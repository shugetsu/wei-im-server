export const JwtConfig = {
  token: {
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
};
