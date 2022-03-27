import{f as t}from"./app.594cd40c.js";import{_ as s}from"./plugin-vue_export-helper.21dcd24c.js";const n={},a=t(`<h1 id="\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u914D\u7F6E" aria-hidden="true">#</a> \u914D\u7F6E</h1><p>Go-doudou\u63D0\u4F9B\u4E86\u5BF9dotenv\u683C\u5F0F\u548Cyaml\u683C\u5F0F\u7684\u672C\u5730\u914D\u7F6E\u6587\u4EF6\uFF0C\u4EE5\u53CA\u963F\u91CCNacos\u914D\u7F6E\u4E2D\u5FC3\u548C\u643A\u7A0BApollo\u914D\u7F6E\u4E2D\u5FC3\u7684\u5F00\u7BB1\u652F\u6301\uFF0C\u53EF\u4EE5\u4ECE\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u6216\u8005\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u52A0\u8F7D\u914D\u7F6E\u5230\u73AF\u5883\u53D8\u91CF\u4E2D\u3002</p><p>\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u548C\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u7684\u4F18\u5148\u7EA7\u662F\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u4F18\u5148\uFF0C\u5373\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u4E2D\u5DF2\u52A0\u8F7D\u7684\u914D\u7F6E\u4E0D\u4F1A\u88AB\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u52A0\u8F7D\u7684\u914D\u7F6E\u8986\u76D6\u3002</p><h2 id="\u672C\u5730\u914D\u7F6E\u6587\u4EF6" tabindex="-1"><a class="header-anchor" href="#\u672C\u5730\u914D\u7F6E\u6587\u4EF6" aria-hidden="true">#</a> \u672C\u5730\u914D\u7F6E\u6587\u4EF6</h2><p>dotenv\u683C\u5F0F\u548Cyaml\u683C\u5F0F\u7684\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u7684\u4F7F\u7528\u65B9\u5F0F\u662F\u5B8C\u5168\u4E00\u6837\u7684\uFF0C\u53EA\u662F\u6587\u4EF6\u547D\u540D\u89C4\u5219\u7A0D\u6709\u4E0D\u540C\u3002\u4E0B\u6587\u5206\u522B\u8BF4\u660E\u3002</p><div class="custom-container tip"><p class="custom-container-title">\u63D0\u793A</p><p>\u4E24\u79CD\u683C\u5F0F\u7684\u914D\u7F6E\u6587\u4EF6\u53EF\u4EE5\u540C\u65F6\u4F7F\u7528\uFF0C\u4E5F\u53EF\u4EE5\u53EA\u7528\u5176\u4E2D\u4E00\u79CD\u3002\u5F53\u540C\u65F6\u4F7F\u7528\u65F6\uFF0Cyaml\u683C\u5F0F\u7684\u914D\u7F6E\u6587\u4EF6\u4F18\u5148\u52A0\u8F7D\uFF0C\u5168\u90E8\u52A0\u8F7D\u5B8C\u6BD5\u4EE5\u540E\uFF0C\u518D\u52A0\u8F7Ddotenv\u683C\u5F0F\u7684\u914D\u7F6E\u6587\u4EF6\u3002</p></div><h3 id="dotenv\u6587\u4EF6" tabindex="-1"><a class="header-anchor" href="#dotenv\u6587\u4EF6" aria-hidden="true">#</a> dotenv\u6587\u4EF6</h3><p>\u5982\u679C\u4F60\u6709\u591A\u4E2A<code>.env</code>\u6587\u4EF6\uFF0C\u4F8B\u5982<code>.env.test</code>, <code>.env.prod</code>\u7B49\u5206\u522B\u914D\u7F6E\u4E0D\u540C\u7684\u73AF\u5883\uFF0C\u4F60\u53EF\u4EE5\u901A\u8FC7\u547D\u4EE4\u884C\u7EC8\u7AEF\u3001<code>Dockerfile</code>\u6587\u4EF6\u6216\u8005k8s\u914D\u7F6E\u6587\u4EF6\u7B49\u8BBE\u7F6E<code>GDD_ENV</code>\u73AF\u5883\u53D8\u91CF\u4E3A<code>test</code>\u6216\u8005<code>prod</code>\u6765\u52A0\u8F7D\u5BF9\u5E94\u7684\u914D\u7F6E\u6587\u4EF6\u3002</p><p>\u914D\u7F6E\u52A0\u8F7D\u89C4\u5219\u5982\u4E0B\uFF1A</p><ol><li>\u540C\u4E00\u4E2A\u73AF\u5883\u53D8\u91CF\uFF0C\u4E0D\u8BBA\u662F\u5728\u547D\u4EE4\u884C\u7EC8\u7AEF\u914D\u7F6E\u7684\uFF0C\u8FD8\u662F\u901A\u8FC7\u914D\u7F6E\u6587\u4EF6\u914D\u7F6E\u7684\uFF0C\u6700\u5148\u52A0\u8F7D\u7684\u503C\u4F18\u5148\u7EA7\u6700\u9AD8\uFF0C\u4E0D\u4F1A\u88AB\u540E\u52A0\u8F7D\u7684\u503C\u4FEE\u6539</li><li>\u914D\u7F6E\u6587\u4EF6\u7684\u52A0\u8F7D\u987A\u5E8F\u662F\uFF08\u4EE5<code>prod</code>\u73AF\u5883\u4E3A\u4F8B\uFF09\uFF1A<br> 1. \u52A0\u8F7D<code>.env.prod.local</code>\u6587\u4EF6<br> 2. \u5F53\u73AF\u5883\u53D8\u91CF<code>GDD_ENV</code>\u7684\u503C<strong>\u4E0D</strong>\u7B49\u4E8E<code>test</code>\u65F6\uFF0C\u52A0\u8F7D<code>.env.local</code>\u6587\u4EF6<br> 3. \u52A0\u8F7D<code>.env.prod</code>\u6587\u4EF6<br> 4. \u52A0\u8F7D<code>.env</code>\u6587\u4EF6</li></ol><p><strong>\u6CE8\u610F</strong>\uFF1A\u524D\u7F00\u5FC5\u987B\u662F<code>.env</code></p><h3 id="yaml\u6587\u4EF6" tabindex="-1"><a class="header-anchor" href="#yaml\u6587\u4EF6" aria-hidden="true">#</a> yaml\u6587\u4EF6</h3><p>\u540C\u65F6\u652F\u6301<code>.yml</code>\u540E\u7F00\u548C<code>.yaml</code>\u540E\u7F00\u7684\u914D\u7F6E\u6587\u4EF6\u3002\u5982\u679C\u4F60\u6709\u591A\u4E2Ayaml\u6587\u4EF6\uFF0C\u4F8B\u5982<code>app-test.yml</code>, <code>app-prod.yml</code>\u7B49\u5206\u522B\u914D\u7F6E\u4E0D\u540C\u7684\u73AF\u5883\uFF0C\u4F60\u53EF\u4EE5\u901A\u8FC7\u547D\u4EE4\u884C\u7EC8\u7AEF\u3001<code>Dockerfile</code>\u6587\u4EF6\u6216\u8005k8s\u914D\u7F6E\u6587\u4EF6\u7B49\u8BBE\u7F6E<code>GDD_ENV</code>\u73AF\u5883\u53D8\u91CF\u4E3A<code>test</code>\u6216\u8005<code>prod</code>\u6765\u52A0\u8F7D\u5BF9\u5E94\u7684\u914D\u7F6E\u6587\u4EF6\u3002</p><p>\u914D\u7F6E\u52A0\u8F7D\u89C4\u5219\u5982\u4E0B\uFF1A</p><ol><li>\u540C\u4E00\u4E2A\u73AF\u5883\u53D8\u91CF\uFF0C\u4E0D\u8BBA\u662F\u5728\u547D\u4EE4\u884C\u7EC8\u7AEF\u914D\u7F6E\u7684\uFF0C\u8FD8\u662F\u901A\u8FC7\u914D\u7F6E\u6587\u4EF6\u914D\u7F6E\u7684\uFF0C\u6700\u5148\u52A0\u8F7D\u7684\u503C\u4F18\u5148\u7EA7\u6700\u9AD8\uFF0C\u4E0D\u4F1A\u88AB\u540E\u52A0\u8F7D\u7684\u503C\u4FEE\u6539</li><li>\u914D\u7F6E\u6587\u4EF6\u7684\u52A0\u8F7D\u987A\u5E8F\u662F\uFF08\u4EE5<code>prod</code>\u73AF\u5883\u4E3A\u4F8B\uFF09\uFF1A<br> 1. \u52A0\u8F7D<code>app-prod-local.yml</code>\u6587\u4EF6<br> 2. \u5F53\u73AF\u5883\u53D8\u91CF<code>GDD_ENV</code>\u7684\u503C<strong>\u4E0D</strong>\u7B49\u4E8E<code>test</code>\u65F6\uFF0C\u52A0\u8F7D<code>app-local.yml</code>\u6587\u4EF6<br> 3. \u52A0\u8F7D<code>app-prod.yml</code>\u6587\u4EF6<br> 4. \u52A0\u8F7D<code>app.yml</code>\u6587\u4EF6</li></ol><p><strong>\u6CE8\u610F</strong>\uFF1A\u524D\u7F00\u5FC5\u987B\u662F<code>app</code></p><h2 id="\u8FDC\u7A0B\u914D\u7F6E\u65B9\u6848" tabindex="-1"><a class="header-anchor" href="#\u8FDC\u7A0B\u914D\u7F6E\u65B9\u6848" aria-hidden="true">#</a> \u8FDC\u7A0B\u914D\u7F6E\u65B9\u6848</h2><p>Go-doudou\u5185\u5EFA\u652F\u6301\u4E24\u79CD\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u65B9\u6848\uFF1A\u963F\u91CC\u7684Nacos\u548C\u643A\u7A0B\u7684Apollo\u3002\u652F\u6301\u5728\u670D\u52A1\u542F\u52A8\u65F6\u52A0\u8F7D\uFF0C\u4E5F\u652F\u6301\u81EA\u5B9A\u4E49\u76D1\u542C\u51FD\u6570\u76D1\u542C\u914D\u7F6E\u53D8\u5316\u3002</p><p>\u5F00\u542F\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\uFF0C\u9700\u5728\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u4E2D\u914D\u7F6E\u4EE5\u4E0B\u73AF\u5883\u53D8\u91CF\uFF1A</p><ul><li><code>GDD_CONFIG_REMOTE_TYPE</code>: \u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u540D\u79F0\uFF0C\u53EF\u9009\u9879\uFF1A<code>nacos</code>\uFF0C<code>apollo</code></li></ul><div class="custom-container tip"><p class="custom-container-title">\u63D0\u793A</p><p>Go-doudou\u6846\u67B6\u5C42\u7684\u914D\u7F6E\uFF08\u5373\u4EE5<code>GDD_</code>\u4E3A\u524D\u7F00\u7684\u914D\u7F6E\uFF09\u4E2D\u6709\u4E00\u90E8\u5206 <a href="#%E6%9C%8D%E5%8A%A1%E9%85%8D%E7%BD%AE">\u670D\u52A1\u914D\u7F6E</a> \u548C <a href="#memberlist%E9%85%8D%E7%BD%AE">Memberlist\u914D\u7F6E</a> \u652F\u6301\u901A\u8FC7\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u5728\u8FD0\u884C\u65F6\u52A8\u6001\u4FEE\u6539\uFF0C\u8FD0\u884C\u65F6\u52A8\u6001\u4FEE\u6539\u7684\u914D\u7F6E\u4F18\u5148\u7EA7\u6700\u9AD8\uFF0C\u4F1A\u5C06\u670D\u52A1\u542F\u52A8\u65F6\u4ECE\u547D\u4EE4\u884C\u7EC8\u7AEF\u3001<code>Dockerfile</code>\u6587\u4EF6\u3001k8s\u914D\u7F6E\u6587\u4EF6\u3001\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u548C\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u52A0\u8F7D\u7684\u914D\u7F6E\u90FD\u8986\u76D6\u6389\u3002</p></div><h3 id="nacos\u914D\u7F6E\u4E2D\u5FC3" tabindex="-1"><a class="header-anchor" href="#nacos\u914D\u7F6E\u4E2D\u5FC3" aria-hidden="true">#</a> Nacos\u914D\u7F6E\u4E2D\u5FC3</h3><p>Go-doudou\u670D\u52A1\u542F\u52A8\u65F6\u4F1A\u81EA\u52A8\u4ECENacos\u52A0\u8F7D\u914D\u7F6E\uFF0C\u53EA\u9700\u8981\u5728\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u91CC\u914D\u7F6E\u4E00\u4E9B\u53C2\u6570\u5373\u53EF\uFF0C\u53EF\u4EE5\u8BF4\u662F\u5F00\u7BB1\u5373\u7528\u7684\u3002</p><ul><li><code>GDD_NACOS_NAMESPACE_ID</code>: Nacos namespaceId\uFF0C\u975E\u5FC5\u987B</li><li><code>GDD_NACOS_SERVER_ADDR</code>: Nacos\u670D\u52A1\u7AEF\u8FDE\u63A5\u5730\u5740\uFF0C\u5FC5\u987B</li><li><code>GDD_NACOS_CONFIG_FORMAT</code>: \u914D\u7F6E\u7684\u683C\u5F0F\uFF0C\u53EF\u9009\u9879\uFF1A<code>dotenv</code>\uFF0C<code>yaml</code>\uFF0C\u9ED8\u8BA4\u503C\u662F<code>dotenv</code></li><li><code>GDD_NACOS_CONFIG_GROUP</code>: Nacos group\uFF0C\u9ED8\u8BA4\u503C\u662F<code>DEFAULT_GROUP</code></li><li><code>GDD_NACOS_CONFIG_DATAID</code>: Nacos dataId\uFF0C\u5FC5\u987B\uFF0C\u591A\u4E2AdataId\u7528\u82F1\u6587\u9017\u53F7\u9694\u5F00\uFF0C\u914D\u7F6E\u91CC\u7684\u987A\u5E8F\u5C31\u662F\u5B9E\u9645\u52A0\u8F7D\u987A\u5E8F\uFF0C\u9075\u5FAA\u5148\u52A0\u8F7D\u7684\u914D\u7F6E\u4F18\u5148\u7EA7\u6700\u9AD8\u7684\u89C4\u5219</li></ul><p><code>configmgr</code>\u5305\u91CC\u63D0\u4F9B\u4E86\u5BF9\u5916\u5BFC\u51FA\u7684\u4E0ENacos\u914D\u7F6E\u4E2D\u5FC3\u4EA4\u4E92\u7684\u5355\u4F8B<code>NacosClient</code>\uFF0C\u53EF\u4EE5\u8C03\u7528<code>AddChangeListener</code>\u65B9\u6CD5\u6DFB\u52A0\u81EA\u5B9A\u4E49\u7684\u76D1\u542C\u51FD\u6570\u3002\u7528\u6CD5\u793A\u4F8B\uFF1A</p><div class="language-go ext-go line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">func</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">	...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">	</span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> configmgr.NacosClient != </span><span style="color:#569CD6;">nil</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">		configmgr.NacosClient.</span><span style="color:#DCDCAA;">AddChangeListener</span><span style="color:#D4D4D4;">(configmgr.NacosConfigListenerParam{</span></span>
<span class="line"><span style="color:#D4D4D4;">			DataId: </span><span style="color:#CE9178;">&quot;statsvc-dev&quot;</span><span style="color:#D4D4D4;">,</span></span>
<span class="line"><span style="color:#D4D4D4;">			OnChange: </span><span style="color:#569CD6;">func</span><span style="color:#D4D4D4;">(event *configmgr.NacosChangeEvent) {</span></span>
<span class="line"><span style="color:#D4D4D4;">				fmt.</span><span style="color:#DCDCAA;">Println</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;group:&quot;</span><span style="color:#D4D4D4;"> + event.Group + </span><span style="color:#CE9178;">&quot;, dataId:&quot;</span><span style="color:#D4D4D4;"> + event.DataId + fmt.</span><span style="color:#DCDCAA;">Sprintf</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;, changes: </span><span style="color:#9CDCFE;">%+v</span><span style="color:#D7BA7D;">\\n</span><span style="color:#CE9178;">&quot;</span><span style="color:#D4D4D4;">, event.Changes))</span></span>
<span class="line"><span style="color:#D4D4D4;">			},</span></span>
<span class="line"><span style="color:#D4D4D4;">		})</span></span>
<span class="line"><span style="color:#D4D4D4;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">	...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">	srv.</span><span style="color:#DCDCAA;">Run</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h3 id="apollo\u914D\u7F6E\u4E2D\u5FC3" tabindex="-1"><a class="header-anchor" href="#apollo\u914D\u7F6E\u4E2D\u5FC3" aria-hidden="true">#</a> Apollo\u914D\u7F6E\u4E2D\u5FC3</h3><p>Go-doudou\u670D\u52A1\u542F\u52A8\u65F6\u4F1A\u81EA\u52A8\u4ECEApollo\u52A0\u8F7D\u914D\u7F6E\uFF0C\u53EA\u9700\u8981\u5728\u672C\u5730\u914D\u7F6E\u6587\u4EF6\u91CC\u914D\u7F6E\u4E00\u4E9B\u53C2\u6570\u5373\u53EF\uFF0C\u53EF\u4EE5\u8BF4\u662F\u5F00\u7BB1\u5373\u7528\u7684\u3002</p><ul><li><code>GDD_APOLLO_CLUSTER</code>: Apollo cluster\uFF0C\u9ED8\u8BA4\u503C\u662F<code>default</code></li><li><code>GDD_APOLLO_ADDR</code>: Apollo\u670D\u52A1\u7AEF\u8FDE\u63A5\u5730\u5740\uFF0C\u5FC5\u987B</li><li><code>GDD_APOLLO_NAMESPACE</code>: Apollo namespace\uFF0C\u76F8\u5F53\u4E8ENacos\u7684dataId\uFF0C\u9ED8\u8BA4\u503C\u662F<code>application.properties</code>\uFF0C\u591A\u4E2Anamespace\u7528\u82F1\u6587\u9017\u53F7\u9694\u5F00\uFF0C\u914D\u7F6E\u91CC\u7684\u987A\u5E8F\u5C31\u662F\u5B9E\u9645\u52A0\u8F7D\u987A\u5E8F\uFF0C\u9075\u5FAA\u5148\u52A0\u8F7D\u7684\u914D\u7F6E\u4F18\u5148\u7EA7\u6700\u9AD8\u7684\u89C4\u5219</li><li><code>GDD_APOLLO_SECRET</code>: Apollo\u914D\u7F6E\u5BC6\u94A5\uFF0C\u975E\u5FC5\u987B</li></ul><p><code>configmgr</code>\u5305\u91CC\u63D0\u4F9B\u4E86\u5BF9\u5916\u5BFC\u51FA\u7684\u4E0EApollo\u914D\u7F6E\u4E2D\u5FC3\u4EA4\u4E92\u7684\u5355\u4F8B<code>ApolloClient</code>\uFF0C\u53EF\u4EE5\u8C03\u7528<code>AddChangeListener</code>\u65B9\u6CD5\u6DFB\u52A0\u81EA\u5B9A\u4E49\u7684\u76D1\u542C\u51FD\u6570\u3002\u7528\u6CD5\u793A\u4F8B\uFF1A</p><div class="language-go ext-go line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#569CD6;">type</span><span style="color:#D4D4D4;"> </span><span style="color:#4EC9B0;">ConfigChangeListener</span><span style="color:#D4D4D4;"> </span><span style="color:#569CD6;">struct</span><span style="color:#D4D4D4;"> {</span></span>
<span class="line"><span style="color:#D4D4D4;">	configmgr.BaseApolloListener</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">func</span><span style="color:#D4D4D4;"> (c *ConfigChangeListener) </span><span style="color:#DCDCAA;">OnChange</span><span style="color:#D4D4D4;">(event *storage.ChangeEvent) {</span></span>
<span class="line"><span style="color:#D4D4D4;">	c.Lock.</span><span style="color:#DCDCAA;">Lock</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">	</span><span style="color:#C586C0;">defer</span><span style="color:#D4D4D4;"> c.Lock.</span><span style="color:#DCDCAA;">Unlock</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">	</span><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> !c.SkippedFirstEvent {</span></span>
<span class="line"><span style="color:#D4D4D4;">		</span><span style="color:#9CDCFE;">c.SkippedFirstEvent</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">true</span></span>
<span class="line"><span style="color:#D4D4D4;">		</span><span style="color:#C586C0;">return</span></span>
<span class="line"><span style="color:#D4D4D4;">	}</span></span>
<span class="line"><span style="color:#D4D4D4;">	logger.</span><span style="color:#DCDCAA;">Info</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;from OnChange&quot;</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">	fmt.</span><span style="color:#DCDCAA;">Println</span><span style="color:#D4D4D4;">(event.Changes)</span></span>
<span class="line"><span style="color:#D4D4D4;">	</span><span style="color:#C586C0;">for</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">key</span><span style="color:#D4D4D4;">, </span><span style="color:#9CDCFE;">value</span><span style="color:#D4D4D4;"> := </span><span style="color:#C586C0;">range</span><span style="color:#D4D4D4;"> event.Changes {</span></span>
<span class="line"><span style="color:#D4D4D4;">		fmt.</span><span style="color:#DCDCAA;">Println</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;change key : &quot;</span><span style="color:#D4D4D4;">, key, </span><span style="color:#CE9178;">&quot;, value :&quot;</span><span style="color:#D4D4D4;">, value)</span></span>
<span class="line"><span style="color:#D4D4D4;">	}</span></span>
<span class="line"><span style="color:#D4D4D4;">	fmt.</span><span style="color:#DCDCAA;">Println</span><span style="color:#D4D4D4;">(event.Namespace)</span></span>
<span class="line"><span style="color:#D4D4D4;">	logger.</span><span style="color:#DCDCAA;">Info</span><span style="color:#D4D4D4;">(</span><span style="color:#CE9178;">&quot;from OnChange end&quot;</span><span style="color:#D4D4D4;">)</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#569CD6;">func</span><span style="color:#D4D4D4;"> </span><span style="color:#DCDCAA;">main</span><span style="color:#D4D4D4;">() {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">    ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">	</span><span style="color:#569CD6;">var</span><span style="color:#D4D4D4;"> </span><span style="color:#9CDCFE;">listener</span><span style="color:#D4D4D4;"> ConfigChangeListener</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">	configmgr.ApolloClient.</span><span style="color:#DCDCAA;">AddChangeListener</span><span style="color:#D4D4D4;">(&amp;listener)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">    ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">	srv.</span><span style="color:#DCDCAA;">Run</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br></div></div><p>\u9700\u8981\u8865\u5145\u8BF4\u660E\u7684\u662F\uFF1A\u9996\u6B21\u52A0\u8F7D\u914D\u7F6E\u7684\u4E8B\u4EF6\u4E5F\u4F1A\u88AB\u81EA\u5B9A\u4E49\u76D1\u542C\u51FD\u6570\u76D1\u542C\u5230\uFF0C\u5982\u679C\u9700\u8981\u8DF3\u8FC7\u7B2C\u4E00\u6B21\uFF0C\u9700\u8981&quot;\u7EE7\u627F&quot;<code>configmgr</code>\u5305\u63D0\u4F9B\u7684<code>BaseApolloListener</code>\u7ED3\u6784\u4F53\uFF0C\u7136\u540E\u5728<code>OnChange</code>\u51FD\u6570\u7684\u5F00\u5934\u52A0\u4E0A\u5982\u4E0B\u4EE3\u7801</p><div class="language-go ext-go line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">c.Lock.</span><span style="color:#DCDCAA;">Lock</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#C586C0;">defer</span><span style="color:#D4D4D4;"> c.Lock.</span><span style="color:#DCDCAA;">Unlock</span><span style="color:#D4D4D4;">()</span></span>
<span class="line"><span style="color:#C586C0;">if</span><span style="color:#D4D4D4;"> !c.SkippedFirstEvent {</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#9CDCFE;">c.SkippedFirstEvent</span><span style="color:#D4D4D4;"> = </span><span style="color:#569CD6;">true</span></span>
<span class="line"><span style="color:#D4D4D4;">  </span><span style="color:#C586C0;">return</span></span>
<span class="line"><span style="color:#D4D4D4;">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h2 id="\u670D\u52A1\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#\u670D\u52A1\u914D\u7F6E" aria-hidden="true">#</a> \u670D\u52A1\u914D\u7F6E</h2><p>\u8868\u683C\u4E2D\u52A0\u7EA2\u8272\u661F\u53F7\u7684\u914D\u7F6E\u662F\u7531go-doudou\u5728\u8FD0\u884C\u65F6\u76D1\u542C\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u7684\u914D\u7F6E\u53D8\u5316\u52A8\u6001\u4FEE\u6539\u7684\u3002</p><table><thead><tr><th>\u73AF\u5883\u53D8\u91CF\u540D</th><th>\u63CF\u8FF0</th><th>\u9ED8\u8BA4\u503C</th><th>\u662F\u5426\u5FC5\u987B</th></tr></thead><tbody><tr><td>GDD_BANNER</td><td>\u662F\u5426\u5F00\u542Fbanner</td><td>true</td><td></td></tr><tr><td>GDD_BANNER_TEXT</td><td>banner\u6587\u5B57</td><td>Go-doudou</td><td></td></tr><tr><td>GDD_LOG_LEVEL</td><td>\u65E5\u5FD7\u7B49\u7EA7\uFF0C\u53EF\u9009\u9879\uFF1A<code>panic</code>, <code>fatal</code>, <code>error</code>, <code>warn</code>, <code>warning</code>, <code>info</code>, <code>debug</code>, <code>trace</code></td><td>info</td><td></td></tr><tr><td>GDD_LOG_FORMAT</td><td>\u65E5\u5FD7\u683C\u5F0F\uFF0C\u53EF\u9009\u9879\uFF1A<code>text</code>, <code>json</code></td><td>text</td><td></td></tr><tr><td>GDD_LOG_REQ_ENABLE</td><td>\u662F\u5426\u5F00\u542Fhttp\u8BF7\u6C42\u4F53\u548C\u54CD\u5E94\u4F53\u65E5\u5FD7</td><td>false</td><td></td></tr><tr><td>GDD_GRACE_TIMEOUT</td><td>\u4F18\u96C5\u4E0B\u7EBF\u7684\u8D85\u65F6\u65F6\u95F4</td><td>15s</td><td></td></tr><tr><td>GDD_WRITE_TIMEOUT</td><td>http\u8FDE\u63A5\u7684\u5199\u8D85\u65F6\u65F6\u95F4</td><td>15s</td><td></td></tr><tr><td>GDD_READ_TIMEOUT</td><td>http\u8FDE\u63A5\u7684\u8BFB\u8D85\u65F6\u65F6\u95F4</td><td>15s</td><td></td></tr><tr><td>GDD_IDLE_TIMEOUT</td><td>http\u8FDE\u63A5\u7684\u7A7A\u95F2\u8D85\u65F6\u65F6\u95F4</td><td>60s</td><td></td></tr><tr><td>GDD_ROUTE_ROOT_PATH</td><td>http\u8BF7\u6C42\u8DEF\u5F84\u524D\u7F00</td><td></td><td></td></tr><tr><td>GDD_SERVICE_NAME</td><td>\u670D\u52A1\u540D</td><td></td><td>\u5FC5\u987B</td></tr><tr><td>GDD_HOST</td><td>http\u670D\u52A1\u5668\u76D1\u542C\u5730\u5740</td><td></td><td></td></tr><tr><td>GDD_PORT</td><td>http\u670D\u52A1\u5668\u76D1\u542C\u7AEF\u53E3</td><td>6060</td><td></td></tr><tr><td>GDD_RETRY_COUNT</td><td>\u5BA2\u6237\u7AEF\u8BF7\u6C42\u91CD\u8BD5\u6B21\u6570</td><td>0</td><td></td></tr><tr><td>GDD_MANAGE_ENABLE</td><td>\u662F\u5426\u5F00\u542F\u5185\u5EFAhttp\u63A5\u53E3\uFF1A<code>/go-doudou/doc</code>, <code>/go-doudou/openapi.json</code>, <code>/go-doudou/prometheus</code>, <code>/go-doudou/registry</code>, <code>/go-doudou/config</code></td><td>true</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MANAGE_USER</td><td>\u5185\u5EFAhttp\u63A5\u53E3\u7684http basic\u6821\u9A8C\u7528\u6237\u540D</td><td>admin</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MANAGE_PASS</td><td>\u5185\u5EFAhttp\u63A5\u53E3\u7684http basic\u6821\u9A8C\u5BC6\u7801</td><td>admin</td><td></td></tr><tr><td>GDD_TRACING_METRICS_ROOT</td><td>jaeger\u8C03\u7528\u94FE\u76D1\u63A7\u7684<code>metrics root</code></td><td>Go-doudou</td><td></td></tr><tr><td>GDD_WEIGHT</td><td>\u670D\u52A1\u5B9E\u4F8B\u7684\u6743\u91CD</td><td>1</td><td></td></tr><tr><td>GDD_SERVICE_DISCOVERY_MODE</td><td>\u670D\u52A1\u53D1\u73B0\u6A21\u5F0F\uFF0C\u53EF\u9009\u9879\uFF1A<code>memberlist</code>, <code>nacos</code></td><td>memberlist</td><td></td></tr><tr><td>GDD_ENABLE_RESPONSE_GZIP</td><td>\u5F00\u542Fhttp\u54CD\u5E94\u4F53gzip\u538B\u7F29</td><td>true</td><td></td></tr></tbody></table><h2 id="memberlist\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#memberlist\u914D\u7F6E" aria-hidden="true">#</a> Memberlist\u914D\u7F6E</h2><p>\u8868\u683C\u4E2D\u52A0\u7EA2\u8272\u661F\u53F7\u7684\u914D\u7F6E\u662F\u7531go-doudou\u5728\u8FD0\u884C\u65F6\u76D1\u542C\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u7684\u914D\u7F6E\u53D8\u5316\u52A8\u6001\u4FEE\u6539\u7684\uFF0C\u8FD9\u4E9B\u914D\u7F6E\u5747\u662F\u7528\u6765\u8C03\u6574Gossip\u6D88\u606F\u4F20\u64AD\u901F\u5EA6\u7684\uFF08\u4E5F\u5C31\u662F\u5FAE\u670D\u52A1\u5404\u5B9E\u4F8B\u5185\u5B58\u4E2D\u7F13\u5B58\u7684\u670D\u52A1\u5217\u8868\u8D8B\u4E8E\u4E00\u81F4\u7684\u901F\u5EA6\uFF09\u3002</p><table><thead><tr><th>\u73AF\u5883\u53D8\u91CF\u540D</th><th>\u63CF\u8FF0</th><th>\u9ED8\u8BA4\u503C</th><th>\u662F\u5426\u5FC5\u987B</th></tr></thead><tbody><tr><td>GDD_MEM_SEED</td><td>memberlist\u96C6\u7FA4\u7684\u79CD\u5B50\u5730\u5740\uFF0C\u591A\u4E2A\u5730\u5740\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694\uFF0C\u5982\u679C\u4E0D\u8BBE\u7F6E\uFF0C\u5219\u4E0D\u52A0\u5165\u4EFB\u4F55\u96C6\u7FA4</td><td></td><td></td></tr><tr><td>GDD_MEM_NAME</td><td>\u4EC5\u7528\u4E8E\u5F00\u53D1\u548C\u6D4B\u8BD5\uFF0C\u5B9E\u4F8B\u7684\u540D\u79F0\uFF0C\u8BE5\u540D\u79F0\u5FC5\u987B\u4FDD\u8BC1\u5728\u96C6\u7FA4\u4E2D\u552F\u4E00\u3002\u5982\u679C\u4E0D\u8BBE\u7F6E\uFF0C\u9ED8\u8BA4\u503C\u53D6\u4E3B\u673A\u540D</td><td></td><td></td></tr><tr><td>GDD_MEM_HOST</td><td>\u96C6\u7FA4\u4E2D\u5176\u4ED6\u5B9E\u4F8B\u5BF9\u8BE5\u5B9E\u4F8B\u7684\u8BBF\u95EE\u5730\u5740\uFF0C\u9ED8\u8BA4\u503C\u53D6\u4E3B\u673A\u7684\u79C1\u6709IP</td><td></td><td></td></tr><tr><td>GDD_MEM_PORT</td><td>\u5B9E\u4F8B\u7684\u76D1\u542C\u7AEF\u53E3</td><td>7946</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_DEAD_TIMEOUT</td><td>\u5728\u73AF\u5883\u53D8\u91CF<code>GDD_MEM_DEAD_TIMEOUT</code>\u6307\u5B9A\u7684\u8D85\u65F6\u65F6\u95F4\u5185\u4ECD\u672A\u6536\u5230\u79BB\u7EBF\u5B9E\u4F8B\u7684\u8868\u793A\u4ECD\u5728\u7EBF\u7684\u6D88\u606F\uFF0C\u5219\u4ECE\u5B9E\u4F8B\u5217\u8868\u4E2D\u5220\u9664\u8BE5\u5B9E\u4F8B</td><td>60s</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_SYNC_INTERVAL</td><td>\u53D1\u8D77\u540C\u6B65\u5B9E\u4F8B\u5217\u8868\u7684TCP\u8BF7\u6C42\u7684\u95F4\u9694\u65F6\u95F4</td><td>60s</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_RECLAIM_TIMEOUT</td><td>\u8D85\u8FC7\u6B64\u73AF\u5883\u53D8\u91CF\u8BBE\u7F6E\u7684\u8D85\u65F6\u65F6\u95F4\uFF0C\u79BB\u7EBF\u5B9E\u4F8B\u4F1A\u88AB\u5177\u6709\u76F8\u540C\u540D\u5B57\u4F46\u4E0D\u540C\u5730\u5740\u7684\u5B9E\u4F8B\u6362\u6389\u3002\u5982\u679C\u672A\u5230\u8D85\u65F6\u65F6\u95F4\uFF0C\u8BE5\u65B0\u5B9E\u4F8B\u4F1A\u59CB\u7EC8\u88AB\u62D2\u7EDD\u52A0\u5165\u96C6\u7FA4</td><td>3s</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_PROBE_INTERVAL</td><td>\u53D1\u8D77\u5B9E\u4F8B\u63A2\u6D3B\u7684UDP\u8BF7\u6C42\u7684\u95F4\u9694\u65F6\u95F4</td><td>5s</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_PROBE_TIMEOUT</td><td>\u5355\u6B21\u5B9E\u4F8B\u63A2\u6D3B\u7684\u8D85\u65F6\u65F6\u95F4</td><td>3s</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_SUSPICION_MULT</td><td>\u8BA1\u7B97\u5BA3\u544A\u7591\u4F3C\u79BB\u7EBF\u5B9E\u4F8B\u5DF2\u79BB\u7EBF\u7684\u8D85\u65F6\u65F6\u95F4\u7684\u7CFB\u6570</td><td>6</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_RETRANSMIT_MULT</td><td>\u8BA1\u7B97\u4E00\u6761\u6D88\u606F\u6700\u591A\u53D1\u9001\u591A\u5C11\u6B21\u7684\u7CFB\u6570</td><td>4</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_GOSSIP_NODES</td><td>\u5B9A\u65F6\u53D1\u9001UDP\u6D88\u606F\u7684\u5355\u6B21\u76EE\u6807\u5B9E\u4F8B\u6570\u91CF</td><td>4</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_GOSSIP_INTERVAL</td><td>\u5B9A\u65F6\u53D1\u9001UDP\u6D88\u606F\u7684\u95F4\u9694\u65F6\u95F4</td><td>500ms</td><td></td></tr><tr><td><span style="color:red;font-weight:bold;">*</span>GDD_MEM_INDIRECT_CHECKS</td><td>\u5982\u679CUDP\u63A2\u6D3B\u5931\u8D25\uFF0C\u5E2E\u52A9\u8BE5\u5B9E\u4F8B\u505A\u95F4\u63A5\u63A2\u6D3B\u7684\u5176\u4ED6\u5B9E\u4F8B\u7684\u6570\u91CF</td><td>3</td><td></td></tr><tr><td>GDD_MEM_TCP_TIMEOUT</td><td>\u5355\u6B21TCP\u8BF7\u6C42\u7684\u8D85\u65F6\u65F6\u95F4</td><td>30s</td><td></td></tr><tr><td>GDD_MEM_WEIGHT</td><td><code>\u5DF2\u5E9F\u5F03</code>\u5BA2\u6237\u7AEF\u5E73\u6ED1\u52A0\u6743\u8D1F\u8F7D\u5747\u8861\u7B97\u6CD5\u6240\u9700\u8981\u7684\u5B9E\u4F8B\u6743\u91CD\uFF0C\u8BF7\u7528<code>GDD_WEIGHT</code></td><td>0</td><td></td></tr><tr><td>GDD_MEM_WEIGHT_INTERVAL</td><td>\u7A0B\u5E8F\u81EA\u52A8\u8BA1\u7B97\u5F53\u524D\u5B9E\u4F8B\u6743\u91CD\u503C\u5E76\u53D1\u51FAUDP\u6D88\u606F\u7684\u95F4\u9694\u65F6\u95F4\uFF0C\u9ED8\u8BA4\u503C\u4E3A<code>0s</code>\uFF0C\u5373\u9ED8\u8BA4\u7981\u7528\u8BE5\u529F\u80FD\uFF0C\u5B9E\u4F8B\u6743\u91CD\u53D6<code>GDD_WEIGHT</code>\uFF0C\u82E5\u672A\u8BBE\u7F6E\uFF0C\u5219\u53D6<code>GDD_MEM_WEIGHT</code>\uFF0C\u82E5\u4E5F\u672A\u8BBE\u7F6E\uFF0C\u5219\u53D6\u9ED8\u8BA4\u503C<code>1</code></td><td>0s</td><td></td></tr><tr><td>GDD_MEM_LOG_DISABLE</td><td>\u662F\u5426\u5173\u95EDmemberlist\u65E5\u5FD7</td><td>false</td><td></td></tr><tr><td>GDD_MEM_CIDRS_ALLOWED</td><td>\u5982\u679C\u672A\u8BBE\u7F6E\uFF0C\u5219\u653E\u884C\u6240\u6709\u5B9E\u4F8B\u53D1\u6765\u7684\u8BF7\u6C42\u3002\u5982\u679C\u8BBE\u7F6E\uFF0C\u5219\u53EA\u5141\u8BB8\u7B26\u5408\u6761\u4EF6\u7684\u5B9E\u4F8B\u7684\u8BF7\u6C42\u901A\u8FC7\u3002\u793A\u4F8B\uFF1A<code>GDD_MEM_CIDRS_ALLOWED=172.28.0.0/16</code></td><td></td><td></td></tr></tbody></table><h2 id="nacos\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#nacos\u914D\u7F6E" aria-hidden="true">#</a> Nacos\u914D\u7F6E</h2><table><thead><tr><th>\u73AF\u5883\u53D8\u91CF\u540D</th><th>\u63CF\u8FF0</th><th>\u9ED8\u8BA4\u503C</th><th>\u662F\u5426\u5FC5\u987B</th></tr></thead><tbody><tr><td>GDD_NACOS_NAMESPACE_ID</td><td>\u547D\u540D\u7A7A\u95F4</td><td>public</td><td></td></tr><tr><td>GDD_NACOS_TIMEOUT_MS</td><td>\u8BF7\u6C42\u8D85\u65F6\u65F6\u95F4\uFF0C\u5355\u4F4D\u6BEB\u79D2</td><td>10000</td><td></td></tr><tr><td>GDD_NACOS_NOT_LOAD_CACHE_AT_START</td><td>\u7A0B\u5E8F\u542F\u52A8\u65F6\u662F\u5426\u4ECE\u78C1\u76D8\u7F13\u5B58\u4E2D\u52A0\u8F7D\u670D\u52A1\u5217\u8868</td><td>false</td><td></td></tr><tr><td>GDD_NACOS_LOG_DIR</td><td>\u65E5\u5FD7\u76EE\u5F55\u5730\u5740</td><td>/tmp/nacos/log</td><td></td></tr><tr><td>GDD_NACOS_CACHE_DIR</td><td>\u670D\u52A1\u5217\u8868\u78C1\u76D8\u7F13\u5B58\u5730\u5740</td><td>/tmp/nacos/cache</td><td></td></tr><tr><td>GDD_NACOS_LOG_LEVEL</td><td>\u65E5\u5FD7\u7B49\u7EA7\uFF0C\u53EF\u9009\u9879\uFF1A<code>debug</code>,<code>info</code>,<code>warn</code>,<code>error</code></td><td>info</td><td></td></tr><tr><td>GDD_NACOS_SERVER_ADDR</td><td>Nacos\u670D\u52A1\u5668\u8FDE\u63A5\u5730\u5740\uFF0C\u591A\u4E2A\u5730\u5740\u7528\u82F1\u6587\u9017\u53F7\u5206\u9694</td><td></td><td></td></tr><tr><td>GDD_NACOS_REGISTER_HOST</td><td>\u670D\u52A1\u5B9E\u4F8B\u7684\u6CE8\u518C\u5730\u5740\uFF0C\u9ED8\u8BA4\u503C\u53D6\u4E3B\u673A\u7684\u79C1\u6709IP</td><td></td><td></td></tr><tr><td>GDD_NACOS_CONFIG_FORMAT</td><td>\u914D\u7F6E\u7684\u6570\u636E\u683C\u5F0F\uFF0C\u652F\u6301\uFF1A<code>dotenv</code>, <code>yaml</code></td><td>dotenv</td><td></td></tr><tr><td>GDD_NACOS_CONFIG_GROUP</td><td>\u914D\u7F6Egroup</td><td>DEFAULT_GROUP</td><td></td></tr><tr><td>GDD_NACOS_CONFIG_DATAID</td><td>\u914D\u7F6EdataId</td><td></td><td>\u5FC5\u987B</td></tr></tbody></table><h2 id="apollo\u914D\u7F6E" tabindex="-1"><a class="header-anchor" href="#apollo\u914D\u7F6E" aria-hidden="true">#</a> Apollo\u914D\u7F6E</h2><table><thead><tr><th>\u73AF\u5883\u53D8\u91CF\u540D</th><th>\u63CF\u8FF0</th><th>\u9ED8\u8BA4\u503C</th><th>\u662F\u5426\u5FC5\u987B</th></tr></thead><tbody><tr><td>GDD_APOLLO_CLUSTER</td><td>apollo\u96C6\u7FA4</td><td>default</td><td></td></tr><tr><td>GDD_APOLLO_ADDR</td><td>apollo\u914D\u7F6E\u670D\u52A1\u8FDE\u63A5\u5730\u5740</td><td></td><td>\u5FC5\u987B</td></tr><tr><td>GDD_APOLLO_NAMESPACE</td><td>apollo\u547D\u540D\u7A7A\u95F4</td><td>application.properties</td><td></td></tr><tr><td>GDD_APOLLO_BACKUP_ENABLE</td><td>\u5F00\u542F\u5728\u672C\u5730\u78C1\u76D8\u7F13\u5B58\u914D\u7F6E</td><td>true</td><td></td></tr><tr><td>GDD_APOLLO_BACKUP_PATH</td><td>\u914D\u7F6E\u7F13\u5B58\u6587\u4EF6\u5939\u8DEF\u5F84</td><td></td><td></td></tr><tr><td>GDD_APOLLO_MUSTSTART</td><td>\u5982\u679C\u914D\u7F6E\u670D\u52A1\u8FDE\u63A5\u5931\u8D25\uFF0C\u7ACB\u523B\u8FD4\u56DE\u9519\u8BEF</td><td>false</td><td></td></tr><tr><td>GDD_APOLLO_SECRET</td><td>apollo\u914D\u7F6E\u7684\u5BC6\u94A5</td><td></td><td></td></tr><tr><td>GDD_APOLLO_LOG_ENABLE</td><td>\u5F00\u542Fapollo\u65E5\u5FD7\u6253\u5370</td><td>false</td><td></td></tr></tbody></table>`,43);function d(e,o){return a}var r=s(n,[["render",d]]);export{r as default};
