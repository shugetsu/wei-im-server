import { Min as _Min, ValidationOptions } from 'class-validator';

export function Min(min: number, validationOptions?: ValidationOptions) {
  return _Min(
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
