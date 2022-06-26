# CLI

Go-doudou has built-in code generation CLI. `go-doudou` is the root command and there are two flags for it.

- `-v` can tell you current installed version of go-doudou.

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou -v     
go-doudou version v1.1.9
```

- `-h` can print help message. As all subcommands have this flag, I will omit it in the following documentation. 

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou -h
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

And there are several useful subcommands helping you speed up your production. Let's get into them one by one.

## version

`go-doudou version` command is mainly used for upgrade `go-doudou`. It tells you not only current installed version, but also the latest release version,
and asks you if you want to upgrade.

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou version
Installed version is v0.9.8
Latest release version is v1.1.9
Use the arrow keys to navigate: ↓ ↑ → ← 
? Do you want to upgrade?: 
  ▸ Yes
    No
```

## help

`go-doudou help` is the same as `go-doudou -h`.

## svc

`go-doudou svc` is the most important and the most commonly used command.

### init

`go-doudou svc init` is used for initializing go-doudou application. You can run this command in an existing directory, or you can also specify a directory immediately following `init`.
Then go-doudou will create the directory if it not exists and initial files for starting the development, and also run `git init` underlyingly. If specified directory has been already existed and not empty, go-doudou will only create non-existing files and skip existing files with warning like this:

```shell
➜  go-doudou-tutorials git:(master) go-doudou svc init helloworld
WARN[2022-02-17 18:14:53] file .gitignore already exists               
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/go.mod already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/.env already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/vo/vo.go already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/svc.go already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/Dockerfile already exists 
```

There is `-m` flag for customizing module name. You can use it like this:
```shell
go-doudou svc init helloworld -m github.com/unionj-cloud/helloworld
```

### http

`go-doudou svc http` is used for generating http routes and handlers for RESTful service. For example:
```shell
go-doudou svc http --handler -c --doc
```

#### Flags

There are several flags for configuring the code generation behavior. Let me explain them one by one:

- `--handler`: `bool` type. If you set this flag, go-doudou will generate default http handler implementations which parse request parameters into form and decode request body into struct, and also send http response back. 

- `-c` or `--client`: `bool` type. It is used for generating [go-resty](https://github.com/go-resty/resty) based http client code.

- `--doc`: `bool` type. It is used for generating [OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3) description file in json format.

- `-e` or `--env`: `string` type. It is used for setting server url environment variable name. If you don't set it, it will be the upper case of service interface name in svc.go file. The name will used in client factory function like this:

```go
func NewHelloworldClient(opts ...ddhttp.DdClientOption) *HelloworldClient {
	defaultProvider := ddhttp.NewServiceProvider("HELLOWORLD")
	defaultClient := ddhttp.NewClient()

	...

	return svcClient
}
```

In line 2, the `HELLOWORLD` is the default name. As we said before, go-doudou is also supporting monolithic service. If your service client application don't want to join go-doudou cluster and use the out-of-box service discovery and client side load balancing feature, it can set `HELLOWORLD` to your service public url, and it will send requests to that url. Let's try run `go-doudou svc http --handler -c --doc -e godoudou_helloworld` to see what changes:

```go
func NewHelloworldClient(opts ...ddhttp.DdClientOption) *HelloworldClient {
	defaultProvider := ddhttp.NewServiceProvider("godoudou_helloworld")
	defaultClient := ddhttp.NewClient()

	...

    return svcClient
}
```

- `--case`: `string` type. As there are some anonymous structs defining http response body data structure in generated http handler code, we need this flag to let users configure json tag for fields. It accepts `lowerCamel` or `snake`, default is `lowerCamel`.

- `-o` or `--omitempty`: `bool` type. If you set this flag, `,omitempty` will be appended to json tag of fields of every generated anonymous struct in http handlers.

- `-r` or `--routePattern`: `int` type. It is used for configuring http route pattern generate strategy. If you set it to `0`, go-doudou will convert name of each service interface method from upper-camel case to snake case, then replace `_` to `/`. If you set it to `1`, go-doudou will join lower-case service interface name with each lower-case method name by `/`. Default is `0` which is also recommended. Here is an example. If there is a method named `PublicSignUp` in `Usersvc` interface, its http route will be `/public/sign/up` if you don't set this flag or set this flag to `0` explicitly. If you set this flag to `1`, its http route will be `/usersvc/publicsignup`.

#### Subcommands

There is only one subcommand `client` available. It is used for generating golang http client code from OpenAPI 3.0 spec json file. There are some flags for it. Let's see an example:

```shell
go-doudou svc http client -o -e GRAPHHOPPER -f https://docs.graphhopper.com/openapi.json --pkg graphhopper
```

- `-e` or `--env`: `string` type. It is used for setting server url environment variable name.

- `-f` or `--file`: `string` type. It is used for setting OpenAPI 3.0 spec json file path or download link.

- `-o` or `--omit`: `bool` type. It is used for configuring whether to append `,omitempty` to json tag.

- `-p` or `--pkg`: `string` type. It is used for setting client package name. Default is `client`.

::: tip
There must be `200` response in `responses` object for each api, otherwise client code will not be generated and you will see an error message from command line output for corresponding api like this:

```shell
➜  go-doudou-tutorials git:(master) ✗ go-doudou svc http client -o -e PETSTORE -f https://petstore3.swagger.io/api/v3/openapi.json --pkg petstore
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Get /user/logout 
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Put /user/{username} 
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Delete /user/{username} 
ERRO[2022-02-18 11:56:08] 200 response definition not found in api Post /user 
ERRO[2022-02-18 11:56:09] 200 response definition not found in api Post /pet/{petId} 
ERRO[2022-02-18 11:56:09] 200 response definition not found in api Delete /pet/{petId} 
ERRO[2022-02-18 11:56:09] 200 response definition not found in api Delete /store/order/{orderId} 
```
:::

### run

`go-doudou svc run` is used for starting our service in development.

- `-w` or `--watch`: `bool` type. It is used for enabling watch mode. Not support on windows. I made this feature, but I am not recommending you to use it as I personally prefer to start or shutdown a program through IDE manually.

### push

`go-doudou svc push` is used for building docker image, pushing to your remote repository and generating k8s deployment files. It runs `go mod vendor`, `docker build`, `docker tag`, `docker push` commands sequentially. For example: 

```shell
go-doudou svc push --pre godoudou_ -r wubin1989
```

- `--pre`: `string` type. Its value will be prefixed to image name for grouping your images.

- `-r` or `--repo`: `string` type. Docker image will be pushed to this repository.

After executed this command, you will get two files: 

- `${service}_deployment.yaml`: k8s deploy file for stateless service, recommended to be used for monolith architecture services
- `${service}_statefulset.yaml`: k8s deploy file for stateful service, recommended to be used for microservice architecture services

### deploy

`go-doudou svc deploy` is used for deploying your service to kubernetes. It runs `kubectl apply -f` command underlyingly. For example, 

```shell
go-doudou svc deploy -k helloworld_deployment.yaml
```

- `-k` or `--k8sfile`: `string` type. It is used for specifying k8s deployment file path. Default is `${service}_statefulset.yaml`.

### shutdown

`go-doudou svc shutdown` is used for shutting down your service on kubernetes. It runs `kubectl delete -f` command underlyingly. For example, 

```shell
go-doudou svc shutdown -k helloworld_deployment.yaml
```

- `-k` or `--k8sfile`: `string` type. It is used for specifying k8s deployment file path. Default is `${service}_statefulset.yaml`.  

## ddl

We have already upgraded ddl tool to lightweight orm, please jump into [ORM](../orm/README.md).

## name

Subcommand for generating json tag of struct field. Default strategy is lower-camel. Support snake case as well. Unexported fields will be skipped, only modify json tag of each exported field.

### Flags

```shell
➜  go-doudou git:(main) go-doudou name -h   
WARN[0000] Error loading .env file: open /Users/wubin1989/workspace/cloud/.env: no such file or directory 
bulk add or update struct fields json tag

Usage:
  go-doudou name [flags]

Flags:
  -f, --file string       absolute path of vo file
  -h, --help              help for name
  -o, --omitempty         whether omit empty value or not
  -s, --strategy string   name of strategy, currently only support "lowerCamel" and "snake" (default "lowerCamel")
```

### Usage

- Put `//go:generate go-doudou name --file $GOFILE` into go file

```go
//go:generate go-doudou name --file $GOFILE

type Event struct {
	Name      string
	EventType int
}

type TestName struct {
	Age    age
	School []struct {
		Name string
		Addr struct {
			Zip   string
			Block string
			Full  string
		}
	}
	EventChan chan Event
	SigChan   chan int
	Callback  func(string) bool
	CallbackN func(param string) bool
}
```

- Execute  `go generate ./...` at the same folder

```go
type Event struct {
	Name      string `json:"name"`
	EventType int    `json:"eventType"`
}

type TestName struct {
	Age    age `json:"age"`
	School []struct {
		Name string `json:"name"`
		Addr struct {
			Zip   string `json:"zip"`
			Block string `json:"block"`
			Full  string `json:"full"`
		} `json:"addr"`
	} `json:"school"`
	EventChan chan Event              `json:"eventChan"`
	SigChan   chan int                `json:"sigChan"`
	Callback  func(string) bool       `json:"callback"`
	CallbackN func(param string) bool `json:"callbackN"`
}
```







