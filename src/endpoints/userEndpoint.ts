import { AxiosResponse } from 'axios'
import { CrudEndpoint } from '../crudEndpoint'

export class UserEndpoint extends CrudEndpoint {
  /**
   *
   * @returns {Promise<any>}
   */
  async current<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.get('/user')
  }

  /**
   *
   * @param {string|number} userId
   * @param {any=} params
   * @returns {Promise<any>}
   */
  async show<T = any, R = AxiosResponse<T>>(userId: string | number, params?: any): Promise<R> {
    return this.get<T, R>(`/user/${userId}`, { params })
  }

  /**
   *
   * @param {string|number} userId
   * @param {any} data
   * @returns {Promise<any>}
   */
  async update<T = any, R = AxiosResponse<T>>(userId: string | number, data: any): Promise<R> {
    return this.put<T, R>(`/user/${userId}`, { data })
  }

  /**
   *
   * @returns {Promise<any>}
   */
  async resendEmailVerification<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.post<T, R>('/email/resend')
  }

  /**
   * For where confirm password middleware is NOT enabled.
   *
   * @param {any} currentPassword
   * @param {any} password
   * @param {any} passwordConfirmation
   * @returns {Promise<any>}
   */
  async changePassword<T = any, R = AxiosResponse<T>>(
    currentPassword: any,
    password: any,
    passwordConfirmation: any,
  ): Promise<R> {
    const data = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      current_password: currentPassword,
      password,
      // eslint-disable-next-line @typescript-eslint/camelcase
      password_confirmation: passwordConfirmation,
    }
    return this.put<T, R>('/password/change', { data })
  }

  /**
   * Use where confirm password middleware is enabled.
   *
   * @param {any} password
   * @param {any} passwordConfirmation
   * @returns {Promise<any>}
   */
  async updatePassword<T = any, R = AxiosResponse<T>>(
    password: any,
    passwordConfirmation: any,
  ): Promise<R> {
    const data = {
      password,
      // eslint-disable-next-line @typescript-eslint/camelcase
      password_confirmation: passwordConfirmation,
    }
    return this.put<T, R>('/password/change', { data })
  }

  /**
   *
   * @param {any} password
   * @returns {Promise<any>}
   */
  async confirmPassword<T = any, R = AxiosResponse<T>>(password: string): Promise<R> {
    const data = { password }
    return this.post('/password/confirm', { data })
  }
}
