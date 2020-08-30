import axios from 'axios'

let apiPath = 'api'

export const setApiPath = (path: string): void => {
  apiPath = path
}

export const getApiPath = (): string => {
  return apiPath
}

class Config {
  get baseURL(): string | undefined {
    return axios.defaults.baseURL
  }

  set baseURL(baseURL: string | undefined) {
    axios.defaults.baseURL = baseURL
  }

  get apiPath(): string {
    return apiPath
  }

  set apiPath(path: string) {
    setApiPath(path)
  }
}

export const config = new Config()
