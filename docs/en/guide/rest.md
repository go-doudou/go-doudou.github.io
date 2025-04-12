# REST

## Built-in Routes

The go-doudou framework has 12 built-in routes, which facilitate debugging between service developers and callers, monitoring of service status by service developers, and optimization of online services.

```shell
2022-11-07 23:11:43 INF | GetDoc               | GET    | /go-doudou/doc          |
2022-11-07 23:11:43 INF | GetOpenAPI           | GET    | /go-doudou/openapi.json |
2022-11-07 23:11:43 INF | Prometheus           | GET    | /go-doudou/prometheus   |
2022-11-07 23:11:43 INF | GetConfig            | GET    | /go-doudou/config       |
2022-11-07 23:11:43 INF | GetStatsvizWs        | GET    | /go-doudou/statsviz/ws  |
2022-11-07 23:11:43 INF | GetStatsviz          | GET    | /go-doudou/statsviz/*   |
2022-11-07 23:11:43 INF | GetDebugPprofCmdline | GET    | /debug/pprof/cmdline    |
2022-11-07 23:11:43 INF | GetDebugPprofProfile | GET    | /debug/pprof/profile    |
2022-11-07 23:11:43 INF | GetDebugPprofSymbol  | GET    | /debug/pprof/symbol     |
2022-11-07 23:11:43 INF | GetDebugPprofTrace   | GET    | /debug/pprof/trace      |
2022-11-07 23:11:43 INF | GetDebugPprofIndex   | GET    | /debug/pprof/*          |
2022-11-07 23:11:43 INF +----------------------+--------+-------------------------+
2022-11-07 23:11:43 INF ===================================================
2022-11-07 23:11:43 INF Http server is listening at :6060
2022-11-07 23:11:43 INF Http server started in 1.676754ms      
```

Here's a detailed explanation of each route:

- `/go-doudou/doc`: An online interface documentation based on OpenAPI 3.0 specification, developed using vuejs+elementUI. The core code is open source and can be used separately after compilation, especially for other frameworks and programming languages. Repository: [https://github.com/unionj-cloud/go-doudou-openapi-ui](https://github.com/unionj-cloud/go-doudou-openapi-ui)

- `/go-doudou/openapi.json`: A json document compatible with OpenAPI 3.0 specification, mainly used for third-party code generation tools that also support OpenAPI 3.0 to generate code, such as the pullcode http request client code generator for typescript developed by the go-doudou author in Nodejs. Repository: [https://github.com/wubin1989/pullcode](https://github.com/wubin1989/pullcode)

- `/go-doudou/prometheus`: Used for Prometheus to crawl service operation metrics

- `/go-doudou/config`: Used to view the environment configuration of the current running service. You can add a query string parameter `pre`, for example: `http://localhost:6066/go-doudou/config?pre=GDD_`, which means only display environment variables with the prefix `GDD_`

- `/go-doudou/statsviz/ws` and `/go-doudou/statsviz/*`: Integrated with the open source library [https://github.com/arl/statsviz](https://github.com/arl/statsviz) for visualizing runtime statistics

- Routes with the prefix `/debug/`: Integrated with Go's built-in pprof tool, can be used when optimizing programs. Here are some common usages:

```shell
go tool pprof -http :6068 http://admin:admin@localhost:6060/debug/pprof/profile\?seconds\=20
```

After waiting 20 seconds, a browser will automatically open where you can view flame graphs, etc.

```shell
curl -o trace.out http://qylz:1234@localhost:6060/debug/pprof/trace\?seconds\=20
go tool trace trace.out
```

After executing these two commands, a browser will automatically open, and you can view the monitoring indicators of the program's operation during the first 20 seconds.

Additionally, all built-in routes have HTTP basic auth verification. You can customize the username and password through the environment variables `GDD_MANAGE_USER` and `GDD_MANAGE_PASS`, with default values both being `admin`. If you use a configuration management center supported by go-doudou such as Nacos or Apollo, you can dynamically modify them at runtime, which will take effect automatically without restarting the service. It is recommended to change the HTTP basic username and password of the service in the production environment every now and then to ensure security.

## Service Registration and Discovery

`go-doudou` supports two service registration and discovery mechanisms: `etcd` and `nacos`. REST services registered in the registry will automatically have the `_rest` suffix added to their service name, and gRPC services will have the `_grpc` suffix, to distinguish between them.

::: tip
The `etcd` and `nacos` mechanisms can be used simultaneously in one service

```shell
GDD_SERVICE_DISCOVERY_MODE=etcd,nacos
```
:::

### Etcd

`go-doudou` has built-in support for using etcd as a registry center for service registration and discovery since v2. The following environment variables need to be configured:

- `GDD_SERVICE_NAME`: Service name, required
- `GDD_SERVICE_DISCOVERY_MODE`: Service registration and discovery mechanism name, `etcd`, required
- `GDD_ETCD_ENDPOINTS`: etcd connection address, required

```shell
GDD_SERVICE_NAME=grpcdemo-server
GDD_SERVICE_DISCOVERY_MODE=etcd
GDD_ETCD_ENDPOINTS=localhost:2379
```

### Nacos

`go-doudou` has built-in support for using Alibaba's Nacos as a registry center for service registration and discovery. The following environment variables need to be configured:

- `GDD_SERVICE_NAME`: Service name, required
- `GDD_NACOS_SERVER_ADDR`: Nacos server address, required
- `GDD_SERVICE_DISCOVERY_MODE`: Service discovery mechanism name, required

```shell
GDD_SERVICE_NAME=test-svc # Required
GDD_NACOS_SERVER_ADDR=http://localhost:8848/nacos # Required
GDD_SERVICE_DISCOVERY_MODE=nacos # Required
```

### Zookeeper

`go-doudou` has built-in support for using Zookeeper as a registry center for service registration and discovery. The following environment variables need to be configured:

- `GDD_SERVICE_NAME`: Service name, required
- `GDD_SERVICE_DISCOVERY_MODE`: Service discovery mechanism name, required
- `GDD_ZK_SERVERS`: Zookeeper server address, required

```shell
GDD_SERVICE_NAME=cloud.unionj.ServiceB # Required
GDD_SERVICE_DISCOVERY_MODE=zk # Required
GDD_ZK_SERVERS=localhost:2181 # Required
GDD_ZK_DIRECTORY_PATTERN=/dubbo/%s/providers
GDD_SERVICE_GROUP=group
GDD_SERVICE_VERSION=v2.2.2
```

## Client-side Load Balancing

### Simple Round Robin Load Balancing (For Etcd)

You need to call `etcd.NewRRServiceProvider("service name registered in etcd")` to create an `etcd.RRServiceProvider` instance.

```go
func main() {
	defer etcd.CloseEtcdClient()
	conf := config.LoadFromEnv()
	restProvider := etcd.NewRRServiceProvider("grpcdemo-server_rest")
	svc := service.NewEnumDemo(conf, client.NewHelloworldClient(restclient.WithProvider(restProvider)))
	handler := httpsrv.NewEnumDemoHandler(svc)
	srv := rest.NewRestServer()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

### Smooth Weighted Round Robin Load Balancing (For Etcd)

You need to call `etcd.NewSWRRServiceProvider("service name registered in etcd")` to create an `etcd.SWRRServiceProvider` instance.

If the environment variable `GDD_WEIGHT` is not set, the default weight is 1.

```go
func main() {
	defer etcd.CloseEtcdClient()
	conf := config.LoadFromEnv()
	restProvider := etcd.NewSWRRServiceProvider("grpcdemo-server_rest")
	svc := service.NewEnumDemo(conf, client.NewHelloworldClient(restclient.WithProvider(restProvider)))
	handler := httpsrv.NewEnumDemoHandler(svc)
	srv := rest.NewRestServer()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

### Simple Round Robin Load Balancing (For Nacos)

You need to call `nacos.NewRRServiceProvider("service name registered in nacos")` to create a `nacos.RRServiceProvider` instance.

```go
func main() {
	defer nacos.CloseNamingClient()
	conf := config.LoadFromEnv()
	restProvider := nacos.NewRRServiceProvider("grpcdemo-server_rest")
	svc := service.NewEnumDemo(conf, client.NewHelloworldClient(restclient.WithProvider(restProvider)))
	handler := httpsrv.NewEnumDemoHandler(svc)
	srv := rest.NewRestServer()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

### Weighted Round Robin Load Balancing (For Nacos)

You need to call `nacos.NewWRRServiceProvider("service name registered in nacos")` to create a `nacos.WRRServiceProvider` instance.

```go
func main() {
	defer nacos.CloseNamingClient()
	conf := config.LoadFromEnv()
	restProvider := nacos.NewWRRServiceProvider("grpcdemo-server_rest")
	svc := service.NewEnumDemo(conf, client.NewHelloworldClient(restclient.WithProvider(restProvider)))
	handler := httpsrv.NewEnumDemoHandler(svc)
	srv := rest.NewRestServer()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

### Simple Round Robin Load Balancing (For Zookeeper)

You need to call `zk.NewRRServiceProvider("service name registered in zookeeper")` to create a `zk.RRServiceProvider` instance.

```go
func main() {
	...
	provider := zk.NewRRServiceProvider(zk.ServiceConfig{
		Name:    "cloud.unionj.ServiceB_rest",
		Group:   "",
		Version: "",
	})
	defer provider.Close()
	bClient := client.NewServiceBClient(restclient.WithProvider(provider))
	...
}
```

### Weighted Round Robin Load Balancing (For Zookeeper)

You need to call `zk.NewSWRRServiceProvider("service name registered in zookeeper")` to create a `zk.NewSWRRServiceProvider` instance.

```go
func main() {
	...
	provider := zk.NewSWRRServiceProvider(zk.ServiceConfig{
		Name:    "cloud.unionj.ServiceB_rest",
		Group:   "",
		Version: "",
	})
	defer provider.Close()
	bClient := client.NewServiceBClient(restclient.WithProvider(provider))
	...
}
```

## Rate Limiting
### Usage

`go-doudou` has built-in memory rate limiters based on the token bucket algorithm implemented with [golang.org/x/time/rate](https://pkg.go.dev/golang.org/x/time/rate).

In the `github.com/unionj-cloud/go-doudou/v2/framework/ratelimit/memrate` package, there is a `MemoryStore` struct that stores key and `Limiter` instance pairs. The `Limiter` instance is a rate limiter instance, and the key is the key for that rate limiter instance.

You can pass an optional function `memrate.WithTimer` to the `memrate.NewLimiter` factory function to set a callback function for when the key's idle time exceeds `timeout`, for example, to delete the key from the `MemoryStore` instance to free up memory resources.

`go-doudou` also provides a redis rate limiter based on the GCRA rate limiting algorithm wrapped with the [go-redis/redis_rate](https://github.com/go-redis/redis_rate) library. This rate limiter supports cross-instance global rate limiting.

### Memory Rate Limiter Example

The memory rate limiter is based on local memory and only supports local rate limiting.

```go
func main() {
	...

	store := memrate.NewMemoryStore(func(_ context.Context, store *memrate.MemoryStore, key string) ratelimit.Limiter {
		return memrate.NewLimiter(10, 30, memrate.WithTimer(10*time.Second, func() {
			store.DeleteKey(key)
		}))
	})
	srv := rest.NewRestServer()
	srv.AddMiddleware(
		httpsrv.RateLimit(store),
	)
	handler := httpsrv.NewUsersvcHandler(svc)
	handler := httpsrv.NewUsersvcHandler(svc)
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

**Note:** You need to implement the HTTP middleware yourself. Here's an example.

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

### Redis Rate Limiter Example

Redis rate limiters can be used in scenarios where multiple instances need to rate limit a key at the same time.

```go
func main() {
	...

	svc := service.NewWordcloudBff(conf, minioClient, makerClientProxy, taskClientProxy, userClientProxy)
	handler := httpsrv.NewWordcloudBffHandler(svc)
	srv := rest.NewRestServer()
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

**Note:** You need to implement the HTTP middleware yourself. Here's an example.

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

`go-doudou` has built-in ready-to-use bulkhead functionality in the `github.com/unionj-cloud/go-doudou/v2/framework/rest` package, encapsulated based on [github.com/slok/goresilience](https://github.com/slok/goresilience).

```go
rest.BulkHead(3, 10*time.Millisecond)
```

In the example code above, the first parameter `3` indicates the number of workers in the goroutine pool used to process HTTP requests, and the second parameter `10*time.Millisecond` indicates the maximum waiting time for an HTTP request after it comes in. If it times out, it directly returns a `429` status code.

### Example

```go
func main() {
	...

	svc := service.NewWordcloudBff(conf, minioClient, makerClientProxy, taskClientProxy, userClientProxy)
	handler := httpsrv.NewWordcloudBffHandler(svc)
	srv := rest.NewRestServer()
	srv.AddMiddleware(httpsrv.Auth(userClientProxy))

	rdb := redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:6379", conf.RedisConf.Host),
	})

	fn := redisrate.LimitFn(func(ctx context.Context) ratelimit.Limit {
		return ratelimit.PerSecondBurst(conf.ConConf.RatelimitRate, conf.ConConf.RatelimitBurst)
	})

	srv.AddMiddleware(rest.BulkHead(conf.ConConf.BulkheadWorkers, conf.ConConf.BulkheadMaxwaittime))

	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```  

## Circuit Breaker / Timeout / Retry 

### Usage

`go-doudou` has built-in code for circuit breaker/timeout/retry and other resilience mechanisms encapsulated based on [github.com/slok/goresilience](https://github.com/slok/goresilience) in the generated client code. You just need to execute the following command to generate client code to use:

```shell
go-doudou svc http -c
```  

The `-c` parameter indicates generating Go language client code. The directory structure of the generated `client` package is as follows:

```shell
├── client.go
├── clientproxy.go
└── iclient.go
``` 

The generated code already has a default `goresilience.Runner` instance, and you can also pass in a custom implementation through the `WithRunner(your_own_runner goresilience.Runner)` function.

### Example
```go
func main() {
	conf := config.LoadFromEnv()

	var segClient *segclient.WordcloudSegClient

	if os.Getenv("GDD_SERVICE_DISCOVERY_MODE") != "" {
		provider := etcd.NewSWRRServiceProvider("wordcloud-segsvc_rest")
		segClient = segclient.NewWordcloudSegClient(restclient.WithProvider(provider))
	} else {
		segClient = segclient.NewWordcloudSegClient()
	}

	segClientProxy := segclient.NewWordcloudSegClientProxy(segClient)

	... 

	svc := service.NewWordcloudMaker(conf, segClientProxy, minioClient, browser)
	
	...
}

```  

## Logging

### Usage

`go-doudou` has a global `zerolog.Logger` built into the `github.com/unionj-cloud/go-doudou/v2/toolkit/zlogger` package. If the `GDD_ENV` environment variable is not equal to an empty string and `dev`, it will include some metadata about the service itself.

You can also call the `InitEntry` function to customize the `zerolog.Logger` instance.

You can also set the log level by configuring the `GDD_LOG_LEVEL` environment variable, and set whether the log format is `json` or `text` by configuring the `GDD_LOG_FORMAT` environment variable.

You can enable HTTP request and response log printing by configuring `GDD_LOG_REQ_ENABLE=true`. The default is `false`, which means no printing.

### Example

```go 
// You can use the lumberjack library to add log rotation functionality to your service
zlogger.SetOutput(io.MultiWriter(os.Stdout, &lumberjack.Logger{
			Filename:   filepath.Join(os.Getenv("LOG_PATH"), fmt.Sprintf("%s.log", "usersvc")),
		  MaxSize:    5,  // Single log file maximum size is 5M, exceeding this will create a new log file
      MaxBackups: 10, // Keep a maximum of 10 log files
      MaxAge:     7,  // Log files are kept for a maximum of 7 days
      Compress:   true, // Whether to enable log compression
}))
```

### ELK Stack

The `logger` package supports integration with the ELK stack.

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

## Jaeger Call Chain Monitoring

### Usage

To integrate Jaeger call chain monitoring, follow these steps:

1. Start Jaeger

```shell
docker run -d --name jaeger \
  -p 6831:6831/udp \
  -p 16686:16686 \
  jaegertracing/all-in-one:1.29
```

2. Add two lines of configuration to the `.env` file

```shell
JAEGER_AGENT_HOST=localhost
JAEGER_AGENT_PORT=6831
```

3. Add three lines of code near the beginning of the `main` function

```go
tracer, closer := tracing.Init()
defer closer.Close()
opentracing.SetGlobalTracer(tracer)
```

Then your `main` function should look something like this:

```go
func main() {
	...

	tracer, closer := tracing.Init()
	defer closer.Close()
	opentracing.SetGlobalTracer(tracer)

	...

	svc := service.NewWordcloudMaker(conf, segClientProxy, minioClient, browser)
	handler := httpsrv.NewWordcloudMakerHandler(svc)
	srv := rest.NewRestServer()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

### Screenshots
![jaeger1](/images/jaeger1.png)
![jaeger2](/images/jaeger2.png)  

## Limiting Request Body Size

To ensure service stability and security, it is necessary to limit the size of the request body. We can implement this requirement using the `BodyMaxBytes` middleware in the `rest` package.

```go
package main

import (
	...
)

func main() {
	...

	handler := httpsrv.NewOrdersvcHandler(svc)
	srv := rest.NewRestServer()
	// Limit request body size to no more than 32M
	srv.Use(rest.BodyMaxBytes(32 << 20))
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

## Gateway

In project practice, a frontend project may need to call multiple service interfaces, which can be inconvenient for frontend colleagues to configure. This is where gateway services come in handy. Frontend colleagues only need to configure one gateway service address in the configuration file, and then can request multiple different microservices through the `/service-name/interface-path` pattern. We can implement this requirement using the `Proxy` middleware in the `rest` package.

The gateway service must also register itself to the Nacos service registry or etcd cluster, or both.

```go
package main

import (
	"github.com/unionj-cloud/go-doudou/v2/framework/rest"
)

func main() {
	srv := rest.NewRestServer()
	srv.AddMiddleware(rest.Proxy(rest.ProxyConfig{}))
	srv.Run()
}
```

`.env` configuration file example
```shell
GDD_SERVICE_NAME=gateway
GDD_SERVICE_DISCOVERY_MODE=nacos,etcd

# Nacos related configuration
GDD_NACOS_SERVER_ADDR=http://localhost:8848/nacos
GDD_NACOS_NOT_LOAD_CACHE_AT_START=true

# etcd related configuration
GDD_ETCD_ENDPOINTS=localhost:2379
```

*Note:* For applications not developed with the go-doudou framework registered in the Nacos registry center, if they have a route prefix, it must be set in the `rootPath` property in the `metadata`, otherwise the gateway may report 404.

## Request Body and Request Parameter Validation

Since version v1.1.9, go-doudou has added a validation mechanism for request bodies and request parameters based on [go-playground/validator](https://github.com/go-playground/validator).

### Usage

go-doudou's built-in request validation mechanism is as follows:

1. Pointer type parameters passed in the interface definition are optional parameters, while non-pointer type parameters are required parameters;
2. In the interface definition, you can add the `@validate` annotation in the form of a Go language comment above the method parameters, following the annotation syntax and format described in the [Interface Definition-Annotations](./idl.html#annotations) section, passing specific validation rules as parameters to the annotation;
3. When defining struct structures in the vo package, you can add the `validate` tag in the property's tag, followed by specific validation rules;

The validation rules mentioned in points 2 and 3 above only support the rules in the `go-playground/validator` library. The actual code for validating request bodies and request parameters in go-doudou is all in the `handlerimpl.go` file generated by the go-doudou command line tool. Only struct type (including struct pointer type) parameters are validated through the `func (v *Validate) Struct(s interface{}) error` method, while other types of parameters are validated through the `func (v *Validate) Var(field interface{}, tag string) error` method.

go-doudou's `ddhttp` package provides a singleton of the `*validator.Validate` type through the exported function `func GetValidate() *validator.Validate`, which developers can use to call APIs provided directly by `go-playground/validator` to implement more complex, custom requirements, such as Chinese translation of error messages, custom validation rules, etc. Please refer to `go-playground/validator`'s [official documentation](https://pkg.go.dev/github.com/go-playground/validator/v10) and [official examples](https://github.com/go-playground/validator/tree/master/_examples).

### Example

Interface definition example

```go
// <b style="color: red">NEW</b> Article creation and update interface
// If there is an id in the passed parameters, the update operation is performed, otherwise the creation operation is performed
// @role(SUPER_ADMIN)
Article(ctx context.Context, file *v3.FileModel,
	// @validate(gt=0,lte=60)
	title,
	// @validate(gt=0,lte=1000)
	content *string, tags *[]string, sort, status *int, id *int) (data string, err error)
```

Struct structure example in the vo package

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

Generated code example

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
			if _err := rest.ValidateStruct(payload); _err != nil {
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
		if _err := rest.ValidateVar(title, "gt=0,lte=60", "title"); _err != nil {
			http.Error(_writer, _err.Error(), http.StatusBadRequest)
			return
		}
	}
	if _, exists := _req.Form["content"]; exists {
		_content := _req.FormValue("content")
		content = &_content
		if _err := rest.ValidateVar(content, "gt=0,lte=1000", "content"); _err != nil {
			http.Error(_writer, _err.Error(), http.StatusBadRequest)
			return
		}
	}
	...
}
```

Chinese translation of error messages example

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
	rest.SetTranslator(trans)
	zhtrans.RegisterDefaultTranslations(rest.GetValidate(), trans)

	...

	srv.Run()
}