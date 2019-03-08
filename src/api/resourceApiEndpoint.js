import ResourceEndpoint from '../resourceEndpoint'
import qs from 'qs'

class ResourceApiEndpoint extends ResourceEndpoint {
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
    options.data = qs.stringify(options.data)
    const headers = options.headers || {}
    // Always set Content-Type to application/x-www-form-urlencoded, place in assign last.
    options.headers = Object.assign({}, headers, {
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    return options
  }
}

export default ResourceApiEndpoint
