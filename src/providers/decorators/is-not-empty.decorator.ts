import { IsNotEmpty as _IsNotEmpty, ValidationOptions } from 'class-validator';

export function IsNotEmpty(validationOptions?: ValidationOptions) {
  return _IsNotEmpty(
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
