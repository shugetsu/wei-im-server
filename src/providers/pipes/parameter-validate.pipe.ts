import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ApiCode } from 'src/enums/api-code.enum';
import { ParameterException } from 'src/common/exception/parameter-exception';
import {
  I18nParameterMsg,
  I18nParameterMsgs,
} from 'src/common/exception/base-exception';
import { validate } from 'class-validator';

/**
 * 参数验证管道
 */
@Injectable()
export class ParameterValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const msgs: I18nParameterMsgs = [];
      errors.forEach((e) => {
        const errItem: I18nParameterMsg = {
          field: e.property,
          messages: [],
        };
        for (const key in e.constraints) {
          errItem.messages.push({
            i18nKey: `Validation.${key}`,
            args: JSON.parse(e.constraints[key]),
          });
        }
        msgs.push(errItem);
      });
      // console.log(msgs);
      // errors.forEach((err) => {
      //   msgs[err.property] = Object.values(err.constraints);
      // });
      // console.log(msgs);
      // console.log(errors);
      // console.log(errors);
      // for (let i = 0; i < errors.length; i++) {
      //   const err = errors[i];
      // }
      // console.log(errors);
      // console.log(errors);
      // const msgs: I18nParameterMsgs = [];
      // for (let i = 0; i < errors.length; i++) {
      //   const err = errors[i];
      //   msgs.push(this.createParameterErrorItem(err.property, err.constraints));
      // }
      throw new ParameterException({
        status: HttpStatus.BAD_REQUEST,
        code: ApiCode.PARAMETER_ERROR,
        msg: msgs,
      });
    }

    return value;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * 创建参数错误项
   * @param field
   * @param constraints
   */
  private createParameterErrorItem(
    field: string,
    constraints: Record<string, string>,
  ) {
    const messages = [];
    for (const rule in constraints) {
      messages.push({
        i18nKey: `Validation.${rule}`,
        args: this.getRuleArgs(field, constraints[rule]),
      });
    }
    return { field, messages };
  }

  /**
   * 获取占位值
   * @param property
   * @param constraints
   */
  private getRuleArgs(property: string, constraints: string) {
    let constraintArr;

    try {
      constraintArr = JSON.parse(constraints);
    } catch (err) {
      constraintArr = [];
    }

    const args = constraintArr.reduce(
      (args, value, i) => {
        args[`constraint${i + 1}`] = value;
        return args;
      },
      { property },
    );
    return args;
  }
}
