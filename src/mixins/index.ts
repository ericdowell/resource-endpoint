export type Constructor<T> =
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]) => T

// Export mixins
export { ApiEndpointMixin } from './apiEndpoint'
export { HandleErrorMixin } from './handleError'
