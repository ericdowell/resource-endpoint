// eslint-disable-next-line no-unused-vars
import { AxiosError, AxiosResponse } from 'axios'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function HandleErrorMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    /**
     *
     * @type {boolean}
     */
    _throwError = false

    /**
     *
     * @returns {this}
     */
    get throwResponseError(): this {
      this._throwError = true
      return this
    }

    /**
     * @returns {string}
     */
    get fallbackErrorMessage(): string {
      return 'An unexpected error has occurred. Please try again.'
    }

    /**
     *
     * @param {AxiosError|Error} error
     * @throws {AxiosError|Error}
     */
    handleError<T = any>(error: AxiosError<T> | any): AxiosResponse<T | { message: string; errors: any }> {
      if (this._throwError) {
        throw error
      }
      let message = this.fallbackErrorMessage
      if (error?.response?.data?.errors) {
        return error.response
      } else if (typeof error?.response?.data?.message === 'string') {
        message = error.response.data.message
      }
      return {
        headers: error?.response?.headers,
        config: error?.config ?? error?.response?.config,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: {
          message,
          errors: {
            fallback: message,
          },
        },
      }
    }
  }
}
