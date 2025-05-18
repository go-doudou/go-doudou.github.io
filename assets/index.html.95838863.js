import{r as l,o as p,a as o,b as s,e,F as r,f as n,g as c}from"./app.2025f35b.js";import{_ as t}from"./plugin-vue_export-helper.21dcd24c.js";const i={},D=s("h1",{id:"contribution",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#contribution","aria-hidden":"true"},"#"),n(" Contribution")],-1),u=s("h2",{id:"code-repositories",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#code-repositories","aria-hidden":"true"},"#"),n(" Code Repositories")],-1),b=n("Github: "),d={href:"https://github.com/unionj-cloud/go-doudou",target:"_blank",rel:"noopener noreferrer"},m=n("https://github.com/unionj-cloud/go-doudou"),y=n("Gitee: "),g={href:"https://gitee.com/unionj-cloud/go-doudou",target:"_blank",rel:"noopener noreferrer"},h=n("https://gitee.com/unionj-cloud/go-doudou"),f=c(`<h2 id="project-structure" tabindex="-1"><a class="header-anchor" href="#project-structure" aria-hidden="true">#</a> Project Structure</h2><p>go-doudou consists of three packages:</p><ul><li><code>cmd</code>: Responsible for the <code>go-doudou</code> command-line tool and code generators</li><li><code>framework</code>: Responsible for the REST/gRPC framework</li><li><code>toolkit</code>: Responsible for the toolkit utilities</li></ul><h3 id="cmd-package" tabindex="-1"><a class="header-anchor" href="#cmd-package" aria-hidden="true">#</a> <code>cmd</code> Package</h3><p>Please refer to the comments below for descriptions of core files and folders.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">\u279C  cmd git:(main) tree -L 2</span></span>
<span class="line"><span style="color:#DCDCAA;">.</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 client.go  </span><span style="color:#6A9955;"># go-doudou svc http client command, generates go language http request client directly from OpenAPI 3.0 json document</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 client_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ddl.go  </span><span style="color:#6A9955;"># go-doudou ddl command, synchronizes database table structures and structs in the domain package, generates dao layer code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ddl_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 deploy.go  </span><span style="color:#6A9955;"># go-doudou svc deploy command, deploys to k8s cluster</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 deploy_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 http.go  </span><span style="color:#6A9955;"># go-doudou svc http command, generates the full set of code needed for RESTful services, including but not limited to main function and code for handling http requests and responses</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 http_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 init.go  </span><span style="color:#6A9955;"># go-doudou svc init command, initializes go-doudou service project structure</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 init_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 internal</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 astutils  </span><span style="color:#6A9955;"># ast utility classes, parses struct and interface type source code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 ddl  </span><span style="color:#6A9955;"># ddl command core code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 executils  </span><span style="color:#6A9955;"># terminal command utility for executing commands from go code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 name  </span><span style="color:#6A9955;"># name tool core code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 openapi  </span><span style="color:#6A9955;"># core code for parsing OpenAPI 3.0 json document and generating http request client</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 svc  </span><span style="color:#6A9955;"># code generator core code for generating the full set of RESTful service code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 mock</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 mock_executils_runner.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 mock_promptui_select_interface.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 mock_svc.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 name.go  </span><span style="color:#6A9955;"># go-doudou name command, a small tool for modifying the json tags of structs, recommended to use with go generate command</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 name_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 promptui_select_interface.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 push.go  </span><span style="color:#6A9955;"># go-doudou svc push command, locally packages docker image and pushes to remote image repository</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 push_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 root.go  </span><span style="color:#6A9955;"># go-doudou root command</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 root_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 run.go  </span><span style="color:#6A9955;"># go-doudou svc run command, can be used to start the service locally, not for online deployment</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 run_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 shutdown.go  </span><span style="color:#6A9955;"># go-doudou svc shutdown command, used to shut down k8s pods</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 shutdown_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 svc.go  </span><span style="color:#6A9955;"># go-doudou svc command</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 svc_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 pushcmd</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 testsvc</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 version.go  </span><span style="color:#6A9955;"># go-doudou version command, used to upgrade the go-doudou command line tool version</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2514\u2500\u2500 version_test.go</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">11 directories, 28 files</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br></div></div><h3 id="framework-package" tabindex="-1"><a class="header-anchor" href="#framework-package" aria-hidden="true">#</a> <code>framework</code> Package</h3><p>Please refer to the comments below for descriptions of core files and folders.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">\u279C  framework git:(main) tree -L 2</span></span>
<span class="line"><span style="color:#DCDCAA;">.</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 buildinfo                              </span><span style="color:#6A9955;"># used when building binary files to write metadata like builder, build time, and go-doudou dependency version</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 buildinfo.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 cache</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 2qcache.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 arccache.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 base.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 item.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 lrucache.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 configmgr                              </span><span style="color:#6A9955;"># core code for integrating apollo and nacos remote configuration centers</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 apollo.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 apollo_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 mock</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 nacos.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 nacos_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 framework.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 grpcx                                  </span><span style="color:#6A9955;"># gRPC service framework layer core code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 grpc_resolver_nacos</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 interceptors</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 server.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 internal</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 banner</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 config</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 logger                                 </span><span style="color:#6A9955;"># deprecated</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 configure.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 entry.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ratelimit                              </span><span style="color:#6A9955;"># rate limiter</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 limit.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 limit_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 limiter.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 memrate</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 redisrate</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 registry                               </span><span style="color:#6A9955;"># service registration related code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 etcd                               </span><span style="color:#6A9955;"># etcd related</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 nacos                              </span><span style="color:#6A9955;"># nacos related</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 node.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 node_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 utils</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 rest                                   </span><span style="color:#6A9955;"># REST service framework layer core code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 bizerror.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 bizerror_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 confighandler.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 dochandler.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 docindex.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 gateway.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 httprouter</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 middleware.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 middleware_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 mock</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 model.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 prometheus</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 promhandler.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 prommiddleware.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 server.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 validate.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 restclient                             </span><span style="color:#6A9955;"># REST service client related code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 restclient.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 restclient_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 change</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 checkIc2</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 inputanonystruct</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 nosvc</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 novo</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 openapi</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 outputanonystruct</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 svc.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 svcp.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 testfilesdoc1_openapi3.json</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 usersvc_deployment.yaml</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 usersvc_statefulset.yaml</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 vo</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2514\u2500\u2500 tracing                               </span><span style="color:#6A9955;"># code related to integrating jaeger call chain tracking</span></span>
<span class="line"><span style="color:#D4D4D4;">    \u2514\u2500\u2500 tracer.go</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">34 directories, 40 files</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br></div></div><h3 id="toolkit-package" tabindex="-1"><a class="header-anchor" href="#toolkit-package" aria-hidden="true">#</a> <code>toolkit</code> Package</h3><p>Please refer to the comments below for descriptions of core files and folders.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">\u279C  toolkit git:(main) tree -L 2</span></span>
<span class="line"><span style="color:#DCDCAA;">.</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 </span><span style="color:#DCDCAA;">caller</span><span style="color:#D4D4D4;">  </span><span style="color:#6A9955;"># tool for getting the caller&#39;s package name, method/function name, code file path and line number</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 caller.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 caller_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 cast  </span><span style="color:#6A9955;"># converts string type values to specified type values</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 string.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 string_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 stringslice.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 stringslice_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 constants  </span><span style="color:#6A9955;"># currently only contains constants related to date formats</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 constants.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 copier  </span><span style="color:#6A9955;"># deep copy tool based on json serialization and deserialization mechanism</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 copier.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 copier_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 dotenv  </span><span style="color:#6A9955;"># tool for parsing dotenv configuration files</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 dotenv.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 dotenv_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 fileutils  </span><span style="color:#6A9955;"># file operation related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 fileutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 fileutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 hashutils  </span><span style="color:#6A9955;"># tools for generating password hashes and uuid strings</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 hashutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 hashutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 ip  </span><span style="color:#6A9955;"># tool for getting the server&#39;s public IP</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 ip.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 ip_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 loadbalance  </span><span style="color:#6A9955;"># client-side load balancing related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 subset.go  </span><span style="color:#6A9955;"># splits multiple service instances into several subsets assigned to different clients</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 subset_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 maputils  </span><span style="color:#6A9955;"># map related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 maputils.go  </span><span style="color:#6A9955;"># currently only has a Diff method for finding differences between two maps</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 maputils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 openapi  </span><span style="color:#6A9955;"># code related to parsing OpenAPI 3.0 documents</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 v3</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 pathutils  </span><span style="color:#6A9955;"># file path related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 pathutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 pathutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 random  </span><span style="color:#6A9955;"># random number related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 rand.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 reflectutils  </span><span style="color:#6A9955;"># reflection related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 reflectutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 sliceutils  </span><span style="color:#6A9955;"># slice related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 sliceutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 sliceutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 sqlext  </span><span style="color:#6A9955;"># sql statement builder related code</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 arithsymbol</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 logger</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 logicsymbol</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 query</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 sortenum</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 wrapper</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 stringutils  </span><span style="color:#6A9955;"># string related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 stringutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 stringutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 templateutils  </span><span style="color:#6A9955;"># text/template related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 funcs.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 templateutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 timeutils  </span><span style="color:#6A9955;"># time related tools</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 timeutils.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 timeutils_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u251C\u2500\u2500 yaml </span><span style="color:#6A9955;"># tool for parsing yaml configuration files</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 testdata</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u251C\u2500\u2500 yaml.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2502   \u2514\u2500\u2500 yaml_test.go</span></span>
<span class="line"><span style="color:#D4D4D4;">\u2514\u2500\u2500 zlogger </span><span style="color:#6A9955;"># logging related</span></span>
<span class="line"><span style="color:#D4D4D4;">    \u2514\u2500\u2500 entry.go</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D4D4D4;">31 directories, 35 files</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br></div></div><h2 id="code-quality" tabindex="-1"><a class="header-anchor" href="#code-quality" aria-hidden="true">#</a> Code Quality</h2><p>We place a high value on code quality. If you want to contribute code, please ensure that the unit tests can pass.</p><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#1E1E1E;"><code><span class="line"><span style="color:#D4D4D4;">go </span><span style="color:#DCDCAA;">test</span><span style="color:#D4D4D4;"> ./... -count=1</span></span>
<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="discussion" tabindex="-1"><a class="header-anchor" href="#discussion" aria-hidden="true">#</a> Discussion</h2>`,16),_=n("Feel free to discuss new features or suggest features you want in the discussions area: "),v={href:"https://github.com/unionj-cloud/go-doudou/discussions",target:"_blank",rel:"noopener noreferrer"},A=n("https://github.com/unionj-cloud/go-doudou/discussions"),k=s("h2",{id:"bugs",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#bugs","aria-hidden":"true"},"#"),n(" Bugs")],-1),w=n("If you encounter a bug, please report it here: "),x={href:"https://github.com/unionj-cloud/go-doudou/issues",target:"_blank",rel:"noopener noreferrer"},j=n("https://github.com/unionj-cloud/go-doudou/issues"),E=s("h2",{id:"code-contribution",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#code-contribution","aria-hidden":"true"},"#"),n(" Code Contribution")],-1),C=n("Code contributions are welcome: "),P={href:"https://github.com/unionj-cloud/go-doudou/pulls",target:"_blank",rel:"noopener noreferrer"},R=n("https://github.com/unionj-cloud/go-doudou/pulls"),q=s("h2",{id:"todo",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#todo","aria-hidden":"true"},"#"),n(" TODO")],-1),I=n("Task board: "),T={href:"https://github.com/unionj-cloud/go-doudou/projects/1",target:"_blank",rel:"noopener noreferrer"},z=n("https://github.com/unionj-cloud/go-doudou/projects/1");function S(L,O){const a=l("ExternalLinkIcon");return p(),o(r,null,[D,u,s("ul",null,[s("li",null,[b,s("a",d,[m,e(a)])]),s("li",null,[y,s("a",g,[h,e(a)])])]),f,s("p",null,[_,s("a",v,[A,e(a)])]),k,s("p",null,[w,s("a",x,[j,e(a)])]),E,s("p",null,[C,s("a",P,[R,e(a)])]),q,s("p",null,[I,s("a",T,[z,e(a)])])],64)}var V=t(i,[["render",S]]);export{V as default};
