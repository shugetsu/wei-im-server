import { Length as _Length, ValidationOptions } from 'class-validator';

export function Length(
  min: number,
  max?: number,
  validationOptions?: ValidationOptions,
) {
  return _Length(
    min,
    max,
    Object.assign(
      {
        message: JSON.stringify({
          property: '$property',
          constraint1: '$constraint1',
          constraint2: '$constraint2',
        }),
      },
      validationOptions,
    ),
  );
}
