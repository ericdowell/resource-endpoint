import { Endpoint } from './endpoint'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export class CrudEndpoint extends Endpoint {
  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  delete<T = any, R = AxiosResponse<T>>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(path, 'delete', config)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  get<T = any, R = AxiosResponse<T>>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(path, 'get', config)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  patch<T = any, R = AxiosResponse<T>>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(path, 'patch', config)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  post<T = any, R = AxiosResponse<T>>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(path, 'post', config)
  }

  /**
   *
   * @param {string} path
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  put<T = any, R = AxiosResponse<T>>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(path, 'put', config)
  }
}
