/**
 * Swagger 配置
 */
export const SwaggerConfig = {
  /**
   * 是否开启文档
   */
  enable: true,

  /**
   * 标题
   */
  title: 'Wei IM',

  /**
   * 描述
   */
  desc: 'Wei IM api document',

  /**
   * 版本号
   */
  version: require('../../package.json').version,

  /**
   * 文档访问路径
   */
  setupPath: 'docs',
};
