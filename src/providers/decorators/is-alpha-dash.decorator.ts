import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAlphaDash(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAlphaDash',
      target: object.constructor,
      propertyName: propertyName,
      options: Object.assign(
        {
          message: JSON.stringify({
            property: '$property',
          }),
        },
        validationOptions,
      ),
      validator: {
        validate(value: any, args: ValidationArguments) {
          return /^[a-zA-Z0-9_-]+$/.test(value);
        },
      },
    });
  };
}
