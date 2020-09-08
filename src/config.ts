import axios, { AxiosStatic } from 'axios'

export class Config {
  protected _apiPath = 'api'
  protected _axios = axios
  protected _origin = window.location.origin

  get apiPath(): string {
    return this._apiPath
  }

  set apiPath(path: string) {
    this._apiPath = path
  }

  get axios(): AxiosStatic {
    return this._axios
  }

  set axios(axios: AxiosStatic) {
    this._axios = axios
  }

  get baseURL(): string | undefined {
    return this.axios.defaults.baseURL
  }

  set baseURL(baseURL: string | undefined) {
    this._axios.defaults.baseURL = baseURL
  }

  get origin(): string {
    return this._origin
  }

  set origin(origin: string) {
    this._origin = origin
  }

  get withCredentials(): boolean | undefined {
    return this._axios.defaults.withCredentials
  }

  set withCredentials(withCredentials: boolean | undefined) {
    this._axios.defaults.withCredentials = withCredentials
  }
}

let config = new Config()

function setConfig(configuration: Config): void {
  config = configuration
}

export { config, setConfig }
