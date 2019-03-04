const CrudEndpoint = require('./crudEndpoint')

class ResourceEndpoint extends CrudEndpoint {
  /**
   * Display a listing of the resource.
   *
   * @returns {Promise<any>}
   */
  index() {
    return this.get('/')
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param {object} data
   * @returns {*|Promise<any | void>}
   */
  store(data) {
    return this.post('/', { data })
  }

  /**
   * Display the specified resource.
   *
   * @param {integer} id
   * @returns {*|Promise<any | void>}
   */
  show(id) {
    return this.get(`/${id}`)
  }

  /**
   * Update the specified resource in storage.
   *
   * @param {integer} id
   * @param {object} data
   * @returns {*|Promise<any | void>}
   */
  update(id, data) {
    return this.put(`/${id}`, { data })
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param {integer} id
   * @returns {*|Promise<any | void>}
   */
  destroy(id) {
    return this.delete(`/${id}`)
  }
}

module.exports = ResourceEndpoint
