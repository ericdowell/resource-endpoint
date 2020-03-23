import { AxiosRequestConfig, Method } from 'axios'
import qs from 'qs'
import { Constructor } from './index'
import urljoin from 'url-join'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ApiEndpointMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
        /**
         *
         * @type {boolean}
         * @protected
         */
        _stringify = true

        /**
         * Always set Content-Type to application/x-www-form-urlencoded, place in assign last.
         *
         * @returns {AxiosRequestConfig}
         */
        get config(): AxiosRequestConfig {
          return {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        }

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
         * @returns {boolean}
         */
        get shouldStringify(): boolean {
          return this._stringify
        }

        /**
         *
         * @param {string} url
         * @param {string} method
         * @param {object=} requestConfig
         * @returns {object}
         */
        requestConfig(
          url: string,
          method: Method,
          requestConfig?: AxiosRequestConfig,
        ): AxiosRequestConfig {
          const config: AxiosRequestConfig = super.requestConfig(url, method, requestConfig)
          if (!config.data || typeof config.data !== 'object') {
            return config
          }
          if (this.shouldStringify && !(config.data instanceof FormData)) {
            config.data = qs.stringify(config.data)
          }
          return config
        }
  }
}
