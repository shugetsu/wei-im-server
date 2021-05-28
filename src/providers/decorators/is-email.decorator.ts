import { IsEmail as _IsEmail, ValidationOptions } from 'class-validator';

export function IsEmail(options?: any, validationOptions?: ValidationOptions) {
  return _IsEmail(
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
