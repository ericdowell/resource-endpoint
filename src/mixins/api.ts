import urljoin from 'url-join'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function ApiMixin<T extends Constructor<any>>(superClass: T) {
  return class extends superClass {
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
  }
}
