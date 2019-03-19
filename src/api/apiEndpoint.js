/* global FormData */
import Endpoint from '../endpoint'
import qs from 'qs'

class ApiEndpoint extends Endpoint {
  /**
   * Always set Content-Type to application/x-www-form-urlencoded, place in assign last.
   *
   * @type {{}}
   * @protected
   */
  _headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  /**
   *
   * @returns {string}
   */
  get apiVersion() {
    return 'v1'
  }

  /**
   * This it the middle of the url path, usually a group prefix.
   * e.g. api/v1 or user/settings
   *
   * @returns {string}
   */
  get path() {
    return `api/${this.apiVersion}`
  }

  /**
   *
   * @param {string} url
   * @param {string} method
   * @param {object} options
   * @returns {object}
   */
  queryOptions(url, method, options) {
    options = super.queryOptions(url, method, options)
    if (!options.data || typeof options.data !== 'object') {
      return options
    }
    if (!(options.data instanceof FormData)) {
      options.data = qs.stringify(options.data)
    }
    return options
  }
}

export default ApiEndpoint
