// eslint-disable-next-line no-unused-vars
import { AxiosError } from 'axios'
import { Constructor } from './index' // for JSDocs

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function HandleErrorMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    /**
     * @returns {string}
     */
    get fallbackErrorMessage(): string {
      return 'An unexpected error has occurred. Please try again.'
    }

    /**
     *
     * @param {AxiosError|Error} error
     */
    handleError<T = any>(error: AxiosError<T> | any): { data: { errors: any } } {
      if (error?.response?.data?.errors) {
        return error.response
      }
      return {
        data: {
          errors: {
            fallback: this.fallbackErrorMessage,
          },
        },
      }
    }
  }
}
