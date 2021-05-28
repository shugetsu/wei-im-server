import { MinLength as _MinLength, ValidationOptions } from 'class-validator';

export function MinLength(min: number, validationOptions?: ValidationOptions) {
  return _MinLength(
    min,
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
