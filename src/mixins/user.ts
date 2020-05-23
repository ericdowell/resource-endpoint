import { AxiosResponse } from 'axios'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function UserMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    async current<T = any, R = AxiosResponse<T>>(): Promise<R> {
      return this.get('user')
    }

    async show<T = any, R = AxiosResponse<T>>(userId: string | number, params?: any): Promise<R> {
      return this.get(`user/${userId}`, { params })
    }

    async update<T = any, R = AxiosResponse<T>>(userId: string | number, data: any): Promise<R> {
      return this.put(`user/${userId}`, { data })
    }

    async resendEmailVerification<T = any, R = AxiosResponse<T>>(): Promise<R> {
      return this.post('email/resend')
    }

    async changePassword<T = any, R = AxiosResponse<T>>(values: {
      currentPassword?: any
      password: any
      passwordConfirmation: any
    }): Promise<R> {
      const data = {
        password: values.password,
        current_password: values.currentPassword,
        password_confirmation: values.passwordConfirmation,
      }
      return this.put('password/change', { data })
    }

    async confirmPassword<T = any, R = AxiosResponse<T>>(password: string): Promise<R> {
      return this.post('password/confirm', { data: { password } })
    }
  }
}
