import { AxiosResponse } from 'axios'
import { CrudEndpoint } from '../crudEndpoint'

export class UserEndpoint extends CrudEndpoint {
  async current<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.get('user')
  }

  async show<T = any, R = AxiosResponse<T>>(userId: string | number, params?: any): Promise<R> {
    return this.get<T, R>(`user/${userId}`, { params })
  }

  async update<T = any, R = AxiosResponse<T>>(userId: string | number, data: any): Promise<R> {
    return this.put<T, R>(`user/${userId}`, { data })
  }

  async resendEmailVerification<T = any, R = AxiosResponse<T>>(): Promise<R> {
    return this.post<T, R>('email/resend')
  }

  async changePassword<T = any, R = AxiosResponse<T>>(values: {
    currentPassword?: any
    password: any
    passwordConfirmation: any
  }): Promise<R> {
    const data = {
      password: values.password,
      // eslint-disable-next-line @typescript-eslint/camelcase
      current_password: values.currentPassword,
      // eslint-disable-next-line @typescript-eslint/camelcase
      password_confirmation: values.passwordConfirmation,
    }
    return this.put<T, R>('password/change', { data })
  }

  async confirmPassword<T = any, R = AxiosResponse<T>>(password: string): Promise<R> {
    return this.post('password/confirm', { data: { password } })
  }
}
