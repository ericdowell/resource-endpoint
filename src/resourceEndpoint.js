import CrudEndpoint from './crudEndpoint'

class ResourceEndpoint extends CrudEndpoint {
  /**
   * Display a listing of the resource.
   *
   * @param {object=} params
   * @returns {Promise<any>}
   */
  index(params) {
    params = params || {}
    return this.get('/', { params })
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param {object} data
   * @param {object=} params
   * @returns {*|Promise<any | void>}
   */
  store(data, params) {
    params = params || {}
    return this.post('/', { data, params })
  }

  /**
   * Display the specified resource.
   *
   * @param {int} id
   * @param {object=} params
   * @returns {*|Promise<any | void>}
   */
  show(id, params) {
    params = params || {}
    return this.get(`/${id}`, { params })
  }

  /**
   * Update the specified resource in storage.
   *
   * @param {int} id
   * @param {object} data
   * @param {object=} params
   * @returns {*|Promise<any | void>}
   */
  update(id, data, params) {
    params = params || {}
    return this.put(`/${id}`, { data, params })
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param {int} id
   * @param {object=} params
   * @returns {*|Promise<any | void>}
   */
  destroy(id, params) {
    params = params || {}
    return this.delete(`/${id}`, { params })
  }
}

export default ResourceEndpoint
