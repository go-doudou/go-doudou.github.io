# Cache

go-doudou provides memory cache and redis cache of read operation result out of box based on [https://github.com/go-redis/cache](https://github.com/go-redis/cache).

Only `GetContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error` and `SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) error` methods of `wrapper.DB` and `wrapper.Tx` interfaces have cache feature.
	
Please read below example code to understand the usage:

```go
func main() {

  ...

	// create redis connection instance
	ring := redis.NewRing(&redis.RingOptions{
		Addrs: map[string]string{
			"server1": ":6379",
		},
	})

  // create cache instance
	mycache := cache.New(&cache.Options{
    // redis cache
		Redis: ring,
		// local memory cache, if not need, you can get rid of it
		LocalCache:   cache.NewTinyLFU(1000, time.Minute),
		// enable redis cache hit stats
		StatsEnabled: true,
	})

	u := dao.NewUserDao(wrapper.NewGddDB(db, 
        // there is no default cache implementation being set in wrapper.NewGddDB factory function,
        // so you need to pass your own by wrapper.WithCache
        wrapper.WithCache(mycache), 
				// call wrapper.WithRedisKeyTTL function to set redis key ttl,
        // default ttl is 1h
        wrapper.WithRedisKeyTTL(10*time.Second)))

	...

	// call dao layer method
	_, err = u.Insert(context.TODO(), &user)
	if err != nil {
		panic(err)
	}
	logrus.Printf("user %s's id is %d\n", user.Name, user.Id)

  // call dao layer method
	got, err := u.PageMany(context.TODO(), Page{
		Orders: []Order{
			{
				Col:  "age",
				Sort: "desc",
			},
		},
		Offset: 0,
		Size:   1,
	}, C().Col("age").Gt(27))
	if err != nil {
		panic(err)
	}
    
  ...

  // repeat call to see SQL logging
	got, err = u.PageMany(context.TODO(), Page{
		Orders: []Order{
			{
				Col:  "age",
				Sort: "desc",
			},
		},
		Offset: 0,
		Size:   1,
	}, C().Col("age").Gt(27))
	if err != nil {
		panic(err)
	}
	 
  ...

	fmt.Println(mycache.Stats())
}
```

Here is a SQL logging example. Value `false` after `HIT: ` means cache miss, `true` means cache hit. `&{Hits:2 Misses:2}` means cache hit 2 times, cache miss 2 times.

```shell
INFO[2022-05-23 20:54:24] SQL: INSERT INTO `test`.`ddl_user` ( `id`, `name`, `phone`, `age`, `no`, `school`, `is_student`, `delete_at`, `avg_score`, `hobby`) VALUES ( '0', 'jack', '13552053960', '30', '0', null, '0', null, '97.53
4', '')
INFO[2022-05-23 20:54:24] user jack's id is 14                                                                     
INFO[2022-05-23 20:54:24] SQL: select * from ddl_user where `age` > '27' order by `age` desc limit 0,1  HIT: false 
INFO[2022-05-23 20:54:24] SQL: select count(1) from ddl_user where `age` > '27' HIT: false                         
INFO[2022-05-23 20:54:24] returned user jack's id is 14                                                            
INFO[2022-05-23 20:54:24] returned user jack's average score is 97.534                                             
INFO[2022-05-23 20:54:24] SQL: select * from ddl_user where `age` > '27' order by `age` desc limit 0,1  HIT: true  
INFO[2022-05-23 20:54:24] SQL: select count(1) from ddl_user where `age` > '27' HIT: true                          
INFO[2022-05-23 20:54:24] returned user jack's id is 14                                                            
INFO[2022-05-23 20:54:24] returned user jack's average score is 97.534                                             
&{Hits:2 Misses:2}                                                                                                             
INFO[2022-05-23 20:54:24] SQL: delete from ddl_user where `age` > '27';       
```

