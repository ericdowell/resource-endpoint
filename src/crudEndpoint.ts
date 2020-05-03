import { Endpoint } from './endpoint'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export class CrudEndpoint extends Endpoint {
  async delete<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'delete', config)
  }

  async get<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'get', config)
  }

  async patch<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'patch', config)
  }

  async post<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'post', config)
  }

  async put<T = any, R = AxiosResponse<T>> (
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>(url, 'put', config)
  }
}
