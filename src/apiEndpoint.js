const Endpoint = require('./endpoint')

class ApiEndpoint extends Endpoint {
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
}

module.exports = ApiEndpoint
