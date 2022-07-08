import { Constructor } from './types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { safeResponseData } from '../helpers'
import {
  getFallbackMessage,
  defaultErrorMessage as constDefaultErrorMessage,
  errorsBlock as baseErrorsBlock,
} from '../errors/messages'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function AxiosErrorMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    get defaultErrorMessage(): string {
      return constDefaultErrorMessage
    }

    getUserFriendlyMessage(response: AxiosResponse<unknown> | undefined): string {
      return getFallbackMessage(response)
    }

    errorsBlock(message: string): { message: string } {
      return baseErrorsBlock(message)
    }

    handleError(error: AxiosError | Error): never {
      let message = this.defaultErrorMessage
      if (!axios.isAxiosError(error)) {
        const axiosErr = new AxiosError(error?.message)
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
      if (typeof responseMessage === 'string') {
        message = this.getUserFriendlyMessage(error.response)
      }
      if (!error.message) {
        error.message = message
      }
      if (errors && typeof errors === 'object') {
        throw error
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
