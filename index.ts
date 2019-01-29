
export enum ParamTypes {
    number = 'number',
    string = 'string',
    boolean = 'boolean',
    email = 'email'
}

export interface  IParamConfig {
    required?: boolean;
    pattern?: RegExp;
    min?: number;
    max?: number;
    type: ParamTypes;
    name: string;
}

export class ParamError {
    constructor(
        public param: string,
        public message: string
    ) { }
}

const _typeHandler = (param: any, paramConfig: IParamConfig, errors: ParamError[]): void => {

    if (param && paramConfig.type == ParamTypes.email) {
        const _emailRegex: RegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        const isValidEmail: boolean = _emailRegex.test(param);
        if (!isValidEmail) {
            errors.push(new ParamError(paramConfig.name, `${paramConfig.name} should be valid email.`))
        }
    }

    if (param && paramConfig.type == ParamTypes.string) {
        if (typeof param != ParamTypes.string.toString()) {
            errors.push(new ParamError(paramConfig.name, `${paramConfig.name} should be string.`))
        }
    }

    if (param && paramConfig.type == ParamTypes.number) {
        if (typeof param != ParamTypes.number.toString()) {
            errors.push(new ParamError(paramConfig.name, `${paramConfig.name} should be number.`))
        }
    }

    if (param && paramConfig.type == ParamTypes.boolean) {
        if (typeof param != ParamTypes.boolean.toString()) {
            errors.push(new ParamError(paramConfig.name, `${paramConfig.name} should be boolean.`))
        }
    }
};

const _requiredHandler = (param: any, paramConfig: IParamConfig, errors: ParamError[]): void => {
    if ([undefined, null, ''].indexOf(param) > -1) {
        errors.push(new ParamError(paramConfig.name, `${paramConfig.name} is required.`))
    }
};

const _minimumHandler = (param: any, paramConfig: IParamConfig, errors: ParamError[]): void => {
    if (param && paramConfig.min && paramConfig.type == ParamTypes.number) {
       if (param < paramConfig.min) {
           errors.push(new ParamError(paramConfig.name, `${paramConfig.name} should be ${paramConfig.min} minimum.`));
       }
    }

    if (paramConfig.min && paramConfig.type == ParamTypes.string) {
        if (param && param.length < paramConfig.min) {
            errors.push(new ParamError(paramConfig.name, `${paramConfig.name} length should be ${paramConfig.min} minimum.`));
        }
    }
};

const _maximumHandler = (param: any, paramConfig: IParamConfig, errors: ParamError[]): void => {
    if (paramConfig.max && paramConfig.type == ParamTypes.number) {
        if (param && param > paramConfig.max) {
            errors.push(new ParamError(paramConfig.name,
                `${paramConfig.name} should not be more than ${paramConfig.max}.`));
        }
    }

    if (paramConfig.max && paramConfig.type == ParamTypes.string) {
        if (param && param.length > paramConfig.max) {
            errors.push(new ParamError(paramConfig.name,
                `${paramConfig.name} length should not be longer than ${paramConfig.max}.`));
        }
    }
};

const _patternHandler = (param: any, paramConfig: IParamConfig, errors: ParamError[]): void => {
    if (paramConfig.pattern && !paramConfig.pattern.test(param)) {
        errors.push(new ParamError(paramConfig.name, `${paramConfig.name} does not match pattern.`))
    }
};

export function Params(handleInside: boolean, params: IParamConfig[]) {
    return function(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            const [req, res] = args;
            let errors: ParamError[] = [];

            for (let i = 0; i < params.length; i++) {
                const paramConfig = params[i];
                const fromBody = req.body[paramConfig.name];

                if (paramConfig.required) {
                    _requiredHandler(fromBody, paramConfig, errors);
                    _typeHandler(fromBody, paramConfig, errors);
                }
                else {
                    _typeHandler(fromBody, paramConfig, errors);
                }

                if (paramConfig.min) {
                    _minimumHandler(fromBody, paramConfig, errors);
                }

                if (paramConfig.max) {
                    _maximumHandler(fromBody, paramConfig, errors);
                }

                if (paramConfig.pattern) {
                    _patternHandler(fromBody, paramConfig, errors);
                }
            }

            if (errors.length > 0 && handleInside) {
                res.status(400).send({
                    errors: errors
                });
                return false
			}
			
			req.validBody = errors.length === 0 ? true : false;
			req.bodyErrors = errors;

            return originalMethod.apply(this, args);
        };

        return descriptor;
    }
}