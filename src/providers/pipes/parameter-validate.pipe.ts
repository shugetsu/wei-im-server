import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ApiCode } from 'src/enums/api-code.enum';
import { ParameterException } from 'src/common/exception/parameter-exception';
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
      throw new ParameterException({
        status: HttpStatus.BAD_REQUEST,
        code: ApiCode.PARAMETER_ERROR,
        msg: errors.map((e) => this.formatError(e.property, e.constraints)),
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
   * 格式化错误
   * @param field
   * @param constraints
   */
  private formatError(field: string, constraints: Record<string, string>) {
    const messages = [];
    for (const key in constraints) {
      messages.push({
        i18nKey: `Validation.${key}`,
        args: JSON.parse(constraints[key]),
      });
    }
    return { field, messages };
  }
}
