import { CrudEndpoint } from './crudEndpoint'
import { AxiosResponse, CancelToken } from 'axios'

export class ResourceEndpoint extends CrudEndpoint {
  /**
   * Display a listing of the resource.
   *
   * @param {any=} params
   * @param {CancelToken=} cancelToken
   * @returns {Promise<any>}
   */
  async index<T = any, R = AxiosResponse<T>> (params?: any, cancelToken?: CancelToken): Promise<R> {
    return this.get<T, R>('/', { params, cancelToken })
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param {object} data
   * @param {any=} params
   * @returns {Promise<any>}
   */
  async store<T = any, R = AxiosResponse<T>> (data: any, params?: any): Promise<R> {
    return this.post<T, R>('/', { data, params })
  }

  /**
   * Display the specified resource.
   *
   * @param {string|number} id
   * @param {any=} params
   * @param {CancelToken=} cancelToken
   * @returns {Promise<any>}
   */
  async show<T = any, R = AxiosResponse<T>> (
    id: string | number,
    params?: any,
    cancelToken?: CancelToken,
  ): Promise<R> {
    return this.get<T, R>(`/${id}`, { params, cancelToken })
  }

  /**
   * Update the specified resource in storage.
   *
   * @param {string|number} id
   * @param {object} data
   * @param {any=} params
   * @returns {Promise<any>}
   */
  async update<T = any, R = AxiosResponse<T>> (
    id: string | number,
    data: any,
    params?: any,
  ): Promise<R> {
    return this.put<T, R>(`/${id}`, { data, params })
  }

  /**
   * Store or update specified resource in storage.
   *
   * @param {int|null|undefined} id
   * @param {object} data
   * @param {any=} params
   * @returns {Promise<any>}
   */
  async storeOrUpdate<T = any, R = AxiosResponse<T>> (
    id: null | string | number,
    data: any,
    params?: any,
  ): Promise<R> {
    if (!id) {
      return this.store<T, R>(data, params)
    }
    return this.update<T, R>(id, data, params)
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param {string|number} id
   * @param {any=} params
   * @returns {Promise<any>}
   */
  async destroy<T = any, R = AxiosResponse<T>> (
    id: string | number,
    params?: any,
  ): Promise<R> {
    return this.delete<T, R>(`/${id}`, { params })
  }
}
