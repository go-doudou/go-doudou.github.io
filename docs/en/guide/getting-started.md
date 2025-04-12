# Getting Started

## Prerequisites

- Only supports go1.16 and above

## Install gRPC compiler and plugins

### Install the compiler protoc

Install the Protobuf compiler protoc, you can refer to the [official documentation](https://grpc.io/docs/protoc-installation/). Here are the installation commands for common operating systems:

- Ubuntu:

```shell
$ apt install -y protobuf-compiler
$ protoc --version  # Ensure v3 or above is installed
```

- Mac, first install [Homebrew](https://brew.sh/):

```shell
$ brew install protobuf
$ protoc --version  # Ensure v3 or above is installed
```

- For Windows, or if Homebrew installation fails on Mac, download the package from GitHub, extract it, and configure the environment variables yourself.  
  Latest protoc download link for Windows: [https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-win64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-win64.zip)  
  Latest protoc download link for Mac Intel: [https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-osx-x86_64.zip](https://github.com/protocolbuffers/protobuf/releases/download/v21.7/protoc-21.7-osx-x86_64.zip)  
  For other installation packages, please find them in [GitHub releases](https://github.com/protocolbuffers/protobuf/releases).

### Install plugins

1. Install plugins:

```shell
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
```

2. Configure environment variables:

```shell
$ export PATH="$PATH:$(go env GOPATH)/bin"
```

::: tip
For the latest version numbers, please visit [https://grpc.io/docs/languages/go/quickstart/](https://grpc.io/docs/languages/go/quickstart/).
:::

## Install go-doudou
- If Go version is below 1.17
```shell
go get -v github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

- If Go version >= 1.17, it's recommended to use the following command to install the `go-doudou` command-line tool globally
```shell
go install -v github.com/unionj-cloud/go-doudou/v2@v2.5.8
```
It's recommended to use the following command to download go-doudou as a project dependency
```shell
go get -v -d github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

::: tip
If you encounter a `410 Gone error`, please execute the following command first, and then execute the above installation command

```shell
export GOSUMDB=off
``` 

After installation, if you encounter a `go-doudou: command not found` error, please configure `$HOME/go/bin` in the `~/.bash_profile` file, for example:

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
You can execute the command `go-doudou version` to upgrade the globally installed `go-doudou` command-line tool
```shell
➜  ~ go-doudou version                       
Installed version is v1.1.9
Latest release version is v2.5.8
✔ Yes
go install -v github.com/unionj-cloud/go-doudou/v2@v2.5.8
go: downloading github.com/unionj-cloud/go-doudou/v2 v2.5.8
github.com/unionj-cloud/go-doudou/v2/toolkit/constants
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/extraenum
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/keyenum
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/columnenum
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/config
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/nullenum
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/sortenum
github.com/unionj-cloud/go-doudou/v2/version
github.com/unionj-cloud/go-doudou/v2/toolkit/openapi/v3
github.com/unionj-cloud/go-doudou/v2/toolkit/reflectutils
github.com/unionj-cloud/go-doudou/v2/toolkit/stringutils
github.com/unionj-cloud/go-doudou/v2/toolkit/caller
github.com/unionj-cloud/go-doudou/v2/toolkit/pathutils
github.com/unionj-cloud/go-doudou/v2/toolkit/sliceutils
github.com/unionj-cloud/go-doudou/v2/toolkit/templateutils
github.com/unionj-cloud/go-doudou/v2/toolkit/cast
github.com/unionj-cloud/go-doudou/v2/toolkit/zlogger
github.com/unionj-cloud/go-doudou/v2/cmd/internal/executils
github.com/unionj-cloud/go-doudou/v2/toolkit/copier
github.com/unionj-cloud/go-doudou/v2/cmd/internal/astutils
github.com/unionj-cloud/go-doudou/v2/toolkit/dotenv
github.com/unionj-cloud/go-doudou/v2/toolkit/yaml
github.com/unionj-cloud/go-doudou/v2/toolkit/sqlext/logger
github.com/unionj-cloud/go-doudou/v2/toolkit/sqlext/wrapper
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/ddlast
github.com/unionj-cloud/go-doudou/v2/cmd/internal/name
github.com/unionj-cloud/go-doudou/v2/cmd/internal/protobuf/v3
github.com/unionj-cloud/go-doudou/v2/cmd/internal/openapi/v3/codegen/client
github.com/unionj-cloud/go-doudou/v2/cmd/internal/openapi/v3
github.com/unionj-cloud/go-doudou/v2/cmd/internal/svc/codegen
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/table
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl/codegen
github.com/unionj-cloud/go-doudou/v2/cmd/internal/svc
github.com/unionj-cloud/go-doudou/v2/cmd/internal/ddl
github.com/unionj-cloud/go-doudou/v2/cmd
github.com/unionj-cloud/go-doudou/v2
DONE
➜  ~ go-doudou version
Installed version is v2.5.8
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
Execute the `go-doudou svc init` command. You can set the `-m` parameter to specify the module name.
```shell
go-doudou svc init helloworld -m github.com/unionj-cloud/helloworld
```
This command will generate a `helloworld` folder and some initialization files.
```
➜  helloworld git:(master) ✗ tree -a 
.
├── .env
├── .git
│   ├── HEAD
│   ├── objects
│   │   ├── info
│   │   └── pack
│   └── refs
│       ├── heads
│       └── tags
├── .gitignore
├── Dockerfile
├── go.mod
├── svc.go
└── vo
    └── vo.go

8 directories, 7 files
```
- `Dockerfile`: For packaging docker images

- `svc.go`: Define methods in the `Helloworld` interface in this file, go-doudou generates corresponding RESTful interface code based on your defined methods

- `vo` package: Define `view object` structures for request bodies and response bodies. You can manually create multiple go files. The structures defined in the `vo` package will all be generated as `schemas` in the json format interface document of `OpenAPI 3.0`

- `.env`: Configuration file, the configurations inside will be loaded into environment variables

### Define Interface

The `svc.go` file is equivalent to an interface definition file. We define methods in the `Helloworld` interface to define our APIs. Now let's comment out the default generated example `PageUsers` method and define our own interface `Greeting`. Please refer to the [Define API](./idl.md) chapter for more information.

```go
/**
* Generated by go-doudou v2.5.8.
* You can edit it as your need.
 */
package service

import (
	"context"
)

//go:generate go-doudou svc http -c
//go:generate go-doudou svc grpc

type Helloworld interface {
	Greeting(ctx context.Context, greeting string) (data string, err error)
}
```

### Generate Code
First execute the following command
```shell
go-doudou svc http -c
```
Then execute `go mod tidy` to download dependencies. If you're using Go version 1.17, you might see the following prompt:
```
To upgrade to the versions selected by go 1.16:
	go mod tidy -go=1.16 && go mod tidy -go=1.17
If reproducibility with go 1.16 is not needed:
	go mod tidy -compat=1.17
For other options, see:
	https://golang.org/doc/modules/pruning
```
In this case, you need to execute the command `go mod tidy -go=1.16 && go mod tidy -go=1.17` or `go mod tidy -compat=1.17`.
Let's see what was generated.

```shell
.
├── Dockerfile
├── client
│   ├── client.go
│   ├── clientproxy.go
│   └── iclient.go
├── cmd
│   └── main.go
├── config
│   └── config.go
├── db
│   └── db.go
├── go.mod
├── go.sum
├── helloworld_openapi3.go
├── helloworld_openapi3.json
├── svc.go
├── svcimpl.go
├── transport
│   └── httpsrv
│       ├── handler.go
│       ├── handlerimpl.go
│       └── middleware.go
└── vo
    └── vo.go
```

- `helloworld_openapi3.json`: JSON format `OpenAPI 3.0` interface document
- `helloworld_openapi3.go`: Assigns the content of the `OpenAPI 3.0` interface document to a global variable for online browsing
- `client` package: Go language http request client code encapsulated based on [resty](https://github.com/go-resty/resty)
- `cmd` package: Entry point for the entire program
- `config` package: For loading business-related configurations
- `db` package: Utility code for connecting to databases
- `svcimpl.go`: Implement the interface in this file, write real business logic code
- `transport` package: HTTP network layer code, mainly responsible for parsing input parameters and encoding output parameters

### Start Service
Execute the command `go-doudou svc run`
```shell
➜  helloworld git:(master) ✗ go-doudou svc run
2022/11/06 21:46:19 maxprocs: Leaving GOMAXPROCS=16: CPU quota undefined
                           _                    _
                          | |                  | |
  __ _   ___   ______   __| |  ___   _   _   __| |  ___   _   _
 / _` | / _ \ |______| / _` | / _ \ | | | | / _` | / _ \ | | | |
| (_| || (_) |        | (_| || (_) || |_| || (_| || (_) || |_| |
 \__, | \___/          \__,_| \___/  \__,_| \__,_| \___/  \__,_|
  __/ |
 |___/
2022-11-06 21:46:19 INF ================ Registered Routes ================
2022-11-06 21:46:19 INF +----------------------+--------+-------------------------+
2022-11-06 21:46:19 INF |         NAME         | METHOD |         PATTERN         |
2022-11-06 21:46:19 INF +----------------------+--------+-------------------------+
2022-11-06 21:46:19 INF | Greeting             | POST   | /greeting               |
2022-11-06 21:46:19 INF | GetDoc               | GET    | /go-doudou/doc          |
2022-11-06 21:46:19 INF | GetOpenAPI           | GET    | /go-doudou/openapi.json |
2022-11-06 21:46:19 INF | Prometheus           | GET    | /go-doudou/prometheus   |
2022-11-06 21:46:19 INF | GetConfig            | GET    | /go-doudou/config       |
2022-11-06 21:46:19 INF | GetStatsvizWs        | GET    | /go-doudou/statsviz/ws  |
2022-11-06 21:46:19 INF | GetStatsviz          | GET    | /go-doudou/statsviz/*   |
2022-11-06 21:46:19 INF | GetDebugPprofCmdline | GET    | /debug/pprof/cmdline    |
2022-11-06 21:46:19 INF | GetDebugPprofProfile | GET    | /debug/pprof/profile    |
2022-11-06 21:46:19 INF | GetDebugPprofSymbol  | GET    | /debug/pprof/symbol     |
2022-11-06 21:46:19 INF | GetDebugPprofTrace   | GET    | /debug/pprof/trace      |
2022-11-06 21:46:19 INF | GetDebugPprofIndex   | GET    | /debug/pprof/*          |
2022-11-06 21:46:19 INF +----------------------+--------+-------------------------+
2022-11-06 21:46:19 INF ===================================================
2022-11-06 21:46:19 INF Http server is listening at :6060
2022-11-06 21:46:19 INF Http server started in 1.993608ms
```

### Postman
Import the `helloworld_openapi3.json` file into Postman to test the `/greeting` API. You can see it returns fake data.
![greeting](/images/greeting.png)

### Implement Interface
Now we are going to implement the real business logic in the `svcimpl.go` file. Let's first look at the current code.
```go
/**
* Generated by go-doudou v2.5.8.
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
We use the [gofakeit](github.com/brianvoe/gofakeit) library to help us generate fake data. We first need to delete this code.
```go
/**
* Generated by go-doudou v2.5.8.
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
We deleted the code from lines 21 to 25 and replaced it with `return fmt.Sprintf("Hello %s", greeting), nil`. Let's test the effect again.
![greeting1](/images/greeting1.png)
Isn't it very simple to write RESTful APIs with go-doudou!

### gRPC Service

Next, we'll add gRPC service to the project. gRPC is the most popular RPC framework in the Go ecosystem. gRPC uses `http2` as the network protocol and `protobuf` as the message body serialization scheme. The general process of developing gRPC services is roughly the following steps:

1. First, define `message` and `service` in a `.proto` file according to the `protobuf` syntax
2. Then execute a command like `protoc --proto_path=. --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative transport/grpc/helloworld.proto` to generate server and client stub code
3. Then define your own struct and methods to implement interfaces like `pb.HelloworldServiceServer` to implement business logic
4. Finally, add code similar to the following in the `main` function to start the gRPC service:

```go
...
grpcServer := grpc.NewServer(opts...)
pb.RegisterHelloworldServiceServer(grpcServer, svc)
grpcServer.Serve(lis)
```

If you use `go-doudou` as a development framework to develop gRPC services, it will be much simpler. Using the `Helloworld` project above as an example, only two steps are needed:

#### Generate gRPC Code

Execute the command `go-doudou svc grpc` at the project root path. This command directly generates `.proto` files, server and client stub code, and implementations of the `pb.HelloworldServiceServer` interface in the `svcimpl.go` file. We just need to implement specific business logic in the generated methods.

The folder structure at this point is as follows:

```shell
.
├── Dockerfile
├── client
│   ├── client.go
│   ├── clientproxy.go
│   └── iclient.go
├── cmd
│   └── main.go
├── config
│   └── config.go
├── db
│   └── db.go
├── go.mod
├── go.sum
├── helloworld_openapi3.go
├── helloworld_openapi3.json
├── svc.go
├── svcimpl.go
├── transport
│   ├── grpc
│   │   ├── annotation.go
│   │   ├── helloworld.pb.go
│   │   ├── helloworld.proto
│   │   └── helloworld_grpc.pb.go
│   └── httpsrv
│       ├── handler.go
``` 