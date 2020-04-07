import { Endpoint } from './endpoint'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export class CrudEndpoint extends Endpoint {
  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  async delete<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'delete', config)
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  async get<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'get', config)
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  async patch<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'patch', config)
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  async post<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'post', config)
  }

  /**
   *
   * @param {string} url
   * @param {AxiosRequestConfig=} config
   * @returns {Promise<any>}
   */
  async put<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'put', config)
  }
}
