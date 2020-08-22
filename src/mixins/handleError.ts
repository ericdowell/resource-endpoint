import { AxiosError, AxiosResponse } from 'axios'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function HandleErrorMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    /** @protected */
    shouldThrowError = false

    get throwResponseError(): this {
      this.shouldThrowError = true
      return this
    }

    get defaultErrorMessage(): string {
      return 'An unexpected error has occurred. Please try again.'
    }

    errorBlock(message: string): any {
      return {
        message,
      }
    }

    handleError<T = any>(error: AxiosError<T> | any): AxiosResponse<T | { message?: string; errors: any }> {
      if (this.shouldThrowError) {
        throw error
      }
      let message = this.defaultErrorMessage
      if (error?.response?.data?.errors) {
        return error.response
      } else if (typeof error?.response?.data?.message === 'string') {
        message = error.response.data.message
      }
      return {
        headers: error?.response?.headers,
        config: error?.config ?? error?.response?.config,
        status: error?.response?.status ?? 500,
        statusText: error?.response?.statusText ?? 'Internal Server Error',
        data: {
          message,
          errors: this.errorBlock(message),
        },
      }
    }
  }
}
