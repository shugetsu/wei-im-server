import { prop } from '@typegoose/typegoose';
import { UserGender } from 'src/enums/user-gender.enum';
import { UserRole } from 'src/enums/user-role.enum';
import { UserStatus } from 'src/enums/user-status.enum';
import { UserType } from 'src/enums/user-type.enum';

export class User {
  id?: string;

  /**
   * 邮箱
   */
  @prop({ required: true, unique: true })
  email: string;

  /**
   * 密码
   */
  @prop({ required: true, select: false })
  password: string;

  /**
   * 性别
   */
  @prop({ enum: UserGender, type: Number, default: UserGender.NEUTRAL })
  gender?: UserGender;

  /**
   * 头像
   */
  @prop({ required: true })
  avatar: string;

  /**
   * 昵称
   */
  @prop({ required: true })
  nickname: string;

  /**
   * 出生日期
   */
  @prop({ required: true })
  birthday: Date;

  /**
   * 个人简介
   */
  @prop({ default: '' })
  signature?: string;

  /**
   * 用户状态
   */
  @prop({ enum: UserStatus, type: Number, default: UserStatus.NORMAL_USE })
  status?: UserStatus;

  /**
   * 用户类型
   */
  @prop({ enum: UserType, type: Number, default: UserType.NORMAL_USER })
  type?: UserType;

  /**
   * 用户角色
   */
  @prop({ type: () => [Number], default: [UserRole.NORMAL_USER] })
  roles?: UserRole[];

  /**
   * 邮箱是否已认证
   */
  @prop({ default: false })
  isAuthEmail?: boolean;

  /**
   * 注册时间
   */
  @prop({ default: new Date() })
  registrationTime?: Date;
}
