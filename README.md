# resource-endpoint
[![CircleCI](https://circleci.com/gh/ericdowell/resource-endpoint.svg?style=svg)](https://circleci.com/gh/ericdowell/resource-endpoint)
[![npm version](https://img.shields.io/npm/v/resource-endpoint.svg?style=flat-square)](https://www.npmjs.com/package/resource-endpoint)
[![npm downloads](https://img.shields.io/npm/dm/resource-endpoint.svg?style=flat-square)](http://npm-stat.com/charts.html?package=resource-endpoint)

A simple resource wrapper for Axios and collection of useful Mixins for building Laravel APIs.

## Examples
Here are two examples using the `AuthEndpoint` and `UserEndpoint` classes with several Mixin functions:
```js
// js/api/endpoints/auth.js
import { AuthEndpoint, ApiMixin, HandleErrorMixin } from 'resource-endpoint'

export class Auth extends HandleErrorMixin(ApiMixin(AuthEndpoint)) {
    /**
     * Override to set as version, default to empty
     * e.g. v1, v3, v5 and so on.
     *
     * @returns {string}
     */
    get version() {
        return 'v1'
    }
}
```
```js
// js/api/endpoints/user.js
import { ApiMixin, UserEndpoint, HandleErrorMixin } from 'resource-endpoint'

export class User extends HandleErrorMixin(ApiMixin(UserEndpoint)) {
    /**
     * Override to set as version, default to empty
     * e.g. v1, v3, v5 and so on.
     *
     * @returns {string}
     */
    get version() {
        return 'v1'
    }
}
```
You can use a singleton/factory pattern with a base `Api` class:
```js
// js/api/index.js
import { Auth } from './endpoints/auth'
import { User } from './endpoints/user'

class Api {
    /**
     *
     * @returns {Auth}
     */
    get auth() {
        return new Auth()
    }

    /**
     * @returns {User}
     */
    get user() {
        return new User()
    }
}

export const api = new Api()
```

### Usage
```js
// js/index.js
import { api } from './api'
import { safeResponseData } from 'resource-endpoint'

// Usage shown in async functions, likely placed in the component onSubmit for the form
// Not created as helper function necessarily as shown below.

const currentUser = async () => {
    const { user, errors } = safeResponseData(await api.user.current())
    return { errors, user }
}

const confirmPassword = async (values) => {
    const { errors, confirmedAt } = safeResponseData(await api.user.confirmPassword(values.password))
    return { errors, confirmedAt }
}

const logoutUser = async () => {
    const { errors } = safeResponseData(await api.auth.logout())
    return { errors }
}

const loginUser = async (email, password) => {
    const { user, errors } = safeResponseData(await api.auth.login({ email, password }))
    return { errors, user }
}

const registerUser = async (values) => {
    const { user, errors } = safeResponseData(await api.auth.register({
        email: values.email,
        emailConfirmation: values.emailConfirmation,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        name: values.name,
    }))
    return { errors, user }
}
```
