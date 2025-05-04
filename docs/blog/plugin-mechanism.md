---
sidebar: auto
---

# go-doudou + langchaingo Microkernel Architecture RAG Large Language Model Knowledge Base Practice (Part 1)

![programming.jpg](./go-doudou_langchaingo.png)
Photo by <a href="https://unsplash.com/@cgower?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Christopher Gower</a> on <a href="https://unsplash.com/photos/a-macbook-with-lines-of-code-on-its-screen-on-a-busy-desk-m_HRfLhgABo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
      
In modern microservice architecture design, modular and pluggable design patterns are increasingly favored by developers. go-doudou, as a domestic Go language microservice framework, provides excellent plugin mechanisms and modular architecture support. This article will explain in detail go-doudou's plugin mechanism and modular microkernel architecture implementation through a practical project based on RAG (Retrieval-Augmented Generation).

## 1. What are Plugin Mechanisms and Microkernel Architecture

Microkernel Architecture, also known as Plugin Architecture, is a design pattern that separates core system functions from extension functions. In this architecture:

- **Core System**: Provides basic services and mechanisms for managing plugins
- **Plugin Modules**: Independently developed, independently deployed, implementing specific functions

The advantages of this architecture include:

1. **Highly Modular**: Each plugin is an independent functional unit
2. **Strong Extensibility**: New functions can be added without modifying the core system
3. **Low Coupling**: Modules communicate through well-defined interfaces
4. **Flexible Deployment**: Plugins can be loaded as needed

## 2. Plugin Mechanism in go-doudou Framework

The go-doudou framework supports plugin mechanisms by implementing the `ServicePlugin` interface. Each service module is registered to the main application as a plugin, achieving decoupling between modules and the core system.

Let's first look at the core code in `main/cmd/main.go` of this project:

```go
package main

import (
	"go-doudou-rag/toolkit/auth"
	"github.com/unionj-cloud/go-doudou/v2/framework/grpcx"
	"github.com/unionj-cloud/go-doudou/v2/framework/plugin"
	"github.com/unionj-cloud/go-doudou/v2/framework/rest"
	"github.com/unionj-cloud/toolkit/pipeconn"
	"github.com/unionj-cloud/toolkit/zlogger"
	"google.golang.org/grpc"

	_ "go-doudou-rag/module-auth/plugin"
	_ "go-doudou-rag/module-chat/plugin"
	_ "go-doudou-rag/module-knowledge/plugin"
)

func main() {
	srv := rest.NewRestServer()
	srv.Use(auth.Jwt)

	grpcServer := grpcx.NewGrpcServer(
		// GRPC configuration...
	)
	lis, dialCtx := pipeconn.NewPipeListener()
	plugins := plugin.GetServicePlugins()
	for _, key := range plugins.Keys() {
		value, _ := plugins.Get(key)
		value.Initialize(srv, grpcServer, dialCtx)
	}
	defer func() {
		if r := recover(); r != nil {
			zlogger.Info().Msgf("Recovered. Error: %v\n", r)
		}
		for _, key := range plugins.Keys() {
			value, _ := plugins.Get(key)
			value.Close()
		}
	}()
	go func() {
		grpcServer.RunWithPipe(lis)
	}()
	srv.AddRoutes(rest.DocRoutes(""))
	srv.Run()
}
```

This code demonstrates the implementation of go-doudou's microkernel architecture:

1. Anonymous import (`_ "go-doudou-rag/module-xxx/plugin"`) of each module's plugin package
2. Get all registered service plugins `plugin.GetServicePlugins()`
3. Call the `Initialize` method of each plugin, passing in the REST server and gRPC server
4. Register resource cleanup functions, ensuring that the plugin's `Close` method is called when the program exits

## 3. Implementation and Registration of Plugins

Each module becomes a plugin by implementing the `ServicePlugin` interface. Taking the `module-auth` module as an example:

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

This plugin implements key interface methods:

- `GoDoudouServicePlugin()`: Identifier interface method
- `GetName()`: Returns the plugin name
- `Initialize()`: Initializes the plugin, registers HTTP routes
- `Close()`: Releases resources

Note especially the `plugin.RegisterServicePlugin()` in the `init()` function, which registers the plugin to the global plugin registry, allowing the main application to discover and load this plugin.

## 4. Communication Between Modules

In microkernel architecture, communication between modules is a key challenge. go-doudou provides multiple communication methods:

1. **Direct Dependency Call**: Modules can directly import interfaces from other modules
2. **Dependency Injection**: Implement dependency injection through the `samber/do` library

In the implementation of `module-chat`, we can see how to call the service of `module-knowledge`:

```go
func (receiver *ModuleChatImpl) Chat(ctx context.Context, req dto.ChatRequest) (err error) {
	// ...code omitted...

	knowService := do.MustInvoke[know.ModuleKnowledge](nil)
	queryResults, err := knowService.GetQuery(ctx, kdto.QueryReq{
		Text: req.Prompt,
		Top:  10,
	})
	
	// ...code omitted...
}
```

`module-knowledge` registers services through dependency injection:

```go
func init() {
	plugin.RegisterServicePlugin(&ModuleKnowledgePlugin{})

	do.Provide[service.ModuleKnowledge](nil, func(injector *do.Injector) (service.ModuleKnowledge, error) {
		conf := config.LoadFromEnv()

		db, err := gorm.Open(sqlite.Open(conf.Db.Dsn), &gorm.Config{})
		if err != nil {
			panic("failed to connect database")
		}

		if err = db.AutoMigrate(&model.File{}); err != nil {
			panic(err)
		}

		dao.Use(db)

		svc := service.NewModuleKnowledge(conf)
		return svc, nil
	})
}
```

## 5. Modular Design Practices

This project demonstrates best practices in modular design, with each module having a clear division of responsibilities:

1. **Module-Auth**: Responsible for user authentication
2. **Module-Chat**: Implements chat functionality, integrates large language models
3. **Module-Knowledge**: Knowledge base management, implements RAG retrieval

Each module follows a similar internal structure:

```
module-xxx/
  ├── cmd/              # Independent execution entry point
  ├── config/           # Module configuration
  ├── dto/              # Data Transfer Objects
  ├── internal/         # Internal implementation
  │   ├── dao/          # Data access
  │   └── model/        # Data models
  ├── plugin/           # Plugin implementation
  ├── transport/        # Transport layer
  │   └── httpsrv/      # HTTP service
  ├── svc.go            # Service interface definition
  └── svcimpl.go        # Service implementation
```

This structure ensures:

1. Separation of interface and implementation
2. Separation of concerns
3. Clear dependency relationships
4. Good encapsulation

## 6. Practical Case: RAG Chat System

This project implements a chat system based on RAG (Retrieval-Augmented Generation), with the overall process as follows:

1. Users authenticate through `module-auth`
2. After authentication, they can upload knowledge documents through `module-knowledge`
3. Users ask questions through `module-chat`, the system will:
   - Retrieve relevant content from `module-knowledge`
   - Call a large language model to generate answers
   - Return results via SSE (Server-Sent Events) streaming

For example, the core processing logic in `module-chat`:

```go
func (receiver *ModuleChatImpl) Chat(ctx context.Context, req dto.ChatRequest) (err error) {
	// ...set response headers...

	// Create LLM client
	llm, err := openai.New(
		openai.WithBaseURL(receiver.conf.Openai.BaseUrl),
		openai.WithToken(lo.Ternary(stringutils.IsNotEmpty(receiver.conf.Openai.Token), 
			receiver.conf.Openai.Token, os.Getenv("OPENAI_API_KEY"))),
		openai.WithEmbeddingModel(receiver.conf.Openai.EmbeddingModel),
		openai.WithModel(receiver.conf.Openai.Model),
	)
	
	// Retrieve relevant content from knowledge base
	knowService := do.MustInvoke[know.ModuleKnowledge](nil)
	queryResults, err := knowService.GetQuery(ctx, kdto.QueryReq{
		Text: req.Prompt,
		Top:  10,
	})
	
	// Filter results with high relevance
	queryResults = lo.Filter(queryResults, func(item kdto.QueryResult, index int) bool {
		return cast.ToFloat64(item.Similarity) >= 0.5
	})

	// Build prompt
	prompt := "Please answer the question based on the context information given below..."
	
	// Call LLM to generate answers and return them via streaming
	content := []llms.MessageContent{
		llms.TextParts(llms.ChatMessageTypeSystem, "You are a senior public policy researcher."),
		llms.TextParts(llms.ChatMessageTypeHuman, prompt),
	}

	_, err = llm.GenerateContent(ctx, content,
		llms.WithMaxTokens(4096),
		llms.WithTemperature(0.2),
		llms.WithStreamingFunc(func(ctx context.Context, chunk []byte) error {
			chunkResp := dto.ChatResponse{
				Content:   string(chunk),
				RequestID: requestID,
				Type:      "content",
			}
			return writeSSEMessage(w, flusher, chunkResp)
		}))
		
	return
}
```

## 7. System Startup and Usage Examples

### 7.1 Starting the System

Start this RAG system based on go-doudou plugin architecture with the following steps:

1. **Clone the repository and enter the project directory**
   ```bash
   git clone https://github.com/your-repo/go-doudou-rag.git
   cd go-doudou-rag
   ```

2. **Install dependencies**
   ```bash
   go mod tidy
   ```

3. **Start the main application**
   ```bash
   cd main/cmd
   go run main.go
   ```

After the system starts, all modules (auth, chat, knowledge) will be loaded as plugins, and their API endpoints will be registered to the main application.

### 7.2 Call Examples

The following shows how to use curl commands to send requests to the chat service for knowledge-based Q&A:

```bash
# Login
curl --location 'http://localhost:6060/moduleauth/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "admin",
    "password": "admin"
}'

# Upload PDF document
curl --location 'http://localhost:6060/moduleknowledge/upload' \
--header 'Authorization: Bearer <token obtained from login interface>' \
--form 'file=@"/Users/wubin1989/Downloads/杭州市人民政府印发关于进一步推动经济高质量发展若干政策的通知.pdf"'

# Chat
curl -w '\n' -N -X POST 'http://localhost:6060/modulechat/chat' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token obtained from login interface>' \
--data '{
    "prompt": "What recent economic policies has Hangzhou introduced?"
}'
```

System response example:

First, the system returns the constructed prompt (including context information retrieved from the knowledge base):

```
Please answer the question based on the context information given below, the answer must be itemized for clarity. If you don't know, you can answer that you don't know, but don't make up answers:
1. — 1 —
Hangzhou Municipal People's Government Document
Hangzheng Function [2024] No. 16
Notice of Hangzhou Municipal People's Government on Issuing
Several Policies for Further Promoting High-Quality Economic Development
To all district, county (city) people's governments, municipal government departments, and directly affiliated units:
The "Several Policies for Further Promoting High-Quality Economic Development" is now issued to you, please organize implementation in conjunction with actual conditions.
Hangzhou Municipal People's Government
February 18, 2024
(This document is publicly released)
ZJAC00-2024-0001
2. — 2 —
Several Policies for Further Promoting High-Quality Economic Development
... [context partially omitted] ...
```

Then, the system generates a structured answer based on the retrieved context information:

```
According to the provided information, the Hangzhou Municipal People's Government has recently issued a series of policies to promote high-quality economic development, specifically including the following aspects:

1. **Expanding Effective Investment Policies**: Promoting the introduction of the "Hangzhou Municipal Government Investment Project Management Regulations", implementing the provincial "Thousand Projects Trillion Yuan" project for expanding effective investment, planning to complete investments of over 80 billion yuan in 2024, driving fixed asset investment growth by 3%.

2. **Stimulating Consumption Potential**: Implementing policies such as purchase tax exemptions for new energy vehicles, adding 3,000 charging facilities in public areas throughout the year, organizing over 500 consumption promotion activities, and holding more than 50 catering consumption promotion activities.

3. **Supporting High-Quality Enterprise Development**: Improving the gradient cultivation mechanism for quality enterprises, providing a one-time reward of up to 200,000 yuan for industrial enterprises that are first incorporated into statistics, and an additional one-time reward of up to 300,000 yuan for those that remain in the statistics for 3 consecutive years.

4. **Stabilizing Foreign Trade Development**: Organizing no less than 150 foreign trade groups throughout the year, participating in more than 100 overseas exhibitions, sending 3,000 enterprises to explore overseas markets, and increasing the upper limit of short-term export credit insurance premium subsidy ratio to 60% (upper limit increased to 65% for manufacturing enterprises).

5. **Building an International Exhibition City**: Successfully hosting the 3rd Global Digital Trade Expo with high quality, achieving five doublings, and attracting 30 exhibitions to settle in Hangzhou International Expo Center and Convention Center in 2024.

6. **Supporting Digital Trade Development**: Encouraging enterprises to conduct data export security assessments, participate in the formulation of various standards in the field of digital trade, and continuously promote innovation in service trade development.

7. **Leveraging E-commerce Advantages**: Promoting high-quality development of new e-commerce in Hangzhou, cumulatively building no less than 200 e-commerce live streaming "Common Prosperity Workshops" throughout the year, and deepening the construction of Hangzhou Cross-border E-commerce Comprehensive Pilot Zone.

8. **Strengthening Financial Support**: The municipal finance budget for 2024 allocates 600 million yuan to support expanding domestic demand and stimulating consumption, supporting foreign trade development, high-quality development of new e-commerce, cross-border e-commerce development, opening new international routes, etc.
```

### 7.3 Knowledge Base Retrieval Failure Handling Mechanism

An important feature of the RAG system is that it only answers questions based on information existing in the knowledge base. When a user's question has low or no relevance to documents in the knowledge base, the system will clearly inform the user that it cannot answer, rather than generating potentially inaccurate information. Here is an example:

```bash
curl -w '\n' -N -X POST 'http://localhost:6060/modulechat/chat' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDU4OTM4MTMsInVzZXJuYW1lIjoiYWRtaW4ifQ.EjxDfrMMHmOCvt557H8rd5sn9zX-uYOytw4OKH-jLJ8' \
--data '{
    "prompt": "What is the latest version of Java?"            
}'
```

System response:
```
I'm very sorry, no relevant information could be retrieved, unable to answer
```

In the code implementation, this mechanism is implemented as follows:

```go
// Implementation from module-chat/svcimpl.go
queryResults = lo.Filter(queryResults, func(item kdto.QueryResult, index int) bool {
    return cast.ToFloat64(item.Similarity) >= 0.5
})

if len(queryResults) == 0 {
    zlogger.Error().Msgf("Knowledge not found, requestId: %s", requestID)
    chunk := dto.ChatResponse{
        Content:   "I'm very sorry, no relevant information could be retrieved, unable to answer",
        RequestID: requestID,
        Type:      "error",
    }
    writeSSEMessage(w, flusher, chunk)
    return
}
```

This design ensures that the system only answers questions for which it has a knowledge base, improving the reliability and accuracy of responses and avoiding the risk of generating false information. It is an important aspect of responsible AI application design, especially in fields requiring high accuracy such as policy consulting, legal advice, etc.

This example fully demonstrates the power of plugin architecture:
1. **Module Collaboration**: `module-auth` handles authentication, `module-knowledge` is responsible for knowledge retrieval, and `module-chat` integrates large language models to generate answers
2. **Pluggability**: Each module can be independently updated or replaced
3. **Technical Decoupling**: Each module can use different technology stacks and data storage methods

## 8. Summary and Outlook

This article detailed the plugin mechanism and modular pluggable microkernel architecture in the go-doudou framework through a practical RAG chat system case. We have seen that this architectural pattern not only provides good modularity and extensibility but also allows different parts of the system to work together in a loosely coupled manner, greatly improving development efficiency and system maintainability.

The plugin mechanism in the go-doudou framework provides developers with a concise yet powerful way to build modular applications through the `ServicePlugin` interface and dependency injection system. This approach is particularly suitable for team collaborative development of complex systems, where each team can focus on their domain module without needing to be overly concerned with implementation details of other modules.

However, understanding concepts and principles is just the first step; how to actually build such a system from scratch is what developers care about most. In the next article, "Plugin Mechanism in go-doudou Framework and Modular Pluggable Microkernel Architecture in Practice (Part 2)", we will provide a detailed practical guide, leading readers step by step to build a complete go-doudou microkernel architecture application from scratch. We will demonstrate how to use go-doudou CLI tools to create workspaces, define service interfaces, implement plugins, configure communication between modules, and other full-process operations through specific commands and code examples, helping developers quickly master the practical application methods of this powerful architectural pattern.

## References

- go-doudou official documentation: https://go-doudou.github.io/
- Source code of this project: https://github.com/wubin1989/go-doudou-rag 