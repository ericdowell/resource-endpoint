/* istanbul ignore file */
import { ApiMixin } from './api'
import { HandleErrorMixin } from './handleError'
import { SessionCsrfCookieMixin } from './sessionCsrfCookie'
import { Constructor } from './types'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function HandleApiMixin<T extends Constructor<any>>(superClass: T) {
  return class extends SessionCsrfCookieMixin(HandleErrorMixin(ApiMixin(superClass))) {}
}
