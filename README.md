# resource-endpoint
[![CircleCI](https://circleci.com/gh/ericdowell/resource-endpoint.svg?style=svg)](https://circleci.com/gh/ericdowell/resource-endpoint)
[![npm version](https://img.shields.io/npm/v/resource-endpoint.svg?style=flat-square)](https://www.npmjs.com/package/resource-endpoint)
[![npm downloads](https://img.shields.io/npm/dm/resource-endpoint.svg?style=flat-square)](http://npm-stat.com/charts.html?package=resource-endpoint)

A simple resource wrapper for Axios and collection of useful Mixins for building Laravel APIs.

## Examples
Using a singleton/factory pattern with a base `Api` class:
```js
// js/api/index.js
import { Auth } from './endpoints/auth'
import { User } from './endpoints/user'
// eslint-disable-next-line no-unused-vars
import { AxiosResponse } from 'axios'
import { Endpoint } from 'resource-endpoint'

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

    /**
     *
     * @param {AxiosResponse} response
     * @param {boolean} isArray
     * @returns {*}
     */
    safeResponseData(response, isArray = false) {
        return Endpoint.safeResponseData(response, isArray)
    }
}

export const api = new Api()
```
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
### Usage
```js
// js/index.js
import { api } from './api'

// Usage shown in async functions, likely placed in the component onSubmit for the form
// Not created as helper function necessarily as shown below.

const currentUser = async () => {
    const { user, errors } = api.safeResponseData(await api.user.current())
    return { errors, user }
}

const confirmPassword = async (values) => {
    const { errors, confirmedAt } = api.safeResponseData(await api.user.confirmPassword(values.password))
    return { errors, confirmedAt }
}

const logoutUser = async () => {
    const { errors } = api.safeResponseData(await api.auth.logout())
    return { errors }
}

const loginUser = async (email, password) => {
    const { user, errors } = api.safeResponseData(await api.auth.login({ email, password }))
    return { errors, user }
}

const registerUser = async (values) => {
    const { user, errors } = api.safeResponseData(await api.auth.register({
        email: values.email,
        emailConfirmation: values.emailConfirmation,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        name: values.name,
    }))
    return { errors, user }
}
```

### Using in React Login Component
Then in your client app you can do the following:
```jsx
// js/pages/Login.jsx
import React from 'react'
import { useFormChange } from 'resource-endpoint'
import { api } from '../api'

export const Login = (props) => {
    const initialState = {
        errors: {},
        email: '',
        password: '',
        remember: false,
    }
    const [onChange, values, setValues] = useFormChange(initialState)
    const onSubmit = async (e) => {
        e.preventDefault()
        const response = await api.auth.login({
            email: values.email,
            password: values.password,
            remember: values.remember,
        })
        const { user, errors } = api.safeResponseData(response)
        if (errors) {
            setValues({ ...values, errors })
            return
        } else if (!user) {
            setValues({
                ...values,
                errors: {
                    message:
                        'Something went wrong. Please try again.',
                },
            })
            return
        }
        setValues(initialState)
        props.loginUser(user)
    }
    return (
        <form onSubmit={onSubmit}>
            {/* TODO: Error handling, display error messages */}
            <input type="email" name="email" value={values.email} onChange={onChange} />
            <input type="password" name="password" value={values.password} onChange={onChange} />
            <input type="checkbox" name="remember" checked={values.remember} onChange={onChange} />
            <input type="submit" value="Login" />
        </form>
    )
}
```

### Using RequestForm in React Login Component
Then in your client app you can do the following:
```jsx
// js/pages/Login.jsx
import React from 'react'
import { RequestForm, useFormChange } from 'resource-endpoint'
import { api } from '../api'

export const Login = (props) => {
    const initialState = {
        errors: {},
        email: '',
        password: '',
        remember: false,
    }
    const [onChange, values, setValues] = useFormChange(initialState)
    const makeRequest = (inputs) => api.auth.login(inputs)
    const onSuccess = ({ user }) => {
        if (!user) {
            setValues({
                ...values,
                errors: {
                    message:
                        'Something went wrong. Please try again.',
                },
            })
            return
        }
        setValues(initialState)
        props.loginUser(user)
    }
    return (
        <RequestForm makeRequest={makeRequest} onSuccess={onSuccess} setValues={setValues} values={values}>
            {/* TODO: Error handling, display error messages */}
            <input type="email" name="email" value={values.email} onChange={onChange} />
            <input type="password" name="password" value={values.password} onChange={onChange} />
            <input type="checkbox" name="remember" checked={values.remember} onChange={onChange} />
            <input type="submit" value="Login" />
        </form>
    )
}
```
