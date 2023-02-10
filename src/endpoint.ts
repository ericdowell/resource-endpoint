import { AxiosError, AxiosRequestConfig, AxiosResponse, ParamsSerializerOptions } from 'axios'
import { Options, globalOptions } from './options'
import qs, { IStringifyOptions } from 'qs'
import urljoin from 'url-join'

export class Endpoint {
  protected localOptions?: Options

  setLocalOptions(options: Options | undefined): this {
    this.localOptions = options
    return this
  }

  // Allowing global options to configure all Endpoint classes.
  // Optionally override options with this.localOptions via this.setLocalOptions
  get options(): Options {
    return this.localOptions ?? globalOptions
  }

  // Used in merging together AxiosRequestConfig values.
  // These are considered fallback values that
  // can be overridden by calling config.
  get config(): AxiosRequestConfig {
    return {}
  }

  // This contains the protocol and domain, aka location.origin.
  // e.g. https://example.com, http://localhost:3000, etc.
  get origin(): string {
    return this.options.origin
  }

  // This is the middle of the url path, usually a group prefix.
  // e.g. api/v1, user/settings, etc.
  get path(): string {
    return this.options.path
  }

  // This is the last part of the url path, usually the resource name.
  // e.g. "user" or "profile"
  get resource(): string {
    return ''
  }

  // Used to set baseURL property in AxiosRequestConfig.
  get baseURL(): string {
    return urljoin(this.origin, this.path, this.resource)
  }

  get stringifyOptions(): IStringifyOptions {
    return { arrayFormat: 'brackets' }
  }

  get paramsSerializer(): ParamsSerializerOptions {
    return {
      serialize: (params) => qs.stringify(params, this.stringifyOptions),
    }
  }

  // Returns AxiosRequestConfig passed to axios.request.
  requestConfig(requestConfig: AxiosRequestConfig): AxiosRequestConfig {
    const config: AxiosRequestConfig = { ...this.config, ...requestConfig }
    config.baseURL = config.baseURL ?? this.baseURL
    config.headers = { ...this.config.headers, ...config.headers }
    config.paramsSerializer = config.paramsSerializer ?? this.paramsSerializer
    return config
  }

  // General request method that is used by all HTTP calls.
  async request<T = any, R = AxiosResponse<T>>(requestConfig: AxiosRequestConfig): Promise<R> {
    try {
      return await this.options.axios.request<T, R>(this.requestConfig(requestConfig))
    } catch (error: any) {
      return this.handleError<T, R>(error)
    }
  }

  async handleError<T = any, R = AxiosResponse<T>>(error: AxiosError<T>): Promise<R | never> {
    throw error
  }
}
