import { AxiosResponse } from 'axios'
import { CrudEndpoint } from '../crudEndpoint'

export class Auth extends CrudEndpoint {
  /**
   *
   * @param {string} email
   * @param {any} password
   * @param {boolean} remember
   * @returns {Promise<any>}
   */
  login<T = any, R = AxiosResponse<T>>(email: string, password: any, remember = true): Promise<R> {
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
  logout<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.post<T, R>('/logout')
  }

  /**
   *
   * @param {string} email
   * @param {string} token
   * @param {any} password
   * @param {any} passwordConfirmation
   * @returns {Promise<any>}
   */
  resetPassword<T = any, R = AxiosResponse<T>>(
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
