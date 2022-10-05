# RESTful

## Service Register and Discovery
`go-doudou` has two options: `memberlist` and `nacos`. 
- `memberlist`: based on [SWIM gossip protocol](https://www.cs.cornell.edu/projects/Quicksilver/public_pdfs/SWIM.pdf), decentralized, peer to peer architecture, no leader election, forking from [hashicorp/memberlist](https://github.com/hashicorp/memberlist) and make some changes
- [`nacos`](https://github.com/alibaba/nacos): centralized, leader-follower architecture, developed by alibaba

::: tip
`memberlist` and `nacos` can be used together.

```shell
GDD_SERVICE_DISCOVERY_MODE=memberlist,nacos
```
:::

### Memberlist

First, add below code to `main` function.

```go
err := registry.NewNode()
if err != nil {
    logrus.Panic(fmt.Sprintf("%+v", err))
}
defer registry.Shutdown()
```  

Second, configure some environment variables.

- `GDD_SERVICE_NAME`: service name, required
- `GDD_MEM_SEED`: seed address for joining cluster, multiple addresses are separated by comma
- `GDD_MEM_PORT`: by default, memberlist advertising port is `7946`
- `GDD_MEM_HOST`: by default, private IP is used 
- `GDD_SERVICE_DISCOVERY_MODE`: You don't have to configure it, as `memberlist` is the default value

```shell
GDD_SERVICE_NAME=test-svc # Required
GDD_MEM_SEED=localhost:7946  # Required
GDD_MEM_PORT=56199 # Optional
GDD_MEM_HOST=localhost # Optional
GDD_SERVICE_DISCOVERY_MODE=memberlist # Optional
```

### Nacos

`go-doudou` also has built-in support for Nacos developed by Alibaba as another option for service discovery.

First, add below code to `main` function.

```go
err := registry.NewNode()
if err != nil {
    logrus.Panic(fmt.Sprintf("%+v", err))
}
defer registry.Shutdown()
```  

Yes, no difference from using `memberlist`.

Second, configure some environment variables.

- `GDD_SERVICE_NAME`: service name, required
- `GDD_NACOS_SERVER_ADDR`: your Nacos server address
- `GDD_SERVICE_DISCOVERY_MODE`: service discovery mode

```shell
GDD_SERVICE_NAME=test-svc # Required
GDD_NACOS_SERVER_ADDR=http://localhost:8848/nacos # Required
GDD_SERVICE_DISCOVERY_MODE=nacos # Required
```

## Client Load Balancing

### Simple Round-robin Load Balancing (memberlist only)

```go
func main() {
	conf := config.LoadFromEnv()

	var segClient *segclient.WordcloudSegClient

	if os.Getenv("GDD_MODE") == "micro" {
		err := registry.NewNode()
		if err != nil {
			logrus.Panicln(fmt.Sprintf("%+v", err))
		}
		defer registry.Shutdown()
		provider := ddhttp.NewMemberlistServiceProvider("wordcloud-segsvc")
		segClient = segclient.NewWordcloudSegClient(ddhttp.WithProvider(provider))
	} else {
		segClient = segclient.NewWordcloudSegClient()
	}

	segClientProxy := segclient.NewWordcloudSegClientProxy(segClient)

	...

	svc := service.NewWordcloudMaker(conf, segClientProxy, minioClient, browser)

	...
}
```

### Smooth Weighted Round-robin Balancing (memberlist only)

If both environment variable `GDD_WEIGHT` and `GDD_MEM_WEIGHT` is not set, local node weight will be 1 by default. If weight is set to 0, environment variable `GDD_MEM_WEIGHT_INTERVAL` is set > `0s`, weight will be calculated by health score and cpu idle
percent every `GDD_MEM_WEIGHT_INTERVAL` and gossip to remote nodes automatically.

```go
func main() {
	conf := config.LoadFromEnv()

	var segClient *segclient.WordcloudSegClient

	if os.Getenv("GDD_MODE") == "micro" {
		err := registry.NewNode()
		if err != nil {
			logrus.Panicln(fmt.Sprintf("%+v", err))
		}
		defer registry.Shutdown()
		provider := ddhttp.NewSmoothWeightedRoundRobinProvider("wordcloud-segsvc")
		segClient = segclient.NewWordcloudSegClient(ddhttp.WithProvider(provider))
	} else {
		segClient = segclient.NewWordcloudSegClient()
	}

	segClientProxy := segclient.NewWordcloudSegClientProxy(segClient)

	...

	svc := service.NewWordcloudMaker(conf, segClientProxy, minioClient, browser)

	...
}
```

### Simple Round-robin Load Balancing (nacos only)

```go
func main() {
	conf := config.LoadFromEnv()

	err := registry.NewNode()
	if err != nil {
		logrus.Panic(fmt.Sprintf("%+v", err))
	}
	defer registry.Shutdown()

	svc := service.NewStatsvc(conf,
		nacosservicej.NewEcho(
			ddhttp.WithRootPath("/nacos-service-j"),
			ddhttp.WithProvider(ddhttp.NewNacosRRServiceProvider("nacos-service-j"))),
	)
	handler := httpsrv.NewStatsvcHandler(svc)
	srv := ddhttp.NewDefaultHttpSrv()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

### Weighted Round-robin Load Balancing (nacos only)

```go
func main() {
	conf := config.LoadFromEnv()

	err := registry.NewNode()
	if err != nil {
		logrus.Panic(fmt.Sprintf("%+v", err))
	}
	defer registry.Shutdown()

	svc := service.NewStatsvc(conf,
		nacosservicej.NewEcho(
			ddhttp.WithRootPath("/nacos-service-j"),
			ddhttp.WithProvider(ddhttp.NewNacosWRRServiceProvider("nacos-service-j"))),
	)
	handler := httpsrv.NewStatsvcHandler(svc)
	srv := ddhttp.NewDefaultHttpSrv()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

## Rate Limit
### Usage
There is a built-in [golang.org/x/time/rate](https://pkg.go.dev/golang.org/x/time/rate) based token-bucket rate limiter implementation
in `github.com/unionj-cloud/go-doudou/framework/ratelimit/memrate` package with a `MemoryStore` struct for storing key and `Limiter` instance pairs.

If you don't like the built-in rate limiter implementation, you can implement `Limiter` interface by yourself.

You can pass an option function `memrate.WithTimer` to `memrate.NewLimiter` function to set a timer to each of 
`memrate.Limiter` instance returned for deleting the key in `keys` of the `MemoryStore` instance if it has been idle for `timeout` duration.

There is also a built-in [go-redis/redis_rate](https://github.com/go-redis/redis_rate) based redis GCRA rate limiter implementation.

### Memory based rate limiter Example

Memory based rate limiter is stored in memory, only for single process.  

```go
func main() {
	...

	handler := httpsrv.NewUsersvcHandler(svc)
	srv := ddhttp.NewDefaultHttpSrv()

	store := memrate.NewMemoryStore(func(_ context.Context, store *memrate.MemoryStore, key string) ratelimit.Limiter {
		return memrate.NewLimiter(10, 30, memrate.WithTimer(10*time.Second, func() {
			store.DeleteKey(key)
		}))
	})

	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

**Note:** you need write your own http middleware to fit your needs. Here is an example below.

```go
// RateLimit limits rate based on memrate.MemoryStore
func RateLimit(store *memrate.MemoryStore) func(inner http.Handler) http.Handler {
	return func(inner http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			key := r.RemoteAddr[:strings.LastIndex(r.RemoteAddr, ":")]
			limiter := store.GetLimiter(key)
			if !limiter.Allow() {
				http.Error(w, "too many requests", http.StatusTooManyRequests)
				return
			}
			inner.ServeHTTP(w, r)
		})
	}
}
```

### Redis based rate limiter Example

Redis based rate limiter is stored in redis, so it can be used for multiple processes to limit one key across cluster.

```go
func main() {
	...

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

	srv.AddMiddleware(httpsrv.RedisRateLimit(rdb, fn))

	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

**Note:** you need write your own http middleware to fit your needs. Here is an example below.

```go
// RedisRateLimit limits rate based on redisrate.GcraLimiter
func RedisRateLimit(rdb redisrate.Rediser, fn redisrate.LimitFn) func(inner http.Handler) http.Handler {
	return func(inner http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userId, _ := service.UserIdFromContext(r.Context())
			limiter := redisrate.NewGcraLimiterLimitFn(rdb, strconv.Itoa(userId), fn)
			if !limiter.Allow() {
				http.Error(w, "too many requests", http.StatusTooManyRequests)
				return
			}
			inner.ServeHTTP(w, r)
		})
	}
}
```

## Bulkhead
### Usage
There is built-in [github.com/slok/goresilience](github.com/slok/goresilience) based bulkhead pattern support by BulkHead middleware in `github.com/unionj-cloud/go-doudou/framework/http` package.

```go
http.BulkHead(3, 10*time.Millisecond)
```

In above code, the first parameter `3` means the number of workers in the execution pool, the second parameter `10*time.Millisecond` 
means the max time an incoming request will wait to execute before being dropped its execution and return `429` response.

### Example

```go
func main() {
	...

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

	srv.AddMiddleware(ddhttp.BulkHead(conf.ConConf.BulkheadWorkers, conf.ConConf.BulkheadMaxwaittime))

	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```  

## Circuit Breaker / Timeout / Retry 
### Usage
There is built-in [github.com/slok/goresilience](github.com/slok/goresilience) based Circuit Breaker / Timeout / Retry support in generated client code.
You don't need to do anything other than running below command: 
```shell
go-doudou svc http --handler -c --doc
```  
The flag  `-c` means generate go client code.
Then you will get three files in client folder: 
```shell
├── client.go
├── clientproxy.go
└── iclient.go
```
For `client.go` and `iclient.go` files, all code will be overwritten each time you execute generation command.  
For `clientproxy.go` file, the existing code will not be changed, only new code will be appended. 

There is a default `goresilience.Runner` instance which has already been built-in circuit breaker, timeout and retry features for you, but if you need to customize it, you can pass `WithRunner(your_own_runner goresilience.Runner)` as `ProxyOption` parameter into `NewXXXClientProxy` function.

### Example
```go
func main() {
	conf := config.LoadFromEnv()

	var segClient *segclient.WordcloudSegClient

	if os.Getenv("GDD_MODE") == "micro" {
		err := registry.NewNode()
		if err != nil {
			logrus.Panicln(fmt.Sprintf("%+v", err))
		}
		defer registry.Shutdown()
		provider := ddhttp.NewSmoothWeightedRoundRobinProvider("wordcloud-segsvc")
		segClient = segclient.NewWordcloudSegClient(ddhttp.WithProvider(provider))
	} else {
		segClient = segclient.NewWordcloudSegClient()
	}

	segClientProxy := segclient.NewWordcloudSegClientProxy(segClient)

	... 

	svc := service.NewWordcloudMaker(conf, segClientProxy, minioClient, browser)
	
	...
}

```  

## Log
### Usage
There is a global `logrus.Entry` provided by `github.com/unionj-cloud/go-doudou/svc/logger` package. If `GDD_ENV` is set and is not set to `dev`,
it will be attached with some meta fields about service name, hostname, etc.

`logger` package implemented several exported package-level methods from `logrus`, so you can replace `logrus.Info()` with `logger.Info()` for example.
It also provided a `Init` function to help you configure `logrus.Logger` instance.

You can also configure log level by environment variable `GDD_LOG_LEVEL` and configure formatter type to `json` or `text` by environment variable `GDD_LOG_FORMAT`.

There are two built-in log related middlewares for you, `ddhttp.Metrics` and `ddhttp.Logger`. In short, `ddhttp.Metrics` is for printing brief log with limited 
information, while `ddhttp.Logger` is for printing detail log with request and response body, headers, opentracing span and some other information, and it only takes 
effect when environment variable `GDD_LOG_LEVEL` is set to `debug`.

### Example
```go 
// you can use lumberjack to add log rotate feature to your service
logger.Init(logger.WithWritter(io.MultiWriter(os.Stdout, &lumberjack.Logger{
    Filename:   filepath.Join(os.Getenv("LOG_PATH"), fmt.Sprintf("%s.log", ddconfig.GddServiceName.Load())),
    MaxSize:    5,  // Max megabytes before log is rotated
    MaxBackups: 10, // Max number of old log files to keep
    MaxAge:     7,  // Max number of days to retain log files
    Compress:   true,
})))
```

### ELK stack
`logger` package provided well support for ELK stack. To see example, please go to [go-doudou-guide](https://github.com/unionj-cloud/go-doudou-guide).

#### Example

```yaml
version: '3.9'

services:

 elasticsearch:
   container_name: elasticsearch
   image: "docker.elastic.co/elasticsearch/elasticsearch:7.2.0"
   environment:
     - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
     - "discovery.type=single-node"
   ports:
     - "9200:9200"
   volumes:
     - ./esdata:/usr/share/elasticsearch/data
   networks:
     testing_net:
       ipv4_address: 172.28.1.9

 kibana:
   container_name: kibana
   image: "docker.elastic.co/kibana/kibana:7.2.0"
   ports:
     - "5601:5601"
   networks:
     testing_net:
       ipv4_address: 172.28.1.10

 filebeat:
   container_name: filebeat
   image: "docker.elastic.co/beats/filebeat:7.2.0"
   volumes:
     - ./filebeat.yml:/usr/share/filebeat/filebeat.yml:ro
     - ./log:/var/log
   networks:
     testing_net:
       ipv4_address: 172.28.1.11

networks:
  testing_net:
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
```

#### Screenshot

![elk](/images/elk.png)

## Jaeger
### Usage
To add jaeger feature, you just need three steps:
1. Start jaeger
```shell
docker run -d --name jaeger \
  -p 6831:6831/udp \
  -p 16686:16686 \
  jaegertracing/all-in-one:1.29
```
2. Add two environment variables to your .env file
```shell
JAEGER_AGENT_HOST=localhost
JAEGER_AGENT_PORT=6831
```
3. Add three lines to your main function before new client and http server code
```go
tracer, closer := tracing.Init()
defer closer.Close()
opentracing.SetGlobalTracer(tracer)
```
Then your main function should like this
```go
func main() {
	...

	tracer, closer := tracing.Init()
	defer closer.Close()
	opentracing.SetGlobalTracer(tracer)

	...

	svc := service.NewWordcloudMaker(conf, segClientProxy, minioClient, browser)
	handler := httpsrv.NewWordcloudMakerHandler(svc)
	srv := ddhttp.NewDefaultHttpSrv()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```
### Screenshot
![jaeger1](/images/jaeger1.png)
![jaeger2](/images/jaeger2.png)  

## Grafana / Prometheus
### Usage

Please refer to [Prometheus Service Discovery](./deployment.md#prometheus-service-discovery) section and repository [wordcloud](https://github.com/unionj-cloud/go-doudou-tutorials/tree/master/wordcloud).

### Example

```yaml
version: '3.9'

services:
  prometheus:
    container_name: prometheus
    hostname: prometheus
    image: wubin1989/go-doudou-prometheus-sd:v1.0.2
    environment:
      - GDD_SERVICE_NAME=prometheus
      - PROM_REFRESH_INTERVAL=15s
      - GDD_MEM_HOST=localhost
    volumes:
      - ./prometheus/:/etc/prometheus/
    ports:
      - "9090:9090"
      - "7946:7946"
      - "7946:7946/udp"
    restart: always
    healthcheck:
      test: [ "CMD", "curl", "-f", "http://localhost:9090" ]
      interval: 10s
      timeout: 3s
      retries: 3
    networks:
      testing_net:
        ipv4_address: 172.28.1.1

  grafana:
	image: grafana/grafana:latest
	container_name: grafana
	volumes:
		- ./grafana/provisioning:/etc/grafana/provisioning
	environment:
		- GF_AUTH_DISABLE_LOGIN_FORM=false
		- GF_AUTH_ANONYMOUS_ENABLED=false
		- GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
	ports:
		- 3000:3000
	networks:
		testing_net:
		ipv4_address: 172.28.1.8

networks:
  testing_net:
    ipam:
      driver: default
      config:
        - subnet: 172.28.0.0/16
```

### Screenshot
![grafana](/images/grafana.png)

## Max Body Size

It is definitely necessary to limit request body size in order to make service stable and safe. We can call package level static method `ddhttp.BodyMaxBytes` to meet the need.

```go
package main

import (
	...
)

func main() {
	...

	handler := httpsrv.NewOrdersvcHandler(svc)
	srv := ddhttp.NewDefaultHttpSrv()
	// Limit request body size not greater than 32M
	srv.Use(ddhttp.BodyMaxBytes(32 << 20))
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

## Gateway

In project development, frontend may need to call multiple services. It is not convenient for frontend developers to configure `baseUrl`s one by one, so gateway comes to rescue. Frontend developers just need to configure one `baseUrl` of gateway service, then they can call different services by `/serviceName/apiUrl`. go-doudou provides an out-of-box middleware `ddhttp.Proxy` for the need.

```go
package main

import (
	...
)

func main() {
	// gateway service itself must be registered to nacos server or memberlist cluster or both of them
	err := registry.NewNode()
	if err != nil {
		logrus.Panic(fmt.Sprintf("%+v", err))
	}
	defer registry.Shutdown()

	conf := config.LoadFromEnv()
	svc := service.NewGateway(conf)
	handler := httpsrv.NewGatewayHandler(svc)
	srv := ddhttp.NewDefaultHttpSrv()
	// Call ddhttp.Proxy method here 
	// Done
	srv.AddMiddleware(ddhttp.Proxy(ddhttp.ProxyConfig{}))
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

`.env` config file example: 

```shell
GDD_SERVICE_NAME=gateway
GDD_SERVICE_DISCOVERY_MODE=memberlist,nacos

GDD_MEM_PORT=65353
GDD_MEM_SEED=localhost:7946
GDD_MEM_HOST=
GDD_MEM_NAME=gateway

GDD_NACOS_SERVER_ADDR=http://localhost:8848/nacos
GDD_NACOS_NOT_LOAD_CACHE_AT_START=true
```

*Notice:* If you want go-doudou gateway service to route services developed by other framework or program language, you should make sure that `urlPrefix`(if any) should be passed to `metadata` as `rootPath` attribute value, otherwise there may be 404 error.

## Request Validation

go-doudou begins supporting request body and request parameter validation from v1.3.3 based on the most famous validation library [go-playground/validator](https://github.com/go-playground/validator).

### Usage

go-doudou built-in request validation mechanism is: 

1. When defining service methods, pointer type parameters are not required, none-pointer type parameters are all required
2. When defining service methods, you can add `@validate` [annotation]((./idl.html#注解)) in go doc and pass validation rules as annotation parameters
3. When defining structs in `vo` package, you can add `validate` tag after each fields that should be validated

In above 2 and 3, only valid `go-playground/validator` built-in validation rules and registered custom rules are supported. All validation related code will be generated in `handlerimpl.go` each time you run `go-doudou` cli command. You can read the code there. Only struct type (including pointer struct type) parameters will be validated by calling `func (v *Validate) Struct(s interface{}) error` method, other type parameters will be validated by calling `func (v *Validate) Var(field interface{}, tag string) error` method under the hood.

There is an exported package level static function `func GetValidate() *validator.Validate` returning a `*validator.Validate` type singleton. Developers can call `go-playground/validator` apis directly to implement more complex and custom needs, like error message translation, custom validation rules etc. Please refer to `go-playground/validator` [official documentation](https://pkg.go.dev/github.com/go-playground/validator/v10) and [official examples](https://github.com/go-playground/validator/tree/master/_examples) to learn more advanced usage.

### Example

Method definition:

```go
// <b style="color: red">NEW</b> article create and update api
// execute update operation if there is id parameter, otherwise execute create operation
// @role(SUPER_ADMIN)
Article(ctx context.Context, file *v3.FileModel,
	// @validate(gt=0,lte=60)
	title,
	// @validate(gt=0,lte=1000)
	content *string, tags *[]string, sort, status *int, id *int) (data string, err error)
```

Struct from `vo` package:

```go
type ArticleVo struct {
	Id      int    `json:"id"`
	Title   string `json:"title" validate:"required,gt=0,lte=60"`
	Content string `json:"content"`
	Link    string `json:"link" validate:"required,url"`
	CreateAt string `json:"createAt"`
	UpdateAt string `json:"updateAt"`
}
```

Generated code:

```go
func (receiver *ArticleHandlerImpl) ArticleList(_writer http.ResponseWriter, _req *http.Request) {
	var (
		ctx     context.Context
		payload vo.ArticlePageQuery
		data    vo.ArticleRet
		err     error
	)
	ctx = _req.Context()
	if _req.Body == nil {
		http.Error(_writer, "missing request body", http.StatusBadRequest)
		return
	} else {
		if _err := json.NewDecoder(_req.Body).Decode(&payload); _err != nil {
			http.Error(_writer, _err.Error(), http.StatusBadRequest)
			return
		} else {
			if _err := ddhttp.ValidateStruct(payload); _err != nil {
				http.Error(_writer, _err.Error(), http.StatusBadRequest)
				return
			}
		}
	}
	...
}
```

```go
func (receiver *ArticleHandlerImpl) Article(_writer http.ResponseWriter, _req *http.Request) {
	var (
		ctx    context.Context
		file   *v3.FileModel
		title  *string
		content    *string
		tags   *[]string
		sort   *int
		status *int
		id     *int
		data   string
		err    error
	)
	...
	if _, exists := _req.Form["title"]; exists {
		_title := _req.FormValue("title")
		title = &_title
		if _err := ddhttp.ValidateVar(title, "gt=0,lte=60", "title"); _err != nil {
			http.Error(_writer, _err.Error(), http.StatusBadRequest)
			return
		}
	}
	if _, exists := _req.Form["content"]; exists {
		_content := _req.FormValue("content")
		content = &_content
		if _err := ddhttp.ValidateVar(content, "gt=0,lte=1000", "content"); _err != nil {
			http.Error(_writer, _err.Error(), http.StatusBadRequest)
			return
		}
	}
	...
}
```

Error message translation

```go
package main

import (
	"github.com/go-playground/locales/zh"
	ut "github.com/go-playground/universal-translator"
	zhtrans "github.com/go-playground/validator/v10/translations/zh"
	...
)

func main() {
	...

	uni := ut.New(zh.New())
	trans, _ := uni.GetTranslator("zh")
	ddhttp.SetTranslator(trans)
	zhtrans.RegisterDefaultTranslations(ddhttp.GetValidate(), trans)

	...

	srv.Run()
}
```
