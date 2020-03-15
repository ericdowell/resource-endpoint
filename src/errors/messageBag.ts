import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios'

export class MessageBag extends Error {
  /**
   * Name of error
   */
  name = 'MessageBag'
  /**
   *
   * @type {string}
   * @private
   */
  _url!: string
  /**
   *
   * @type {Method}
   * @private
   */
  _method!: Method
  /**
   *
   * @type {{}}
   * @private
   */
  _options = {}
  /**
   *
   * @type {AxiosRequestConfig}
   * @private
   */
  _config!: AxiosRequestConfig
  /**
   *
   * @type {AxiosResponse}
   * @private
   */
  _response!: AxiosResponse | any

  /**
   *
   * @type {AxiosError|Error|null}
   * @private
   */
  _original!: AxiosError | Error

  /**
   *
   * @param {string} url
   */
  set url(url: string) {
    this._url = url
  }

  /**
   *
   * @returns {string}
   */
  get url(): string {
    return this._url
  }

  /**
   *
   * @param {Method} method
   */
  set method(method: Method) {
    this._method = method
  }

  /**
   *
   * @returns {Method}
   */
  get method(): Method {
    return this._method
  }

  /**
   *
   * @returns {Error}
   */
  get original(): Error {
    return this._original || new Error(this.default)
  }

  /**
   *
   * @param {object|Error} original
   */
  set original(original) {
    this._original = original
  }

  /**
   *
   * @param {AxiosRequestConfig} options
   */
  set options(options: AxiosRequestConfig) {
    this._options = options
  }

  /**
   *
   * @returns {AxiosRequestConfig}
   */
  get options(): AxiosRequestConfig {
    return this._options
  }

  /**
   *
   * @param {AxiosRequestConfig} config
   */
  set config(config: AxiosRequestConfig) {
    this._config = config
  }

  /**
   *
   * @returns {AxiosRequestConfig}
   */
  get config(): AxiosRequestConfig {
    return this._config
  }

  /**
   *
   * @param {object} response
   */
  set response(response: AxiosResponse | any) {
    this._response = response
  }

  /**
   *
   * @returns {AxiosResponse}
   */
  get response(): AxiosResponse | any {
    return this._response
  }

  /**
   *
   * @returns {string}
   */
  get message(): string {
    return this.getApiMessage()
  }

  /**
   *
   * @return {string}
   */
  get default(): string {
    return 'An unexpected error has occurred. Please try again.'
  }

  /**
   *
   * @returns {string}
   */
  getApiMessage(): string {
    return typeof this._response?.data?.message === 'string'
      ? this._response.data.message
      : this.default
  }

  /**
   *
   * @returns {object}
   */
  getErrors(): any {
    return this._response?.data?.errors ? this._response.data.errors : {}
  }

  /**
   *
   * @return {number}
   */
  get defaultStatus(): number {
    return 500
  }

  /**
   *
   * @returns {object}
   */
  getStatus(): number {
    return this._response.status ? this._response.status : this.defaultStatus
  }

  /**
   *
   * @param {string} key
   * @returns {boolean}
   */
  hasMessage(key: string): boolean {
    const errors = this.getErrors()
    return !!errors && typeof errors[key] !== 'undefined'
  }

  /**
   *
   * @param {string} key
   * @returns {string|*}
   */
  getMessage(key: string): string {
    const errors = this.getErrors()
    return !key || !errors[key] ? this.getApiMessage() : errors[key]
  }
}
