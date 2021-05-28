import { IsString as _IsString, ValidationOptions } from 'class-validator';

export function IsString(validationOptions?: ValidationOptions) {
  return _IsString(
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
