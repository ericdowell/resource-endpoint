class MessageBag extends Error {
  /**
   *
   * @type {string}
   * @private
   */
  _url = ''
  /**
   *
   * @type {string}
   * @private
   */
  _method = 'unkown'
  /**
   *
   * @type {{}}
   * @private
   */
  _options = {}
  /**
   *
   * @type {object}
   * @private
   */
  _config = {}
  /**
   *
   * @type {object}
   * @private
   */
  _response = {}

  /**
   *
   * @type {Error|null}
   * @private
   */
  _original = null

  /**
   *
   * @param {string} url
   */
  set url(url) {
    this._url = url
  }

  /**
   *
   * @returns {string}
   */
  get url() {
    return this._url
  }

  /**
   *
   * @param {string} method
   */
  set method(method) {
    this._method = method
  }

  /**
   *
   * @returns {string}
   */
  get method() {
    return this._method
  }

  /**
   *
   * @param {object} options
   */
  set options(options) {
    this._options = options
  }

  /**
   *
   * @returns {object|Error}
   */
  get original() {
    return this._original || { message: this.default }
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
   * @returns {object}
   */
  get options() {
    return this._options
  }

  /**
   *
   * @param {object} config
   */
  set config(config) {
    this._config = config
  }

  /**
   *
   * @returns {object}
   */
  get config() {
    return this._config
  }

  /**
   *
   * @param {object} response
   */
  set response(response) {
    this._response = response
  }

  /**
   *
   * @returns {object}
   */
  get response() {
    return this._response
  }

  /**
   *
   * @returns {string}
   */
  get message() {
    return this.getApiMessage()
  }

  /**
   *
   * @return {string}
   */
  get default() {
    return 'An unexpected error has occurred. Please try again.'
  }

  /**
   *
   * @returns {string}
   */
  getApiMessage() {
    return this._response.data && this._response.data.message
      ? this._response.data.message
      : this.default
  }

  /**
   *
   * @returns {object}
   */
  getErrors() {
    return this._response.data && this._response.data.errors
      ? this._response.data.errors
      : {}
  }

  /**
   *
   * @return {number}
   */
  get defaultStatus() {
    return 500
  }

  /**
   *
   * @returns {object}
   */
  getStatus() {
    return this._response.status ? this._response.status : this.defaultStatus
  }

  /**
   *
   * @param {string} key
   * @returns {boolean}
   */
  hasMessage(key) {
    const errors = this.getErrors()
    return errors && typeof errors[key] !== 'undefined'
  }

  /**
   *
   * @param {string} key
   * @returns {string|*}
   */
  getMessage(key) {
    const errors = this.getErrors()
    return !key || !errors[key] ? this.getApiMessage() : errors[key]
  }
}

export default MessageBag
