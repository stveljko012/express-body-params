# express-body-params

express-body-params is decorator for handler functions to validate body before function called.

## Installation

Use the package manager [npm](https://www.npmjs.com) to install express-body-params decorator.

```bash
npm i express-body-params
```

## Usage
#### Skip method call if body is not valid and send status 400 with errors:

```typescript
import { Params, ParamTypes } from 'express-body-params';


// SET THIS PARAMETER TO TRUE
@Params(true, [
    { name: "email", type: ParamTypes.email, required: true },
    { name: "password", type: ParamTypes.string, required: true }
])
async login(req: any, res: any): Promise<void> {
	...
}
```

#### Call method call if body is not valid and pass errors to it:

```typescript
import { Params, ParamTypes, ParamError } from 'express-body-params';


// SET THIS PARAMETER TO FALSE
@Params(false, [
    { name: "email", type: ParamTypes.email, required: true },
    { name: "password", type: ParamTypes.string, required: true }
])
async login(req: any, res: any): Promise<void> {
    if (req.validBody) {
        ...
    } else { 
        const errors: ParamError[] = req.bodyErrors;
        res.status(400).send({ errors })
    }
}
```
## Optional checks

- __required__ - Checks if param exists.
- __pattern__ - Checks if param match the passed pattern.
- __min__/__max__- Checks length of string if string type is setted or compare numbers for type number.

## Parameters

| Parameter       | Type          |
|:----------------|:--------------| 
| handleInside    | Boolean       |
| params          | IParamConfig[]|

## Types
#### IParamConfig
```
export interface IParamConfig {
    required?: boolean;
    pattern?: RegExp;
    min?: number;
    max?: number;
    type: ParamTypes;
    name: string;
}
```

#### ParamError
```
export declare class ParamError {
    param: string;
    message: string;
    constructor(param: string, message: string);
}
```

#### ParamTypes
```
export declare enum ParamTypes {
    number = "number",
    string = "string",
    boolean = "boolean",
    email = "email"
}
```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Please star me on github.

## License
[MIT](https://choosealicense.com/licenses/mit/)
