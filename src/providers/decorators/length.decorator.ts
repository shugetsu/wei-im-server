import { Contains as _Contains, ValidationOptions } from 'class-validator';

export function Contains(seed: string, validationOptions?: ValidationOptions) {
  return _Contains(
    seed,
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
