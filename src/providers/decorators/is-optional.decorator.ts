import { IsOptional as _IsOptional, ValidationOptions } from 'class-validator';

export function IsOptional(validationOptions?: ValidationOptions) {
  return _IsOptional(validationOptions);
}
