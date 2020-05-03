import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { Constructor } from './types'
import { Endpoint } from '../endpoint'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function SessionCsrfCookieMixin<C extends Constructor<any>> (superClass: C) {
  return class extends superClass {
    /**
     * Used to tell if a csrf cookie fix request is happening.
     * Otherwise we'd have an infinite loop. This also ensures
     * we only retry once.
     *
     * @type {boolean}
     * @protected
     */
    csrfCookieFix = false

    // Decides if current response is a CSRF token mismatch error.
    // Override method as needed.
    isCsrfTokenMismatch<T = any> (response: AxiosResponse<T>): boolean {
      const { message } = Endpoint.safeResponseData<T>(response)
      return (
        response.status === 419 &&
          message === 'CSRF token mismatch.'
      )
    }

    // Requests new CSRF Cookie from common Laravel Sanctum endpoint.
    // Override method as needed.
    async requestCsrfCookie (): Promise<any> {
      return axios.get('sanctum/csrf-cookie', {
        baseURL: this.origin,
      })
    }

    // General request method that is used by all HTTP calls.
    async request<T = any, R = AxiosResponse<T>> (
      url: string,
      method: Method,
      requestConfig?: AxiosRequestConfig,
    ): Promise<R> {
      const response = await super.request(url, method, requestConfig)
      if (!this.csrfCookieFix && this.isCsrfTokenMismatch<T>(response)) {
        this.csrfCookieFix = true
        try {
          await this.requestCsrfCookie()
        } catch (error) {
          return response
        }
        return super.request(url, method, requestConfig)
      }
      return response
    }
  }
}
