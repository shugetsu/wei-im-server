export enum ApiCode {
  /**
   * 成功
   */
  OK = 200,

  /**
   * 内部服务器错误
   */
  INTERNAL_SERVER_ERROR = 500,

  /**
   * 未授权
   */
  UNAUTHORIZED = 401,

  /**
   * 令牌无效
   */
  TOKEN_INVALID = 402,

  /**
   * 令牌已过期
   */
  TOKEN_EXPIRED = 403,

  /**
   * 鉴权失败
   */
  AUTHENTICATION_FAIL = 405,

  /**
   * 参数错误
   */
  PARAMETER_ERROR = 400,

  /**
   * 注册失败
   */
  REGISTER_FAIL = 10000,

  /**
   * 邮箱已注册
   */
  EMAIL_REGISTERED = 10001,

  /**
   * 邮箱已注册，但未认证
   */
  EMAIL_REGISTERED_UNVERIFIED = 10002,

  /**
   * 登录失败，账号不存在
   */
  LOGIN_FAIL_ACCOUNT_NOT_EXIST = 10003,

  /**
   * 登录失败，密码错误
   */
  LOGIN_FAIL_PASSWORD_ERROR = 10004,

  /**
   * 登录失败，邮箱未认证
   */
  LOGIN_FAIL_EMAIL_UNVERIFIED = 10005,

  /**
   * 登录失败，缓存异常
   */
  LOGIN_FAIL_CACHE_EXCEPTION = 10006,

  /**
   * 用户不存在
   */
  USER_NOT_EXIST = 10008,

  /**
   * 激活邮件发送失败，对方拒收
   */
  ACTIVATE_MAIL_SEND_FAIL_REJECTED = 10009,

  /**
   * 无法发送激活邮件，邮箱未注册
   */
  UNABLE_SEND_ACTIVATE_MAIL_EMAIL_NOT_REGISTERED = 10010,

  /**
   * 无法发送激活邮件，邮箱已认证
   */
  UNABLE_SEND_ACTIVATE_AUTHENTICATED = 10011,
}
