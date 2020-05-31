import { AxiosRequestConfig } from 'axios'
import qs from 'qs'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function FormMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
    /** @protected */
    shouldStringify = true

    // Always set Content-Type to application/x-www-form-urlencoded, place in assign last.
    get config(): AxiosRequestConfig {
      return {
        ...super.config,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          ...super.config.headers,
        },
      }
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
