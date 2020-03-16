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
   * @type {object}
   * @protected
   */
  _headers: { [key: string]: any } = {}

  /**
   * @type {boolean}
   * @protected
   */
  _axiosResponse = false

  /**
   *
   * @returns {this}
   */
  axiosResponse(): this {
    this._axiosResponse = true
    return this
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
  setHeaders(headers: any): this {
    this._headers = headers
    return this
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   * @returns {this}
   */
  setHeader(key: string, value: any): this {
    this._headers[key] = value
    return this
  }

  /**
   *
   * @returns {object}
   */
  get headers(): { [key: string]: any } {
    return this._headers
  }

  /**
   *
   * @returns {boolean}
   */
  hasHeaders(): boolean {
    return Object.keys(this.headers).length !== 0
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
  get console(): Console {
    return (window && window.console) || console
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
   * Returns object of query options, currently defaults to Axios options.
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} requestConfig
   * @returns {object}
   */
  queryOptions(
    url: string,
    method: Method,
    requestConfig?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const config = { ...(requestConfig ?? {}), ...{ url, method } }
    config.baseURL = this.baseURL
    if (!config.paramsSerializer) {
      config.paramsSerializer = (params): string => {
        return qs.stringify(params, { arrayFormat: 'brackets' })
      }
    }
    if (this.hasHeaders()) {
      config.headers = { ...config.headers, ...this.headers }
    }
    return config
  }

  /**
   * General query method that is used by all HTTP calls.
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} requestConfig
   * @returns {Promise<any>}
   */
  async query<T = any, R = AxiosResponse<T>>(
    url: string,
    method: Method,
    requestConfig?: AxiosRequestConfig | any,
  ): Promise<T | R> {
    const config = this.queryOptions(url, method, requestConfig)
    try {
      const response = await axios.request<T, R>(config)
      if (this.isDebugEnabled()) {
        this.debugResponse(url, method, config, response)
      }
      return this._axiosResponse ? response : this.responseData<T>(response)
    } catch (error) {
      if (this.isDebugEnabled()) {
        this.debugResponseError(url, method, config, error)
      }
      return Endpoint.handleQueryError(error, this)
    }
  }

  /**
   *
   * @param {object} response
   * @returns {any}
   */
  responseData<T = any>(response: AxiosResponse | any): T {
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
    method: string,
    config: AxiosRequestConfig,
    response: R,
  ): void {
    this.debugQuery<R>(url, method, config, 'response', response)
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
    method: string,
    config: AxiosRequestConfig,
    error: T,
  ): void {
    this.debugQuery<T>(url, method, config, 'error', error)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} config
   * @param {string} label
   * @param {object} data
   */
  debugQuery<T = any>(
    url: string,
    method: string,
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
    ]
    let format = 'url: %c"%s"%c\nmethod: %c"%s"%c\nconfig:\n%o'
    if (label && data) {
      format += '\n%s:\n%o'
      output.push(label)
      output.push(data)
    }
    this.console.log(format, ...output)
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
  static handleQueryError(
    error: AxiosError | Error,
    endpointInstance: Endpoint,
  ): any {
    return endpointInstance.handleError(error)
  }
}
