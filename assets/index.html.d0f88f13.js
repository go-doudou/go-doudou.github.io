import{r as p,o as e,a as o,b as s,e as l,F as r,f as n,g as c}from"./app.2025f35b.js";import{_ as i}from"./plugin-vue_export-helper.21dcd24c.js";const t={},D=s("h1",{id:"\u8D21\u732E",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#\u8D21\u732E","aria-hidden":"true"},"#"),n(" \u8D21\u732E")],-1),b=s("h2",{id:"\u4EE3\u7801\u4ED3\u5E93",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#\u4EE3\u7801\u4ED3\u5E93","aria-hidden":"true"},"#"),n(" \u4EE3\u7801\u4ED3\u5E93")],-1),u=n("Github\uFF1A"),m={href:"https://github.com/unionj-cloud/go-doudou",target:"_blank",rel:"noopener noreferrer"},d=n("https://github.com/unionj-cloud/go-doudou"),y=n("\u7801\u4E91\uFF1A"),g={href:"https://gitee.com/unionj-cloud/go-doudou",target:"_blank",rel:"noopener noreferrer"},h=n("https://gitee.com/unionj-cloud/go-doudou"),_=c(`<h2 id="\u9879\u76EE\u7ED3\u6784" tabindex="-1"><a class="header-anchor" href="#\u9879\u76EE\u7ED3\u6784" aria-hidden="true">#</a> \u9879\u76EE\u7ED3\u6784</h2><p>go-doudou\u7531\u4E09\u4E2A\u5305\u6784\u6210\uFF1A</p><ul><li><code>cmd</code>: \u8D1F\u8D23<code>go-doudou</code>\u547D\u4EE4\u884C\u5DE5\u5177\u548C\u4EE3\u7801\u751F\u6210\u5668</li><li><code>framework</code>: \u8D1F\u8D23REST/gRPC\u6846\u67B6</li><li><code>toolkit</code>: \u8D1F\u8D23\u5DE5\u5177\u7BB1</li></ul><h3 id="cmd\u5305" tabindex="-1"><a class="header-anchor" href="#cmd\u5305" aria-hidden="true">#</a> <code>cmd</code>\u5305</h3><p>\u5404\u6838\u5FC3\u6587\u4EF6\u548C\u6587\u4EF6\u5939\u7684\u8BF4\u660E\u8BF7\u53C2\u8003\u4E0B\u9762\u7684\u6CE8\u91CA\u3002</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">\u279C  cmd git:(main) tree -L 2</span></span>
<span class="line"><span style="color:#DCDCAA;">.</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 client.go  </span><span style="color:#6A9955;"># go-doudou svc http client \u547D\u4EE4\uFF0C\u76F4\u63A5\u4ECEOpenAPI 3.0 json\u6587\u6863\u751F\u6210go\u8BED\u8A00http\u8BF7\u6C42\u5BA2\u6237\u7AEF</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 client_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ddl.go  </span><span style="color:#6A9955;"># go-doudou ddl \u547D\u4EE4\uFF0C\u540C\u6B65\u6570\u636E\u5E93\u8868\u7ED3\u6784\u548Cdomain\u5305\u91CC\u7684\u7ED3\u6784\u4F53\uFF0C\u751F\u6210dao\u5C42\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ddl_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 deploy.go  </span><span style="color:#6A9955;"># go-doudou svc deploy \u547D\u4EE4\uFF0C\u90E8\u7F72\u5230k8s\u96C6\u7FA4\u547D\u4EE4</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 deploy_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 http.go  </span><span style="color:#6A9955;"># go-doudou svc http \u547D\u4EE4\uFF0C\u751F\u6210RESTful\u670D\u52A1\u6240\u9700\u5168\u5957\u4EE3\u7801\uFF0C\u5305\u62EC\u4F46\u4E0D\u9650\u4E8Emain\u51FD\u6570\u548C\u5904\u7406http\u8BF7\u6C42\u548C\u54CD\u5E94\u7684\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 http_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 init.go  </span><span style="color:#6A9955;"># go-doudou svc init \u547D\u4EE4\uFF0C\u521D\u59CB\u5316go-doudou\u670D\u52A1\u9879\u76EE\u7ED3\u6784</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 init_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 internal</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 astutils  </span><span style="color:#6A9955;"># ast\u5DE5\u5177\u7C7B\uFF0C\u89E3\u6790struct\u548Cinterface\u7C7B\u578B\u6E90\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 ddl  </span><span style="color:#6A9955;"># ddl\u547D\u4EE4\u6838\u5FC3\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 executils  </span><span style="color:#6A9955;"># \u4ECEgo\u4EE3\u7801\u91CC\u8C03\u7528\u7EC8\u7AEF\u547D\u4EE4\u5DE5\u5177\u7C7B</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 name  </span><span style="color:#6A9955;"># name\u5DE5\u5177\u6838\u5FC3\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 openapi  </span><span style="color:#6A9955;"># \u89E3\u6790OpenAPI 3.0 json\u6587\u6863\u5E76\u751F\u6210http\u8BF7\u6C42\u5BA2\u6237\u7AEF\u7684\u6838\u5FC3\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 svc  </span><span style="color:#6A9955;"># \u751F\u6210RESTful\u670D\u52A1\u5168\u5957\u4EE3\u7801\u7684\u4EE3\u7801\u751F\u6210\u5668\u6838\u5FC3\u4EE3\u7801 </span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 mock</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 mock_executils_runner.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 mock_promptui_select_interface.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 mock_svc.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 name.go  </span><span style="color:#6A9955;"># go-doudou name \u547D\u4EE4\uFF0C\u4FEE\u6539\u7ED3\u6784\u4F53\u7684json\u6807\u7B7E\u7684\u5C0F\u5DE5\u5177\uFF0C\u63A8\u8350\u7ED3\u5408go generate\u547D\u4EE4\u7528</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 name_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 promptui_select_interface.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 push.go  </span><span style="color:#6A9955;"># go-doudou svc push \u547D\u4EE4\uFF0C\u672C\u5730\u6253\u5305docker\u955C\u50CF\u5E76\u63A8\u9001\u5230\u8FDC\u7A0B\u955C\u50CF\u4ED3\u5E93</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 push_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 root.go  </span><span style="color:#6A9955;"># go-doudou \u6839\u547D\u4EE4</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 root_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 run.go  </span><span style="color:#6A9955;"># go-doudou svc run \u547D\u4EE4\uFF0C\u53EF\u4EE5\u7528\u4E8E\u672C\u5730\u542F\u52A8\u670D\u52A1\uFF0C\u4E0D\u8981\u7528\u4E8E\u7EBF\u4E0A\u90E8\u7F72</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 run_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 shutdown.go  </span><span style="color:#6A9955;"># go-doudou svc shutdown \u547D\u4EE4\uFF0C\u7528\u4E8E\u4E0B\u7EBFk8s pod</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 shutdown_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 svc.go  </span><span style="color:#6A9955;"># go-doudou svc \u547D\u4EE4</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 svc_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 pushcmd</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 testsvc</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 version.go  </span><span style="color:#6A9955;"># go-doudou version \u547D\u4EE4\uFF0C\u7528\u4E8E\u5347\u7EA7go-doudou\u547D\u4EE4\u884C\u5DE5\u5177\u7248\u672C</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2514\u2500\u2500 version_test.go</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">11 directories, 28 files</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br></div></div><h3 id="framework\u5305" tabindex="-1"><a class="header-anchor" href="#framework\u5305" aria-hidden="true">#</a> <code>framework</code>\u5305</h3><p>\u5404\u6838\u5FC3\u6587\u4EF6\u548C\u6587\u4EF6\u5939\u7684\u8BF4\u660E\u8BF7\u53C2\u8003\u4E0B\u9762\u7684\u6CE8\u91CA\u3002</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">\u279C  framework git:(main) tree -L 2</span></span>
<span class="line"><span style="color:#DCDCAA;">.</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 buildinfo                              </span><span style="color:#6A9955;"># \u7528\u4E8E\u6784\u5EFA\u4E8C\u8FDB\u5236\u6587\u4EF6\u65F6\uFF0C\u5199\u5165\u6784\u5EFA\u4EBA\u3001\u6784\u5EFA\u65F6\u95F4\u548Cgo-doudou\u4F9D\u8D56\u7248\u672C\u7B49\u5143\u4FE1\u606F</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 buildinfo.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 cache</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 2qcache.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 arccache.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 base.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 item.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 lrucache.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 configmgr                              </span><span style="color:#6A9955;"># \u96C6\u6210apollo\u548Cnacos\u8FDC\u7A0B\u914D\u7F6E\u4E2D\u5FC3\u7684\u6838\u5FC3\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 apollo.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 apollo_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 mock</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 nacos.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 nacos_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 framework.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 grpcx                                  </span><span style="color:#6A9955;"># gRPC\u670D\u52A1\u6846\u67B6\u5C42\u6838\u5FC3\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 grpc_resolver_nacos</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 interceptors</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 server.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 internal</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 banner</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 config</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 logger                                 </span><span style="color:#6A9955;"># \u5DF2\u5E9F\u5F03</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 configure.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 entry.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ratelimit                              </span><span style="color:#6A9955;"># \u9650\u6D41\u5668</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 limit.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 limit_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 limiter.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 memrate</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 redisrate</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 registry                               </span><span style="color:#6A9955;"># \u670D\u52A1\u6CE8\u518C\u76F8\u5173\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 etcd                               </span><span style="color:#6A9955;"># etcd\u76F8\u5173</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 nacos                              </span><span style="color:#6A9955;"># nacos\u76F8\u5173</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 node.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 node_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 utils</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 rest                                   </span><span style="color:#6A9955;"># REST\u670D\u52A1\u6846\u67B6\u5C42\u6838\u5FC3\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 bizerror.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 bizerror_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 confighandler.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 dochandler.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 docindex.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 gateway.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 httprouter</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 middleware.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 middleware_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 mock</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 model.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 prometheus</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 promhandler.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 prommiddleware.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 server.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 validate.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 restclient                             </span><span style="color:#6A9955;"># REST\u670D\u52A1\u5BA2\u6237\u7AEF\u76F8\u5173\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 restclient.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 restclient_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 change</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 checkIc2</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 inputanonystruct</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 nosvc</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 novo</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 openapi</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 outputanonystruct</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 svc.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 svcp.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 testfilesdoc1_openapi3.json</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 usersvc_deployment.yaml</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 usersvc_statefulset.yaml</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 vo</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2514\u2500\u2500 tracing                               </span><span style="color:#6A9955;"># \u96C6\u6210jaeger\u8C03\u7528\u94FE\u8DDF\u8E2A\u76F8\u5173\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">    \u2514\u2500\u2500 tracer.go</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">34 directories, 40 files</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br></div></div><h3 id="toolkit\u5305" tabindex="-1"><a class="header-anchor" href="#toolkit\u5305" aria-hidden="true">#</a> <code>toolkit</code>\u5305</h3><p>\u5404\u6838\u5FC3\u6587\u4EF6\u548C\u6587\u4EF6\u5939\u7684\u8BF4\u660E\u8BF7\u53C2\u8003\u4E0B\u9762\u7684\u6CE8\u91CA\u3002</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">\u279C  toolkit git:(main) tree -L 2</span></span>
<span class="line"><span style="color:#DCDCAA;">.</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 </span><span style="color:#DCDCAA;">caller</span><span style="color:#D4D4D4;">  </span><span style="color:#6A9955;"># \u83B7\u53D6\u51FD\u6570\u8C03\u7528\u65B9\u5305\u540D\u3001\u65B9\u6CD5/\u51FD\u6570\u540D\u3001\u4EE3\u7801\u6587\u4EF6\u8DEF\u5F84\u548C\u884C\u53F7\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 caller.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 caller_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 cast  </span><span style="color:#6A9955;"># \u4F20\u5165\u5B57\u7B26\u4E32\u7C7B\u578B\u503C\u8FD4\u56DE\u8F6C\u6362\u540E\u7684\u7C7B\u578B\u503C</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 string.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 string_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 stringslice.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 stringslice_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 constants  </span><span style="color:#6A9955;"># \u76EE\u524D\u53EA\u6709\u65E5\u671F\u683C\u5F0F\u76F8\u5173\u7684\u5E38\u91CF</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 constants.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 copier  </span><span style="color:#6A9955;"># \u57FA\u4E8Ejson\u5E8F\u5217\u5316\u548C\u53CD\u5E8F\u5217\u5316\u673A\u5236\u7684\u6DF1\u62F7\u8D1D\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 copier.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 copier_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 dotenv  </span><span style="color:#6A9955;"># \u89E3\u6790dotenv\u914D\u7F6E\u6587\u4EF6\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 dotenv.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 dotenv_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 fileutils  </span><span style="color:#6A9955;"># \u6587\u4EF6\u64CD\u4F5C\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 fileutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 fileutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 hashutils  </span><span style="color:#6A9955;"># \u751F\u6210\u5BC6\u7801\u54C8\u5E0C\u548Cuuid\u5B57\u7B26\u4E32\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 hashutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 hashutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ip  </span><span style="color:#6A9955;"># \u83B7\u53D6\u670D\u52A1\u5668\u516C\u7F51ip\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 ip.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 ip_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 loadbalance  </span><span style="color:#6A9955;"># \u5BA2\u6237\u7AEF\u8D1F\u8F7D\u5747\u8861\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 subset.go  </span><span style="color:#6A9955;"># \u5C06\u591A\u4E2A\u670D\u52A1\u5B9E\u4F8B\u62C6\u6210\u51E0\u4E2A\u5B50\u96C6\u5206\u914D\u7ED9\u4E0D\u540C\u7684\u5BA2\u6237\u7AEF</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 subset_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 maputils  </span><span style="color:#6A9955;"># map\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 maputils.go  </span><span style="color:#6A9955;"># \u76EE\u524D\u53EA\u6709Diff\u65B9\u6CD5\uFF0C\u627E\u51FA\u4E24\u4E2Amap\u7684\u4E0D\u540C</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 maputils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 openapi  </span><span style="color:#6A9955;"># \u89E3\u6790OpenAPI 3.0\u6587\u6863\u76F8\u5173\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 v3</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 pathutils  </span><span style="color:#6A9955;"># \u6587\u4EF6\u8DEF\u5F84\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 pathutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 pathutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 random  </span><span style="color:#6A9955;"># \u968F\u673A\u6570\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 rand.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 reflectutils  </span><span style="color:#6A9955;"># \u53CD\u5C04\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 reflectutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 sliceutils  </span><span style="color:#6A9955;"># \u5207\u7247\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 sliceutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 sliceutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 sqlext  </span><span style="color:#6A9955;"># sql\u8BED\u53E5\u6784\u5EFA\u5668\u76F8\u5173\u4EE3\u7801</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 arithsymbol</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 logger</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 logicsymbol</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 query</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 sortenum</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 wrapper</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 stringutils  </span><span style="color:#6A9955;"># \u5B57\u7B26\u4E32\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 stringutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 stringutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 templateutils  </span><span style="color:#6A9955;"># text/template\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 funcs.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 templateutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 timeutils  </span><span style="color:#6A9955;"># \u65F6\u95F4\u76F8\u5173\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 timeutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 timeutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 yaml </span><span style="color:#6A9955;"># \u89E3\u6790yaml\u914D\u7F6E\u6587\u4EF6\u5DE5\u5177</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u251C\u2500\u2500 yaml.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502\xA0\xA0 \u2514\u2500\u2500 yaml_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2514\u2500\u2500 zlogger </span><span style="color:#6A9955;"># \u65E5\u5FD7\u76F8\u5173</span></span>
<span class="line"><span style="color:#D4D4D4;">    \u2514\u2500\u2500 entry.go</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">31 directories, 35 files</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br></div></div><h2 id="\u4EE3\u7801\u8D28\u91CF" tabindex="-1"><a class="header-anchor" href="#\u4EE3\u7801\u8D28\u91CF" aria-hidden="true">#</a> \u4EE3\u7801\u8D28\u91CF</h2><p>\u6211\u4EEC\u975E\u5E38\u91CD\u89C6\u4EE3\u7801\u8D28\u91CF\uFF0C\u5982\u679C\u4F60\u60F3\u8D21\u732E\u4EE3\u7801\uFF0C\u8BF7\u52A1\u5FC5\u4FDD\u8BC1\u5355\u5143\u6D4B\u8BD5\u53EF\u4EE5\u901A\u8FC7\u3002</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">go </span><span style="color:#DCDCAA;">test</span><span style="color:#D4D4D4;"> ./... -count=1</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="\u8BA8\u8BBA" tabindex="-1"><a class="header-anchor" href="#\u8BA8\u8BBA" aria-hidden="true">#</a> \u8BA8\u8BBA</h2>`,16),A=n("\u6B22\u8FCE\u5728\u8BA8\u8BBA\u533A\u8BA8\u8BBA\u65B0\u7279\u6027\u6216\u8005\u63D0\u51FA\u4F60\u60F3\u8981\u7684\u7279\u6027\uFF1A"),f={href:"https://github.com/unionj-cloud/go-doudou/discussions",target:"_blank",rel:"noopener noreferrer"},v=n("https://github.com/unionj-cloud/go-doudou/discussions"),k=s("h2",{id:"\u7F3A\u9677",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#\u7F3A\u9677","aria-hidden":"true"},"#"),n(" \u7F3A\u9677")],-1),x=n("\u9047\u5230bug\uFF0C\u8BF7\u63D0\u5230\u8FD9\u91CC\uFF1A"),j={href:"https://github.com/unionj-cloud/go-doudou/issues",target:"_blank",rel:"noopener noreferrer"},E=n("https://github.com/unionj-cloud/go-doudou/issues"),w=s("h2",{id:"\u8D21\u732E\u4EE3\u7801",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#\u8D21\u732E\u4EE3\u7801","aria-hidden":"true"},"#"),n(" \u8D21\u732E\u4EE3\u7801")],-1),C=n("\u6B22\u8FCE\u8D21\u732E\u4EE3\u7801\uFF1A"),R={href:"https://github.com/unionj-cloud/go-doudou/pulls",target:"_blank",rel:"noopener noreferrer"},T=n("https://github.com/unionj-cloud/go-doudou/pulls"),I=s("h2",{id:"todo",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#todo","aria-hidden":"true"},"#"),n(" TODO")],-1),S=n("\u4EFB\u52A1\u770B\u677F\uFF1A"),L={href:"https://github.com/unionj-cloud/go-doudou/projects/1",target:"_blank",rel:"noopener noreferrer"},O=n("https://github.com/unionj-cloud/go-doudou/projects/1");function P(q,N){const a=p("ExternalLinkIcon");return e(),o(r,null,[D,b,s("ul",null,[s("li",null,[u,s("a",m,[d,l(a)])]),s("li",null,[y,s("a",g,[h,l(a)])])]),_,s("p",null,[A,s("a",f,[v,l(a)])]),k,s("p",null,[x,s("a",j,[E,l(a)])]),w,s("p",null,[C,s("a",R,[T,l(a)])]),I,s("p",null,[S,s("a",L,[O,l(a)])])],64)}var B=i(t,[["render",P]]);export{B as default};
