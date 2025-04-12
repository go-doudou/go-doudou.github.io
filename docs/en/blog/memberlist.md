---
sidebar: auto
---

# Deep Dive into go-doudou's Built-in Service Registry and Discovery Component

go-doudou is a microservice framework developed in Go language that was open-sourced in early 2021. It initially built a decentralized service registration and discovery mechanism based on the SWIM gossip protocol that is integrated into the go-doudou framework and ready to use out of the box, using the open-source memberlist library from HashiCorp. The SWIM Gossip protocol is a weakly consistent protocol that not only has decentralized characteristics but also includes mechanisms for service registration, node health checks, and message broadcasting, making it very suitable as middleware for service registration and discovery.

## Practical Example

We'll demonstrate usage through a practical example that includes a complete set of front-end and back-end services for uploading text files to generate word cloud images.

### Development Environment

Docker and docker-compose development environments are required. All microservices need to be packaged as docker images and then started using docker-compose commands.

### Download the Code

After cloning the repository source code to your local machine, please switch to the wordcloud folder.

```
git clone git@github.com:unionj-cloud/go-doudou-tutorials.git
```

### Build the Images

```
make docker
```

### Start the Entire Microservice System

```
make up
```

### Initialize Minio

This example uses minio to store user-uploaded files, which requires some initialization work. First, open [http://localhost:9001/](http://localhost:9001/), then log in with the account and password minio/minio123, create a bucket called wordcloud, set `Access Policy` to `public`, and finally create an `access key`: testkey and `access secret`: testsecret.

![go-doudou](/images/minio1.png)
![go-doudou](/images/minio2.png)
![go-doudou](/images/minio3.png)
![go-doudou](/images/minio4.png)
![go-doudou](/images/minio5.png)

### Using the System

Open [http://localhost:3100/](http://localhost:3100/), log in with the default account and password jackchen/1234, then upload any text format file. After processing, you will see the word cloud image output on the page.

![go-doudou](/images/wordcloud.png)

### Architecture Description

In this practical example, the frontend is handled by a UI service developed based on the `vue-vben-admin` framework (since the frontend technology stack is not the focus of this article, we won't elaborate further), and the backend consists of 5 RESTful microservices. Please see the comments below for specific explanations.

```shell
➜  wordcloud git:(master) ✗ tree -L 1
.
├── Makefile
├── README.md
├── alertmanager
├── ddosify
├── dingtalkalert
├── docker-compose.yml
├── esdata
├── filebeat.yml
├── grafana
├── minio
├── my
├── prometheus
├── screencapture1.png
├── screencapture2.png
├── shellscripts
├── sqlscripts
├── wordcloud-bff  # BFF service, providing a single interface entry point for the frontend, while tailoring and formatting data for frontend requirements
├── wordcloud-maker  # Maker service, responsible for generating word cloud images based on the word frequency statistics of the text
├── wordcloud-seg  # Seg service, responsible for tokenizing Chinese and English text content and calculating word frequency
├── wordcloud-task  # Task service, responsible for storing and querying word cloud image tasks created by users
├── wordcloud-ui
└── wordcloud-user  # User service, responsible for registration, login, and token generation

16 directories, 6 files
```

### Service List

Readers can open [http://localhost:6060/go-doudou/registry](http://localhost:6060/go-doudou/registry) to view the service list. You need to enter HTTP basic account and password admin/admin.

![go-doudou](/images/registry.png)

### Code Analysis

Taking the BFF service as an example, let's look at the service registration and discovery related code. Please refer to the comments below for specific explanations.

```go
package main

import (
	...
)

func main() {
    // Load configuration from environment variables
	conf := config.LoadFromEnv()

    // User service http request client
	var userClient *userclient.UsersvcClient
    // Maker service http request client
	var makerClient *makerclient.WordcloudMakerClient
    // Task service http request client
	var taskClient *taskclient.WordcloudTaskClient

    // Read the service mode from environment variables, monolithic or microservice
    // The environment variable name and value can be completely customized, not related to the go-doudou framework
    // The distinction of service modes is just for convenient local development
	if os.Getenv("GDD_MODE") == "micro" {
        // Service registration
		err := registry.NewNode()
		if err != nil {
			logrus.Panicln(fmt.Sprintf("%+v", err))
		}
        // Service offline, release resources
		defer registry.Shutdown()
        // Create a client load balancer based on go-doudou's built-in service registration and discovery mechanism
        // Client load balancer for User service
		userProvider := ddhttp.NewMemberlistServiceProvider("wordcloud-usersvc")
        // Create an http request client instance for User service
		userClient = userclient.NewUsersvcClient(ddhttp.WithProvider(userProvider))
        // Client load balancer for Maker service
		makerProvider := ddhttp.NewMemberlistServiceProvider("wordcloud-makersvc")
        // http request client instance for Maker service
		makerClient = makerclient.NewWordcloudMakerClient(ddhttp.WithProvider(makerProvider))
        // Client load balancer for Task service
		taskProvider := ddhttp.NewMemberlistServiceProvider("wordcloud-tasksvc")
        // http request client instance for Task service
		taskClient = taskclient.NewWordcloudTaskClient(ddhttp.WithProvider(taskProvider))
	} else {
        // Direct connection http request client instance for User service
		userClient = userclient.NewUsersvcClient()
        // Direct connection http request client instance for Maker service
		makerClient = makerclient.NewWordcloudMakerClient()
        // Direct connection http request client instance for Task service
		taskClient = taskclient.NewWordcloudTaskClient()
	}

    // Enable Jaeger call chain monitoring
	tracer, closer := tracing.Init()
	defer closer.Close()
	opentracing.SetGlobalTracer(tracer)

	rec := metrics.NewPrometheusRecorder(prometheus.DefaultRegisterer)

    // Add circuit breakers, timeouts, retries, and other resilience and fault tolerance mechanisms and Prometheus metrics collection to User, Maker, and Task services
	userClientProxy := userclient.NewUsersvcClientProxy(userClient, rec)
	makerClientProxy := makerclient.NewWordcloudMakerClientProxy(makerClient, rec)
	taskClientProxy := taskclient.NewWordcloudTaskClientProxy(taskClient, rec)

    // Create minio client
	endpoint := conf.BizConf.OssEndpoint
	accessKeyID := conf.BizConf.OssKey
	secretAccessKey := conf.BizConf.OssSecret
	useSSL := false

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		panic(err)
	}

    // Inject User, Maker, Task service http request client instances, minio client instance
	svc := service.NewWordcloudBff(conf, minioClient, makerClientProxy, taskClientProxy, userClientProxy)
	handler := httpsrv.NewWordcloudBffHandler(svc)
	srv := ddhttp.NewDefaultHttpSrv()
	srv.AddMiddleware(httpsrv.Auth(userClientProxy))

	rdb := redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:6379", conf.RedisConf.Host),
	})

	fn := redisrate.LimitFn(func(ctx context.Context) ratelimit.Limit {
		return ratelimit.PerSecondBurst(conf.ConConf.RatelimitRate, conf.ConConf.RatelimitBurst)
	})

	srv.AddMiddleware(
        // Add bulkhead mechanism
		ddhttp.BulkHead(conf.ConConf.BulkheadWorkers, conf.ConConf.BulkheadMaxwaittime),
        // Add redis-based rate limiter
		httpsrv.RedisRateLimit(rdb, fn),
	)

	srv.AddRoute(httpsrv.Routes(handler)...)

    // Start http service
	srv.Run()
}
```

## Source Code Analysis

The go-doudou built-in service registry and discovery mechanism is developed based on the memberlist library and has been modified for microservice application scenarios. The memberlist library contains many treasures, and each time you read the source code, you gain new insights. Even if readers don't use this mechanism in their actual project development, it's still recommended to study it. Please first review the startup flow diagram, and later we will focus on code analysis of several important functions.

### Startup Flow Diagram

![go-doudou](/images/memberlist-flow.png)

### registry.NewNode()

In this function, go-doudou encapsulates the initialization processes for two mechanisms: one based on memberlist and another based on Nacos. It decides which mechanism to use based on configuration and supports using both mechanisms simultaneously.

```go
func NewNode(data ...map[string]interface{}) error {
    // Read configuration from environment variable GDD_SERVICE_DISCOVERY_MODE
	for mode, _ := range getModemap() {
		switch mode {
		case "nacos":
			nacos.NewNode(data...)
		case "memberlist":
            // Initialize memberlist mechanism
			err := newNode(data...)
			if err != nil {
				return err
			}
		default:
			logger.Warn(fmt.Sprintf("[go-doudou] unknown service discovery mode: %s", mode))
		}
	}
	return nil
}
```

### registry.newNode()

This function creates a memberlist instance, and the startup flow diagram actually starts from here.

```go
func newNode(data ...map[string]interface{}) error {
    // Initialize memberlist configuration
	mconf = newConf()
    // Initialize HTTP-related configurations and metadata for the service itself, omitted here
	...
	mmeta := mergedMeta{
		Meta: nodeMeta{
			Service:       service,
			RouteRootPath: rr,
			Port:          httpPort,
			RegisterAt:    &now,
			GoVer:         runtime.Version(),
			GddVer:        buildinfo.GddVer,
			BuildUser:     buildinfo.BuildUser,
			BuildTime:     buildTime,
			Weight:        weight,
		},
		Data: make(map[string]interface{}),
	}
	if len(data) > 0 {
		mmeta.Data = data[0]
	}
	queue := &memberlist.TransmitLimitedQueue{
		NumNodes:             numNodes,
		RetransmitMultGetter: retransmitMultGetter,
	}
	BroadcastQueue = queue
	mconf.Delegate = &delegate{
		mmeta: mmeta,
		queue: queue,
	}
	mconf.Events = events
	var err error
    // createMemberlist actually calls memberlist.Create
    // Written this way for unit testing
	if mlist, err = createMemberlist(mconf); err != nil {
		return errors.Wrap(err, "[go-doudou] Failed to create memberlist")
	}
    // Join the cluster where the seed node is located
	if err = join(); err != nil {
		mlist.Shutdown()
		return errors.Wrap(err, "[go-doudou] Node register failed")
	}
	local := mlist.LocalNode()
	baseUrl, _ := BaseUrl(local)
	logger.Infof("memberlist created. local node is Node %s, providing %s service at %s, memberlist port %s",
		local.Name, mmeta.Meta.Service, baseUrl, fmt.Sprint(local.Port))
	registerConfigListener(mconf)
	return nil
}
```

### memberlist.NewMemberlist

Creates a memberlist instance

```go
func NewMemberlist(conf *Config) (*Memberlist, error) {
    // Check protocol version, go-doudou doesn't involve this logic
	if conf.ProtocolVersion < ProtocolVersionMin {
		return nil, fmt.Errorf("Protocol version '%d' too low. Must be in range: [%d, %d]",
			conf.ProtocolVersion, ProtocolVersionMin, ProtocolVersionMax)
	} else if conf.ProtocolVersion > ProtocolVersionMax {
		return nil, fmt.Errorf("Protocol version '%d' too high. Must be in range: [%d, %d]",
			conf.ProtocolVersion, ProtocolVersionMin, ProtocolVersionMax)
	}

	if len(conf.SecretKey) > 0 {
		if conf.Keyring == nil {
			keyring, err := NewKeyring(nil, conf.SecretKey)
			if err != nil {
				return nil, err
			}
			conf.Keyring = keyring
		} else {
			if err := conf.Keyring.AddKey(conf.SecretKey); err != nil {
				return nil, err
			}
			if err := conf.Keyring.UseKey(conf.SecretKey); err != nil {
				return nil, err
			}
		}
	}

    // Log related configuration
	if conf.LogOutput != nil && conf.Logger != nil {
		return nil, fmt.Errorf("Cannot specify both LogOutput and Logger. Please choose a single log configuration setting.")
	}

	logDest := conf.LogOutput
	if logDest == nil {
		logDest = os.Stderr
	}

	logger := conf.Logger
	if logger == nil {
		logger = log.New(logDest, "", log.LstdFlags)
	}

	// If the user doesn't provide a custom Transport, create a default one
    // Responsible for listening to TCP and UDP messages
	transport := conf.Transport
	if transport == nil {
		nc := &NetTransportConfig{
			BindAddrs: []string{conf.BindAddr},
			BindPort:  conf.BindPort,
			Logger:    logger,
		}

		// See comment below for details about the retry in here.
		makeNetRetry := func(limit int) (*NetTransport, error) {
			var err error
			for try := 0; try < limit; try++ {
				var nt *NetTransport
				if nt, err = NewNetTransport(nc); err == nil {
					return nt, nil
				}
				if strings.Contains(err.Error(), "address already in use") {
					logger.Printf("[DEBUG] memberlist: Got bind error: %v", err)
					continue
				}
			}

			return nil, fmt.Errorf("failed to obtain an address: %v", err)
		}

		limit := 1
		if conf.BindPort == 0 {
			limit = 10
		}

        // If the user doesn't specify BindPort, it will try 10 times to bind to an available port,
        // shared by both TCP and UDP
		nt, err := makeNetRetry(limit)
		if err != nil {
			return nil, fmt.Errorf("Could not set up network transport: %v", err)
		}
		if conf.BindPort == 0 {
			port := nt.GetAutoBindPort()
			conf.BindPort = port
			conf.AdvertisePort = port
			logger.Printf("[DEBUG] memberlist: Using dynamic bind port %d", port)
		}
		transport = nt
	}

	nodeAwareTransport, ok := transport.(NodeAwareTransport)
	if !ok {
		logger.Printf("[DEBUG] memberlist: configured Transport is not a NodeAwareTransport and some features may not work as desired")
		nodeAwareTransport = &shimNodeAwareTransport{transport}
	}

    // Create and initialize memberlist instance
	m := &Memberlist{
		config:               conf,
		shutdownCh:           make(chan struct{}),
		leaveBroadcast:       make(chan struct{}, 1),
		transport:            nodeAwareTransport,
		handoffCh:            make(chan struct{}, 1),
		highPriorityMsgQueue: list.New(),
		lowPriorityMsgQueue:  list.New(),
		nodeMap:              make(map[string]*nodeState),
		nodeTimers:           make(map[string]*suspicion),
		awareness:            newAwareness(conf.AwarenessMaxMultiplier),
		ackHandlers:          make(map[uint32]*ackHandler),
		broadcasts: &TransmitLimitedQueue{RetransmitMultGetter: func() int {
			return conf.RetransmitMult
		}},
		logger: logger,
	}
	m.broadcasts.NumNodes = func() int {
		return m.estNumNodes()
	}

	// Refresh public Host and port
	if _, _, err := m.refreshAdvertise(); err != nil {
		return nil, err
	}

    // Start TCP message listening goroutine
	go m.streamListen()
    // Start UDP message listening goroutine
	go m.packetListen()
    // Start goroutine to handle five types of messages sent via UDP: suspectMsg, aliveMsg, deadMsg, weightMsg, and userMsg
	go m.packetHandler()
	return m, nil
}
```

### m.aliveNode

This memberlist instance method is responsible for handling alive messages, which can either process messages from other nodes or handle messages when initializing itself to set its state as alive.

```go
func (m *Memberlist) aliveNode(a *alive, notify chan struct{}, bootstrap bool) {
    // Lock to ensure thread safety
	m.nodeLock.Lock()
	defer m.nodeLock.Unlock()

    // Retrieve the node status value from m's dictionary-type node cache nodeMap using the node name in the alive message
	state, ok := m.nodeMap[a.Node]

	// If the local node has already actively left and the node mentioned in the alive message is itself, return directly
    // The go-doudou service node doesn't have an "actively leave" situation because the node list cache of each node
    // won't clear the node information that "actively leaves", which would cause memory leaks
	if m.hasLeft() && a.Node == m.config.Name {
		return
	}

	if len(a.Vsn) >= 3 {
		pMin := a.Vsn[0]
		pMax := a.Vsn[1]
		pCur := a.Vsn[2]
		if pMin == 0 || pMax == 0 || pMin > pMax {
			m.logger.Printf("[WARN] memberlist: Ignoring an alive message for '%s' (%v:%d) because protocol version(s) are wrong: %d <= %d <= %d should be >0", a.Node, a.Addr, a.Port, pMin, pCur, pMax)
			return
		}
	}

	// Alive callback function, the go-doudou framework doesn't use this, and no application scenario has been found yet
	if m.config.Alive != nil {
		if len(a.Vsn) < 6 {
			m.logger.Printf("[WARN] memberlist: ignoring alive message for '%s' (%v:%d) because Vsn is not present",
				a.Node, a.Addr, a.Port)
			return
		}
		node := &Node{
			Name: a.Node,
			Addr: a.Addr,
			Port: a.Port,
			Meta: a.Meta,
			PMin: a.Vsn[0],
			PMax: a.Vsn[1],
			PCur: a.Vsn[2],
			DMin: a.Vsn[3],
			DMax: a.Vsn[4],
			DCur: a.Vsn[5],
		}
		if err := m.config.Alive.NotifyAlive(node); err != nil {
			m.logger.Printf("[WARN] memberlist: ignoring alive message for '%s': %s",
				a.Node, err)
			return
		}
	}

	// Determine if this is a new node we haven't seen before; if so, add it to the local node cache dictionary
	var updatesNode bool
	if !ok {
        // Check if it's a blacklisted IP; if so, discard the message
		errCon := m.config.AddrAllowed(a.Addr)
		if errCon != nil {
			m.logger.Printf("[WARN] memberlist: Rejected node %s (%v): %s", a.Node, a.Addr, errCon)
			return
		}
        // Create and initialize node state
		state = &nodeState{
			Node: Node{
				Name: a.Node,
				Addr: a.Addr,
				Port: a.Port,
				Meta: a.Meta,
			},
			State: StateDead,
		}
        // Protocol version compatibility related code, not relevant to go-doudou
		if len(a.Vsn) > 5 {
			state.PMin = a.Vsn[0]
			state.PMax = a.Vsn[1]
			state.PCur = a.Vsn[2]
			state.DMin = a.Vsn[3]
			state.DMax = a.Vsn[4]
			state.DCur = a.Vsn[5]
		}

		// Put the node state into the node cache dictionary
		m.nodeMap[a.Node] = state

		// Randomly select an offset, with the purpose of exchanging nodes later,
        // equivalent to shuffling the node list, to avoid consecutive node health check failures,
        // which would increase the overhead of the node health checking mechanism
		n := len(m.nodes)
		offset := randomOffset(n)

		// First put this node state at the end, then swap positions with the node at offset
		m.nodes = append(m.nodes, state)
		m.nodes[offset], m.nodes[n] = m.nodes[n], m.nodes[offset]

		// Perform atomic increment of node count
		atomic.AddUint32(&m.numNodes, 1)
	} else {
        // If we get here, it means the alive message is about a known node, so check if the new Host and port
        // are consistent with the old Host and port. If not, execute the logic below
		if state.Addr != a.Addr || state.Port != a.Port {
            // Check if the new Host is blacklisted
			errCon := m.config.AddrAllowed(a.Addr)
			if errCon != nil {
				m.logger.Printf("[WARN] memberlist: Rejected IP update from %v to %v for node %s: %s", a.Node, state.Addr, a.Addr, errCon)
				return
			}
            // If DeadNodeReclaimTime is configured (i.e., how long a dead node must wait before it can declare itself
            // alive again with the same name but a different address), check if that time has passed.
            // If the time has passed, it can declare itself alive, just with a different Host or port
			canReclaim := (m.config.DeadNodeReclaimTime > 0 &&
				time.Since(state.StateChange) > m.config.DeadNodeReclaimTime)

			// If the node state in the cache is "actively left" or "dead" but can reclaim aliveness,
            // update the node state in the cache
			if state.State == StateLeft || (state.State == StateDead && canReclaim) {
				m.logger.Printf("[INFO] memberlist: Updating address for left or failed node %s from %v:%d to %v:%d",
					state.Name, state.Addr, state.Port, a.Addr, a.Port)
				updatesNode = true
			} else {
                // If the conditions for reclaiming aliveness are not met, log a node conflict
				m.logger.Printf("[ERR] memberlist: Conflicting address for %s. Mine: %v:%d Theirs: %v:%d Old state: %v",
					state.Name, state.Addr, state.Port, a.Addr, a.Port, state.State)

				// If a node conflict callback is configured, call it
				if m.config.Conflict != nil {
					other := Node{
						Name: a.Node,
						Addr: a.Addr,
						Port: a.Port,
						Meta: a.Meta,
					}
					m.config.Conflict.NotifyConflict(&state.Node, &other)
				}
				return
			}
		}
	}

    // If the Incarnation value in the alive message is less than or equal to the Incarnation value in the cache,
    // and it's neither about the local node nor does it need to update the node cache, discard the message.
    // The Incarnation value serves as a kind of version control for node state, or an optimistic lock
	isLocalNode := state.Name == m.config.Name
	if a.Incarnation <= state.Incarnation && !isLocalNode && !updatesNode {
		return
	}

	// If the Incarnation value in the alive message is less than the Incarnation value in the cache
    // and it's about the local node, discard the message
	if a.Incarnation < state.Incarnation && isLocalNode {
		return
	}

	// Delete the timer that suspects the node is dead
	delete(m.nodeTimers, a.Node)

	// Store the old state and meta data
	oldState := state.State
	oldMeta := state.Meta

	// If it's not initializing the local node state during startup but is about the local node,
    // execute the logic below
	if !bootstrap && isLocalNode {
		// Calculate protocol version matrix
		versions := []uint8{
			state.PMin, state.PMax, state.PCur,
			state.DMin, state.DMax, state.DCur,
		}

        // If the Incarnation value in the alive message is the same as the Incarnation value in the node state cache,
        // we need special handling because this situation could arise from the following scenario:
		// 1) Start with configuration C and join the cluster
		// 2) Force quit/process killed/server shutdown
		// 3) Restart with configuration C' and join the cluster
		//
        // In this case, both other nodes and the local node will see the same incarnation value,
        // but the node state may have changed. So we need to check for equality.
        // In most cases, we just need to ignore the message, but sometimes we might need to refute back.
		if a.Incarnation == state.Incarnation &&
			bytes.Equal(a.Meta, state.Meta) &&
			bytes.Equal(a.Vsn, versions) {
			return
		}
		m.refute(state, a.Incarnation)
		m.logger.Printf("[WARN] memberlist: Refuting an alive message for '%s' (%v:%d) meta:(%v VS %v), vsn:(%v VS %v)", a.Node, a.Addr, a.Port, a.Meta, state.Meta, a.Vsn, versions)
	} else {
        // Add the alive message for this node to the broadcast queue again, broadcasting to other nodes
		m.encodeBroadcastNotify(a.Node, aliveMsg, a, notify)

		// Update protocol version information, not relevant to go-doudou
		if len(a.Vsn) > 0 {
			state.PMin = a.Vsn[0]
			state.PMax = a.Vsn[1]
			state.PCur = a.Vsn[2]
			state.DMin = a.Vsn[3]
			state.DMax = a.Vsn[4]
			state.DCur = a.Vsn[5]
		}

        // Update the node state in the cache and the Incarnation property
		state.Incarnation = a.Incarnation
		state.Meta = a.Meta
		state.Addr = a.Addr
		state.Port = a.Port
		if state.State != StateAlive {
			state.State = StateAlive
			state.StateChange = time.Now()
		}
	}

	// Update metrics monitoring items, used to calculate node health value,
    // also calculated as a dimension when go-doudou dynamically calculates node weight
	metrics.IncrCounter([]string{"memberlist", "msg", "alive"}, 1)

	// Execute relevant callback functions
	if m.config.Events != nil {
		if oldState == StateDead || oldState == StateLeft {
            // If the node state changes from "dead" or "actively left" to "alive",
            // execute the Join event callback function
			state.Node.State = state.State
			m.config.Events.NotifyJoin(&state.Node)
		} else if oldState == StateSuspect {
			state.Node.State = state.State
            // If the node state changes from "suspected dead" to "alive",
            // execute the SuspectSateChange event callback function
			m.config.Events.NotifySuspectSateChange(&state.Node)
		} else if !bytes.Equal(oldMeta, state.Meta) {
			// If only metadata is updated, execute the Update event callback function
			m.config.Events.NotifyUpdate(&state.Node)
		}
	}
}
```

### m.schedule

This method implements the core scheduling logic of memberlist.

```go
func (m *Memberlist) schedule() {
    // Lock to ensure thread safety
	m.tickerLock.Lock()
	defer m.tickerLock.Unlock()

	// If the timer task list is not empty, return
	if len(m.tickers) > 0 {
		return
	}

    // Create an unbuffered channel for stopping timer tasks; when we need to stop the timer tasks, we close it
	stopCh := make(chan struct{})

	// Create a node health check timer task
	if m.config.ProbeInterval > 0 {
		t := time.NewTicker(m.config.ProbeInterval)
		go m.triggerFuncDynamic(func() time.Duration {
			return m.config.ProbeInterval
		}, t, stopCh, m.probe)
		m.tickers = append(m.tickers, t)
	}

	// Create a TCP-based timer task for synchronizing node lists with other nodes
	if m.config.PushPullInterval > 0 {
		go m.pushPullTrigger(stopCh)
	}

	// Create a timer task for broadcasting UDP messages
	if m.config.GossipInterval > 0 && m.config.GossipNodes > 0 {
		t := time.NewTicker(m.config.GossipInterval)
		go m.triggerFuncDynamic(func() time.Duration {
			return m.config.GossipInterval
		}, t, stopCh, m.gossip)
		m.tickers = append(m.tickers, t)
	}

	// Create a timer task for dynamically calculating the local node weight and broadcasting it
	if m.config.WeightInterval > 0 {
		t := time.NewTicker(m.config.WeightInterval)
		go m.triggerFunc(m.config.WeightInterval, t.C, stopCh, m.weight)
		m.tickers = append(m.tickers, t)
	}

	// If the timer task list is not empty, assign the just-created stopCh channel to the m variable's stopTick property
	if len(m.tickers) > 0 {
		m.stopTick = stopCh
	}
}
```

## Conclusion

This article has introduced go-doudou's built-in service registration and discovery mechanism based on the SWIM gossip protocol, demonstrated its basic usage through a practical example of generating word cloud images from uploaded text files, and provided an overview of the startup process with detailed explanations of the core source code. The aim is to help gophers better understand the internal mechanisms of the go-doudou microservice framework.

From the above code, we can see that go-doudou implements a decentralized service registration and discovery mechanism based on the gossip protocol. The key features include:

1. **Decentralized Architecture**: No central registry server is needed, making the system more resilient.
2. **Automatic Service Registration**: Services automatically register with the cluster upon startup.
3. **Health Checking**: The SWIM protocol provides efficient health checking with low overhead.
4. **Metadata Exchange**: Services exchange metadata with other nodes upon joining the cluster.
5. **Event-Driven Notifications**: The system is notified when nodes join or leave, ensuring the registry is up-to-date.

This built-in service registry and discovery component makes go-doudou particularly suitable for containerized environments, edge computing, and scenarios where simple deployment is a priority. 