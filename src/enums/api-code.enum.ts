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
}
