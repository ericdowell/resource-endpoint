import { Endpoint } from '../endpoint'
import { Constructor } from './types'
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function SessionCsrfTokenMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    /**
     * Used to tell if a csrf cookie fix request is happening
     * otherwise we'd have an infinite loop. We only want
     * to retry only once as well.
     *
     * @type {boolean}
     * @protected
     */
    csrfCookieFix = false

    /**
     * General request method that is used by all HTTP calls.
     *
     * @param {string} url
     * @param {Method} method
     * @param {AxiosRequestConfig=} requestConfig
     * @returns {Promise<any>}
     */
    async request<T = any, R = AxiosResponse<T>>(
      url: string,
      method: Method,
      requestConfig?: AxiosRequestConfig,
    ): Promise<R> {
      const response = await super.request(url, method, requestConfig)
      const { message } = Endpoint.safeResponseData<{ message?: string }>(response)
      const isCsrfTokenMismatch = (
        !this.csrfCookieFix &&
        response.status === 419 &&
        message === 'CSRF token mismatch.'
      )
      if (isCsrfTokenMismatch) {
        this.csrfCookieFix = true
        await this.get('sanctum/csrf-cookie', {
          baseURL: window.location.origin,
        })
        // Retry once more to see if error goes away.
        return super.request(url, method, requestConfig)
      }
      return response
    }
  }
}
