import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isEitherEmailOrLogin', async: false })
export class IsEitherEmailOrLogin implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    return !!object.email || !!object.login; // Проверяем, заполнено ли хотя бы одно из полей
  }

  defaultMessage(args: ValidationArguments) {
    return 'Должен быть указан либо email, либо логин';
  }
}
