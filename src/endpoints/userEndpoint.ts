import { CrudEndpoint } from '../crudEndpoint'
import { AxiosResponse } from 'axios'

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
   * @returns {Promise<any>}
   */
  async resendEmailVerification<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.post<T, R>('/email/resend')
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
