# resource-endpoint
[![CircleCI](https://circleci.com/gh/ericdowell/resource-endpoint.svg?style=svg)](https://circleci.com/gh/ericdowell/resource-endpoint)
[![npm version](https://img.shields.io/npm/v/resource-endpoint.svg?style=flat-square)](https://www.npmjs.com/package/resource-endpoint)
[![npm downloads](https://img.shields.io/npm/dm/resource-endpoint.svg?style=flat-square)](http://npm-stat.com/charts.html?package=resource-endpoint)

A simple resource wrapper for Axios.

## Examples
Using a singleton pattern with a base `Api` class:
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
import {
    AuthEndpoint,
    ApiEndpointMixin,
    HandleErrorMixin
} from 'resource-endpoint'

export class Auth extends HandleErrorMixin(ApiEndpointMixin(AuthEndpoint)) {
    /**
     * Override to set as version, default to empty
     * e.g. v1, v3, v5 and so on.
     *
     * @returns {string}
     */
    get apiVersion() {
        return 'v1'
    }
}
```
```js
// js/api/endpoints/user.js
import {
    ApiEndpointMixin,
    UserEndpoint,
    HandleErrorMixin
} from 'resource-endpoint'

export class User extends HandleErrorMixin(ApiEndpointMixin(UserEndpoint)) {
    /**
     * Override to set as version, default to empty
     * e.g. v1, v3, v5 and so on.
     *
     * @returns {string}
     */
    get apiVersion() {
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
    const response = await api.user.current()
    const { user, errors } = api.safeResponseData(response)
    return { errors, user }
}

const confirmPassword = async (values) => {
    const response = await api.user.confirmPassword(values.password)
    const { errors, intended } = api.safeResponseData(response)
    return { errors, intended }
}

const logoutUser = async () => {
    const response = await api.auth.logout()
    const { errors } = api.safeResponseData(response)
    return { errors }
}

const loginUser = async (email, password) => {
    const response = await api.auth.login(email, password)
    const { user, errors } = api.safeResponseData(response)
    return { errors, user }
}

const registerUser = async (values) => {
    const response = await api.auth
        .register(
            values.email,
            values.email_confirmation,
            values.password,
            values.password_confirmation,
            { name: values.name },
        )
    const { user, errors } = api.safeResponseData(response)
    return { errors, user }
}
```

### Using in React Login Component
Then in your client app you can do the following:
```jsx
// js/pages/Login.jsx
import React, { useState } from 'react'
import { api } from '../api'

export const Login = () => {
    const initialState = {
        errors: {},
        email: '',
        password: '',
        remember: false,
    }
    const [values, setValues] = useState(initialState)
    const onSubmit = async (e) => {
        e.preventDefault()
        const response = await api.auth.login(
            values.email,
            values.password,
        )
        const { user, errors } = api.safeResponseData(response)
        if (errors) {
            setValues({ ...values, errors })
            return
        } else if (!user) {
            setValues({
                ...values,
                errors: {
                    fallback:
                        'Something went wrong. Please try again.',
                },
            })
            return
        }
        setValues(initialState)
        dispatch({ type: SET_USER, user })
    }
    return <form onSubmit={onSubmit})></form>
}
```

## Todo
- [ ] Add documentation?
