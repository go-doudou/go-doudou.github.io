---
sidebar: auto
---

# go-doudou + langchaingo Microkernel Architecture RAG Large Language Model Knowledge Base Practice (Part 3)

In the previous two articles, we detailed go-doudou framework's plugin mechanism, the implementation of microkernel architecture, and how to build a microkernel architecture application from scratch using go-doudou. This article will focus on frontend development, particularly how to develop a chat interface based on Vue 3, and how the go-doudou framework embeds frontend resources into backend services for integrated packaging.

## 1. Frontend Technology Stack Overview

This project's frontend adopts the following technology stack:

- **Vue 3**: Core frontend framework, using Composition API for development
- **Ant Design Vue**: UI component library providing beautiful and feature-rich components
- **ant-design-x-vue**: Chat component library developed based on Ant Design Vue
- **TypeScript**: Provides type safety and better development experience
- **Vite**: Modern frontend build tool offering a fast development experience

The frontend code is located in the `module-chat/frontend` directory, with a clear structure for easy development and maintenance.

## 2. Chat Interface Development

### 2.1 Interface Design and Implementation

The chat interface adopts a classic left-right layout design: conversation list on the left, message area and input box on the right. The entire interface is implemented based on the ant-design-x-vue component library, providing a consistent user experience.

The implementation of the core chat component is as follows (`module-chat/frontend/src/Demo.vue`):

```vue
<script setup lang="ts">
import type { AttachmentsProps, BubbleListProps, ConversationsProps, PromptsProps } from 'ant-design-x-vue'
import type { VNode } from 'vue'
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from '@ant-design/icons-vue'
import { Badge, Button, Flex, Space, Typography, theme, message } from 'ant-design-vue'
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  useXAgent,
  useXChat,
  Welcome,
  XStream,
} from 'ant-design-x-vue'
import { computed, h, ref, watch, onUnmounted, onMounted, nextTick, defineComponent } from 'vue'
import { uploadService } from '@/api_know/UploadService'
import { TokenService } from '@/httputil/TokenService'
import MarkdownIt from 'markdown-it'

// Create markdown-it parser
const md = new MarkdownIt({
  html: true,        // Enable HTML tags
  breaks: true,      // Convert '\n' to <br>
  linkify: true,     // Automatically convert URLs to links
  highlight: (str, lang) => {
    // Simple code highlighting
    return `<pre class="code-block"><code class="${lang ? `language-${lang}` : ''}">${md.utils.escapeHtml(str)}</code></pre>`;
  }
});
```

### 2.2 Technical Highlights

#### Streaming Output and Typewriter Effect

This project implements streaming responses and typewriter effects to enhance user experience. This is achieved through a custom `TypingText` component and server-side SSE (Server-Sent Events):

```vue
// Custom typewriter component
const TypingText = defineComponent({
  name: 'TypingText',
  props: {
    text: {
      type: String,
      required: true
    },
    speed: {
      type: Number,
      default: 30
    },
    onComplete: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const displayText = ref('');
    const isTyping = ref(true);
    const charIndex = ref(0);
    const blinkCursor = ref(true);
    
    // Typing effect
    const typeNextChar = () => {
      if (charIndex.value < props.text.length) {
        // Add 2 characters at once to increase speed
        const charsToAdd = Math.min(2, props.text.length - charIndex.value);
        displayText.value += props.text.substring(charIndex.value, charIndex.value + charsToAdd);
        charIndex.value += charsToAdd;
        
        setTimeout(typeNextChar, props.speed);
      } else {
        isTyping.value = false;
        blinkCursor.value = false;
        props.onComplete();
      }
    };
    
    // Watch for text changes to restart typing
    watch(() => props.text, () => {
      displayText.value = '';
      charIndex.value = 0;
      isTyping.value = true;
      blinkCursor.value = true;
      
      if (props.text) {
        setTimeout(typeNextChar, props.speed);
      }
    }, { immediate: true });
    
    return () => {
      return h('div', { class: 'typing-container' }, [
        h('span', displayText.value),
        isTyping.value ? h('span', { 
          class: 'typing-cursor',
          style: {
            display: blinkCursor.value ? 'inline-block' : 'none',
            marginLeft: '2px',
            animation: 'cursor-blink 0.8s infinite'
          }
        }, '|') : null
      ]);
    };
  }
});
```

#### Markdown Rendering and Code Highlighting

The chat interface supports rendering of Markdown-formatted messages and provides code highlighting, making the display of complex content clearer:

```vue
// Custom function to render Markdown content
const renderMarkdown = (content: string) => {
  if (!content) return ''
  return md.render(content)
}

const items = computed<BubbleListProps['items']>(() => {
  return messages.value.map(({ id, message, status }) => {
    if (status !== 'local') {
      // Check if typing effect is completed for this message
      const isTypingDone = typingCompleted.value[id] || false;
      
      return {
        key: id,
        loading: status === 'loading',
        role: 'ai',
        // Specify content as HTML or plain text
        content: isTypingDone 
          ? h('div', { 
              class: 'markdown-content',
              innerHTML: renderMarkdown(message)
            })
          : h(TypingText, { 
              text: message,
              onComplete: () => {
                typingCompleted.value[id] = true;
              }
            })
      }
    }
    
    return {
      key: id,
      loading: false,
      role: 'local',
      content: message,
    }
  })
})
```

#### File Upload and Knowledge Base Integration

The frontend implements a file upload function that supports uploading PDF documents to the knowledge base and conducting Q&A based on these documents:

```vue
// File upload handler function
const handleUpload = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadService.postUpload(formData);
    return response;
  } catch (error) {
    return false;
  }
}

const handleFileChange: AttachmentsProps['onChange'] = info => {
  attachedFiles.value = info.fileList

  // If this is a file upload operation
  if (info.file.status === 'done') {
    console.log("file done", info.file)

    // Check if the response contains a file ID
    if (info.file.response && info.file.response.data && info.file.response.data.id) {
      // If file uploaded successfully and has an ID, add it to the file ID list
      uploadedFileIds.value.push(info.file.response.data.id);
    }

    message.success(`${info.file.name} uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} upload failed`);
  } else if (info.file.status === 'removed') {
    console.log("file removed", info.file)
    // If file was removed, also remove from file ID list
    if (info.file.response && info.file.response.data && info.file.response.data.id) {
      const fileId = info.file.response.data.id;
      uploadedFileIds.value = uploadedFileIds.value.filter(id => id !== fileId);
    }
  }
}
```

#### SSE Streaming Communication Implementation

The frontend implements streaming communication with the backend through SSE (Server-Sent Events) technology, ensuring real-time communication and efficient resource utilization:

```vue
const [agent] = useXAgent({
  request: async ({ message }, { onSuccess, onError }) => {
    agentRequestLoading.value = true

    // Cancel any ongoing request first
    if (abortController.value) {
      abortController.value.abort()
    }

    // Create new AbortController
    abortController.value = new AbortController()
    // Reset cancellation flag
    isRequestCancelled.value = false

    try {
      // Get file ID string, multiple file IDs joined with commas
      const fileIdStr = uploadedFileIds.value.join(',')
      
      // Initiate SSE streaming request
      const response = await fetch(`/modulechat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TokenService.getToken()}`,
          'Accept': 'text/event-stream', // Explicitly specify accepting SSE
          'Connection': 'keep-alive', // Try to keep connection
          'Cache-Control': 'no-cache' // Prevent caching
        },
        body: JSON.stringify({
          prompt: message,
          file_id: fileIdStr // Add file ID field
        }),
        signal: abortController.value.signal,
        // Allow authentication information
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      // Use XStream to process streaming data
      const stream = XStream({
        readableStream: response.body
      })
      
      // Collect complete content
      let fullContent = ''

      try {
        // Use stream iterator to process data chunks
        for await (const chunk of stream) {
          // If request has been canceled, stop processing data
          if (isRequestCancelled.value) {
            break
          }

          try {
            if (!chunk || !chunk.data) continue

            // Parse SSE data
            const data = JSON.parse(chunk.data)

            // Only collect content, don't update intermediate results,
            // let Bubble's built-in typing effect handle it
            if (data.content) {
              fullContent += data.content
            }
          } catch (error) {
            console.error('Error parsing SSE data:', error)
          }
        }

        // After stream ends, return complete content for Bubble component to display with typing effect
        onSuccess(fullContent || 'Server did not return valid content')
      } catch (error) {
        console.error('Error reading stream:', error)
        throw error
      }
    } catch (error: any) {
      console.error('SSE error:', error)

      if (error.name === 'AbortError') {
        onSuccess('Conversation canceled')
      } else if (error.message.includes('timeout') || error.message.includes('timedout')) {
        onSuccess('Connection timeout, please try again later')
      } else {
        onError(error)
      }
    } finally {
      agentRequestLoading.value = false
      abortController.value = null
    }
  },
})
```

## 3. go-doudou Framework Embedding Frontend Resources

### 3.1 Frontend Resource Packaging and Integration

The go-doudou framework provides an elegant way to embed frontend resources, achieving integrated deployment of frontend and backend. This approach avoids the complexity of traditional separate frontend and backend deployments, particularly suitable for small to medium-sized applications.

In this project, we first need to execute the build command in the frontend project directory to generate static resources:

```bash
cd module-chat/frontend
npm run build
```

This command will generate packaged static resource files in the `module-chat/frontend/dist` directory. Then, in the plugin initialization code of the `module-chat` module, we use the `AddStaticResource` method to embed these static resources into the backend service.

### 3.2 Using AddStaticResource and Frontend Resource Embedding

To achieve integrated packaging of frontend resources, we used the `embed` package introduced in Go 1.16+, a powerful feature that allows static files to be embedded into Go binary files. In the `module-chat/frontend/embed.go` file, we can see how to declare an embedded file system:

```go
package frontend

import "embed"

//go:embed dist/*
var Dist embed.FS
```

The special comment directive `//go:embed dist/*` tells the Go compiler to embed all files in the `dist` directory into the executable file and provide access via the `Dist` variable. This approach has the following advantages:

1. Frontend resources become part of the Go binary, no need for additional file copying or deployment
2. Distribution is simpler, only requiring distribution of a single binary file
3. Resource content is determined at compile time, no need to look for files at runtime

In the `module-chat/plugin/plugin.go` file, we can see how to use these embedded resources:

```go
func (receiver *ModuleChatPlugin) Initialize(restServer *rest.RestServer, grpcServer *grpcx.GrpcServer, dialCtx pipeconn.DialContextFunc) {
	dist_storage, _ := fs.Sub(frontend.Dist, "dist")
	restServer.AddStaticResource(dist_storage, "")

	conf := config.LoadFromEnv()
	svc := service.NewModuleChat(conf)
	routes := httpsrv.Routes(httpsrv.NewModuleChatHandler(svc))
	restServer.GroupRoutes("/modulechat", routes, httpsrv.InjectResponseWriter)
	restServer.GroupRoutes("/modulechat", rest.DocRoutes(service.Oas))
}
```

This code implements key functions:

1. Use the `fs.Sub` function to extract the `dist` subdirectory from the embedded `frontend.Dist`, returning a new file system that implements the `fs.FS` interface.
2. Call the `AddStaticResource` method to map this embedded file system to the root path `""` rather than mapping a physical file path. This is a powerful feature of the go-doudou framework, supporting direct use of the `fs.FS` interface.

### 3.3 Frontend and Backend Route Integration

In our project, frontend routes and backend API routes need to coexist harmoniously. We use Vue Router to manage frontend routes, and define route configuration in `module-chat/frontend/src/router/index.ts`:

```typescript
import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { TokenService } from '@/httputil/TokenService';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/demo',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/Demo.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Route guards
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isLoggedIn = TokenService.isLoggedIn();

  if (requiresAuth && !isLoggedIn) {
    // Requires login but user is not logged in, redirect to login page
    next({ name: 'Login' });
  } else if (to.path === '/login' && isLoggedIn) {
    // Already logged in but accessing login page, redirect to home page
    next({ path: '/demo' });
  } else {
    next();
  }
});

export default router;
```

The key here is using `createWebHashHistory()` to create a hash-based history mode, which uses `#` in URLs to separate frontend routes, thereby avoiding conflicts with backend routes. For example, accessing the `/demo` route will actually be converted to `/#/demo`, so the server only needs to handle the `/` path, while the browser is responsible for parsing the part after `#`.

## 4. Compilation and Deployment Process

### 4.1 Frontend Resource Building

Building frontend resources is very simple, just execute in the `module-chat/frontend` directory:

```bash
npm install    # Only needed for first build or when dependencies change
npm run build
```

This command will generate packaged static resource files in the `module-chat/frontend/dist` directory. Since we use Go's `embed` package, these build products will be embedded into the binary file at Go compilation time.

### 4.2 Project Startup and Access

After building the frontend resources, the entire application can be started directly by running the following command in the project root directory:

```bash
cd main && go run cmd/main.go
```

If you need to compile the entire project into an executable file, simply execute:

```bash
go build main/cmd/main.go
```

The compiled binary file already includes all frontend resources and can be run directly without any additional files or configuration. After the service starts, users can directly access the chat interface via `http://localhost:6060`.

This integrated deployment method greatly simplifies operations work, particularly suitable for scenarios where teams don't have dedicated frontend operations personnel. The entire application only requires one binary file to run, greatly reducing the complexity of deployment and distribution.

## 5. Summary and Best Practices

Through this article, we've detailed the development of a Vue 3-based chat interface and how to use the go-doudou framework's `AddStaticResource` method to achieve integrated frontend-backend deployment. This integration approach has the following advantages:

1. **Simplified deployment**: Only need to deploy one service, no need to deploy frontend and backend separately
2. **Reduced cross-origin issues**: Frontend and backend are same-origin, avoiding common cross-origin problems
3. **Lowered operations complexity**: Simplifies operations processes and environment configuration
4. **Improved resource utilization efficiency**: Reduces the number of service instances, saving resources

In actual development, we recommend the following best practices:

1. **Keep frontend and backend code separate**: Although deployment is integrated, frontend and backend code should remain clearly separated during development
2. **Use hash route mode**: Avoid conflicts between frontend routes and backend API routes
3. **Automate build processes**: Automate frontend and backend builds through Makefile or CI/CD processes
4. **Optimize static resources**: Appropriately optimize frontend static resources to reduce homepage loading time
5. **Cache control**: Add appropriate cache controls in production environments to enhance user experience

The go-doudou framework's integrated frontend-backend deployment solution is very suitable for small to medium-sized teams to quickly develop and deploy applications. Especially in situations with limited resources or smaller team sizes, this approach can significantly improve development efficiency and reduce operations costs.

In future development, we can further explore how to implement richer features on the basis of this integrated architecture, such as internationalization support, theme customization, more complex state management, etc., making this chat application based on go-doudou and Vue 3 more powerful and flexible. 