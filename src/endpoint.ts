import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import qs, { IStringifyOptions } from 'qs'
import urljoin from 'url-join'

export class Endpoint {
  /** @protected */
  _debug = false

  // Used in merging together AxiosRequestConfig values.
  // These are considered fallback values that
  // can be overridden by calling config.
  get config(): AxiosRequestConfig {
    return {}
  }

  // Can be used during chaining call to enable debugging response/error
  // using console.log or specifically this.console().log().
  debug(): this {
    this._debug = true
    return this
  }

  // Returns boolean value for debugging to console.log
  shouldDebug(): boolean {
    return this._debug
  }

  // This contains the protocol and domain, aka location.origin.
  // e.g. https://example.com, http://localhost:3000, etc.
  get origin(): string {
    return window.location.origin
  }

  // This is the middle of the url path, usually a group prefix.
  // e.g. api/v1, user/settings, etc.
  get path(): string {
    return ''
  }

  // This is the last part of the url path, usually the resource name.
  // e.g. "user" or "profile"
  get endpoint(): string {
    return ''
  }

  // Returns console for output.
  console(): Console {
    return window.console
  }

  // Used to set baseURL property in AxiosRequestConfig.
  get baseURL(): string {
    return urljoin(this.origin, this.path, this.endpoint)
  }

  get stringifyOptions(): IStringifyOptions {
    return { arrayFormat: 'brackets' }
  }

  get paramsSerializer(): (params: any) => string {
    return (params): string => {
      return qs.stringify(params, this.stringifyOptions)
    }
  }

  // Returns AxiosRequestConfig passed to axios.request.
  requestConfig(requestConfig: AxiosRequestConfig): AxiosRequestConfig {
    const config: AxiosRequestConfig = { ...this.config, ...requestConfig }
    config.baseURL = config.baseURL ?? this.baseURL
    config.headers = { ...this.config.headers, ...config.headers }
    config.paramsSerializer = config.paramsSerializer ?? this.paramsSerializer
    return config
  }

  // General request method that is used by all HTTP calls.
  async request<T = any, R = AxiosResponse<T>>(requestConfig: AxiosRequestConfig): Promise<R> {
    const config = this.requestConfig(requestConfig)
    try {
      const response = await axios.request<T, R>(config)
      this.logResponse<T, R>(config, response)
      return response
    } catch (error) {
      this.logResponseError<T>(config, error)
      return Endpoint.handleRequestError<T>(error, this)
    }
  }

  handleError<T = any>(error: AxiosError<T> | Error): never {
    throw error
  }

  static handleRequestError<T = any>(error: AxiosError<T> | Error, instance: Endpoint): any {
    return instance.handleError<T>(error)
  }

  static safeResponseData<T = any>(response: AxiosResponse<T>, isArray = false): any {
    if (isArray) {
      return (Array.isArray(response?.data) && response.data) || []
    }
    return (response?.data && typeof response.data === 'object' && response.data) || {}
  }

  logResponse<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig, response: R): void {
    if (!this.shouldDebug()) {
      return
    }
    this.consoleLog<R>(config, 'response', response)
  }

  logResponseError<T = any, R = AxiosError<T>>(config: AxiosRequestConfig, error: R): void {
    if (!this.shouldDebug()) {
      return
    }
    this.consoleLog<R>(config, 'error', error)
  }

  protected consoleLog<T = any>(config: AxiosRequestConfig, label: string, data: T): void {
    const output = [
      'color: #e55ea2;',
      config.url,
      'color: black;',
      'color: #e55ea2;',
      config.method,
      'color: black;',
      config,
      label,
      data,
    ]
    this.console().log('url: %c"%s"%c\nmethod: %c"%s"%c\nconfig:\n%o\n%s:\n%o', ...output)
  }
}
