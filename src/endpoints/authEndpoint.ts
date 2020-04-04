import { AxiosResponse } from 'axios'
import { CrudEndpoint } from '../crudEndpoint'

export class AuthEndpoint extends CrudEndpoint {
  /**
   *
   * @param {string} email
   * @param {any} password
   * @param {boolean} remember
   * @returns {Promise<any>}
   */
  async login<T = any, R = AxiosResponse<T>>(email: string, password: any, remember = true): Promise<R> {
    const data = {
      email,
      password,
      remember,
    }
    return this.post<T, R>('/login', { data })
  }

  /**
   *
   * @returns {Promise<any>}
   */
  async logout<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.post<T, R>('/logout')
  }

  /**
   *
   * @param {string} email
   * @param {string} emailConfirmation
   * @param {any} password
   * @param {any} passwordConfirmation
   * @param {any} attributes
   * @param {boolean} remember
   * @returns {Promise<any>}
   */
  async register<T = any, R = AxiosResponse<T>>(
    email: string,
    emailConfirmation: string,
    password: any,
    passwordConfirmation: any,
    attributes?: { [key: string]: any },
    remember = true,
  ): Promise<R> {
    const data = {
      email,
      // eslint-disable-next-line @typescript-eslint/camelcase
      email_confirmation: emailConfirmation,
      password,
      // eslint-disable-next-line @typescript-eslint/camelcase
      password_confirmation: passwordConfirmation,
      remember,
      ...attributes,
    }
    return this.post<T, R>('/register', { data })
  }

  /**
   *
   * @param {string} email
   * @returns {Promise<any>}
   */
  async requestPasswordReset<T = any, R = AxiosResponse<T>>(email: string): Promise<R> {
    const data = {
      email,
    }
    return this.post<T, R>('/password/email', { data })
  }

  /**
   *
   * @param {string} email
   * @param {string} token
   * @param {any} password
   * @param {any} passwordConfirmation
   * @returns {Promise<any>}
   */
  async resetPassword<T = any, R = AxiosResponse<T>>(
    email: string,
    token: string,
    password: any,
    passwordConfirmation: any,
  ): Promise<R> {
    const data = {
      email,
      token,
      password,
      // eslint-disable-next-line @typescript-eslint/camelcase
      password_confirmation: passwordConfirmation,
    }
    return this.post<T, R>('/password/reset', { data })
  }
}
