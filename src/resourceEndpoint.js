import CrudEndpoint from './crudEndpoint'
import qs from 'qs'

class ResourceEndpoint extends CrudEndpoint {
  /**
   * Display a listing of the resource.
   *
   * @returns {Promise<any>}
   */
  index(query) {
    let path = '/'
    query = query || {}
    if (Object.keys(query).length !== 0) {
      path += '?' + qs.stringify(query)
    }
    return this.get(path)
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

export default ResourceEndpoint
