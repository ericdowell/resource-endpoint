import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios'
import { MessageBag } from '@errors/messageBag'
import qs from 'qs'

const trimSlashes = (string: any): string =>
  (typeof string === 'string' && string.replace(/^\/|\/$/g, '')) || ''

const trimStartSlash = (string: any): string =>
  (typeof string === 'string' && string.replace(/^\/+/g, '')) || ''

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
   * This recommended to be singular.
   * e.g. "user" or "profile" or this.constructor.name.toLowerCase()
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
  get output(): Console {
    return (window && window.console) || console
  }

  /**
   * Used with axios library to set baseURL property.
   *
   * @returns {string}
   */
  getBaseUrl(): string {
    const origin = trimSlashes(this.origin)
    const path = trimSlashes(this.path)
    const endpoint = trimStartSlash(this.endpoint)
    if (!endpoint) {
      return `${origin}/${path}`
    }
    return `${origin}/${path}/${endpoint}`
  }

  /**
   * Returns object of query options, currently defaults to Axios options.
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @returns {object}
   */
  queryOptions(
    url: string,
    method: Method,
    options?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const config = { ...(options ?? {}), ...{ url, method } }
    config.baseURL = this.getBaseUrl()
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
   * @param {object=} options
   * @returns {Promise<any>}
   */
  async query<T = any, R = AxiosResponse<T>>(
    url: string,
    method: Method,
    options?: AxiosRequestConfig | any,
  ): Promise<R> {
    const config = this.queryOptions(url, method, options)
    try {
      const response = await axios.request<T, R>(config)
      if (this.isDebugEnabled()) {
        this.debugResponse(url, method, config, response)
      }
      return this.responseData<R>(response)
    } catch (error) {
      const responseError = this.responseError(url, method, config, error)
      if (this.isDebugEnabled()) {
        this.debugResponseError(url, method, config, responseError)
      }
      return Endpoint.handleQueryError(responseError, this)
    }
  }

  /**
   *
   * @param {object} response
   * @returns {any}
   */
  responseData<T = any>(response: AxiosResponse | any): T {
    return response && response.data
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {AxiosError|Error} error
   * @returns {MessageBag}
   */
  responseError(
    url: string,
    method: Method,
    options: AxiosRequestConfig,
    error: AxiosError | any,
  ): MessageBag {
    const messageBag = this.newMessageBag()
    messageBag.url = url
    messageBag.method = method
    messageBag.options = options
    error = error || { config: {}, response: {} }
    messageBag.original = error
    messageBag.config = (error && error.config) || {}
    messageBag.response = (error && error.response) || {}
    return messageBag
  }

  /**
   *
   * @returns {MessageBag}
   */
  newMessageBag(): MessageBag {
    return new MessageBag()
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {object} response
   */
  debugResponse<T = any, R = AxiosResponse<T>>(
    url: string,
    method: string,
    options: AxiosRequestConfig,
    response: R,
  ): void {
    this.debugQuery<R>(url, method, options, 'response', response)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {MessageBag} error
   */
  debugResponseError<T = MessageBag>(
    url: string,
    method: string,
    options: AxiosRequestConfig,
    error: T,
  ): void {
    this.debugQuery<T>(url, method, options, 'error', error)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {string} label
   * @param {object} data
   */
  debugQuery<T = any>(
    url: string,
    method: string,
    options: AxiosRequestConfig,
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
      options,
    ]
    let format = 'url: %c"%s"%c\nmethod: %c"%s"%c\noptions:\n%o'
    if (label && data) {
      format += '\n%s:\n%o'
      output.push(label)
      output.push(data)
    }
    this.output.log(format, ...output)
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
