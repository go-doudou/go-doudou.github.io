# Configuration

`go-doudou` provides out-of-the-box support for local configuration files in dotenv and yaml formats, as well as Alibaba's Nacos and Ctrip's Apollo configuration centers. It can load configurations from local files or remote configuration centers into environment variables.

The priority between local configuration files and remote configuration centers is that local configuration files take precedence, meaning configurations already loaded from local files will not be overridden by those loaded from remote configuration centers.

## Local Configuration Files

The usage of dotenv format and yaml format local configuration files is exactly the same, with only slight differences in file naming rules. These are explained separately below.

:::tip

The two configuration file formats can be used simultaneously or you can use just one. When used simultaneously, yaml format configuration files are loaded first, and after all yaml files are loaded, dotenv format configuration files are loaded.

:::

### dotenv Files

If you have multiple `.env` files, such as `.env.test`, `.env.prod`, etc., to configure different environments, you can set the `GDD_ENV` environment variable to `test` or `prod` through the command line terminal, `Dockerfile`, or k8s configuration files to load the corresponding configuration file.

The configuration loading rules are as follows:
  1. For the same environment variable, whether configured in the command line terminal or through configuration files, the value loaded first has the highest priority and will not be modified by subsequently loaded values.
  2. The loading order of configuration files (taking the `prod` environment as an example) is:
    1. Load `.env.prod.local` file
    2. When the value of the environment variable `GDD_ENV` is **not** equal to `test`, load `.env.local` file
    3. Load `.env.prod` file
    4. Load `.env` file

**Note**: The prefix must be `.env`

### yaml Files

Supports both `.yml` and `.yaml` suffix configuration files. If you have multiple yaml files, such as `app-test.yml`, `app-prod.yml`, etc., to configure different environments, you can set the `GDD_ENV` environment variable to `test` or `prod` through the command line terminal, `Dockerfile`, or k8s configuration files to load the corresponding configuration file.

The configuration loading rules are as follows:
  1. For the same environment variable, whether configured in the command line terminal or through configuration files, the value loaded first has the highest priority and will not be modified by subsequently loaded values.
  2. The loading order of configuration files (taking the `prod` environment as an example) is:
    1. Load `app-prod-local.yml` file
    2. When the value of the environment variable `GDD_ENV` is **not** equal to `test`, load `app-local.yml` file
    3. Load `app-prod.yml` file
    4. Load `app.yml` file

**Note**: The prefix must be `app`
::: tip
When converting environment variables to yaml configuration, the rule is to use underscores as property separators. For very long property names, hyphens can be used to split them into multiple words for better readability. For example, the environment variable GDD_DB_MYSQL_DISABLEDATETIMEPRECISION converted to yaml configuration:
```yaml
gdd:
	db:
		mysql:
			disable-datetime-precision:
```
:::

## Remote Configuration Solutions

`go-doudou` has built-in support for two remote configuration center solutions: Alibaba's Nacos and Ctrip's Apollo. It supports loading at service startup and also supports custom listener functions to monitor configuration changes.

To enable a remote configuration center, you need to configure the following environment variables in the local configuration file:

- `GDD_CONFIG_REMOTE_TYPE`: Remote configuration center name, options: `nacos`, `apollo`

:::tip

Some of the [service configurations](#service-configuration) in the `go-doudou` framework layer (i.e., configurations with the `GDD_` prefix) support runtime dynamic modification through remote configuration centers. The priority of runtime dynamic modifications is the highest and will override all configurations loaded from the command line terminal, `Dockerfile`, k8s configuration files, local configuration files, and remote configuration centers at service startup.

:::
### Nacos Configuration Center

`go-doudou` service will automatically load configurations from Nacos at startup. You only need to configure some parameters in the local configuration file, making it ready to use out of the box.

- `GDD_NACOS_NAMESPACE_ID`: Nacos namespaceId, optional
- `GDD_NACOS_SERVER_ADDR`: Nacos server connection address, required
- `GDD_NACOS_CONFIG_FORMAT`: Configuration format, options: `dotenv`, `yaml`, default is `dotenv`
- `GDD_NACOS_CONFIG_GROUP`: Nacos group, default is `DEFAULT_GROUP`
- `GDD_NACOS_CONFIG_DATAID`: Nacos dataId, required, multiple dataIds separated by commas, the order in the configuration is the actual loading order, following the rule that configurations loaded first have the highest priority

The `configmgr` package provides an exported singleton `NacosClient` for interacting with the Nacos configuration center. You can call the `AddChangeListener` method to add custom listener functions. Example usage:

```go
func main() {

	...

	if configmgr.NacosClient != nil {
		configmgr.NacosClient.AddChangeListener(configmgr.NacosConfigListenerParam{
			DataId: "statsvc-dev",
			OnChange: func(event *configmgr.NacosChangeEvent) {
				fmt.Println("group:" + event.Group + ", dataId:" + event.DataId + fmt.Sprintf(", changes: %+v\n", event.Changes))
			},
		})
	}

	...

	srv.Run()
}
```

### Apollo Configuration Center

`go-doudou` service will automatically load configurations from Apollo at startup. You only need to configure some parameters in the local configuration file, making it ready to use out of the box.

- `GDD_SERVICE_NAME`: Service name is the Apollo AppId
- `GDD_APOLLO_CLUSTER`: Apollo cluster, default is `default`
- `GDD_APOLLO_ADDR`: Apollo server connection address, required
- `GDD_APOLLO_NAMESPACE`: Apollo namespace, equivalent to Nacos's dataId, default is `application.properties`, multiple namespaces separated by commas, the order in the configuration is the actual loading order, following the rule that configurations loaded first have the highest priority
- `GDD_APOLLO_SECRET`: Apollo configuration secret, optional

The `configmgr` package provides an exported singleton `ApolloClient` for interacting with the Apollo configuration center. You can call the `AddChangeListener` method to add custom listener functions. Example usage:

```go
type ConfigChangeListener struct {
	configmgr.BaseApolloListener
}

func (c *ConfigChangeListener) OnChange(event *storage.ChangeEvent) {
	c.Lock.Lock()
	defer c.Lock.Unlock()
	if !c.SkippedFirstEvent {
		c.SkippedFirstEvent = true
		return
	}
	logger.Info("from OnChange")
	fmt.Println(event.Changes)
	for key, value := range event.Changes {
		fmt.Println("change key : ", key, ", value :", value)
	}
	fmt.Println(event.Namespace)
	logger.Info("from OnChange end")
}

func main() {

    ...

	var listener ConfigChangeListener

	configmgr.ApolloClient.AddChangeListener(&listener)

    ...

	srv.Run()
}
```

It's worth noting that the first configuration loading event will also be detected by custom listener functions. If you need to skip the first time, you need to "inherit" the `BaseApolloListener` struct provided by the `configmgr` package, and then add the following code at the beginning of the `OnChange` function:

```go
c.Lock.Lock()
defer c.Lock.Unlock()
if !c.SkippedFirstEvent {
  c.SkippedFirstEvent = true
  return
}
```

## Service Configuration

Configurations marked with a red asterisk in the table are dynamically modified by go-doudou at runtime by monitoring configuration changes in the remote configuration center.

| Environment Variable       | Description                                                                                                       | Default Value    | Required   |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | -------|
| GDD_BANNER                 | Enable banner                                                                                   | true       |        |
| GDD_BANNER_TEXT            | Banner text                                                                                       | `go-doudou`  |        |
| GDD_LOG_LEVEL              | Log level, options: `panic`, `fatal`, `error`, `warn`, `warning`, `info`, `debug`, `trace`           | info       |        |
| GDD_LOG_FORMAT             | Log format, options: `text`, `json`                                                                   | text       |        |
| GDD_LOG_REQ_ENABLE         | Enable HTTP request and response body logging                                                                       | false      |        |
| GDD_LOG_CALLER         | Print "filename:line"                                                                       | true      |        |
| GDD_LOG_DISCARD            | Disable logging                                                                                          | false      |        |
| GDD_LOG_PATH               | Log file path, if set, logs will be written to the file                                                                  |           |        |
| GDD_LOG_STYLE              | Log format style, only valid when GDD_LOG_PATH is set, options: `json` or `console`                                    | json       |        |
| GDD_GRACE_TIMEOUT          | Graceful shutdown timeout                                                                                  | 15s        |        |
| GDD_WRITE_TIMEOUT          | HTTP connection write timeout                                                                                | 15s        |        |
| GDD_READ_TIMEOUT           | HTTP connection read timeout                                                                                | 15s        |        |
| GDD_IDLE_TIMEOUT           | HTTP connection idle timeout                                                                              | 60s        |        |
| GDD_ROUTE_ROOT_PATH        | HTTP request path prefix                                                                                   |            |        |
| GDD_SERVICE_NAME           | Service name                                                                                            |            | Required    |
| GDD_SERVICE_GROUP          | Service group name, valid when using zookeeper for service registration and discovery                                                         |            |     |
| GDD_SERVICE_VERSION        | Service version name, valid when using zookeeper for service registration and discovery                                                       |            |     |
| GDD_HOST                   | HTTP server listening address                                                                                  |            |        |
| GDD_PORT                   | HTTP server listening port                                                                                  | 6060       |        |
| GDD_GRPC_PORT              | gRPC server listening port                                                                                  | 50051       |        |
| GDD_RETRY_COUNT            | Client request retry count                                                                                   | 0          |        |
| GDD_MANAGE_ENABLE          | Enable built-in HTTP interfaces: `/go-doudou/doc`, `/go-doudou/openapi.json`, `/go-doudou/prometheus`, `/go-doudou/registry`, `/go-doudou/config` | true       |        |
| <span style="color: red; font-weight: bold;">*</span>GDD_MANAGE_USER            | HTTP basic authentication username for built-in HTTP interfaces                                                                    | admin      |        |
| <span style="color: red; font-weight: bold;">*</span>GDD_MANAGE_PASS            | HTTP basic authentication password for built-in HTTP interfaces                                                                      | admin      |        |
| GDD_TRACING_METRICS_ROOT   | `metrics root` for jaeger call chain monitoring                                                                     | tracing  |        |
| GDD_WEIGHT                 | Service instance weight                                                                                       | 1          |        |
| GDD_SERVICE_DISCOVERY_MODE | Service discovery mode, options: `etcd`, `nacos`, `zk`                                                           |  |        |
| GDD_ENABLE_RESPONSE_GZIP | Enable HTTP response body gzip compression     | true |              |
| GDD_SQL_LOG_ENABLE | Enable SQL log printing      | false |              |
| GDD_REGISTER_HOST           | Service instance registration address, default is the host's private IP                                              |     |          |
| GDD_FALLBACK_CONTENTTYPE           | Default Content-Type header for HTTP response body                                                     | application/json; charset=UTF-8 |          |
| GDD_CONFIG_REMOTE_TYPE           | Remote configuration center, options: `nacos`, `apollo`                                                     |  |          |
| GDD_ROUTER_SAVEMATCHEDROUTEPATH           | Save matched route path                                                     | true |          |
| GDD_STATS_FREQ           | Service status statistics frequency                                                    | 1s |          |

## Nacos Configuration

| Environment Variable       | Description                                        | Default Value    | Required                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| GDD_NACOS_NAMESPACE_ID            | Namespace                                                                                 | public                 |          |
| GDD_NACOS_TIMEOUT_MS              | Request timeout in milliseconds                                                                      | 10000            |          |
| GDD_NACOS_NOTLOADCACHEATSTART | Whether to load service list from disk cache at program startup                                                         | false            |          |
| GDD_NACOS_LOG_DIR                 | Log directory path                                                                               | /tmp/nacos/log   |          |
| GDD_NACOS_CACHE_DIR               | Service list disk cache path                                                      | /tmp/nacos/cache |          |
| GDD_NACOS_LOG_LEVEL               | Log level, options: `debug`, `info`, `warn`, `error`                                      | info             |          |
| GDD_NACOS_LOG_DISCARD             | Disable Nacos logging                                               | false             |          |
| GDD_NACOS_SERVER_ADDR             | Nacos server connection address, multiple addresses separated by commas                                         |                  |          |
| GDD_NACOS_REGISTER_HOST           | IP address used for Nacos service registration                                        |                  |          |
| GDD_NACOS_CLUSTER_NAME            | Nacos cluster name                                               | DEFAULT             |          |
| GDD_NACOS_GROUP_NAME              | Nacos group name                                               | DEFAULT_GROUP             |          |
| GDD_NACOS_CONFIG_FORMAT           | Configuration data format, supports: `dotenv`, `yaml` |      dotenv            |          |
| GDD_NACOS_CONFIG_GROUP           | Configuration group |        DEFAULT_GROUP          |          |
| GDD_NACOS_CONFIG_DATAID           | Configuration dataId |                  |    Required      |

## Apollo Configuration

| Environment Variable                          | Description                                                                             | Default Value          | Required         |
| --------------------------------- | -------------------------------------------------------------------------------- | ---------------- | -------- |
| GDD_APOLLO_CLUSTER            | Apollo cluster                                                                       | default           |          |
| GDD_APOLLO_ADDR              | Apollo configuration service connection address                                             |             |      Required    |
| GDD_APOLLO_NAMESPACE | Apollo namespace                               | application.properties            |          |
| GDD_APOLLO_BACKUP_ENABLE                 | Enable configuration caching on local disk                                     | true   |          |
| GDD_APOLLO_BACKUP_PATH               | Configuration cache folder path                            |             |          |
| GDD_APOLLO_MUSTSTART               | Return error immediately if configuration service connection fails            | false             |          |
| GDD_APOLLO_SECRET             | Apollo configuration secret                                    |                  |          |
| GDD_APOLLO_LOG_ENABLE           | Enable Apollo log printing |     false             |          |

## Etcd Configuration

| Environment Variable       | Description                                        | Default Value    | Required                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| GDD_ETCD_ENDPOINTS            | Etcd cluster connection address                                                                                 |                  |          |
| GDD_ETCD_LEASE              | Etcd service registration lease TTL time in seconds                                                                      | 5            |          |

## Zookeeper Configuration

| Environment Variable       | Description                                        | Default Value    | Required                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| GDD_ZK_SERVERS                   | Zookeeper cluster connection address, multiple addresses separated by commas                                                    |                  |          |
| GDD_ZK_SEQUENCE              | Whether to add a sequence number to Zookeeper nodes                                                                      | false            |          |
| GDD_ZK_DIRECTORY_PATTERN     | String fmt pattern for service registration node path, %s represents service name                                                     | /registry/%s/providers     |          |

## Memberlist Configuration

Memberlist is a built-in service registration and discovery component in the go-doudou framework based on the gossip protocol.

| Environment Variable       | Description                                        | Default Value    | Required                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| GDD_MEM_SEED               | Cluster seed nodes for joining                                                    |                  |          |
| GDD_MEM_NAME               | Unique name of the node in the cluster, hostname will be used if not set                                |                  |          |
| GDD_MEM_HOST               | Advertise address of the node, if starting with a dot (like .seed-svc), will be prefixed with hostname, supports K8s stateful services |                  |          |
| GDD_MEM_PORT               | Node communication port, randomly assigned if not set                                             | 7946             |          |
| GDD_MEM_DEAD_TIMEOUT       | Node death timeout in seconds, node will be removed if no refute messages are received within this time                | 60s          |          |
| GDD_MEM_SYNC_INTERVAL      | Node state synchronization interval in seconds                                                        | 60s           |          |
| GDD_MEM_RECLAIM_TIMEOUT    | Dead node reclamation time in seconds, dead node will be replaced by a new node after this time                       | 3s           |          |
| GDD_MEM_PROBE_INTERVAL     | Probe interval in seconds                                                                | 5s            |          |
| GDD_MEM_PROBE_TIMEOUT      | Probe timeout in seconds                                                                | 3s        |          |
| GDD_MEM_SUSPICION_MULT     | Suspicion multiplier, determines the time a node is considered suspicious before being declared dead                                  | 6            |          |
| GDD_MEM_RETRANSMIT_MULT    | Retransmission multiplier                                                                        | 4            |          |
| GDD_MEM_GOSSIP_NODES       | Number of remote nodes to gossip messages to                                                          | 4            |          |
| GDD_MEM_GOSSIP_INTERVAL    | Gossip interval in seconds                                                         | 500ms        |          |
| GDD_MEM_TCP_TIMEOUT        | TCP timeout in seconds                                                            | 30s        |          |
| GDD_MEM_WEIGHT             | Node weight                                                                        | 1            |          |
| GDD_MEM_WEIGHT_INTERVAL    | Node weight calculation interval                                                            | 0            |          |
| GDD_MEM_INDIRECT_CHECKS    | Number of indirect checks                                                                    | 3            |          |
| GDD_MEM_LOG_DISABLE        | Disable memberlist logging                                                          | false        |          |
| GDD_MEM_CIDRS_ALLOWED      | CIDRs allowed to connect, allows any connection if not set, must specify IPv6/IPv4 separately                      |             |          |

## Cache Configuration

| Environment Variable       | Description                                        | Default Value    | Required                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| GDD_CACHE_TTL                | Cache TTL time in seconds                                                                              | 0                  |          |
| GDD_CACHE_STORES             | Cache storage types, options: `redis`, `ristretto`, `gocache`                                            |                  |          |
| GDD_CACHE_REDIS_ADDR         | Redis server address                                                                                 |                  |          |
| GDD_CACHE_REDIS_USER         | Redis username                                                                                    |                  |          |
| GDD_CACHE_REDIS_PASS         | Redis password                                                                                      |                  |          |
| GDD_CACHE_REDIS_ROUTEBYLATENCY | Route Redis requests by latency                                                                       | true            |          |
| GDD_CACHE_REDIS_ROUTERANDOMLY  | Route Redis requests randomly                                                                           | false            |          |
| GDD_CACHE_RISTRETTO_NUMCOUNTERS | Ristretto cache counter number                                                                       | 1000             |          |
| GDD_CACHE_RISTRETTO_MAXCOST    | Ristretto cache maximum cost                                                                         | 100              |          |
| GDD_CACHE_RISTRETTO_BUFFERITEMS | Ristretto cache buffer items                                                                       | 64               |          |
| GDD_CACHE_GOCACHE_EXPIRATION | GoCache default cache expiration time                                                                         | 5m               |          |
| GDD_CACHE_GOCACHE_CLEANUP_INTERVAL | GoCache cleanup interval                                                                        | 10m              |          |

## Gorm Configuration

| Environment Variable       | Description                                        | Default Value    | Required                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------- |
| GDD_DB_DISABLEAUTOCONFIGURE           | Disable auto-configuration                                                   |   false               |          |
| GDD_DB_DRIVER              | Database driver name, consistent with gorm: `mysql`, `postgres`, `sqlite`, `sqlserver`, `tidb`, `clickhouse`  |             |          |
| GDD_DB_DSN     | Database connection address                                                     |     |          |
| GDD_DB_TABLE_PREFIX        | Database table prefix                                                     |     |          |
| GDD_DB_PREPARESTMT         | Enable prepared statements                                                    | false    |          |
| GDD_DB_SKIPDEFAULTTRANSACTION | Skip default transaction                                                    | false    |          |
| GDD_DB_POOL_MAXIDLECONNS     | Maximum number of idle connections                                                    | 2    |          |
| GDD_DB_POOL_MAXOPENCONNS     | Maximum number of connections, -1 means unlimited                                                     |  -1    |          |
| GDD_DB_POOL_CONNMAXLIFETIME     | Maximum time period a connection can be reused, -1 means unlimited                                                 |  -1    |          |
| GDD_DB_POOL_CONNMAXIDLETIME     | Maximum idle time for a connection, if it expires it will be closed before reuse, -1 means unlimited                               | -1     |          |
| GDD_DB_LOG_SLOWTHRESHOLD     | Slow query log threshold                                                     | 200ms     |          |
| GDD_DB_LOG_IGNORERECORDNOTFOUNDERROR     | Ignore record not found error                                                     | false     |          |
| GDD_DB_LOG_PARAMETERIZEDQUERIES          | Hide SQL parameters                                                                      | false     |          |
| GDD_DB_LOG_LEVEL     | Log level, consistent with gorm: `silent`, `error`, `warn`, `info`                                                   | warn     |          |
| GDD_DB_MYSQL_SKIPINITIALIZEWITHVERSION     | Gorm's SkipInitializeWithVersion parameter                                           | false     |          |
| GDD_DB_MYSQL_DEFAULTSTRINGSIZE     | Gorm's DefaultStringSize parameter                                               | 0     |          |
| GDD_DB_MYSQL_DISABLEWITHRETURNING     | Gorm's DisableWithReturning parameter                                                | false     |          |
| GDD_DB_MYSQL_DISABLEDATETIMEPRECISION     | Gorm's DisableDatetimePrecision parameter                                            | false     |          |
| GDD_DB_MYSQL_DONTSUPPORTRENAMEINDEX     | Gorm's DontSupportRenameIndex parameter                                              | false     |          |
| GDD_DB_MYSQL_DONTSUPPORTRENAMECOLUMN     | Gorm's DontSupportRenameColumn parameter                                             | false     |          |
| GDD_DB_MYSQL_DONTSUPPORTFORSHARECLAUSE     | Gorm's DontSupportForShareClause parameter                                           | false     |          |
| GDD_DB_MYSQL_DONTSUPPORTNULLASDEFAULTVALUE     | Gorm's DontSupportNullAsDefaultValue parameter                                       | false     |          |
| GDD_DB_MYSQL_DONTSUPPORTRENAMECOLUMNUNIQUE     | Gorm's DontSupportRenameColumnUnique parameter                                      | false     |          |
| GDD_DB_POSTGRES_PREFERSIMPLEPROTOCOL     | Gorm's PreferSimpleProtocol parameter                                             | false     |          |
| GDD_DB_POSTGRES_WITHOUTRETURNING     | Gorm's WithoutReturning parameter                                                | false     |          |
| GDD_DB_PROMETHEUS_ENABLE     | Enable Prometheus monitoring                                                | false     |          |
| GDD_DB_PROMETHEUS_REFRESHINTERVAL     | Prometheus monitoring refresh interval in seconds                                             | 15     |          |
| GDD_DB_PROMETHEUS_DBNAME     | Database name used for Prometheus monitoring                                          |      |          |
| GDD_DB_CACHE_ENABLE     | Enable database query caching                                          | false     |          | 