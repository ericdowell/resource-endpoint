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
   * @type {AxiosRequestConfig}
   * @protected
   */
  _config: AxiosRequestConfig = {}

  /**
   *
   * @returns {AxiosRequestConfig}
   */
  get config(): AxiosRequestConfig {
    return this._config
  }

  /**
   *
   * @returns {this}
   */
  enableDebug(): this {
    this._debug = true
    return this
  }

  /**
   *
   * @returns {boolean}
   */
  isDebugEnabled(): boolean {
    return this._debug
  }

  /**
   *
   * @param {object} headers
   * @returns {this}
   */
  setHeaders(headers: { [key: string]: any }): this {
    this._config.headers = headers
    return this
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   * @returns {this}
   */
  setHeader(key: string, value: any): this {
    this._config.headers = this._config.headers ?? {}
    this._config.headers[key] = value
    return this
  }

  /**
   *
   * @returns {object|undefined}
   */
  get headers(): { [key: string]: any } | undefined {
    return this.config.headers
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
    const config: AxiosRequestConfig = { ...this.config, ...(requestConfig ?? {}), ...{ url, method } }
    config.baseURL = this.baseURL
    config.headers = { ...this.headers, ...config.headers }
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
    requestConfig?: AxiosRequestConfig | any,
  ): Promise<R> {
    const config = this.requestConfig(url, method, requestConfig)
    try {
      const response = await axios.request<T, R>(config)
      if (this.isDebugEnabled()) {
        this.debugResponse(url, method, config, response)
      }
      return response
    } catch (error) {
      if (this.isDebugEnabled()) {
        this.debugResponseError(url, method, config, error)
      }
      return Endpoint.handleRequestError(error, this)
    }
  }

  /**
   *
   * @param {object} response
   * @returns {any}
   */
  static responseData<T = any>(response: AxiosResponse<T> | any): T {
    return response?.data
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
    this.debug<R>(url, method, config, 'response', response)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} config
   * @param {AxiosError} error
   */
  debugResponseError<T = AxiosError>(
    url: string,
    method: Method,
    config: AxiosRequestConfig,
    error: T,
  ): void {
    this.debug<T>(url, method, config, 'error', error)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} config
   * @param {string=} label
   * @param {object=} data
   */
  debug<T = any>(
    url: string,
    method: Method,
    config?: AxiosRequestConfig,
    label?: string,
    data?: T,
  ): void {
    const output = [
      'color: #e55ea2;',
      url,
      'color: black;',
      'color: #e55ea2;',
      method,
      'color: black;',
      config,
    ]
    let format = 'url: %c"%s"%c\nmethod: %c"%s"%c\nconfig:\n%o'
    if (label && data) {
      format += '\n%s:\n%o'
      output.push(label)
      output.push(data)
    }
    this.console().log(format, ...output)
  }

  handleError(error: AxiosError | Error): never {
    throw error
  }

  /**
   *
   * @param {Error} error
   * @param {any} endpointInstance
   * @returns {void|*}
   * @throw {Error}
   */
  static handleRequestError(
    error: AxiosError | Error,
    endpointInstance: Endpoint,
  ): any {
    return endpointInstance.handleError(error)
  }
}
