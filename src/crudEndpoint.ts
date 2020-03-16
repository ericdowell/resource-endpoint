import { Endpoint } from './endpoint'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export class CrudEndpoint extends Endpoint {
  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} options
   * @returns {Promise<any>}
   */
  delete<T = any, R = AxiosResponse<T>>(
    path: string,
    options?: AxiosRequestConfig,
  ): Promise<R> {
    return this.query<T, R>(path, 'delete', options)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} options
   * @returns {Promise<any>}
   */
  get<T = any, R = AxiosResponse<T>>(
    path: string,
    options?: AxiosRequestConfig,
  ): Promise<R> {
    return this.query<T, R>(path, 'get', options)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} options
   * @returns {Promise<any>}
   */
  patch<T = any, R = AxiosResponse<T>>(
    path: string,
    options?: AxiosRequestConfig,
  ): Promise<R> {
    return this.query<T, R>(path, 'patch', options)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} options
   * @returns {Promise<any>}
   */
  post<T = any, R = AxiosResponse<T>>(
    path: string,
    options?: AxiosRequestConfig,
  ): Promise<R> {
    return this.query<T, R>(path, 'post', options)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} options
   * @returns {Promise<any>}
   */
  put<T = any, R = AxiosResponse<T>>(
    path: string,
    options?: AxiosRequestConfig,
  ): Promise<R> {
    return this.query<T, R>(path, 'put', options)
  }
}
