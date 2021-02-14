import axios from 'axios'

describe('options', (): void => {
  // eslint-disable-next-line jest/no-hooks
  beforeEach((): void => {
    jest.resetModules() // reset cached 'globalOptions' value in src/options
  })
  // eslint-disable-next-line jest/no-hooks
  afterAll((): void => {
    jest.resetModules() // reset cached 'globalOptions' value in src/options
  })

  it('globalOptions is instance of Options class', async (): Promise<void> => {
    expect.assertions(2)
    const module = await import('../options')
    expect(module.globalOptions).toBeInstanceOf(module.Options)
    expect(module.globalOptions.withCredentials).toBeUndefined()
  })

  it('setGlobalOptions sets new instance as globalOptions singleton', async (): Promise<void> => {
    expect.assertions(5)
    const module = await import('../options')

    expect(module.globalOptions.withCredentials).toBeUndefined()
    expect(module.globalOptions.path).toBe('')

    const axiosInstance = axios.create({
      headers: {
        'X-FOO': 'BAR',
      },
    })

    module.setGlobalOptions(
      new module.Options({
        withCredentials: true,
        path: 'api',
        origin: 'http://example.com',
        axios: axiosInstance,
      }),
    )

    expect(module.globalOptions.axios).toBe(axiosInstance)
    expect(module.globalOptions.path).toBe('api')
    expect(module.globalOptions.withCredentials).toBe(true)
  })
})
