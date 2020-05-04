import { AxiosResponse } from 'axios'
import { CrudEndpoint } from '../crudEndpoint'

export class AuthEndpoint extends CrudEndpoint {
  async login<T = any, R = AxiosResponse<T>>(values: {
    email: string
    password: any
    remember?: boolean
  }): Promise<R> {
    const { remember = true } = values
    const data = { remember, email: values.email, password: values.password }
    return this.post<T, R>('login', { data })
  }

  async logout<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.post<T, R>('logout')
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
    return this.post<T, R>('register', { data })
  }

  async requestPasswordReset<T = any, R = AxiosResponse<T>>(data: { email: string }): Promise<R> {
    return this.post<T, R>('password/email', { data })
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
    return this.post<T, R>('password/reset', { data })
  }
}
