# Getting Started

## Prerequisites

- go 1.15 with GO111MODULE=on
- go 1.16+
- < go 1.15: not support from v1.0.3

## Install gRPC Compiler and Plugins

### Install Compiler protoc

To install the Protobuf compiler protoc, please refer to [official documentation](https://grpc.io/docs/protoc-installation/), here are the installation commands for common operating systems:

- Ubuntu system:

```shell
$ apt install -y protobuf-compiler
$ protoc --version # Make sure to install v3 and above
````

- Mac system, you need to install [Homebrew](https://brew.sh/):

```shell
$ brew install protobuf
$ protoc --version # Make sure to install v3 and above
````

- If Homebrew fails to be installed on Windows systems or Mac systems, you need to download the installation package from github, unzip it, and configure the environment variables yourself.
  The latest protoc download address for Windows system: [https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-win64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-win64.zip)
Mac system Intel latest protoc download address: [https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-osx-x86_64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-osx-x86_64.zip)
Please find other packages in [github releases](https://github.com/protocolbuffers/protobuf/releases).

### Install Plugins

1. Install the plugin:

```shell
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
````

2. Configure environment variables:

```shell
$ export PATH="$PATH:$(go env GOPATH)/bin"
````

::: tip
Please go to [https://grpc.io/docs/languages/go/quickstart/](https://grpc.io/docs/languages/go/quickstart/) to find the latest version number.
:::

## Install go-doudou

- If go version < 1.17,
```shell
go get -v github.com/unionj-cloud/go-doudou@v1.3.3
```

- If go version >= 1.17, recommend to use below command to install go-doudou cli globally
```shell
go install -v github.com/unionj-cloud/go-doudou@v1.3.3
```
and use below command to download go-doudou as dependency for your module.
```shell
go get -v -d github.com/unionj-cloud/go-doudou@v1.3.3
```

::: tip
If you meet 410 Gone error, try to run below command, then run install command again:

```shell
export GOSUMDB=off
``` 

After installation, if you meet `go-doudou: command not found` error, please configure `$HOME/go/bin` to `~/.bash_profile` file, for example:

```shell
# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

PATH=$PATH:/usr/local/go/bin
PATH=$PATH:$HOME/go/bin

export PATH
```

:::

## Upgrade
You can run `go-doudou version` to upgrade cli.
```shell
➜  ~ go-doudou version                       
Installed version is v1.1.9
Latest release version is v1.3.3
✔ Yes
go install -v github.com/unionj-cloud/go-doudou@v1.3.3
go: downloading github.com/unionj-cloud/go-doudou v1.3.3
github.com/unionj-cloud/go-doudou/toolkit/sqlext/columnenum
github.com/unionj-cloud/go-doudou/toolkit/sqlext/sortenum
github.com/unionj-cloud/go-doudou/toolkit/sqlext/nullenum
github.com/unionj-cloud/go-doudou/toolkit/sqlext/keyenum
github.com/unionj-cloud/go-doudou/toolkit/sqlext/extraenum
github.com/unionj-cloud/go-doudou/toolkit/sqlext/config
github.com/unionj-cloud/go-doudou/toolkit/constants
github.com/unionj-cloud/go-doudou/toolkit/stringutils
github.com/unionj-cloud/go-doudou/toolkit/sliceutils
github.com/unionj-cloud/go-doudou/toolkit/templateutils
github.com/unionj-cloud/go-doudou/toolkit/sqlext/wrapper
github.com/unionj-cloud/go-doudou/toolkit/pathutils
github.com/unionj-cloud/go-doudou/framework/internal/config
github.com/unionj-cloud/go-doudou/copier
github.com/unionj-cloud/go-doudou/executils
github.com/unionj-cloud/go-doudou/cmd/internal/astutils
github.com/unionj-cloud/go-doudou/logutils
github.com/unionj-cloud/go-doudou/test
github.com/unionj-cloud/go-doudou/name
github.com/unionj-cloud/go-doudou/toolkit/sqlext/ddlast
github.com/unionj-cloud/go-doudou/openapi/v3
github.com/unionj-cloud/go-doudou/toolkit/sqlext/table
github.com/unionj-cloud/go-doudou/openapi/v3/codegen/client
github.com/unionj-cloud/go-doudou/framework/internal/codegen
github.com/unionj-cloud/go-doudou/toolkit/sqlext/codegen
github.com/unionj-cloud/go-doudou/ddl
github.com/unionj-cloud/go-doudou/svc
github.com/unionj-cloud/go-doudou/cmd
github.com/unionj-cloud/go-doudou
DONE
➜  ~ go-doudou version
Installed version is v1.3.3
➜  ~ 
```  

## Usage

```shell
➜  ~ go-doudou -h                                 
go-doudou works like a scaffolding tool but more than that. 
it lets api providers design their apis and help them code less. 
it generates openapi 3.0 spec json document for frontend developers or other api consumers to understand what apis there, 
consumers can import it into postman to debug and test, or upload it into some code generators to download client sdk.
it provides some useful components and middleware for constructing microservice cluster like service register and discovering, 
load balancing and so on. it just begins, more features will come out soon.

Usage:
  go-doudou [flags]
  go-doudou [command]

Available Commands:
  ddl         migration tool between database table structure and golang struct
  help        Help about any command
  name        bulk add or update json tag of struct fields
  svc         generate or update service
  version     Print the version number of go-doudou

Flags:
  -h, --help      help for go-doudou
  -v, --version   version for go-doudou

Use "go-doudou [command] --help" for more information about a command.
```

## Hello World

### Initialize Project
Run `svc init` command, you can use `-m` flag to specify module name.
```shell
go-doudou svc init helloworld -m github.com/unionj-cloud/helloworld
```
It creates helloworld folder and some initial files.
```
➜  helloworld git:(master) ✗ tree -a 
.
├── .env
├── .git
│   ├── HEAD
│   ├── objects
│   │   ├── info
│   │   └── pack
│   └── refs
│       ├── heads
│       └── tags
├── .gitignore
├── Dockerfile
├── go.mod
├── svc.go
└── vo
    └── vo.go

8 directories, 7 files
```
- Dockerfile：build docker image

- svc.go: design your RESTful apis by defining methods in `Helloworld` interface

- vo folder：define structs as view objects and OpenAPI 3.0 schemas used in http request body and response body

- .env: config file used to load `GDD_` prefixed environment variables

### Define API

`svc.go` file is the idl file to describe your apis. Let's comment out the example api `PageUsers` and define our own like `Greeting`.  
Please refer to [Define API](./idl.md) to learn more.

```go
/**
* Generated by go-doudou v1.3.3.
* You can edit it as your need.
 */
package service

import (
	"context"
)

//go:generate go-doudou svc http --handler -c --doc
//go:generate go-doudou svc grpc

type Helloworld interface {
	// You can define your service methods as your need. Below is an example.
	// You can also add annotations here like @role(admin) to add meta data to routes for
	// implementing your own middlewares
	Greeting(ctx context.Context, greeting string) (data string, err error)
}
```

### Generate Code
```shell
go-doudou svc http --handler -c --doc
```
then we should run `go mod tidy` to download dependencies.
If you use go 1.17, you will see below instruction:
```
To upgrade to the versions selected by go 1.16:
	go mod tidy -go=1.16 && go mod tidy -go=1.17
If reproducibility with go 1.16 is not needed:
	go mod tidy -compat=1.17
For other options, see:
	https://golang.org/doc/modules/pruning
```
Then you should run `go mod tidy -go=1.16 && go mod tidy -go=1.17` or `go mod tidy -compat=1.17`.  
Let's see what are generated.

```shell
.
├── Dockerfile
├── client
│   ├── client.go
│   ├── clientproxy.go
│   └── iclient.go
├── cmd
│   └── main.go
├── config
│   └── config.go
├── db
│   └── db.go
├── go.mod
├── go.sum
├── helloworld_openapi3.go
├── helloworld_openapi3.json
├── svc.go
├── svcimpl.go
├── transport
│   └── httpsrv
│       ├── handler.go
│       ├── handlerimpl.go
│       └── middleware.go
└── vo
    └── vo.go
```

- helloworld_openapi3.json: OpenAPI 3.0 spec json documentation
- helloworld_openapi3.go: assign OpenAPI 3.0 spec json string to a variable for serving online
- client folder: golang http client sdk based on [resty](https://github.com/go-resty/resty)
- cmd folder: entry of the whole program
- config folder: used for loading your custom business related configs
- db folder: helper function for connecting to database
- svcimpl.go: code your business logic here
- transport folder: http routes and handlers

### Run
Run `go-doudou svc run`
```shell
➜  helloworld git:(master) ✗ go-doudou svc run
2022/10/04 20:16:34 maxprocs: Leaving GOMAXPROCS=16: CPU quota undefined
                           _                    _
                          | |                  | |
  __ _   ___   ______   __| |  ___   _   _   __| |  ___   _   _
 / _` | / _ \ |______| / _` | / _ \ | | | | / _` | / _ \ | | | |
| (_| || (_) |        | (_| || (_) || |_| || (_| || (_) || |_| |
 \__, | \___/          \__,_| \___/  \__,_| \__,_| \___/  \__,_|
  __/ |
 |___/
2022-10-04 20:16:34 INF ================ Registered Routes ================
2022-10-04 20:16:34 INF +----------------------+--------+-------------------------------+
2022-10-04 20:16:34 INF |         NAME         | METHOD |            PATTERN            |
2022-10-04 20:16:34 INF +----------------------+--------+-------------------------------+
2022-10-04 20:16:34 INF | Greeting             | POST   | /greeting                     |
2022-10-04 20:16:34 INF | GetDoc               | GET    | /go-doudou/doc                |
2022-10-04 20:16:34 INF | GetOpenAPI           | GET    | /go-doudou/openapi.json       |
2022-10-04 20:16:34 INF | Prometheus           | GET    | /go-doudou/prometheus         |
2022-10-04 20:16:34 INF | GetRegistry          | GET    | /go-doudou/registry           |
2022-10-04 20:16:34 INF | GetConfig            | GET    | /go-doudou/config             |
2022-10-04 20:16:34 INF | GetStatsvizWs        | GET    | /go-doudou/statsviz/ws        |
2022-10-04 20:16:34 INF | GetStatsviz          | GET    | /go-doudou/statsviz/*filepath |
2022-10-04 20:16:34 INF | GetDebugPprofCmdline | GET    | /debug/pprof/cmdline          |
2022-10-04 20:16:34 INF | GetDebugPprofProfile | GET    | /debug/pprof/profile          |
2022-10-04 20:16:34 INF | GetDebugPprofSymbol  | GET    | /debug/pprof/symbol           |
2022-10-04 20:16:34 INF | GetDebugPprofTrace   | GET    | /debug/pprof/trace            |
2022-10-04 20:16:34 INF | GetDebugPprofIndex   | GET    | /debug/pprof/*filepath        |
2022-10-04 20:16:34 INF +----------------------+--------+-------------------------------+
2022-10-04 20:16:34 INF ===================================================
2022-10-04 20:16:34 INF Http server is listening at :6060
2022-10-04 20:16:34 INF Http server started in 1.323458ms
```

### Postman
Import helloworld_openapi3.json to postman to test `/greeting` api. You can see fake response returned.
![greeting](/images/greeting.png)

### Implementation
Now we are going to start implementing our business logic in `svcimpl.go` file.
Let's what code already there.
```go
/**
* Generated by go-doudou v1.3.3.
* You can edit it as your need.
 */
package service

import (
	"context"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/unionj-cloud/helloworld/config"
)

var _ Helloworld = (*HelloworldImpl)(nil)

type HelloworldImpl struct {
	conf *config.Config
}

func (receiver *HelloworldImpl) Greeting(ctx context.Context, greeting string) (data string, err error) {
	var _result struct {
		Data string
	}
	_ = gofakeit.Struct(&_result)
	return _result.Data, nil
}

func NewHelloworld(conf *config.Config) *HelloworldImpl {
	return &HelloworldImpl{
		conf: conf,
	}
}
```
We use [gofakeit](github.com/brianvoe/gofakeit) to generate fake response as default implementation. Now we should get rid of it and start to code.
```go
/**
* Generated by go-doudou v1.3.3.
* You can edit it as your need.
 */
package service

import (
	"context"
	"fmt"

	"github.com/unionj-cloud/helloworld/config"
)

var _ Helloworld = (*HelloworldImpl)(nil)

type HelloworldImpl struct {
	conf *config.Config
}

func (receiver *HelloworldImpl) Greeting(ctx context.Context, greeting string) (data string, err error) {
	return fmt.Sprintf("Hello %s", greeting), nil
}

func NewHelloworld(conf *config.Config) *HelloworldImpl {
	return &HelloworldImpl{
		conf: conf,
	}
}
```
We removed Line 21~25 and replaced with `return fmt.Sprintf("Hello %s", greeting), nil`. Then let's test it again.
![greeting1](/images/greeting1.png)
You see, it's really very simple to write a RESTful service with go-doudou!

### gRPC service

Let's add the gRPC service to the project. gRPC is the most popular rpc framework in the go ecosystem. gRPC uses `http2` as the network protocol and `protobuf` as the message body serialization scheme. The general process of developing a gRPC service is probably the following steps:

1. First define `message` and `service` in the file with the `.proto` suffix according to the syntax of `protobuf`
2. Execute something like `protoc --proto_path=. --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative transport/grpc/helloworld.proto` Command to generate server-side and client-side piling code
3. Then define the structure and method yourself to implement an interface like `pb.HelloworldServiceServer`, so as to realize the business logic
4. Finally in the `main` function add something like

````go
...
grpcServer := grpc.NewServer(opts...)
pb.RegisterHelloworldServiceServer(grpcServer, svc)
grpcServer.Serve(lis)
````

Such code to start the gRPC service.

If you use `go-doudou` as the development framework to develop gRPC services, it will be much simpler. Taking the `Helloworld` project above as an example, it only takes two steps:

#### Generate gRPC code

Execute the command `go-doudou svc grpc` in the project root path, this command directly generates files with `.proto` suffix, server and client piling code, and `pb in the `svcimpl.go` file. The implementation method of the HelloworldServiceServer` interface, just wait for us to implement the specific business logic in the generated method.

The folder structure at this point is as follows:

```shell
...
├── main
├── svc.go
├── svcimpl.go
├── transport
│   ├── grpc
│   │   ├── helloworld.pb.go
│   │   ├── helloworld.proto
│   │   └── helloworld_grpc.pb.go
│   └── httpsrv
│       ├── handler.go
│       ├── handlerimpl.go
│       └── middleware.go
└── vo
    └── vo.go
```

Let's look at the `svcimpl.go` file again, and you can see that there is an additional `GreetingRpc` method, so that the `HelloworldImpl` structure implements the `pb.HelloworldServiceServer` interface.

```go
func (receiver *HelloworldImpl) GreetingRpc(ctx context.Context, request *pb.GreetingRpcRequest) (*pb.GreetingRpcResponse, error) {
	//TODO implement me
	panic("implement me")
}
```

Here we can reuse the `Greeting` method used by RESTful services. The modified code is as follows:

```go
func (receiver *HelloworldImpl) GreetingRpc(ctx context.Context, request *pb.GreetingRpcRequest) (*pb.GreetingRpcResponse, error) {
	data, err := receiver.Greeting(ctx, request.Greeting)
	if err != nil {
		return nil, err
	}
	return &pb.GreetingRpcResponse{
		Data: data,
	}, nil
}
```

#### Modify the main function

Add the following code to the `main` function of the `main.go` file in the `cmd` folder:

```go
go func() {
		grpcServer := ddgrpc.NewGrpcServer(
			grpc.StreamInterceptor(grpc_middleware.ChainStreamServer(
				grpc_ctxtags.StreamServerInterceptor(),
				grpc_opentracing.StreamServerInterceptor(),
				grpc_prometheus.StreamServerInterceptor,
				tags.StreamServerInterceptor(tags.WithFieldExtractor(tags.CodeGenRequestFieldExtractor)),
				logging.StreamServerInterceptor(grpczerolog.InterceptorLogger(logger.Logger)),
				grpc_recovery.StreamServerInterceptor(),
			)),
			grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
				grpc_ctxtags.UnaryServerInterceptor(),
				grpc_opentracing.UnaryServerInterceptor(),
				grpc_prometheus.UnaryServerInterceptor,
				tags.UnaryServerInterceptor(tags.WithFieldExtractor(tags.CodeGenRequestFieldExtractor)),
				logging.UnaryServerInterceptor(grpczerolog.InterceptorLogger(logger.Logger)),
				grpc_recovery.UnaryServerInterceptor(),
			)),
		)
		pb.RegisterHelloworldServiceServer(grpcServer, svc)
		grpcServer.Run()
	}()
```

After modification, the complete `main.go` file code is as follows:

```go
/**
* Generated by go-doudou v1.3.3.
* You can edit it as your need.
 */
package main

import (
	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpczerolog "github.com/grpc-ecosystem/go-grpc-middleware/providers/zerolog/v2"
	grpc_recovery "github.com/grpc-ecosystem/go-grpc-middleware/recovery"
	grpc_ctxtags "github.com/grpc-ecosystem/go-grpc-middleware/tags"
	grpc_opentracing "github.com/grpc-ecosystem/go-grpc-middleware/tracing/opentracing"
	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/logging"
	"github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/tags"
	grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
	ddgrpc "github.com/unionj-cloud/go-doudou/framework/grpc"
	ddhttp "github.com/unionj-cloud/go-doudou/framework/http"
	logger "github.com/unionj-cloud/go-doudou/toolkit/zlogger"
	service "github.com/unionj-cloud/helloworld"
	"github.com/unionj-cloud/helloworld/config"
	pb "github.com/unionj-cloud/helloworld/transport/grpc"
	"github.com/unionj-cloud/helloworld/transport/httpsrv"
	"google.golang.org/grpc"
)

func main() {
	conf := config.LoadFromEnv()
	svc := service.NewHelloworld(conf)

	go func() {
		grpcServer := ddgrpc.NewGrpcServer(
			grpc.StreamInterceptor(grpc_middleware.ChainStreamServer(
				grpc_ctxtags.StreamServerInterceptor(),
				grpc_opentracing.StreamServerInterceptor(),
				grpc_prometheus.StreamServerInterceptor,
				tags.StreamServerInterceptor(tags.WithFieldExtractor(tags.CodeGenRequestFieldExtractor)),
				logging.StreamServerInterceptor(grpczerolog.InterceptorLogger(logger.Logger)),
				grpc_recovery.StreamServerInterceptor(),
			)),
			grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
				grpc_ctxtags.UnaryServerInterceptor(),
				grpc_opentracing.UnaryServerInterceptor(),
				grpc_prometheus.UnaryServerInterceptor,
				tags.UnaryServerInterceptor(tags.WithFieldExtractor(tags.CodeGenRequestFieldExtractor)),
				logging.UnaryServerInterceptor(grpczerolog.InterceptorLogger(logger.Logger)),
				grpc_recovery.UnaryServerInterceptor(),
			)),
		)
		pb.RegisterHelloworldServiceServer(grpcServer, svc)
		grpcServer.Run()
	}()

	handler := httpsrv.NewHelloworldHandler(svc)
	srv := ddhttp.NewHttpRouterSrv()
	srv.AddRoute(httpsrv.Routes(handler)...)
	srv.Run()
}
```

After executing the command `go mod tidy`, let's restart the service and take a look.

```shell
➜  helloworld git:(master) ✗ go-doudou svc run
2022/10/04 20:52:40 maxprocs: Leaving GOMAXPROCS=16: CPU quota undefined
                           _                    _
                          | |                  | |
  __ _   ___   ______   __| |  ___   _   _   __| |  ___   _   _
 / _` | / _ \ |______| / _` | / _ \ | | | | / _` | / _ \ | | | |
| (_| || (_) |        | (_| || (_) || |_| || (_| || (_) || |_| |
 \__, | \___/          \__,_| \___/  \__,_| \__,_| \___/  \__,_|
  __/ |
 |___/
2022-10-04 20:52:40 INF ================ Registered Routes ================
2022-10-04 20:52:40 INF +----------------------+--------+-------------------------------+
2022-10-04 20:52:40 INF |         NAME         | METHOD |            PATTERN            |
2022-10-04 20:52:40 INF +----------------------+--------+-------------------------------+
2022-10-04 20:52:40 INF | Greeting             | POST   | /greeting                     |
2022-10-04 20:52:40 INF | GetDoc               | GET    | /go-doudou/doc                |
2022-10-04 20:52:40 INF | GetOpenAPI           | GET    | /go-doudou/openapi.json       |
2022-10-04 20:52:40 INF | Prometheus           | GET    | /go-doudou/prometheus         |
2022-10-04 20:52:40 INF ================ Registered Services ================
2022-10-04 20:52:40 INF | GetRegistry          | GET    | /go-doudou/registry           |
2022-10-04 20:52:40 INF | GetConfig            | GET    | /go-doudou/config             |
2022-10-04 20:52:40 INF | GetStatsvizWs        | GET    | /go-doudou/statsviz/ws        |
2022-10-04 20:52:40 INF | GetStatsviz          | GET    | /go-doudou/statsviz/*filepath |
2022-10-04 20:52:40 INF | GetDebugPprofCmdline | GET    | /debug/pprof/cmdline          |
2022-10-04 20:52:40 INF | GetDebugPprofProfile | GET    | /debug/pprof/profile          |
2022-10-04 20:52:40 INF +------------------------------------------+----------------------+
2022-10-04 20:52:40 INF |                 SERVICE                  |         RPC          |
2022-10-04 20:52:40 INF | GetDebugPprofSymbol  | GET    | /debug/pprof/symbol           |
2022-10-04 20:52:40 INF +------------------------------------------+----------------------+
2022-10-04 20:52:40 INF | GetDebugPprofTrace   | GET    | /debug/pprof/trace            |
2022-10-04 20:52:40 INF | GetDebugPprofIndex   | GET    | /debug/pprof/*filepath        |
2022-10-04 20:52:40 INF | helloworld.HelloworldService             | GreetingRpc          |
2022-10-04 20:52:40 INF +----------------------+--------+-------------------------------+
2022-10-04 20:52:40 INF | grpc.reflection.v1alpha.ServerReflection | ServerReflectionInfo |
2022-10-04 20:52:40 INF ===================================================
2022-10-04 20:52:40 INF +------------------------------------------+----------------------+
2022-10-04 20:52:40 INF ===================================================
2022-10-04 20:52:40 INF Http server is listening at :6060
2022-10-04 20:52:40 INF Http server started in 2.085978ms
2022-10-04 20:52:40 INF Grpc server is listening at [::]:50051
2022-10-04 20:52:40 INF Grpc server started in 8.11024ms
```

The log output is a bit messy because the gRPC service and the RESTful service are running in separate goroutines. The log output will be clearer if only the gRPC service is started.

When we see `Grpc server is listening at [::]:50051`, the gRPC service is successfully started.

### Test gRPC

You can test gRPC services with postman, but I won't go into details here.

![postmangrpc](/images/postmangrpc.jpeg)

Here we use the well-known gRPC client tool `evans` to test. For details, please jump to [https://github.com/ktr0731/evans](https://github.com/ktr0731/evans).

Please read the comments in the code for usage.

```shell
# 50051 is the default port number that grpc server listens to
➜  helloworld git:(master) ✗ evans -r repl -p 50051

  ______
 |  ____|
 | |__    __   __   __ _   _ __    ___
 |  __|   \ \ / /  / _. | | '_ \  / __|
 | |____   \ V /  | (_| | | | | | \__ \
 |______|   \_/    \__,_| |_| |_| |___/

 more expressive universal gRPC client

# View which services and rpc interfaces are provided by grpc server
helloworld.HelloworldService@127.0.0.1:50051> show service
+-------------------+-------------+--------------------+---------------------+
|      SERVICE      |     RPC     |    REQUEST TYPE    |    RESPONSE TYPE    |
+-------------------+-------------+--------------------+---------------------+
| HelloworldService | GreetingRpc | GreetingRpcRequest | GreetingRpcResponse |
+-------------------+-------------+--------------------+---------------------+

# Switch to the HelloworldService service, so that after the call command, you can directly enter the rpc name
helloworld.HelloworldService@127.0.0.1:50051> service HelloworldService

# Call the GreetingRpc interface, open the interactive terminal, 
# input parameters according to the prompt, and output the return value
helloworld.HelloworldService@127.0.0.1:50051> call GreetingRpc
greeting (TYPE_STRING) => Jack
{
  "data": "Hello Jack"
}

# Exit evans
helloworld.HelloworldService@127.0.0.1:50051> exit
Good Bye :)
```

After we input "Jack", we output "Hello Jack", which proves that the gRPC service can run.

We can see that a line of log is also output in the tab of the command line terminal where the gRPC service is located:

```shell
2022-10-04 21:31:03 INF finished server unary call grpc.code=OK grpc.method=GreetingRpc grpc.method_type=unary grpc.service=helloworld.HelloworldService grpc.start_time=2022-10-04T21:31:03+08:00 grpc.time_ms=0.031 kind=server peer.address=127.0.0.1:53737 system=grpc
```

### Deployment
There are a lot of approaches to deploy go http server. We'd like to use kubernetes to deploy our projects.
Please refer to [Deployment](./deployment.md) to learn more.
#### Build Docker Image
Run `go-doudou svc push -r wubin1989`, don't forget change `wubin1989` to your remote docker image reposiotry.
```shell
...
v20221004215355: digest: sha256:31d4242cc6d27990e7cf562c285bd164c10914bceddc6a23068a52aa43c217be size: 1360
INFO[2022-10-04 22:01:37] image wubin1989/helloworld:v20221004215355 has been pushed successfully 
INFO[2022-10-04 22:01:37] k8s yaml has been created/updated successfully. execute command 'go-doudou svc deploy' to deploy service helloworld to k8s cluster 
```

Then you should see there are two yaml files generated: `helloworld_deployment.yaml` and `helloworld_statefulset.yaml`

- `helloworld_deployment.yaml`: k8s deploy file for stateless service
- `helloworld_statefulset.yaml`: k8s deploy file for stateful service  

#### Deploy
::: tip
If you haven't installed Docker Desktop, please download and install it from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).  
If you are not familiar with docker and kubernetes, please refer to [official documentation](https://docs.docker.com/get-started/overview/) to learn more.
::: 
By default, `go-doudou svc deploy` command uses `helloworld_statefulset.yaml` to deploy the service as statefulset application.  
```shell
go-doudou svc deploy
```

Stateless services can also be deployed by adding the `-k` option followed by the file path:

```shell
go-doudou svc deploy -k helloworld_deployment.yaml
```

Then run `kubectl get pods` and you should see our service is running.
```shell
➜  helloworld git:(master) ✗ kubectl get pods    
NAME                       READY   STATUS    RESTARTS   AGE
helloworld-statefulset-0   1/1     Running   0          11m
```
At the moment, you can't connect to our service via `http://localhost:6060`. You should setup proxy by running below commands:
```shell
export POD_NAME=$(kubectl get pods --namespace default -l "app=helloworld" -o jsonpath="{.items[0].metadata.name}")
```
and 
```shell
kubectl port-forward --namespace default $POD_NAME 6060:6060 
```
If you see below output from command line, you can test by postman now.
```shell
➜  helloworld git:(master) ✗ export POD_NAME=$(kubectl get pods --namespace default -l "app=helloworld" -o jsonpath="{.items[0].metadata.name}")
➜  helloworld git:(master) ✗ kubectl port-forward --namespace default $POD_NAME 6060:6060                                               
Forwarding from 127.0.0.1:6060 -> 6060
Forwarding from [::1]:6060 -> 6060
```

#### Shutdown
Run `go-doudou svc shutdown` to stop the service.
```shell
go-doudou svc shutdown
```  
Then run `kubectl get pods` again, you should see below output.
```shell
➜  helloworld git:(master) ✗ kubectl get pods                                                                                             
No resources found in default namespace.
```

