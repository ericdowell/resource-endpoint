import { AxiosRequestConfig, Method } from 'axios'
import qs from 'qs'
import urljoin from 'url-join'

export type Constructor<T> =
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]) => T

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ApiEndpointMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
        /**
         * Always set Content-Type to application/x-www-form-urlencoded, place in assign last.
         *
         * @type {{}}
         * @protected
         */
        _headers: { [key: string]: any } = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        }

        /**
         *
         * @type {boolean}
         * @protected
         */
        _stringify = true

        /**
         * Override to set as version, default to empty
         * e.g. v1, v3, v5 and so on.
         *
         * @returns {string}
         */
        get apiVersion(): string {
          return ''
        }

        /**
         * This it the middle of the url path, usually a group prefix.
         * e.g. api/v1 or user/settings
         *
         * @returns {string}
         */
        get path(): string {
          return urljoin('api', this.apiVersion)
        }

        /**
         *
         * @returns {this}
         */
        preventStringify(): this {
          this._stringify = false
          return this
        }

        /**
         *
         * @param {string} url
         * @param {string} method
         * @param {object} options
         * @returns {object}
         */
        queryOptions(
          url: string,
          method: Method,
          options: AxiosRequestConfig,
        ): AxiosRequestConfig {
          const config = super.queryOptions(url, method, options)
          if (!config.data || typeof config.data !== 'object') {
            return config
          }
          if (this._stringify && !(config.data instanceof FormData)) {
            config.data = qs.stringify(config.data)
          }
          return config
        }
  }
}