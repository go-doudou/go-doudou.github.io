# 命令行工具

`go-doudou`内置了基于命令行终端的代码生成器。`go-doudou`是根命令，有两个参数。

- `-v` 打印当前安装的go-doudou命令行工具的版本

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou -v     
go-doudou version v2.5.8
```

- `-h` 打印帮助信息。下文介绍的所有的子命令都有这个参数，就不再介绍了。

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
  completion  Generate the autocompletion script for the specified shell
  enum        Generate functions for constants to implement IEnum interface
  help        Help about any command
  name        bulk add or update json tag of struct fields
  svc         generate or update service
  version     Print the version number of go-doudou
  work        Build modular application

Flags:
  -h, --help      help for go-doudou
  -v, --version   version for go-doudou

Use "go-doudou [command] --help" for more information about a command.
```

::: warning 注意
虽然在某些版本的帮助信息中可能仍能看到 `ddl` 命令，但该命令已被废弃，不建议在新项目中使用。请使用 `svc crud` 命令代替。
:::

`go-doudou`还提供了若干子命令来加速整个开发流程。我们挨个看一下。

## version

`go-doudou version` 主要用于升级`go-doudou`命令行工具版本。它不仅打印当前安装版本的信息，还打印最新发布版本的信息，并且询问你是否要升级。

```shell
➜  go-doudou.github.io git:(dev) ✗ go-doudou version
go-doudou version v2.5.8

A new version is available: v2.5.9
Do you want to upgrade? [Y/n]
```

## completion

`completion`命令用于为指定的shell生成自动完成脚本，提高go-doudou命令行的使用效率。

### 基本用法

```shell
go-doudou completion [command]
```

### 子命令

- `bash`: 为bash生成自动完成脚本
- `fish`: 为fish生成自动完成脚本
- `powershell`: 为powershell生成自动完成脚本
- `zsh`: 为zsh生成自动完成脚本

### 示例

生成bash自动完成脚本：
```shell
go-doudou completion bash > ~/.bash_completion
```

生成zsh自动完成脚本：
```shell
go-doudou completion zsh > ~/.zsh_completion
```

## help

`go-doudou help` 同`go-doudou -h`。

## svc

`go-doudou svc` 是最重要和最常用的命令，用于生成或更新服务相关的代码。

### init

`go-doudou svc init` 用于初始化go-doudou应用。你既可以在已有文件夹下执行此命令，也可以在`init`后面指定需要初始化的文件夹路径。如果文件夹不存在，`go-doudou`会创建该文件夹，并且生成一些文件来便于上手开发，还会执行`git init`命令。如果指定的文件夹已经存在并且不为空，`go-doudou`会跳过已存在的文件，只生成不存在的文件，保证已有的代码不会被覆盖。

```shell
➜  go-doudou-tutorials git:(master) go-doudou svc init helloworld
WARN[2022-02-17 18:14:53] file .gitignore already exists               
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/go.mod already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/.env already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/vo/vo.go already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/svc.go already exists 
WARN[2022-02-17 18:14:53] file /Users/wubin1989/workspace/cloud/go-doudou-tutorials/helloworld/Dockerfile already exists 
```

#### 常用参数

- `-m, --mod`: 模块名称，用于指定Go模块路径
- `--module`: 是否初始化为模块化应用的组件（布尔值）。当设置为`true`时，go-doudou会自动调用`go work use`将该组件添加到工作区中。
- `-f, --file`: OpenAPI 3.0或Swagger 2.0规范的JSON文件路径或下载链接
- `--case`: protobuf消息字段和JSON标签命名规则，支持"lowerCamel"和"snake"（默认"lowerCamel"）
- `-t, --type`: 指定项目类型，值可以是"grpc"或"rest"（默认"grpc"）
- `--db_driver`: 数据库驱动类型，选项有"mysql"、"postgres"、"sqlite"、"sqlserver"、"tidb"
- `--db_dsn`: 数据库连接URL
- `--grpc_gen_cmd`: 用于生成gRPC服务和消息代码的命令（默认使用protoc命令）

#### 示例

基本初始化：
```shell
go-doudou svc init helloworld -m github.com/unionj-cloud/helloworld
```

使用MySQL数据库初始化并生成gRPC代码：
```shell
go-doudou svc init myservice --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_grpc
```

初始化为模块化应用的组件：
```shell
go-doudou svc init component-c -m my-workspace/component-c --module
```

### http

`go-doudou svc http` 用于生成RESTful接口的http路由和handler代码。

```shell
go-doudou svc http -c
```

#### 常用参数

- `--handler`: 是否生成默认处理程序实现（布尔值）
- `-c, --client`: `bool` 类型。用于设置是否生成封装了[go-resty](https://github.com/go-resty/resty) 的http请求客户端代码。
- `-e, --env`: `string` 类型。用于设置写进http请求客户端代码里的服务端baseUrl的环境变量名。如果没有指定，默认采用`svc.go`文件里的字母大写的服务接口名。
- `--case`: `string` 类型。在生成的默认`http.Handler`接口实现代码里会有一些匿名结构体做为响应体，你可能需要设置这个参数来指定json序列化时的字段名称的命名规则。接受两种值：`lowerCamel` 和 `snake`。默认值为`lowerCamel`。
- `-o, --omitempty`: `bool` 类型。如果设置了这个参数，`,omitempty`会被加到默认`http.Handler`接口实现代码里的匿名结构体字段的json标签值的后面。
- `-r, --routePattern`: `int` 类型。这个参数用于设置http路由的生成规则。如果值为`0`，`go-doudou`会先将服务接口的方法名称从驼峰命令转成蛇形命令，然后把下划线`_`替换成反斜线`/`，结果作为接口路径。如果值为`1`，`go-doudou`会将服务接口名转成小写，方法名也转成小写，再用反斜线`/`拼接起来，结果作为接口路径。默认值为`0`。
- `--doc`: 是否生成OpenAPI 3.0 JSON文档（布尔值）
- `--allowGetWithReqBody`: 是否允许GET请求带有请求体（布尔值）

使用`-e`参数示例:

```shell
go-doudou svc http -c -e godoudou_helloworld
```

生成的代码会使用指定的环境变量:

```go
func NewHelloworldClient(opts ...ddhttp.DdClientOption) *HelloworldClient {
	defaultProvider := ddhttp.NewServiceProvider("godoudou_helloworld")
	defaultClient := ddhttp.NewClient()

	...

    return svcClient
}
```

### svc http client

`svc http client` 用于从json格式的`OpenAPI 3.0`接口文档生成Go语言http请求客户端代码。

#### 常用参数

- `-e, --env`: `string` 类型。用于设置写进http请求客户端代码里的服务端baseUrl的环境变量名。
- `-f, --file`: `string` 类型。用于设置接口文档的本地路径或下载链接。
- `-o, --omit`: `bool` 类型。如果设置了这个参数，会在json标签里的字段名后面加`,omitempty`。
- `-p, --pkg`: `string` 类型。用于设置包名，默认值为`client`。

#### 示例

```shell
go-doudou svc http client -o -e GRAPHHOPPER -f https://docs.graphhopper.com/openapi.json --pkg graphhopper
```

::: tip
每个接口都需要有`200`状态码的响应体，否则不会生成该接口的代码，在命令行终端也会输出错误信息。

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

### svc http test

`svc http test`是`svc http`的子命令，用于从Postman Collection文件生成集成测试代码。

#### 基本用法

```shell
go-doudou svc http test [flags]
```

#### 常用参数

- `--collection`: Postman Collection v2.1兼容文件路径
- `--dotenv`: 仅用于集成测试的dotenv格式配置文件路径

#### 示例

从Postman Collection生成测试代码：
```shell
go-doudou svc http test --collection ./postman_collection.json --dotenv ./.env.test
```

### grpc

`go-doudou svc grpc` 用于在`transport/grpc`路径下生成`Protobuf v3`语法的`.proto`后缀文件，gRPC服务端和客户端打桩代码等。如果`svcimpl.go`文件不存在，还会生成该文件，如果已存在，则会增量更新该文件。如果`cmd`路径下不存在`main.go`文件，则会生成该文件，如果已存在，则跳过。生成的`main.go`文件里已经有了启动gRPC服务的相关代码。

```shell
...
├── svc.go
├── svcimpl.go
├── transport
│   ├── grpc
│   │   ├── helloworld.pb.go
│   │   ├── helloworld.proto
│   │   └── helloworld_grpc.pb.go
│   └── httpsrv
│       ├── handler.go
│       ├── handlerimpl.go
│       └── middleware.go
└── vo
    └── vo.go
```

#### 常用参数

- `-o, --omitempty`: 是否在生成的匿名结构体中的JSON标签中添加`omitempty`（布尔值）
- `--case`: protobuf消息字段命名策略，支持"lowerCamel"和"snake"（默认"lowerCamel"）
- `--grpc_gen_cmd`: 用于生成gRPC服务和消息代码的命令（默认使用protoc命令）
- `--http2grpc`: 是否为gRPC服务生成RESTful API（布尔值）
- `--allow_get_body`: 是否允许GET请求带有请求体（布尔值）
- `--annotated_only`: 是否只为带有@grpc注解的方法生成gRPC API（布尔值）

#### 示例

生成基本的gRPC服务代码：
```shell
go-doudou svc grpc
```

生成gRPC服务代码并提供RESTful API代理：
```shell
go-doudou svc grpc --http2grpc
```

### crud

`svc crud`命令用于从数据库生成通用的CRUD代码。这个命令是替代已废弃的`ddl`命令的推荐选择。

#### 基本用法

```shell
go-doudou svc crud [flags]
```

#### 常用参数

- `--db_orm`: 指定ORM，目前仅支持gorm（默认"gorm"）
- `--db_driver`: 数据库驱动类型，选项有"mysql"、"postgres"、"sqlite"、"sqlserver"、"tidb"
- `--db_dsn`: 数据库连接URL
- `--db_soft`: 数据库软删除列名（默认"deleted_at"）
- `--db_service`: 生成gRPC或REST服务，接受值：grpc或rest
- `--db_gen_gen`: 是否生成gen.go文件（布尔值）
- `--db_table_prefix`: 表前缀或PostgreSQL的schema名称
- `--db_table_glob`: 用于过滤glob匹配的表
- `--db_table_exclude_glob`: 用于排除glob匹配的表
- `--case`: protobuf消息字段和JSON标签命名规则，支持"lowerCamel"和"snake"（默认"lowerCamel"）
- `--db_type_mapping`: 指定自定义的列类型到Go类型的映射
- `--db_omitempty`: 是否在生成的模型字段的JSON标签中添加`omitempty`（布尔值）
- `--grpc_gen_cmd`: 用于生成gRPC服务和消息代码的命令（默认使用protoc命令）

#### 示例

从MySQL数据库生成CRUD代码：
```shell
go-doudou svc crud --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_service rest
```

从PostgreSQL数据库生成CRUD代码，并指定schema：
```shell
go-doudou svc crud --db_driver postgres --db_dsn "host=localhost user=postgres password=postgres dbname=mydb port=5432 sslmode=disable" --db_table_prefix public --db_service grpc
```

### run

`go-doudou svc run` 用于启动服务。

#### 常用参数

- `-w, --watch`: `bool` 类型。用于开启`watch`模式，即热重启。不支持windows平台。虽然做了这个功能，但并不推荐使用。

#### 示例

启动服务：
```shell
go-doudou svc run
```

启用监视模式启动服务：
```shell
go-doudou svc run -w
```

### push

`go-doudou svc push` 用于生成docker镜像，推到远程镜像仓库，并生成k8s部署文件。实际按顺序依次执行了`go mod vendor`, `docker build`, `docker tag`, `docker push`这几个命令。

#### 常用参数

- `--pre`: `string` 类型。用于设置镜像文件的名称前缀。
- `-r, --repo`: `string` 类型。用于设置远程镜像仓库地址。
- `--ver`: Docker镜像版本

#### 示例

```shell
go-doudou svc push --pre godoudou_ -r wubin1989
```

命令执行完毕后，你会得到两个文件：

- `${service}_deployment.yaml`: 无状态的k8s应用部署文件，推荐用于单体应用架构。
- `${service}_statefulset.yaml`: 有状态的k8s应用部署文件，推荐用于微服务架构。

### deploy

`go-doudou svc deploy` 用于将服务部署到k8s。实际执行的是`kubectl apply -f`命令。

#### 常用参数

- `-k, --k8sfile`: `string` 类型。用于设置k8s部署文件的本地路径。默认值为`${service}_statefulset.yaml`。

#### 示例

```shell
go-doudou svc deploy -k helloworld_deployment.yaml
```

### shutdown

`go-doudou svc shutdown` 用于从k8s下线服务，实际执行`kubectl delete -f`命令。

#### 常用参数

- `-k, --k8sfile`: `string` 类型。用于设置k8s部署文件的本地路径。默认值为`${service}_statefulset.yaml`。

#### 示例

```shell
go-doudou svc shutdown -k helloworld_deployment.yaml
```

## name

`name`命令用于批量添加或更新结构体字段的JSON标签。根据指定的命名规则生成结构体字段后面的`json`tag。默认生成策略是**首字母小写的驼峰命名策略**，同时支持蛇形命名。未导出的字段会跳过，只修改导出字段的json标签。支持`omitempty`。

### 常用参数

- `-f, --file`: Go源文件路径
- `-c, --case`: JSON标签命名规则，支持"lowerCamel"、"snake"等（默认"lowerCamel"）
- `-s, --strategy`: 命名策略名称，当前仅支持"lowerCamel"和"snake"（默认"lowerCamel"）
- `-o, --omitempty`: 是否添加`omitempty`标记（布尔值）
- `--form`: 是否为[github.com/go-playground/form](https://github.com/go-playground/form)添加form标签

### 用法

- 在go文件里写上`//go:generate go-doudou name --file $GOFILE`，不限位置，最好是写在上方。目前的实现是对整个文件的所有struct都生效。

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

- 在项目根路径下执行命令`go generate ./...`

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

### 示例

为User结构体的字段添加snake_case形式的JSON标签：
```shell
go-doudou name -f ./model/user.go -c snake -o
```

同时生成JSON和form标签：
```shell
go-doudou name -f ./model/user.go -c lowerCamel -o --form
```

## enum

`enum`命令用于为常量生成实现`IEnum`接口的函数。这对于在Go中使用枚举类型非常有用。

### 基本用法

```shell
go-doudou enum [flags]
```

### 常用参数

- `-f, --file`: Go源文件的绝对路径

### 示例

为包含常量定义的文件生成枚举接口实现：
```shell
go-doudou enum -f ./enum/status.go
```

生成的代码示例（假设status.go中定义了Status类型的常量）：

```go
// 原始文件
type Status int

const (
    StatusPending Status = iota
    StatusActive
    StatusInactive
)

// 生成的函数
func (s *Status) StringSetter(value string) {
    switch value {
    case "StatusPending":
        *s = StatusPending
    case "StatusActive":
        *s = StatusActive
    case "StatusInactive":
        *s = StatusInactive
    default:
        *s = StatusPending
    }
}

func (s *Status) StringGetter() string {
    switch *s {
    case StatusPending:
        return "StatusPending"
    case StatusActive:
        return "StatusActive"
    case StatusInactive:
        return "StatusInactive"
    default:
        return "StatusPending"
    }
}
```

## work

`work`命令用于构建模块化应用程序，它会创建一个带有工作区和主入口模块的项目结构。

### 基本用法

```shell
go-doudou work [flags]
go-doudou work [command]
```

### 子命令

- `init`: 初始化工作区文件夹

### work init

`work init`命令用于初始化一个工作区文件夹，用于开发模块化应用。

#### 基本用法

```shell
go-doudou work init [dir]
```

其中`[dir]`是要初始化的工作区目录路径。如果不指定，则使用当前目录。

#### 工作区结构

执行`work init`命令后，go-doudou会创建如下的工作区结构：

```
workspace/              # 工作区根目录
├── go.work             # Go工作区文件，自动包含main模块和其他组件
└── main/               # 主入口模块目录
    ├── go.mod          # 主模块的go.mod文件
    ├── .env            # 环境变量配置文件
    └── cmd/            # 命令目录
        └── main.go     # 主入口文件，负责加载和运行所有组件
```

当使用 `svc init --module` 添加组件时，go-doudou会自动调用 `go work use` 命令将新组件添加到工作区，并自动更新 `main/cmd/main.go` 文件以导入新组件的插件。

#### 示例

初始化当前目录作为工作区：
```shell
go-doudou work init
```

指定目录作为工作区：
```shell
go-doudou work init ./my-workspace
```

## 高级用法与技巧

### 1. 使用注解控制接口权限

在service接口中，可以使用特殊注释添加注解，如：

```go
// @role(ADMIN)
GetAdminData(ctx context.Context) (data string, err error)
```

然后在中间件中检查这些注解：

```go
annotations := httpsrv.RouteAnnotationStore.GetParams(routeName, "@role")
if !sliceutils.StringContains(annotations, userRole) {
    // 拒绝访问
}
```

### 2. 自定义protoc命令

对于复杂的gRPC服务，可以自定义protoc命令：

```shell
go-doudou svc grpc --grpc_gen_cmd "protoc --proto_path=. --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative --validate_out=lang=go,paths=source_relative:. transport/grpc/myservice.proto"
```

### 3. 配置环境变量影响服务行为

go-doudou支持多种环境变量来配置服务行为：

- `GDD_SERVICE_NAME`: 服务名称
- `GDD_SERVICE_GROUP`: 服务组名
- `GDD_SERVICE_VERSION`: 服务版本
- `GDD_WEIGHT`: 服务实例权重
- `GDD_REGISTER_HOST`: 服务注册主机
- `GDD_HTTP_PORT`: HTTP服务端口
- `GDD_GRPC_PORT`: gRPC服务端口
- `GDD_LOG_LEVEL`: 日志级别，可选值："debug"、"info"、"warn"、"error"
- `GDD_PROMETHEUS`: 是否启用Prometheus指标收集

示例：
```shell
export GDD_SERVICE_NAME=myservice
export GDD_HTTP_PORT=8080
export GDD_LOG_LEVEL=debug
go-doudou svc run
```








