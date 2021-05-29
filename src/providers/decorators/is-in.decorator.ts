import { IsIn as _IsIn, ValidationOptions } from 'class-validator';

export function IsIn(
  values: readonly any[],
  validationOptions?: ValidationOptions,
) {
  return _IsIn(
    values,
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
