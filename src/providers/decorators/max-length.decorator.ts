import { MaxLength as _MaxLength, ValidationOptions } from 'class-validator';

export function MaxLength(max: number, validationOptions?: ValidationOptions) {
  return _MaxLength(
    max,
    Object.assign(
      {
        message: JSON.stringify({
          property: '$property',
          constraint1: '$constraint1',
        }),
      },
      validationOptions,
    ),
  );
}
