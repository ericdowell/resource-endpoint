import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios'
import qs from 'qs'
import urljoin from 'url-join'

export class Endpoint {
  /**
   *
   * @type {boolean}
   * @private
   */
  _debug = false

  /**
   *
   * @returns {AxiosRequestConfig}
   */
  get config(): AxiosRequestConfig {
    return {}
  }

  /**
   *
   * @returns {this}
   */
  debug(): this {
    this._debug = true
    return this
  }

  /**
   *
   * @returns {boolean}
   */
  shouldDebug(): boolean {
    return this._debug
  }

  /**
   * This contains the protocol and domain, aka location.origin.
   * e.g. https://example.com or https://localhost:3000
   *
   * @returns {string}
   */
  get origin(): string {
    return window.location.origin
  }

  /**
   * This is the middle of the url path, usually a group prefix.
   * e.g. api/v1 or user/settings
   *
   * @returns {string}
   */
  get path(): string {
    return ''
  }

  /**
   * This is the last part of the url path, usually the resource name.
   * e.g. "user" or "profile"
   *
   * @returns {string}
   */
  get endpoint(): string {
    return ''
  }

  /**
   * Returns console for output.
   *
   * @returns {Console}
   */
  console(): Console {
    return window.console
  }

  /**
   * Used with axios library to set baseURL property.
   *
   * @returns {string}
   */
  get baseURL(): string {
    return urljoin(this.origin, this.path, this.endpoint)
  }

  /**
   *
   * @returns {Function}
   */
  get paramsSerializer(): (params: any) => string {
    return (params): string => {
      return qs.stringify(params, { arrayFormat: 'brackets' })
    }
  }

  /**
   * Returns object of request config.
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
    const config: AxiosRequestConfig = { ...this.config, ...requestConfig, ...{ url, method } }
    config.baseURL = config.baseURL ?? this.baseURL
    config.headers = { ...this.config.headers, ...config.headers }
    config.paramsSerializer = config.paramsSerializer ?? this.paramsSerializer
    return config
  }

  /**
   * General request method that is used by all HTTP calls.
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} requestConfig
   * @returns {Promise<any>}
   */
  async request<T = any, R = AxiosResponse<T>>(
    url: string,
    method: Method,
    requestConfig?: AxiosRequestConfig,
  ): Promise<R> {
    const config = this.requestConfig(url, method, requestConfig)
    try {
      const response = await axios.request<T, R>(config)
      if (this.shouldDebug()) {
        this.debugResponse<T, R>(url, method, config, response)
      }
      return response
    } catch (error) {
      if (this.shouldDebug()) {
        this.debugResponseError<T>(url, method, config, error)
      }
      return Endpoint.handleRequestError<T>(error, this)
    }
  }

  /**
   *
   * @param {AxiosError|Error} error
   * @throws {Error}
   */
  handleError<T = any>(error: AxiosError<T> | Error): never {
    throw error
  }

  /**
   *
   * @param {Error} error
   * @param {any} instance
   * @returns {void|*}
   * @throw {Error}
   */
  static handleRequestError<T = any>(error: AxiosError<T> | Error, instance: Endpoint): any {
    return instance.handleError<T>(error)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} config
   * @param {object} response
   */
  debugResponse<T = any, R = AxiosResponse<T>>(
    url: string,
    method: Method,
    config: AxiosRequestConfig,
    response: R,
  ): void {
    this.log<R>(url, method, config, 'response', response)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} config
   * @param {AxiosError} error
   */
  debugResponseError<T = any, R = AxiosError<T>>(
    url: string,
    method: Method,
    config: AxiosRequestConfig,
    error: R,
  ): void {
    this.log<R>(url, method, config, 'error', error)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} config
   * @param {string=} label
   * @param {object=} data
   */
  protected log<T = any>(
    url: string,
    method: Method,
    config: AxiosRequestConfig,
    label: string,
    data: T,
  ): void {
    const output = [
      'color: #e55ea2;',
      url,
      'color: black;',
      'color: #e55ea2;',
      method,
      'color: black;',
      config,
      label,
      data,
    ]
    this.console().log('url: %c"%s"%c\nmethod: %c"%s"%c\nconfig:\n%o\n%s:\n%o', ...output)
  }
}
