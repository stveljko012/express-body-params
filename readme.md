# express-body-params

express-body-params is decorator for handler functions to validate body before function called.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/express-body-params) to install foobar.

```bash
npm  i express-body-params
```

## Usage

```typescript
import { Params, ParamTypes } from 'express-body-params';

@Params([
    { name: "email", type: ParamTypes.email, required: true },
    { name: "password", type: ParamTypes.string, required: true }
])
async login(req: any, res: any): Promise<void> {
    ...
}



```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)