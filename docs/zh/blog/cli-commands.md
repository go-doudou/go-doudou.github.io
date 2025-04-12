---
sidebar: auto
---

# go-doudou CLI命令行工具详解

[[toc]]

![programming.jpg](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1740&fm=jpg&fit=crop)
Photo by [Christopher Gower](https://unsplash.com/@cgower?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/m_HRfLhgABo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

go-doudou是一个强大的Go语言微服务开发框架，它提供了丰富的命令行工具，帮助开发者快速构建、部署和管理微服务。本文将详细介绍go-doudou CLI工具的各种命令和子命令的用法，并结合实际案例进行说明。

## 安装与升级

### 安装go-doudou

如果Go版本低于1.17：

```shell
go get -v github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

如果Go版本 >= 1.17，推荐采用如下命令全局安装`go-doudou`命令行工具：

```shell
go install -v github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

推荐采用如下命令下载go-doudou作为项目的依赖：

```shell
go get -v -d github.com/unionj-cloud/go-doudou/v2@v2.5.8
```

::: tip
如果遇到`410 Gone error`报错，请先执行如下命令，再执行上述的安装命令

```shell
export GOSUMDB=off
``` 
:::

### 升级go-doudou

执行`go-doudou version`命令可以升级全局安装的go-doudou命令行工具：

```shell
go-doudou version
```

如果检测到有新版本，会提示是否升级，选择"Yes"后会自动安装最新版本。

## 命令概览

go-doudou命令行工具的基本用法如下：

```shell
go-doudou [flags]
go-doudou [command]
```

主要命令包括：

- `svc`: 生成或更新服务
  - `init`: 初始化新项目
  - `http`: 生成HTTP路由和处理程序
    - `client`: 生成HTTP客户端代码
    - `test`: 生成集成测试代码
  - `grpc`: 生成gRPC服务代码
  - `crud`: 从数据库生成通用CRUD代码
  - `run`: 运行服务
  - `push`: 构建Docker镜像并推送
  - `deploy`: 将服务部署到Kubernetes
  - `shutdown`: 关闭已部署的服务
- `completion`: 为指定的shell生成自动完成脚本
- `ddl`: 数据库表结构与Go结构体之间的迁移工具
- `enum`: 为常量生成枚举接口实现函数
- `name`: 批量添加或更新结构体字段的JSON标签
- `version`: 显示go-doudou的版本号
- `work`: 构建模块化应用

::: warning 注意
虽然在帮助信息中可能仍能看到 `ddl` 命令，但该命令已被废弃，不建议在新项目中使用。请使用 `svc crud` 命令代替。
:::

可以通过`go-doudou -h`查看帮助信息：

```shell
go-doudou -h
```

输出示例：
```
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
```

## completion命令详解

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

## svc命令详解

`svc`是go-doudou命令行工具中最常用的命令，用于生成或更新服务相关的代码。它包含多个子命令：

### svc init

`svc init`命令用于初始化一个新的go-doudou微服务项目。

#### 基本用法

```shell
go-doudou svc init [dir] [flags]
```

其中`[dir]`是要初始化的项目目录名称。

#### 常用参数

- `-m, --mod`: 模块名称
- `--module`: 是否初始化为模块化应用的组件（布尔值）。当设置为`true`时，go-doudou会自动调用`go work use`将该组件添加到工作区中。
- `-f, --file`: OpenAPI 3.0或Swagger 2.0规范的JSON文件路径或下载链接
- `--case`: protobuf消息字段和JSON标签命名规则，支持"lowerCamel"和"snake"（默认"lowerCamel"）
- `-t, --type`: 指定项目类型，值可以是"grpc"或"rest"（默认"grpc"）
- `--grpc_gen_cmd`: 用于生成gRPC服务和消息代码的命令（默认使用protoc命令）

#### 示例

基本初始化：
```shell
go-doudou svc init myservice -m github.com/myorg/myservice
```

使用MySQL数据库初始化并生成gRPC代码：
```shell
go-doudou svc init myservice --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_grpc
```

初始化为模块化应用的组件：
```shell
go-doudou svc init component-c -m my-workspace/component-c --module
```

当使用`--module`标志时，go-doudou会自动执行以下操作：
1. 创建必要的项目结构
2. 自动调用`go work use`将新创建的组件添加到工作区
3. 为模块化应用生成插件和入口代码
4. 更新主应用的导入语句，自动引入新组件的插件

### svc http

`svc http`命令用于生成HTTP路由和处理程序。

#### 基本用法

```shell
go-doudou svc http [flags]
```

#### 常用参数

- `--handler`: 是否生成默认处理程序实现（布尔值）
- `-c, --client`: 是否生成默认的Go HTTP客户端代码（布尔值）
- `-o, --omitempty`: 是否在生成的匿名结构体中的JSON标签中添加`omitempty`（布尔值）
- `--case`: 应用于生成的处理程序中匿名结构体字段的JSON标签命名规则，可选值为"lowerCamel"或"snake"（默认"lowerCamel"）
- `--doc`: 是否生成OpenAPI 3.0 JSON文档（布尔值）
- `-e, --env`: 基础URL环境变量名称
- `-r, --routePattern`: 路由模式生成策略，0表示将服务接口的每个方法按斜杠/拆分（转为snake_case后），1表示不拆分，只转小写
- `--allowGetWithReqBody`: 是否允许GET请求带有请求体（布尔值）

#### 示例

生成HTTP路由和客户端代码：
```shell
go-doudou svc http -c
```

生成HTTP路由、处理程序和OpenAPI文档：
```shell
go-doudou svc http --handler --doc
```

### svc http client

`svc http client`是`svc http`的子命令，用于从OpenAPI 3.0规范JSON文件生成HTTP客户端代码。

#### 基本用法

```shell
go-doudou svc http client [flags]
```

#### 常用参数

- `-f, --file`: OpenAPI 3.0或Swagger 2.0规范的JSON文件路径或下载链接
- `-e, --env`: 基础URL环境变量名称
- `-p, --pkg`: 客户端包名称（默认"client"）
- `-o, --omit`: 是否在JSON标签中添加`omitempty`（布尔值）

#### 示例

从OpenAPI文档生成客户端代码：
```shell
go-doudou svc http client -f ./api-docs.json -e BASE_URL -p client
```

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

### svc grpc

`svc grpc`命令用于生成gRPC服务代码。

#### 基本用法

```shell
go-doudou svc grpc [flags]
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

生成只包含带有@grpc注解方法的gRPC服务代码：
```shell
go-doudou svc grpc --annotated_only
```

### svc crud

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

仅生成特定表的CRUD代码：
```shell
go-doudou svc crud --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb" --db_table_glob "user_*" --db_service rest
```

### svc run

`svc run`命令用于运行go-doudou服务。

#### 基本用法

```shell
go-doudou svc run [flags]
```

#### 常用参数

- `-w, --watch`: 启用监视模式，文件变更时自动重启服务（布尔值）

#### 示例

启动服务：
```shell
go-doudou svc run
```

启用监视模式启动服务：
```shell
go-doudou svc run -w
```

### svc push

`svc push`命令用于构建Docker镜像并推送到镜像仓库，同时生成或更新K8s部署YAML文件。

#### 基本用法

```shell
go-doudou svc push [flags]
```

#### 常用参数

- `-r, --repo`: 私有Docker镜像仓库
- `--pre`: 用于构建和推送Docker镜像的镜像名称前缀
- `--ver`: Docker镜像版本

#### 示例

构建镜像并推送到私有仓库：
```shell
go-doudou svc push -r myregistry.com/myuser
```

指定版本标签构建镜像：
```shell
go-doudou svc push -r myregistry.com/myuser --ver v1.0.0
```

### svc deploy

`svc deploy`命令包装kubectl apply命令，用于将服务部署到Kubernetes集群。

#### 基本用法

```shell
go-doudou svc deploy [flags]
```

#### 常用参数

- `-k, --k8sfile`: 用于部署服务的Kubernetes YAML文件

#### 示例

使用默认配置部署服务：
```shell
go-doudou svc deploy
```

使用指定的Kubernetes配置文件部署服务：
```shell
go-doudou svc deploy -k myservice_deployment.yaml
```

### svc shutdown

`svc shutdown`命令包装kubectl delete命令，用于关闭已部署的服务。

#### 基本用法

```shell
go-doudou svc shutdown [flags]
```

#### 常用参数

- `-k, --k8sfile`: 用于部署服务的Kubernetes YAML文件

#### 示例

关闭默认部署的服务：
```shell
go-doudou svc shutdown
```

使用指定的Kubernetes配置文件关闭服务：
```shell
go-doudou svc shutdown -k myservice_deployment.yaml
```

## name命令详解

`name`命令用于批量添加或更新结构体字段的JSON标签。

### 基本用法

```shell
go-doudou name [flags]
```

### 常用参数

- `-f, --file`: Go源文件路径
- `-c, --case`: JSON标签命名规则，支持"lowerCamel"、"snake"等（默认"lowerCamel"）
- `-s, --strategy`: 命名策略名称，当前仅支持"lowerCamel"和"snake"（默认"lowerCamel"）
- `-o, --omitempty`: 是否添加`omitempty`标记（布尔值）
- `--form`: 是否为[github.com/go-playground/form](https://github.com/go-playground/form)添加form标签

### 示例

为User结构体的字段添加snake_case形式的JSON标签：
```shell
go-doudou name -f ./model/user.go -c snake -o
```

同时生成JSON和form标签：
```shell
go-doudou name -f ./model/user.go -c lowerCamel -o --form
```

## enum命令详解

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

## version命令详解

`version`命令用于显示go-doudou的版本号，并检查是否有新版本可用。

### 基本用法

```shell
go-doudou version
```

### 示例

```shell
go-doudou version
```

输出示例：
```
go-doudou version v2.5.8
```

如果检测到有更新版本，会提示是否升级：
```
A new version is available: v2.5.9
Do you want to upgrade? [Y/n]
```

## work命令详解

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

## 实际应用示例

### 1. 微服务初始化与开发流程

下面是一个完整的微服务开发流程：

```shell
# 步骤1: 初始化项目
go-doudou svc init myservice -m github.com/myorg/myservice

# 步骤2: 编辑svc.go文件，定义服务接口
# 在myservice/svc.go中定义服务接口

# 步骤3: 生成HTTP和gRPC服务代码
cd myservice
go-doudou svc http -c --doc
go-doudou svc grpc

# 步骤4: 实现业务逻辑
# 编辑svcimpl.go文件

# 步骤5: 运行服务
go-doudou svc run

# 步骤6: 构建镜像并部署
go-doudou svc push -r myregistry.com/myuser
go-doudou svc deploy
```

### 2. 基于数据库表的微服务生成

```shell
# 步骤1: 初始化带数据库支持的项目
go-doudou svc init dbservice -m github.com/myorg/dbservice --db_driver mysql --db_dsn "root:password@tcp(localhost:3306)/mydb?charset=utf8mb4&parseTime=True&loc=Local" --db_soft deleted_at --db_grpc --db_rest

# 步骤2: 运行服务
cd dbservice
go-doudou svc run
```

### 3. 使用crud命令从现有数据库生成CRUD服务

```shell
# 步骤1: 在现有项目目录中运行命令
cd myproject
go-doudou svc crud --db_driver postgres --db_dsn "host=localhost user=postgres password=postgres dbname=mydb" --db_service rest --db_soft deleted_at

# 步骤2: 运行生成的服务
go-doudou svc run
```

### 4. 工作区中的模块化应用开发

```shell
# 步骤1: 初始化工作区
go-doudou work init my-workspace
cd my-workspace

# 步骤2: 初始化模块化组件
# go-doudou会自动执行"go work use"将组件添加到工作区
go-doudou svc init component-a -m my-workspace/component-a --module
go-doudou svc init component-b -m my-workspace/component-b --module

# 步骤3: 在每个组件中定义服务接口并生成代码
cd component-a
go-doudou svc http -c
go-doudou svc grpc

cd ../component-b
go-doudou svc http -c
go-doudou svc grpc

# 步骤4: 启动主应用 - main模块会自动引入所有组件
cd ../main
go run cmd/main.go
```

模块化应用的工作原理：
- 每个组件在初始化时会生成一个`plugin`包，用于将自身注册到主应用
- 主应用(`main`模块)会自动导入所有组件的插件，并在运行时初始化它们
- 当调用`svc init --module`时，go-doudou会自动执行`go work use`将新组件添加到工作区
- 同时会更新`main/cmd/main.go`文件，添加新组件插件的导入语句

### 5. 实现枚举类型

```shell
# 步骤1: 定义枚举常量
# 在status.go文件中定义如下内容
type Status int

const (
    StatusPending Status = iota
    StatusActive
    StatusInactive
)

# 步骤2: 生成枚举接口实现
go-doudou enum -f ./model/status.go
```

### 6. 生成自动完成脚本

```shell
# 生成bash自动完成脚本
go-doudou completion bash > ~/.bash_completion

# 生成zsh自动完成脚本
go-doudou completion zsh > ~/.zsh_completion
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

### 4. 集成测试技巧

利用`svc http test`命令生成的测试代码，可以轻松实现集成测试：

```shell
# 步骤1: 从Postman Collection生成测试代码
go-doudou svc http test --collection ./collection.json --dotenv ./.env.test

# 步骤2: 运行测试
go test -v ./test/...
```

### 5. 模块化应用开发技巧

对于大型项目，使用 `work` 命令和 `--module` 标志可以轻松管理模块化应用：

```shell
# 初始化工作区
go-doudou work init my-workspace
cd my-workspace

# 添加多个模块 - go-doudou会自动调用go work use
go-doudou svc init api-gateway -m my-workspace/api-gateway --module
go-doudou svc init user-service -m my-workspace/user-service --module
go-doudou svc init product-service -m my-workspace/product-service --module

# 启动应用（主模块自动引入并初始化所有组件）
cd main
go run cmd/main.go
```

模块化应用的优势：
- 代码组织更清晰，每个组件独立维护
- 可以独立开发和测试每个组件
- 共享依赖通过go.work解决，避免依赖冲突
- 主应用自动集成所有组件，无需手动编写集成代码
- 适合大型微服务应用的开发和管理

## 总结

go-doudou命令行工具提供了丰富的功能，帮助开发者快速构建、部署和管理微服务。通过本文介绍的各种命令和子命令，你可以轻松完成从服务初始化、代码生成到部署的整个流程。

go-doudou的最大特点是简化了微服务开发流程，无需编写大量样板代码，只需专注于业务逻辑的实现。它支持RESTful API和gRPC服务的生成，以及与数据库的集成，是构建现代Go微服务的理想选择。

此外，go-doudou还提供了强大的模块化应用开发支持，通过 `work` 命令和 `--module` 标志可以轻松管理多模块项目。go-doudou会自动执行`go work use`将组件添加到工作区，并在主应用中自动导入和初始化所有组件，大大简化了模块化应用的开发和维护工作。

::: warning 重要提示
请注意，`ddl` 命令已被废弃，不再推荐使用。如需从数据库生成代码或将Go结构体同步到数据库，请使用 `svc crud` 命令替代。
:::

希望本文对你理解和使用go-doudou CLI工具有所帮助。更多详情，请参考[官方文档](https://go-doudou.github.io/)和示例代码库。 