import { Constructor } from './types'
import axios, { AxiosError } from 'axios'
import { safeResponseData } from '../helpers'
import { defaultErrorMessage as constDefaultErrorMessage, errorsBlock as baseErrorsBlock } from './helpers'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function AxiosErrorMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    get defaultErrorMessage(): string {
      return constDefaultErrorMessage
    }

    errorsBlock(message: string): { message: string } {
      return baseErrorsBlock(message)
    }

    handleError(error: AxiosError | Error): never {
      let message = this.defaultErrorMessage
      if (!axios.isAxiosError(error)) {
        const axiosErr = new AxiosError(error.message)
        axiosErr.response = {
          headers: {},
          config: {},
          status: 500,
          statusText: 'Internal Server Error',
          data: {
            message,
            errors: this.errorsBlock(message),
          },
        }
        throw axiosErr
      }
      const { errors, message: responseMessage } = safeResponseData<Record<string, unknown>>(error.response)
      // Matches what we want from our response.
      if (errors && typeof errors === 'object') {
        throw error
      } else if (typeof responseMessage === 'string') {
        message = responseMessage
      }
      error.response = {
        headers: error?.response?.headers ?? {},
        config: error?.config ?? error?.response?.config,
        status: error?.response?.status ?? 500,
        statusText: error?.response?.statusText ?? 'Internal Server Error',
        data: {
          message,
          errors: this.errorsBlock(message),
        },
      }
      throw error
    }
  }
}
