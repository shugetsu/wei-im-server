import { Max as _Max, ValidationOptions } from 'class-validator';

export function Max(max: number, validationOptions?: ValidationOptions) {
  return _Max(
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
