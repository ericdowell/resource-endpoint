import { AxiosError } from 'axios'

export const mockResponse = {
  config: {},
  data: { foo: 'bar' },
}

export async function BasicMock(config: any): Promise<any> {
  if (!config.errors) {
    return mockResponse
  }
  const error = new Error() as AxiosError
  error.config = {}
  error.response = {
    data: {
      message: config.message,
      errors: config.errors,
    },
    status: config.status || 422,
  } as any
  throw error
}
