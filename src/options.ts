import axios, { AxiosInstance, AxiosStatic } from 'axios'

export interface GlobalOptions {
  axios?: AxiosStatic | AxiosInstance
  origin?: string
  path?: string
  withCredentials?: boolean
}

export class Options {
  protected _path = ''
  protected _axios: AxiosStatic | AxiosInstance = axios
  /* istanbul ignore next */
  protected _origin = (typeof window !== 'undefined' && window.location && window.location.origin) || ''

  constructor(options?: GlobalOptions) {
    this.axios = options?.axios ?? this.axios
    this.origin = options?.origin ?? this.origin
    this.path = options?.path ?? this.path
    if (typeof options?.withCredentials === 'boolean') {
      this.withCredentials = options.withCredentials
    }
  }

  get axios(): AxiosStatic | AxiosInstance {
    return this._axios
  }

  set axios(axios: AxiosStatic | AxiosInstance) {
    this._axios = axios
  }

  get origin(): string {
    return this._origin
  }

  set origin(origin: string) {
    this._origin = origin
  }

  get path(): string {
    return this._path
  }

  set path(path: string) {
    this._path = path
  }

  get withCredentials(): boolean | undefined {
    return this._axios.defaults.withCredentials
  }

  set withCredentials(withCredentials: boolean | undefined) {
    this._axios.defaults.withCredentials = withCredentials
  }
}

let globalOptions = new Options()

function setGlobalOptions(options: Options): void {
  globalOptions = options
}

export { globalOptions, setGlobalOptions }
