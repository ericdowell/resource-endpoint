import ResourceEndpoint from './resourceEndpoint'

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
}

export default ResourceApiEndpoint
