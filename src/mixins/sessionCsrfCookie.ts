import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { Constructor } from './types'
import { Endpoint } from '../endpoint'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function SessionCsrfTokenMixin<C extends Constructor<any>>(superClass: C) {
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
     * Decides if current response is CSRF token mismatch error.
     *
     * @param {AxiosResponse<any>} response
     * @returns {boolean}
     */
    isCsrfTokenMismatch<T = any>(response: AxiosResponse<T>): boolean {
      const { message } = Endpoint.safeResponseData<T>(response)
      return (
        response.status === 419 &&
          message === 'CSRF token mismatch.'
      )
    }

    /**
     * Requests new CSRF Cookie from common Laravel Sanctum endpoint.
     * Override as needed.
     *
     * @returns {Promise<any>}
     */
    async requestCsrfCookie(): Promise<any> {
      return axios.get('sanctum/csrf-cookie', {
        baseURL: window.location.origin,
      })
    }

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
