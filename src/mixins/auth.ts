import { AxiosResponse } from 'axios'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function AuthMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    async login<T = any, R = AxiosResponse<T>>(values: {
      email: string
      password: any
      remember?: boolean
    }): Promise<R> {
      const { remember = true } = values
      const data = { remember, email: values.email, password: values.password }
      return this.post('login', { data })
    }

    async logout<T = any, R = AxiosResponse<T>>(): Promise<R> {
      return this.post('logout')
    }

    async register<T = any, R = AxiosResponse<T>>(values: {
      email: string
      emailConfirmation: string
      password: any
      passwordConfirmation: any
      remember?: boolean
      [key: string]: any
    }): Promise<R> {
      const { emailConfirmation, passwordConfirmation, remember = true, ...inputs } = values
      const data = {
        ...inputs,
        // eslint-disable-next-line @typescript-eslint/camelcase
        email_confirmation: emailConfirmation,
        // eslint-disable-next-line @typescript-eslint/camelcase
        password_confirmation: passwordConfirmation,
        remember,
      }
      return this.post('register', { data })
    }

    async requestPasswordReset<T = any, R = AxiosResponse<T>>(email: string): Promise<R> {
      return this.post('password/email', { data: { email } })
    }

    async resetPassword<T = any, R = AxiosResponse<T>>(values: {
      email: string
      token: string
      password: any
      passwordConfirmation: any
    }): Promise<R> {
      const data = {
        email: values.email,
        token: values.token,
        password: values.password,
        // eslint-disable-next-line @typescript-eslint/camelcase
        password_confirmation: values.passwordConfirmation,
      }
      return this.post('password/reset', { data })
    }
  }
}
