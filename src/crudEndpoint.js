import Endpoint from './endpoint'

class CrudEndpoint extends Endpoint {
  /**
   *
   * @param {string} path
   * @param {object=} options
   * @returns {Promise<any>}
   */
  delete(path, options) {
    return this.query(path, 'delete', options)
  }

  /**
   *
   * @param {string} path
   * @param {object=} options
   * @returns {Promise<any>}
   */
  get(path, options) {
    return this.query(path, 'get', options)
  }

  /**
   *
   * @param {string} path
   * @param {object=} options
   * @returns {Promise<any>}
   */
  patch(path, options) {
    return this.query(path, 'patch', options)
  }

  /**
   *
   * @param {string} path
   * @param {object=} options
   * @returns {Promise<any>}
   */
  post(path, options) {
    return this.query(path, 'post', options)
  }

  /**
   *
   * @param {string} path
   * @param {object=} options
   * @returns {Promise<any>}
   */
  put(path, options) {
    return this.query(path, 'put', options)
  }
}

export default CrudEndpoint
