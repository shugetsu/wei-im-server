export const RedisConfig = {
  /**
   * redis 地址
   */
  host: 'localhost',

  /**
   * redis 端口
   */
  port: 6379,

  token: {
    dbName: 0,
    resolverField: 'token',
    secret: 'WeiIM@2021@Token',
    ttl: {
      ios: 7,
      android: 7,
      web: 1,
      window: 7,
      mac: 7,
    },
  },

  user: {
    dbName: 1,
    ttl: 0,
  },

  mail: {
    dbName: 2,
    secret: 'WeiIM@2021@Mail',
    activateMailTTL: 24,
    validateEmailUrl: ' http://localhost:3001/users/validate-email',
  },
};
