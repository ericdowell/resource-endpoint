import { AxiosRequestConfig } from 'axios'
import qs from 'qs'
import urljoin from 'url-join'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function ApiMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    /** @protected */
    shouldStringify = true

    // Always set Content-Type to application/x-www-form-urlencoded, place in assign last.
    get config(): AxiosRequestConfig {
      return {
        ...super.config,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...super.config.headers,
          Accept: 'application/json',
        },
      }
    }

    // Override to set as version, default to empty
    // e.g. v1, v3, v5 and so on.
    get version(): string {
      return ''
    }

    // This it the middle of the url path, usually a group prefix.
    // e.g. api/v1 or user/settings
    get path(): string {
      return urljoin('api', this.version)
    }

    preventStringify(): this {
      this.shouldStringify = false
      return this
    }

    requestConfig(requestConfig: AxiosRequestConfig): AxiosRequestConfig {
      const config: AxiosRequestConfig = super.requestConfig(requestConfig)
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
