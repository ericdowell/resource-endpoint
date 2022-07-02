import { AxiosError, AxiosResponse } from 'axios'
import { Constructor } from './types'
import { defaultErrorMessage as constDefaultErrorMessage, errorsBlock as baseErrorsBlock } from './helpers'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function HandleErrorMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    /** @protected */
    shouldThrowError = false

    throwResponseError(): void {
      this.shouldThrowError = true
    }

    get defaultErrorMessage(): string {
      return constDefaultErrorMessage
    }

    errorsBlock(message: string): { message: string } {
      return baseErrorsBlock(message)
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
          errors: this.errorsBlock(message),
        },
      }
    }
  }
}
