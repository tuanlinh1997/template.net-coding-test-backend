import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'PasswordStrength', async: false })
export class PasswordStrengthConstraint implements ValidatorConstraintInterface {
    validate(password: string) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
        return typeof password === 'string' && regex.test(password);
    }

    defaultMessage() {
        return 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ in hoa, 1 số và 1 ký tự đặc biệt.';
    }
}

export function PasswordStrength(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: PasswordStrengthConstraint,
        });
    };
}
