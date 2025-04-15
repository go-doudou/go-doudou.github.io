---
sidebar: auto
---

# go-doudou Plugin Mechanism: Building Modular Monolithic Applications with a Micro-Kernel Architecture

[[toc]]

![microservices.jpg](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1740&fm=jpg&fit=crop)
Photo by [Mitchell Luo](https://unsplash.com/@mitchel3uo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/FWoq_ldWlNQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

When building large-scale applications, modular design is one of the key methods for addressing complexity. go-doudou, as a powerful Go framework, features a flexible and robust plugin mechanism that makes it easier for developers to build modular monolithic applications with a micro-kernel architecture. This article will delve into go-doudou's plugin mechanism, including its design principles, usage methods, and best practices, helping developers better utilize this feature to build high-quality modular applications.

## I. Plugin Mechanism Overview

### 1.1 What is the go-doudou Plugin Mechanism

The go-doudou plugin mechanism is a modular design based on interfaces and dependency injection, allowing different business components to be registered as plugins to the main application. This mechanism is primarily designed for building modular monolithic applications with a microkernel architecture, where the core system provides foundational services while business functionalities are implemented as pluggable modules. This approach helps to:

- **Reduce coupling**: Business components exist as plugins, independent of each other
- **Simplify integration**: Automatic registration and initialization of services, eliminating the need to manually write integration code
- **Configuration control**: Enable or disable specific plugins through configuration (requires compilation with the main application and service restart)
- **Centralized management**: Unified management of all service components in the main program

### 1.2 Core Components

The core components of the go-doudou plugin mechanism include:

#### ServicePlugin Interface

```go
type ServicePlugin interface {
    Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc)
    GetName() string
    Close()
    GoDoudouServicePlugin()
}
```

This interface defines the basic behavior of plugins:
- `Initialize`: Initialize the plugin, register HTTP routes and gRPC services
- `GetName`: Get the plugin name for registration and management
- `Close`: Close the plugin and release resources
- `GoDoudouServicePlugin`: A marker method indicating this is a go-doudou service plugin

#### Plugin Registry

go-doudou uses an ordered map to store all registered plugins:

```go
var servicePlugins = orderedmap.NewOrderedMap[string, ServicePlugin]()

func RegisterServicePlugin(plugin ServicePlugin) {
    servicePlugins.Set(plugin.GetName(), plugin)
}

func GetServicePlugins() *orderedmap.OrderedMap[string, ServicePlugin] {
    return servicePlugins
}
```

## II. Plugin Mechanism Working Principles

### 2.1 Plugin Creation and Registration Process

The workflow of the go-doudou plugin mechanism is as follows:

1. **Plugin definition**: Create a struct that implements the `ServicePlugin` interface
2. **Automatic registration**: Register the plugin to the global registry through the `init()` function when the package loads
3. **Import triggering**: The main program triggers registration by importing plugin packages
4. **Initialization call**: The main program calls the plugin's `Initialize` method for initialization
5. **Service running**: The plugin registers its services to HTTP and gRPC servers
6. **Resource release**: The program calls the plugin's `Close` method to release resources when ending

### 2.2 Plugin Registration Mechanism

go-doudou uses Go's package initialization mechanism to implement automatic plugin registration. Each plugin calls the `RegisterServicePlugin` method in its package's `init()` function to register itself to the global plugin registry:

```go
func init() {
    plugin.RegisterServicePlugin(&MyServicePlugin{})
}
```

When the main program imports these plugin packages, the `init()` function will be automatically executed, even if they are not directly used, thereby completing the plugin registration. This approach makes plugin registration very simple, requiring only importing the corresponding packages.

### 2.3 Main Program Interaction with Plugins

The main program interacts with plugins in the following ways:

1. **Get registered plugins**: Call `plugin.GetServicePlugins()` to get all registered plugins
2. **Initialize plugins**: Call each plugin's `Initialize` method, passing in HTTP and gRPC server instances
3. **Release resources**: Call each plugin's `Close` method before the program ends

Sample code:

```go
// Get all registered plugins
plugins := plugin.GetServicePlugins()

// Initialize all plugins
for _, key := range plugins.Keys() {
    // Skip certain plugins through configuration
    if sliceutils.StringContains(conf.Biz.Plugin.Blacklist, key) {
        continue
    }
    value, _ := plugins.Get(key)
    value.Initialize(restServer, grpcServer, dialCtx)
}

// Close all plugins before the program ends
defer func() {
    for _, key := range plugins.Keys() {
        value, _ := plugins.Get(key)
        value.Close()
    }
}()
```

## III. Detailed Plugin Implementation

### 3.1 Typical Plugin Structure

A typical go-doudou plugin usually contains the following structure:

```go
package plugin

import (
    "os"
    "your-service-package/config"
    "your-service-package/transport/httpsrv"
    
    "github.com/unionj-cloud/go-doudou/v2/framework/grpcx"
    "github.com/unionj-cloud/go-doudou/v2/framework/plugin"
    "github.com/unionj-cloud/go-doudou/v2/framework/rest"
    "github.com/unionj-cloud/toolkit/pipeconn"
    "github.com/unionj-cloud/toolkit/stringutils"
    "google.golang.org/grpc"
)

// Ensure MyServicePlugin implements ServicePlugin interface
var _ plugin.ServicePlugin = (*MyServicePlugin)(nil)

// Define plugin struct
type MyServicePlugin struct {
    grpcConns []*grpc.ClientConn
}

// Implement Close method
func (receiver *MyServicePlugin) Close() {
    for _, item := range receiver.grpcConns {
        item.Close()
    }
}

// Implement GoDoudouServicePlugin marker method
func (receiver *MyServicePlugin) GoDoudouServicePlugin() {
    // Empty implementation, just as a marker
}

// Implement GetName method
func (receiver *MyServicePlugin) GetName() string {
    name := os.Getenv("GDD_SERVICE_NAME")
    if stringutils.IsEmpty(name) {
        name = "com.example.myservice"
    }
    return name
}

// Implement Initialize method
func (receiver *MyServicePlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
    // Load configuration
    conf := config.LoadFromEnv()
    
    // Initialize service instance
    svc := service.NewMyService(conf)
    
    // Register HTTP routes
    routes := httpsrv.Routes(httpsrv.NewMyServiceHandler(svc))
    restServer.GroupRoutes("/myservice", routes)
    
    // Register API documentation routes
    restServer.GroupRoutes("/myservice", rest.DocRoutes(service.Oas))
}

// Register plugin
func init() {
    plugin.RegisterServicePlugin(&MyServicePlugin{})
}
```

### 3.2 Plugin Initialization Process

In the `Initialize` method, plugins typically perform the following operations:

1. **Load configuration**: Load service configuration from environment variables or configuration files
2. **Create service instance**: Initialize service implementation
3. **Register HTTP routes**: Register the service's HTTP routes to the REST server
4. **Register gRPC services**: Register the service to the gRPC server (if gRPC is supported)
5. **Establish connections**: Create gRPC client connections if connections to other services are needed

### 3.3 Plugin Resource Management

Plugins need to properly manage resources, especially releasing them in the `Close` method:

```go
func (receiver *MyServicePlugin) Close() {
    // Close gRPC connections
    for _, item := range receiver.grpcConns {
        item.Close()
    }
    
    // Close database connections
    if receiver.db != nil {
        receiver.db.Close()
    }
    
    // Close cache connections
    if receiver.cache != nil {
        receiver.cache.Close()
    }
    
    // Release other resources
    // ...
}
```

## IV. Practical Case Analysis

### 4.1 Modular Monolithic Application Based on go-doudou Plugin Mechanism

Below is an example of a modular monolithic application built using the go-doudou plugin mechanism, based on real-world implementation:

```
modular-app/                     # Root directory
├── go.work                     # Go workspace file
├── main/                       # Main module directory
│   ├── cmd/
│   │   └── main.go             # Main program entry
│   └── go.mod
├── module-a/                   # Module A
│   ├── plugin/
│   │   └── plugin.go           # Module A plugin implementation
│   ├── transport/
│   │   ├── grpc/              # gRPC service implementation
│   │   └── httpsrv/           # HTTP routes and handlers
│   ├── svc.go                 # Service interface definition
│   ├── svcimpl.go             # Service implementation
│   └── go.mod
└── module-b/                   # Module B
    ├── plugin/
    │   └── plugin.go           # Module B plugin implementation
    ├── transport/
    │   ├── grpc/              # gRPC service implementation
    │   └── httpsrv/           # HTTP routes and handlers
    ├── svc.go                 # Service interface definition
    ├── svcimpl.go             # Service implementation
    └── go.mod
```

### 4.2 Main Program Entry Example

Here's an example of the main program entry `main.go`, showing how to import and initialize multiple plugins:

```go
package main

import (
    "github.com/go-playground/locales/zh"
    ut "github.com/go-playground/universal-translator"
    zhtrans "github.com/go-playground/validator/v10/translations/zh"
    grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
    grpczerolog "github.com/grpc-ecosystem/go-grpc-middleware/providers/zerolog/v2"
    grpc_recovery "github.com/grpc-ecosystem/go-grpc-middleware/recovery"
    grpc_ctxtags "github.com/grpc-ecosystem/go-grpc-middleware/tags"
    grpc_opentracing "github.com/grpc-ecosystem/go-grpc-middleware/tracing/opentracing"
    "github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/logging"
    "github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/tags"
    grpc_prometheus "github.com/grpc-ecosystem/go-grpc-prometheus"
    "github.com/unionj-cloud/go-doudou/v2/framework/grpcx"
    "github.com/unionj-cloud/go-doudou/v2/framework/plugin"
    "github.com/unionj-cloud/go-doudou/v2/framework/rest"
    "github.com/unionj-cloud/toolkit/pipeconn"
    "github.com/unionj-cloud/toolkit/sliceutils"
    "github.com/unionj-cloud/toolkit/zlogger"
    "google.golang.org/grpc"
    
    // Import plugin packages to register them 
    modulea "modular-app/module-a/plugin"
    moduleb "modular-app/module-b/plugin"
    
    "modular-app/main/config"
)

func main() {
    // Setup Chinese translator
    uni := ut.New(zh.New())
    trans, _ := uni.GetTranslator("zh")
    rest.SetTranslator(trans)
    zhtrans.RegisterDefaultTranslations(rest.GetValidate(), trans)
    
    // Create REST server
    restServer := rest.NewRestServer()
    
    // Create gRPC server with interceptors
    grpcServer := grpcx.NewGrpcServer(
        grpc.StreamInterceptor(grpc_middleware.ChainStreamServer(
            grpc_ctxtags.StreamServerInterceptor(),
            grpc_opentracing.StreamServerInterceptor(),
            grpc_prometheus.StreamServerInterceptor,
            tags.StreamServerInterceptor(tags.WithFieldExtractor(tags.CodeGenRequestFieldExtractor)),
            logging.StreamServerInterceptor(grpczerolog.InterceptorLogger(zlogger.Logger)),
            grpc_recovery.StreamServerInterceptor(),
        )),
        grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
            grpc_ctxtags.UnaryServerInterceptor(),
            grpc_opentracing.UnaryServerInterceptor(),
            grpc_prometheus.UnaryServerInterceptor,
            tags.UnaryServerInterceptor(tags.WithFieldExtractor(tags.CodeGenRequestFieldExtractor)),
            logging.UnaryServerInterceptor(grpczerolog.InterceptorLogger(zlogger.Logger)),
            grpc_recovery.UnaryServerInterceptor(),
        )),
    )
    
    // Create internal communication channel
    lis, dialCtx := pipeconn.NewPipeListener()
    
    // Load configuration
    conf := config.LoadFromEnv()
    
    // Method 1: Register and initialize plugins directly
    moduleA := &modulea.ModuleAPlugin{}
    plugin.RegisterServicePlugin(moduleA)
    moduleA.Initialize(restServer, grpcServer, dialCtx)
    
    moduleB := &moduleb.ModuleBPlugin{}
    plugin.RegisterServicePlugin(moduleB)
    moduleB.Initialize(restServer, grpcServer, dialCtx)
    
    // Method 2: Initialize all registered plugins in batch
    plugins := plugin.GetServicePlugins()
    for _, key := range plugins.Keys() {
        // Skip plugins in blacklist
        if sliceutils.StringContains(conf.Biz.Plugin.Blacklist, key) {
            zlogger.Info().Msgf("Skipping plugin: %s (in blacklist)", key)
            continue
        }
        
        value, _ := plugins.Get(key)
        zlogger.Info().Msgf("Initializing plugin: %s", key)
        value.Initialize(restServer, grpcServer, dialCtx)
    }
    
    // Resource cleanup
    defer func() {
        if r := recover(); r != nil {
            zlogger.Info().Msgf("Recovered from error: %v", r)
        }
        // Close plugins directly
        moduleA.Close()
        moduleB.Close()
        
        // Or close all plugins in batch
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
    restServer.AddRoutes(rest.DocRoutes(""))
    
    // Start REST server
    restServer.Run()
}
```

Example YAML configuration file (app.yml):

```yaml
plugin:
  blacklist:
    - module-c
    - module-d
```

You can also create environment-specific configuration files:
- app-dev.yml: For development environment
- app-prod.yml: For production environment
- app-local.yml: For local overrides (gitignored)

go-doudou will load these files based on the GDD_ENV environment variable, with app-local.yml having the highest priority.

### 4.2.1 Configuration Package Example

The best practice is to define and load your configuration in a dedicated package:

```go
// modular-app/main/config/config.go
package config

import (
    "github.com/unionj-cloud/go-doudou/v2/framework/config"
    "github.com/unionj-cloud/toolkit/envconfig"
    "github.com/unionj-cloud/toolkit/zlogger"
)

// Global configuration variable
var G_Config *Config

// Initialize configuration when package loads
func init() {
    var conf Config
    // Load configuration from environment variables
    err := envconfig.Process("modular", &conf)
    if err != nil {
        zlogger.Panic().Msg("Error processing environment variables")
    }
    G_Config = &conf
}

type Config struct {
    // Business configuration
    Biz struct {
        Domain  string
        Plugin struct {
            Blacklist []string
        }
        // Other business-specific configuration...
    }
    // Embed go-doudou framework configuration
    config.Config
}

func LoadFromEnv() *Config {
    return G_Config
}
```

This approach centralizes configuration management and provides a clean way to access configuration values throughout your application.

### 4.3 Understanding pipeconn.DialContextFunc

A key feature of the go-doudou plugin mechanism is efficient inter-plugin communication through `pipeconn.DialContextFunc`. This function allows gRPC service calls to be made within the same process, avoiding network overhead.

```go
// Create internal communication channel
lis, dialCtx := pipeconn.NewPipeListener()
```

The `pipeconn.NewPipeListener()` function creates an in-memory network connection using Go's `net.Pipe()` mechanism. This is a core feature of go-doudou's microkernel architecture, designed specifically for modular monolithic applications rather than distributed systems. This approach provides several advantages:

1. **Low latency**: Communication occurs within the same process, eliminating network overhead
2. **Enhanced security**: Inter-plugin communication doesn't need to be exposed to external networks
3. **Simplified debugging**: Tracing service calls within the application is simplified

This in-process communication is particularly valuable for go-doudou's modular plugin architecture, allowing developers to create well-structured, maintainable single-process applications while maintaining clear boundaries between components.

### 4.4 Implementing Inter-Plugin Communication with pipeconn

`pipeconn.DialContextFunc` allows plugins to communicate seamlessly within the same process. Here's a real-world example of how modules can communicate using this mechanism:

```go
// module-a/plugin/plugin.go
package plugin

import (
    "context"
    "github.com/unionj-cloud/go-doudou/v2/framework/grpcx"
    "github.com/unionj-cloud/go-doudou/v2/framework/plugin"
    "github.com/unionj-cloud/go-doudou/v2/framework/rest"
    "github.com/unionj-cloud/toolkit/logger"
    "github.com/unionj-cloud/toolkit/pipeconn"
    "google.golang.org/grpc"
    "modular-app/module-a/config"
    "modular-app/module-a/transport/httpsrv"
    "modular-app/module-b/transport/grpc/pb"
)

var _ plugin.ServicePlugin = (*ModuleAPlugin)(nil)

type ModuleAPlugin struct {
    grpcConns []*grpc.ClientConn
}

func (p *ModuleAPlugin) Close() {
    for _, conn := range p.grpcConns {
        if conn != nil {
            conn.Close()
        }
    }
}

func (p *ModuleAPlugin) GoDoudouServicePlugin() {}

func (p *ModuleAPlugin) GetName() string {
    return "module-a"
}

func (p *ModuleAPlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
    // Load configuration
    conf := config.LoadFromEnv()
    
    // Establish in-process connection to Module B using dialCtx
    conn, err := grpc.DialContext(
        context.Background(),
        "module-b", // Service name
        grpc.WithContextDialer(dialCtx), // Use pipeconn dialCtx for in-process communication
        grpc.WithInsecure(),
    )
    if err != nil {
        logger.Panicf("Failed to connect to module-b: %v", err)
    }
    
    // Create gRPC client for Module B
    moduleBClient := pb.NewModuleBServiceClient(conn)
    
    // Save connection for later cleanup
    p.grpcConns = append(p.grpcConns, conn)
    
    // Create service instance and inject Module B client
    svc := service.NewModuleAService(conf, moduleBClient)
    
    // Register HTTP routes
    routes := httpsrv.Routes(httpsrv.NewModuleAHandler(svc))
    restServer.GroupRoutes("/module-a", routes)
}

func init() {
    plugin.RegisterServicePlugin(&ModuleAPlugin{})
}
```

In the example above, Module A establishes a connection to Module B using the `dialCtx` provided by the main application. This allows Module A to call gRPC methods of Module B as if it were a remote service, but since they run in the same process, there is no network overhead.

### 4.5 Application Architecture Evolution Path

While the go-doudou plugin mechanism is primarily designed for modular monolithic applications, it also provides architectural flexibility benefits. If certain components of your application experience significantly higher load or need to scale independently, they can be extracted with minimal code changes:

1. Individual plugins can be extracted as independent services when needed
2. For these specific components, in-process gRPC communication can be switched to network-based communication
3. The original application can continue to run the remaining plugins

This approach allows teams to start with a simpler, more manageable monolithic architecture and evolve specific parts only when scaling is truly needed, avoiding unnecessary complexity. However, it's important to note that the primary purpose and best use case for the go-doudou plugin mechanism is building well-structured microkernel architecture monoliths.

## V. Best Practices

### 5.1 Plugin Design Principles

When designing go-doudou plugins, the following principles should be followed:

1. **Single responsibility**: Each plugin should focus on a single business function
2. **Autonomy**: Plugins should be as self-contained as possible, reducing direct dependencies on other plugins
3. **Explicit dependencies**: If dependencies on other services are needed, they should be explicitly declared through interfaces and support dependency injection
4. **Resource management**: Properly manage resources, ensuring they are released when the plugin closes
5. **Error handling**: Properly handle errors during initialization and closing

### 5.2 Plugin Dependency Management

Several ways to manage dependencies between plugins:

#### Using Dependency Injection Container

The [samber/do](https://github.com/samber/do) library is highly recommended in go-doudou projects for dependency injection. It allows you to manage dependencies between plugins without having to control initialization order manually:

```go
// Create a shared injector
injector := do.New()

// Register service instance in one plugin's init function
func init() {
    do.Provide(injector, func(i *do.Injector) (service.ModuleA, error) {
        conf := config.LoadFromEnv()
        
        // Create service instance
        svc := service.NewModuleA(conf)
        return svc, nil
    })
    
    // Register plugin
    plugin.RegisterServicePlugin(&ModuleAPlugin{
        injector: injector,
    })
}

// In another plugin that depends on ModuleA
func init() {
    do.Provide(injector, func(i *do.Injector) (service.ModuleB, error) {
        // Get dependency from the injector
        moduleA, err := do.Invoke[service.ModuleA](i)
        if err != nil {
            return nil, err
        }
        
        // Create service instance with dependency
        svc := service.NewModuleB(moduleA)
        return svc, nil
    })
    
    // Register plugin
    plugin.RegisterServicePlugin(&ModuleBPlugin{
        injector: injector,
    })
}

// Use in plugin
func (receiver *ModuleBPlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
    // Get service instance from DI container
    svc, err := do.Invoke[service.ModuleB](receiver.injector)
    if err != nil {
        panic(err)
    }
    
    // Register routes
    routes := httpsrv.Routes(httpsrv.NewModuleBHandler(svc))
    restServer.GroupRoutes("/moduleb", routes)
}
```

Using `samber/do` for dependency injection provides several benefits:

1. **Decoupled initialization**: Plugins can be registered in any order, with dependencies resolved automatically
2. **Lazy loading**: Services are only created when first requested
3. **Clear dependency graph**: Dependencies are explicitly declared and documented
4. **Testability**: Dependencies can be easily mocked for testing

With this approach, you can avoid manually controlling the plugin initialization order, making the code more maintainable and less error-prone.

### 5.3 Plugin Configuration

Enable or disable plugins through configuration using YAML:

```yaml
# Configuration file (app.yml)
plugin:
  blacklist:
    - module-c
    - module-d
```

In your main.go:

```go
// Import your configuration package
import (
    "modular-app/main/config"
)

func main() {
    // Load configuration from config package
    conf := config.LoadFromEnv()
    
    // Initialize plugins based on configuration
    for _, key := range plugins.Keys() {
        // Skip plugins in blacklist
        if sliceutils.StringContains(conf.Plugin.Blacklist, key) {
            logger.Info(fmt.Sprintf("Skipping plugin: %s (in blacklist)", key))
            continue
        }
        
        value, _ := plugins.Get(key)
        value.Initialize(restServer, grpcServer, dialCtx)
    }
    // ...
}
```

It's important to note that all plugins are compiled into the final binary when the application is built. The configuration only determines which plugins are initialized at runtime. To completely remove a plugin, you need to remove its import from the main application and recompile.

### 5.4 Plugin Version Management

When plugins need version updates, the following strategies can be adopted:

1. **Compatible updates**: Keep the interface unchanged, only update the implementation
2. **Parallel operation**: Run new versions alongside old versions, gradually migrating traffic
3. **Version tagging**: Distinguish different plugin versions through naming or configuration

Example:

```go
// Low-code plugin
func (p *LowCodePlugin) GetName() string {
    return "com.example.lowcode"
}

// High-code plugin
func (p *LowCodeV2Plugin) GetName() string {
    return "com.example.lowcode.v2"
}
```

#### RESTful API Version Management

When managing API versions in go-doudou plugins, a common approach is to use version prefixes in route groups:

```go
// In plugin v1
func (receiver *MyServicePluginV1) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
    // Register HTTP routes with v1 prefix
    routes := httpsrv.RoutesV1(httpsrv.NewMyServiceHandler(svc))
    restServer.GroupRoutes("/v1/myservice", routes)
}

// In plugin v2
func (receiver *MyServicePluginV2) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
    // Register HTTP routes with v2 prefix
    routes := httpsrv.RoutesV2(httpsrv.NewMyServiceHandlerV2(svc))
    restServer.GroupRoutes("/v2/myservice", routes)
}
```

This approach allows multiple versions of an API to coexist, making it easier to maintain backward compatibility while introducing new features.

## VI. Middleware Mechanism

go-doudou differentiates between plugins (for business modules) and middleware (for cross-cutting concerns like authentication, logging, etc.). Understanding this distinction is crucial for proper architecture design.

### 6.1 Global Middleware

Global middleware in go-doudou applies to all routes in the REST server. Here's how to register global middleware:

```go
func main() {
    // Create REST server
    restServer := rest.NewRestServer()
    
    // Add global middleware
    restServer.Use(middleware.CORS())
    restServer.Use(middleware.RequestID())
    restServer.Use(middleware.GinLogger())
    restServer.Use(middleware.Recovery())
    
    // Initialize plugins
    // ...
}
```

Common global middleware includes:

1. **CORS handling**: Managing cross-origin requests
2. **Request ID**: Adding unique identifiers to each request for tracing
3. **Logging**: Recording all incoming requests and responses
4. **Recovery**: Catching panics and converting them to 500 errors
5. **Authentication**: Verifying user identity
6. **Rate limiting**: Controlling request frequency

### 6.2 Plugin-Level Middleware

Plugins can also apply middleware to their specific routes:

```go
func (receiver *MyServicePlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
    // Create router group with middleware
    group := restServer.Group("/myservice")
    group.Use(middleware.TokenAuth())
    group.Use(middleware.RateLimit(100, 1*time.Minute))
    
    // Register routes to the group
    routes := httpsrv.Routes(httpsrv.NewMyServiceHandler(svc))
    for _, route := range routes {
        group.Handle(route.Method, route.Pattern, route.HandlerFunc)
    }
}
```

This approach allows plugins to have their own security policies, rate limits, or other specific behaviors.

### 6.3 Custom Middleware Implementation

You can easily create custom middleware for specific requirements:

```go
// Custom middleware for business metrics
func BusinessMetricsMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        
        // Process request
        c.Next()
        
        // After request
        duration := time.Since(start)
        
        // Record metrics based on route
        path := c.Request.URL.Path
        status := c.Writer.Status()
        
        // Record to metrics system
        metrics.RecordRequest(path, c.Request.Method, status, duration)
    }
}

// Usage in a plugin
func (receiver *MyServicePlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
    group := restServer.Group("/myservice")
    group.Use(BusinessMetricsMiddleware())
    
    // Register routes
    // ...
}
```

### 6.4 gRPC Middleware

go-doudou also supports middleware for gRPC services through interceptors:

```go
func main() {
    // Create gRPC server with interceptors
    grpcServer := grpcx.NewGrpcServer(
        grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
            grpc_recovery.UnaryServerInterceptor(),
            grpc_auth.UnaryServerInterceptor(authFunc),
            grpc_prometheus.UnaryServerInterceptor,
        )),
        grpc.StreamInterceptor(grpc_middleware.ChainStreamServer(
            grpc_recovery.StreamServerInterceptor(),
            grpc_auth.StreamServerInterceptor(authFunc),
            grpc_prometheus.StreamServerInterceptor,
        )),
    )
    
    // Initialize plugins
    // ...
}
```

gRPC interceptors provide similar functionality to HTTP middleware but for gRPC services.

### 6.5 Middleware vs. Plugins

Understanding the difference between middleware and plugins is important:

| Aspect | Middleware | Plugins |
|--------|------------|---------|
| Purpose | Cross-cutting concerns (auth, logging, metrics) | Business functionality |
| Scope | Request processing pipeline | Application architecture |
| Integration | Added to HTTP/gRPC request handling chain | Registered as architectural components |
| Development | Usually simpler, focused on request/response | More complex, implements business logic |
| Examples | Authentication, logging, rate limiting | User service, payment processing, notification system |

go-doudou uses middleware for infrastructure concerns (database, cache, logging) and plugins for business modules. This separation helps maintain clean architecture with clear responsibilities.

## VII. Conclusion

The go-doudou plugin mechanism provides powerful support for building modular monolithic applications with a micro-kernel architecture. By implementing the `ServicePlugin` interface and leveraging Go's package initialization mechanism, developers can easily build extensible and maintainable systems within a single process.

Core advantages include:

1. **Simplified integration**: Automatic registration and initialization of services, reducing boilerplate code
2. **Loose coupling**: Business modules exist as plugins, independent of each other
3. **Configure plugin usage**: Enable or disable specific plugins through configuration (requires compilation with the main application and service restart)
4. **Centralize management**: Centralized management of all components in the main program
5. **Efficient communication**: In-process communication between plugins without network overhead
6. **Future adaptability**: Possibility to extract high-load components as separate services when necessary

In practical applications, principles such as single responsibility, explicit dependencies, and good resource management should be followed, combined with dependency injection and middleware technologies to build robust and efficient monolithic systems with clear boundaries between components.

Through the plugin mechanism design principles, implementation methods, and best practices introduced in this article, developers can better utilize the go-doudou framework to build modular monolithic applications, improving development efficiency and system maintainability while avoiding premature architectural complexity.

As application requirements continue to evolve, modular design within monolithic applications will remain important for many use cases. The go-doudou plugin mechanism provides an elegant solution to help address the challenges of complex systems while maintaining the simplicity and advantages of a monolithic architecture. 