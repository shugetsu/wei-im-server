import {
  IsDateString as _IsDateString,
  ValidationOptions,
} from 'class-validator';
import ValidatorJS from 'validator';

export function IsDateString(
  options?: ValidatorJS.IsISO8601Options,
  validationOptions?: ValidationOptions,
) {
  return _IsDateString(
    options,
    Object.assign(
      {
        message: JSON.stringify({
          property: '$property',
        }),
      },
      validationOptions,
    ),
  );
}
