---
sidebar: auto
---

# go-doudou + langchaingo Microkernel Architecture RAG Large Language Model Knowledge Base Practice (Part 2)

In the previous article, we introduced the basic concepts and principles of go-doudou framework's plugin mechanism and modular pluggable microkernel architecture. This article will explain in detail how to build a microkernel architecture application based on go-doudou from scratch, helping newcomers quickly get started with development.

## 1. Review of Microkernel Architecture Application Concepts

Microkernel architecture (also known as plugin architecture) divides applications into core systems and plugin modules:

- **Core System**: Provides basic services and plugin management mechanisms
- **Plugin Modules**: Independently developed and deployed functional units

The advantages of this architecture include:

1. **High Cohesion, Low Coupling**: Modules communicate through well-defined interfaces
2. **Strong Extensibility**: New functionality can be added without modifying the core system
3. **Flexible Deployment**: Modules can be loaded as needed, making the system lighter
4. **Independent Development**: Teams can develop different modules in parallel

The go-doudou framework, with its powerful CLI tools and plugin mechanism, makes building microkernel architecture applications simpler and more efficient.

## 2. Environment Preparation

### 2.1 Installing go-doudou CLI

First, we need to install the go-doudou command-line tool. For Go 1.17 and above, it is recommended to use the following command for global installation:

```bash
go install -v github.com/unionj-cloud/go-doudou/v2@v2.5.9
```

After installation, you can verify if the installation was successful with the following command:

```bash
go-doudou version
```

### 2.2 Development Environment Requirements

- Go 1.16 and above
- Git (version control)
- IDE with Go module support (GoLand or Visual Studio Code recommended)

## 3. Creating a Workspace

go-doudou provides the `work` command to create and manage workspaces, which is the first step in building a microkernel architecture application.

### 3.1 Initializing the Workspace

```bash
# Create a workspace named go-doudou-rag
go-doudou work init go-doudou-rag

# Enter the workspace directory
cd go-doudou-rag
```

This command creates a workspace with the following structure:

```
go-doudou-rag/
  ├── go.work          # Go workspace file
  ├── main/            # Main application module
  │   ├── cmd/         # Main program entry point
  │   └── config/      # Main program configuration
```

After the workspace is created, a Git repository is automatically initialized and a `.gitignore` file is generated. The `main` module is the core of the application, responsible for loading and managing all plugin modules.

## 4. Creating the Core Module of a Microkernel Architecture Application

The main module is the core of the microkernel architecture, responsible for loading and managing plugins. We need to understand and modify the core code of the main module.

### 4.1 Understanding the Main Module Structure

The `cmd/main.go` file of the main module contains the code for initializing and starting the application. In a go-doudou microkernel architecture, this file typically contains the following:

```go
package main

import (
    "github.com/unionj-cloud/go-doudou/v2/framework/grpcx"
    "github.com/unionj-cloud/go-doudou/v2/framework/plugin"
    "github.com/unionj-cloud/go-doudou/v2/framework/rest"
    "github.com/unionj-cloud/toolkit/pipeconn"
    "github.com/unionj-cloud/toolkit/zlogger"
    
    // The following are imported plugin modules, which may not exist in the initial stage
)

func main() {
    // Create REST server
    srv := rest.NewRestServer()
    
    // Create gRPC server (if needed)
    grpcServer := grpcx.NewGrpcServer()
    lis, dialCtx := pipeconn.NewPipeListener()
    
    // Get all registered service plugins
    plugins := plugin.GetServicePlugins()
    for _, key := range plugins.Keys() {
        value, _ := plugins.Get(key)
        // Initialize each plugin
        value.Initialize(srv, grpcServer, dialCtx)
    }
    
    // Resource cleanup
    defer func() {
        if r := recover(); r != nil {
            zlogger.Info().Msgf("Recovered. Error: %v\n", r)
        }
        // Close all plugins
        for _, key := range plugins.Keys() {
            value, _ := plugins.Get(key)
            value.Close()
        }
    }()
    
    // Start gRPC server
    go func() {
        grpcServer.RunWithPipe(lis)
    }()
    
    // Add API documentation routes
    srv.AddRoutes(rest.DocRoutes(""))
    
    // Start REST server
    srv.Run()
}
```

This code implements the core functionality of the microkernel architecture: getting registered plugins, initializing them, and releasing resources when the application exits.

### 4.2 Adding Common Middleware and Tools

In the main module, we typically add some common middleware and tools, such as authentication, logging, monitoring, etc. For example, JWT authentication middleware:

```bash
mkdir -p toolkit/auth
```

Create an `auth.go` file in the `toolkit/auth` directory, implementing JWT authentication middleware:

```go
package auth

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/unionj-cloud/go-doudou/v2/framework"
	"github.com/unionj-cloud/go-doudou/v2/framework/rest/httprouter"
	"github.com/unionj-cloud/toolkit/copier"
	"go-doudou-rag/toolkit/config"
	"net/http"
	"slices"
	"strings"
	"time"
)

var authMiddleware *AuthMiddleware

func init() {
	conf := config.LoadFromEnv()
	authMiddleware = &AuthMiddleware{
		JwtSecret:    conf.Auth.JwtSecret,
		JwtExpiresIn: conf.Auth.JwtExpiresIn,
	}
}

func JwtToken(userInfo UserInfo) string {
	return authMiddleware.JwtToken(userInfo)
}

func Jwt(inner http.Handler) http.Handler {
	return authMiddleware.Jwt(inner)
}

type AuthMiddleware struct {
	JwtSecret    string
	JwtExpiresIn time.Duration
}

type UserInfo struct {
	Username string `json:"username"`
}

type ctxKey int

const userInfoKey ctxKey = ctxKey(0)

func NewUserInfoContext(ctx context.Context, userInfo UserInfo) context.Context {
	return context.WithValue(ctx, userInfoKey, userInfo)
}

func UserInfoFromContext(ctx context.Context) (UserInfo, bool) {
	userInfo, ok := ctx.Value(userInfoKey).(UserInfo)
	return userInfo, ok
}

func (auth *AuthMiddleware) JwtToken(userInfo UserInfo) string {
	var claims jwt.MapClaims
	err := copier.DeepCopy(userInfo, &claims)
	if err != nil {
		panic(err)
	}

	claims["exp"] = time.Now().Add(auth.JwtExpiresIn).Unix()

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(auth.JwtSecret))
	if err != nil {
		panic(err)
	}
	return token
}

func (auth *AuthMiddleware) Jwt(inner http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		paramsFromCtx := httprouter.ParamsFromContext(r.Context())
		routeName := paramsFromCtx.MatchedRouteName()

		annotation, ok := framework.GetAnnotation(routeName, "@role")
		if ok && slices.Contains(annotation.Params, "guest") {
			inner.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(auth.JwtSecret), nil
		})
		if err != nil || !token.Valid {
			w.WriteHeader(401)
			w.Write([]byte("Unauthorised.\n"))
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		var userInfo UserInfo
		err = copier.DeepCopy(claims, &userInfo)
		if err != nil {
			panic(err)
		}

		r = r.WithContext(NewUserInfoContext(r.Context(), userInfo))
		inner.ServeHTTP(w, r)
	})
}
```

Then use this middleware in the `main.go` of the main module:

```go
func main() {
    srv := rest.NewRestServer()
    // Add JWT middleware
    srv.Use(auth.Jwt)
    
    // Other code...
}
```

## 5. Creating Feature Modules

Next, we create specific feature modules. Each module is an independent Go module but will be registered as a plugin for the main application. We will create three example modules: authentication module, knowledge base module, and chat module.

### 5.1 Creating the Authentication Module

```bash
# Execute in the workspace root directory
# Create authentication module
go-doudou svc init module-auth -m go-doudou-rag/module-auth --module --case snake -t rest
```

Parameter explanation:
- `svc init`: Initialize service
- `module-auth`: Service name
- `-m go-doudou-rag/module-auth`: Module import path
- `--module`: Specify this is a module in the workspace
- `--case snake`: Use snake_case naming style
- `-t rest`: Generate RESTful service

This command creates a `module-auth` directory and generates the basic module structure:

```
module-auth/
  ├── cmd/            # Independent running entry point
  ├── config/         # Module configuration
  ├── dto/            # Data Transfer Objects
  ├── plugin/         # Plugin implementation
  ├── transport/      # Transport layer
  │   └── httpsrv/    # HTTP service
  ├── go.mod          # Go module file
  ├── svc.go          # Service interface definition
  └── svcimpl.go      # Service implementation
```

At the same time, go-doudou will automatically execute `go work use module-auth` to add the new module to the workspace and update the `main.go` file of the main module, adding the import of the new module plugin:

```go
import (
    // Other imports...
    _ "go-doudou-rag/module-auth/plugin"
)
```

### 5.2 Defining the Service Interface

Edit the `module-auth/svc.go` file, defining the interface for the authentication service:

```go
package service

import (
	"context"
	"go-doudou-rag/module-auth/dto"
	"go-doudou-rag/module-auth/internal/model"
)

//go:generate go-doudou svc http --case snake

type ModuleAuth interface {
	// PostLogin @role(guest)
	PostLogin(ctx context.Context, req dto.LoginReq) (data string, err error)
	GetMe(ctx context.Context) (data *model.User, err error)
}
```

Note the `//go:generate` directive, which tells go-doudou to generate HTTP-related code.

### 5.3 Creating DTOs and Models

Create a `login.go` file in the `dto` directory:

```go
package dto

type LoginReq struct {
    Username string `json:"username" validate:"required"`
    Password string `json:"password" validate:"required"`
}
```

Create a `user.go` file in the `internal/model` directory:

```go
package model

import "time"

type User struct {
    ID        uint      `gorm:"primarykey" json:"id"`
    Username  string    `json:"username"`
    Password  string    `json:"-"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
```

### 5.4 Implementing Service Logic

Edit the `module-auth/svcimpl.go` file, implementing the logic for the authentication service:

```go
package service

import (
	"context"
	"go-doudou-rag/module-auth/config"
	"go-doudou-rag/module-auth/dto"
	"go-doudou-rag/module-auth/internal/dao"
	"go-doudou-rag/module-auth/internal/model"
	"go-doudou-rag/toolkit/auth"
)

var _ ModuleAuth = (*ModuleAuthImpl)(nil)

type ModuleAuthImpl struct {
	conf *config.Config
}

func NewModuleAuth(conf *config.Config) *ModuleAuthImpl {
	return &ModuleAuthImpl{
		conf: conf,
	}
}

func (receiver *ModuleAuthImpl) PostLogin(ctx context.Context, req dto.LoginReq) (data string, err error) {
	userRepo := dao.GetUserRepo()
	user := userRepo.FindOneByUsername(ctx, req.Username)
	if user == nil {
		panic("user not found")
	}

	if user.Password != req.Password {
		panic("wrong password")
	}

	data = auth.JwtToken(auth.UserInfo{
		Username: user.Username,
	})
	return data, nil
}

func (receiver *ModuleAuthImpl) GetMe(ctx context.Context) (data *model.User, err error) {
	userInfo, _ := auth.UserInfoFromContext(ctx)

	userRepo := dao.GetUserRepo()
	user := userRepo.FindOneByUsername(ctx, userInfo.Username)

	return user, nil
}
```

### 5.5 Data Access Layer

Create a `user.go` file in the `internal/dao` directory, implementing data access:

```go
package dao

import (
	"context"
	"go-doudou-rag/module-auth/internal/model"
	"gorm.io/gorm"
)

var userRepo *UserRepo

func init() {
	userRepo = &UserRepo{}
}

func GetUserRepo() *UserRepo {
	return userRepo
}

type UserRepo struct {
	db *gorm.DB
}

func (ur *UserRepo) Use(db *gorm.DB) {
	ur.db = db
}

func (ur *UserRepo) Init() {
	admin := model.User{
		Username: "admin",
		Password: "admin",
	}
	if err := ur.db.Save(&admin).Error; err != nil {
		panic(err)
	}
}

func (ur *UserRepo) FindOneByUsername(ctx context.Context, username string) *model.User {
	var users []*model.User
	if err := ur.db.Where("username = ?", username).Find(&users).Error; err != nil {
		panic(err)
	}

	if len(users) == 0 {
		return nil
	}
	return users[0]
}
```

### 5.6 Configuring the Module

Edit the `module-auth/config/config.go` file, defining the module configuration:

```go
package config

import (
	_ "github.com/unionj-cloud/go-doudou/v2/framework/config"
	"github.com/unionj-cloud/toolkit/envconfig"
	"github.com/unionj-cloud/toolkit/zlogger"
)

var G_Config *Config

type Config struct {
	Biz struct {
	}
	Db struct {
		Dsn string
	}
}

func init() {
	var conf Config
	err := envconfig.Process("moduleauth", &conf)
	if err != nil {
		zlogger.Panic().Msgf("Error processing environment variables: %v", err)
	}
	G_Config = &conf
}

func LoadFromEnv() *Config {
	return G_Config
}
```

### 5.7 Plugin Implementation

The basic implementation of the plugin has already been generated in the `plugin` directory. We need to ensure that the plugin correctly initializes the database and service. Edit the `module-auth/plugin/plugin.go` file:

```go
package plugin

import (
	"github.com/glebarez/sqlite"
	"github.com/unionj-cloud/go-doudou/v2/framework/grpcx"
	"github.com/unionj-cloud/go-doudou/v2/framework/plugin"
	"github.com/unionj-cloud/go-doudou/v2/framework/rest"
	"github.com/unionj-cloud/toolkit/pipeconn"
	"github.com/unionj-cloud/toolkit/stringutils"
	service "go-doudou-rag/module-auth"
	"go-doudou-rag/module-auth/config"
	"go-doudou-rag/module-auth/internal/dao"
	"go-doudou-rag/module-auth/internal/model"
	"go-doudou-rag/module-auth/transport/httpsrv"
	"google.golang.org/grpc"
	"gorm.io/gorm"
	"os"
)

var _ plugin.ServicePlugin = (*ModuleAuthPlugin)(nil)

type ModuleAuthPlugin struct {
	grpcConns []*grpc.ClientConn
}

func (receiver *ModuleAuthPlugin) Close() {
	for _, item := range receiver.grpcConns {
		item.Close()
	}
}

func (receiver *ModuleAuthPlugin) GoDoudouServicePlugin() {

}

func (receiver *ModuleAuthPlugin) GetName() string {
	name := os.Getenv("GDD_SERVICE_NAME")
	if stringutils.IsEmpty(name) {
		name = "cloud.unionj.ModuleAuth"
	}
	return name
}

func (receiver *ModuleAuthPlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
	conf := config.LoadFromEnv()

	db, err := gorm.Open(sqlite.Open(conf.Db.Dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	if err = db.AutoMigrate(&model.User{}); err != nil {
		panic(err)
	}

	dao.Use(db)
	dao.Init()

	svc := service.NewModuleAuth(conf)
	routes := httpsrv.Routes(httpsrv.NewModuleAuthHandler(svc))
	restServer.GroupRoutes("/moduleauth", routes)
	restServer.GroupRoutes("/moduleauth", rest.DocRoutes(service.Oas))
}

func init() {
	plugin.RegisterServicePlugin(&ModuleAuthPlugin{})
}
```

### 5.8 Generating HTTP-Related Code

Now, we need to generate HTTP-related code. Execute in the `module-auth` directory:

```bash
go-doudou svc http --case snake
```

This command will generate HTTP routes, handlers, and OpenAPI documentation based on the interface defined in `svc.go`.

## 6. Creating and Integrating Other Modules

Follow similar steps to create the knowledge base module and chat module:

```bash
# Create knowledge base module
go-doudou svc init module-knowledge -m go-doudou-rag/module-knowledge --module --case snake -t rest

# Create chat module
go-doudou svc init module-chat -m go-doudou-rag/module-chat --module --case snake -t rest
```

Define service interfaces, implement service logic, configure plugins, etc. for each module. Here's an example of a service interface for the knowledge base module:

```go
package service

import (
	"context"
	v3 "github.com/unionj-cloud/toolkit/openapi/v3"
	"go-doudou-rag/module-knowledge/dto"
)

//go:generate go-doudou svc http --case snake

type ModuleKnowledge interface {
	Upload(ctx context.Context, file v3.FileModel) (data dto.UploadResult, err error)
	GetList(ctx context.Context) (data []dto.FileDTO, err error)
	GetQuery(ctx context.Context, req dto.QueryReq) (data []dto.QueryResult, err error)
}
```

## 7. Communication Between Modules

In a microkernel architecture application, modules need to communicate with each other. go-doudou provides two main communication methods: direct import and dependency injection.

### 7.1 Through Direct Import

```go
package service

import (
    "context"
    knowledge "go-doudou-rag/module-knowledge"
    "go-doudou-rag/module-chat/dto"
)

func (receiver *ModuleChatImpl) Chat(ctx context.Context, req dto.ChatRequest) (err error) {
    // Directly import the service interface of the knowledge base module
    knowService := knowledge.NewModuleKnowledge(knowConf)
    queryResults, err := knowService.GetQuery(ctx, knowledge.QueryReq{
        Text: req.Prompt,
        Top:  10,
    })
    
    // Process results...
}
```

### 7.2 Through Dependency Injection

A more recommended approach is to use dependency injection, which can make the coupling between modules looser:

```go
// Register service in the plugin/plugin.go file of the knowledge base module
func init() {
    plugin.RegisterServicePlugin(&ModuleKnowledgePlugin{})

    do.Provide[service.ModuleKnowledge](nil, func(injector *do.Injector) (service.ModuleKnowledge, error) {
        conf := config.LoadFromEnv()
        
        // Initialize database...
        
        svc := service.NewModuleKnowledge(conf)
        return svc, nil
    })
}

// Use dependency injection to get service in the chat module
import (
    "github.com/samber/do"
    know "go-doudou-rag/module-knowledge"
)

func (receiver *ModuleChatImpl) Chat(ctx context.Context, req dto.ChatRequest) (err error) {
    // Use dependency injection to get knowledge base service
    knowService := do.MustInvoke[know.ModuleKnowledge](nil)
    queryResults, err := knowService.GetQuery(ctx, know.QueryReq{
        Text: req.Prompt,
        Top:  10,
    })
    
    // Process results...
}
```

## 8. Configuration Management

go-doudou microkernel architecture applications use a layered configuration management approach, combining configuration files and environment variables.

### 8.1 Creating a Central Configuration File

Create an `app.yml` file in the workspace root directory:

```yaml
toolkit:
  auth:
    jwt-secret: "my-jwt-secret"
    jwt-expires-in: "12h"

moduleauth:
  db:
#    dsn: ":memory:"
    dsn: "/Users/wubin1989/workspace/cloud/unionj-cloud/go-doudou-rag/data/auth.db"

moduleknowledge:
  biz:
    file-save-path: "/Users/wubin1989/workspace/cloud/unionj-cloud/go-doudou-rag/data/files"
    vector-store:
      export-to-file: "/Users/wubin1989/workspace/cloud/unionj-cloud/go-doudou-rag/data/chromem-go.gob"
  db:
    dsn: "/Users/wubin1989/workspace/cloud/unionj-cloud/go-doudou-rag/data/knowledge.db"
  openai:
    base-url: "https://api.siliconflow.cn/v1"
    token:
    embedding-model: "BAAI/bge-large-zh-v1.5"

modulechat:
  openai:
    base-url: "https://api.siliconflow.cn/v1"
    token:
    embedding-model: "BAAI/bge-large-zh-v1.5"
    model: "Qwen/Qwen2.5-32B-Instruct"
```

### 8.2 Environment Variable Override

go-doudou allows overriding values in configuration files through environment variables:

```bash
# JWT secret
export TOOLKIT_AUTH_JWTSECRET="awesome-jwt-secret"

# JWT expiration time
export TOOLKIT_AUTH_JWTEXPIRESIN="24h"

# Database connection string
export MODULEAUTH_DB_DSN="/data/production/auth.db"
```

The rule for constructing environment variable names is: module prefix (uppercase) + underscore + configuration path (uppercase, separated by underscores). Hyphens in YAML format configuration should be removed in environment variables.

Usage example:
```
TOOLKIT_AUTH_JWTEXPIRESIN=24h TOOLKIT_AUTH_JWTSECRET=awesome-jwt-secret go run cmd/main.go
```

## 9. Running and Testing

### 9.1 Running the Entire Application

Execute in the workspace root directory:

```bash
cd main
go run cmd/main.go
```

This will start the main program, loading all registered plugin modules.

### 9.2 Running Individual Modules Independently (for Development)

Each module can run independently, which is very useful during development:

```bash
cd module-auth
go run cmd/main.go
```

When running independently, the module will start its own HTTP server without loading other modules. When you need to expand to a microservice architecture in the future, you can easily implement architecture upgrades.

### 9.3 Generating API Documentation

go-doudou automatically generates OpenAPI 3.0 specification documentation for each module, which can be accessed via the following URLs:

- Main application (documentation home page): `http://localhost:6060/go-doudou/doc`
- Authentication module: `http://localhost:6060/moduleauth/go-doudou/doc`
- Knowledge base module: `http://localhost:6060/modulechat/go-doudou/doc`
- Chat module: `http://localhost:6060/moduleknowledge/go-doudou/doc`

For details on how to customize OpenAPI 3.0 specification documentation, please refer to the [Interface Definition](https://go-doudou.github.io/guide/idl.html) section of the go-doudou official documentation.

## 10. Best Practices

1. **Module Division**: Divide modules according to business domains, ensuring each module has clear responsibility boundaries
2. **Interface First**: Define service interfaces first, then implement business logic
3. **Dependency Injection**: Use dependency injection to manage service instances, reducing hard-coded dependencies
4. **Configuration Externalization**: Externalize all configuration parameters for easy deployment in different environments
5. **Independent Testing**: Each module should be independently testable, reducing dependency complexity
6. **Version Management**: Define clear version strategies for modules, especially when interfaces between modules change
7. **Error Handling**: Modules should handle errors properly internally, avoiding exposing underlying errors directly to callers

## 11. Advanced Features

### 11.1 Custom Plugin Registration

Sometimes we need more fine-grained control over the plugin initialization process:

```go
func (receiver *ModuleChatPlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
	conf := config.LoadFromEnv()
	svc := service.NewModuleChat(conf)
	routes := httpsrv.Routes(httpsrv.NewModuleChatHandler(svc))

  // httpsrv.InjectResponseWriter is a custom route middleware that applies to a group of routes starting with /modulechat
	restServer.GroupRoutes("/modulechat", routes, httpsrv.InjectResponseWriter)
	restServer.GroupRoutes("/modulechat", rest.DocRoutes(service.Oas))
}
```

### 11.2 Custom Service Registration

Different scopes can be used when injecting dependencies:

```go
// Singleton mode
do.Provide[service.ModuleKnowledge](nil, func(injector *do.Injector) (service.ModuleKnowledge, error) {
    // ...
})

// Request scope (create a new instance for each request)
do.ProvideNamed[service.ModuleKnowledge]("request", nil, func(injector *do.Injector) (service.ModuleKnowledge, error) {
    // ...
})

// Using named injection
knowService := do.MustInvokeNamed[know.ModuleKnowledge]("request", nil)
```

## Summary

Through this detailed guide, we have demonstrated how to build a microkernel architecture application from scratch using go-doudou. This architectural pattern has a high degree of modularity and extensibility, making it very suitable for the development of microkernel systems and large applications.

The CLI tools and plugin mechanism of go-doudou greatly simplify the implementation of microkernel architecture, allowing developers to focus on business logic without worrying too much about building infrastructure. By following the development process and best practices introduced in this article, you can quickly master the method of building microkernel architecture applications based on go-doudou.

Currently, the usage method is based on command line or postman. In "go-doudou + langchaingo Microkernel Architecture RAG Large Language Model Knowledge Base Practice (Part 3)", we will add a conversation interface implemented based on Vue 3, and package and compile front-end resources into the chat module, achieving full-stack development and lightweight deployment. 