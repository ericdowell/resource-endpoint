import MessageBag from './errors/messageBag'

const trimSlashes = string =>
  (typeof string === 'string' && string.replace(/^\/|\/$/g, '')) || ''

const trimStartSlash = string =>
  (typeof string === 'string' && string.replace(/^\/+/g, '')) || ''

class Endpoint {
  /**
   *
   * @type {boolean}
   * @private
   */
  _debug = false

  /**
   *
   * @returns {this}
   */
  debug() {
    this._debug = true

    return this
  }

  /**
   *
   * @returns {boolean}
   */
  isDebugEnabled() {
    return this._debug === true
  }

  /**
   * This contains the protocol and domain, aka location.origin.
   * e.g. https://example.com or https://localhost:3000
   *
   * @returns {string}
   */
  get origin() {
    return window.location.origin
  }

  /**
   * This it the middle of the url path, usually a group prefix.
   * e.g. api/v1 or user/settings
   *
   * @returns {string}
   */
  get path() {
    return ''
  }

  /**
   * This should be singular.
   * e.g. "user" or "profile" or this.constructor.name.toLowerCase()
   *
   * @returns {string}
   */
  get endpoint() {
    return ''
  }

  /**
   *
   * @returns {{AxiosStatic: AxiosStatic}}
   */
  get client() {
    return window.axios
  }

  /**
   *
   * @returns {Console}
   */
  get output() {
    return window.console
  }

  /**
   * Used with axios library to set baseURL property.
   *
   * @returns {string}
   */
  getBaseUrl() {
    const origin = trimSlashes(this.origin)
    const path = trimSlashes(this.path)
    const endpoint = trimStartSlash(this.endpoint)
    return `${origin}/${path}/${endpoint}`
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object} options
   * @returns {object}
   */
  queryOptions(url, method, options) {
    options = options || {}
    options = Object.assign({}, options, { url, method })
    options.baseURL = this.getBaseUrl()
    if (!options.data || typeof options.data !== 'object') {
      return options
    }
    return options
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @returns {Promise<any>}
   */
  query(url, method, options) {
    const client = this.client
    options = this.queryOptions(url, method, options)

    return client(options)
      .then(response => {
        if (this.isDebugEnabled()) {
          this.debugResponse(url, method, options, response)
        }
        return this.responseData(response)
      })
      .catch(error => {
        const responseError = this.responseError(url, method, options, error)
        if (this.isDebugEnabled()) {
          this.debugResponseError(url, method, options, responseError)
        }
        return Endpoint.handleQueryError(responseError, this)
      })
  }

  /**
   *
   * @param response
   * @returns {*}
   */
  responseData(response) {
    return response.data
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {AxiosError|Error} error
   */
  responseError(url, method, options, error) {
    const messageBag = new MessageBag()
    messageBag.url = url
    messageBag.method = method
    messageBag.options = options
    messageBag.config = error.config || {}
    messageBag.response = error.response || {}
    return messageBag
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {object} response
   */
  debugResponse(url, method, options, response) {
    this.debugQuery(url, method, options, 'response', response)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {MessageBag} error
   */
  debugResponseError(url, method, options, error) {
    this.debugQuery(url, method, options, 'error', error)
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object=} options
   * @param {string} label
   * @param {object} data
   */
  debugQuery(url, method, options, label, data) {
    let output = [
      'color: #e55ea2;',
      url,
      'color: black;',
      'color: #e55ea2;',
      method,
      'color: black;',
      options
    ]
    let format = 'url: %c"%s"%c\nmethod: %c"%s"%c\noptions:\n%o'
    if (label && data) {
      format += '\n%s:\n%o'
      output.push(label)
      output.push(data)
    }
    this.output.log(format, ...output)
  }

  /**
   *
   * @param {Error} error
   * @param {object|Endpoint} object
   * @returns {Function|void}
   */
  static handleQueryError(error, object) {
    if (
      !(object instanceof Endpoint) ||
      !object.handleError ||
      typeof object.handleError !== 'function'
    ) {
      throw error
    }
    return object.handleError(error)
  }
}

export default Endpoint
