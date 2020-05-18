import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Endpoint } from '../endpoint'

export class CrudEndpoint extends Endpoint {
  async delete<T = any, R = AxiosResponse<T>>(url?: string, config?: AxiosRequestConfig): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'delete' })
  }

  async get<T = any, R = AxiosResponse<T>>(url?: string, config?: AxiosRequestConfig): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'get' })
  }

  async patch<T = any, R = AxiosResponse<T>>(url?: string, config?: AxiosRequestConfig): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'patch' })
  }

  async post<T = any, R = AxiosResponse<T>>(url?: string, config?: AxiosRequestConfig): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'post' })
  }

  async put<T = any, R = AxiosResponse<T>>(url?: string, config?: AxiosRequestConfig): Promise<R> {
    return this.request<T, R>({ ...config, url, method: 'put' })
  }
}
