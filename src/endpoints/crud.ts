import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Endpoint } from '../endpoint'

export interface AxiosCrudEndpoint {
  delete<T = any, R = AxiosResponse<T>>(url?: string | undefined, config?: AxiosRequestConfig): Promise<R>
  get<T = any, R = AxiosResponse<T>>(url?: string | undefined, config?: AxiosRequestConfig): Promise<R>
  patch<T = any, R = AxiosResponse<T>>(url?: string | undefined, config?: AxiosRequestConfig): Promise<R>
  post<T = any, R = AxiosResponse<T>>(url?: string | undefined, config?: AxiosRequestConfig): Promise<R>
  put<T = any, R = AxiosResponse<T>>(url?: string | undefined, config?: AxiosRequestConfig): Promise<R>
  request<T = any, R = AxiosResponse<T>>(requestConfig: AxiosRequestConfig): Promise<R>
}

export class CrudEndpoint extends Endpoint implements AxiosCrudEndpoint {
  async delete<T = any, R = AxiosResponse<T>>(
    url?: string | undefined,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'delete' })
  }

  async get<T = any, R = AxiosResponse<T>>(
    url?: string | undefined,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'get' })
  }

  async patch<T = any, R = AxiosResponse<T>>(
    url?: string | undefined,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'patch' })
  }

  async post<T = any, R = AxiosResponse<T>>(
    url?: string | undefined,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'post' })
  }

  async put<T = any, R = AxiosResponse<T>>(
    url?: string | undefined,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'put' })
  }
}
