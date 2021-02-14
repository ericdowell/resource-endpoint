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
    expect.assertions(6)
    const module = await import('../options')

    expect(module.globalOptions.path).toBe('')
    expect(module.globalOptions.withCredentials).toBeUndefined()

    const axiosInstance = axios.create({
      headers: {
        'X-FOO': 'BAR',
      },
    })
    const path = 'api'
    const origin = 'http://example.com'
    const withCredentials = true

    module.setGlobalOptions(
      new module.Options({
        axios: axiosInstance,
        origin,
        path,
        withCredentials,
      }),
    )

    expect(module.globalOptions.axios).toBe(axiosInstance)
    expect(module.globalOptions.path).toBe(path)
    expect(module.globalOptions.origin).toBe(origin)
    expect(module.globalOptions.withCredentials).toBe(withCredentials)
  })
})
