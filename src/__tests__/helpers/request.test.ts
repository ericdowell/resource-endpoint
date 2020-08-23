import * as request from '../../helpers/request'

const DEFAULT_REQUEST = async (): Promise<any> => ({})

describe('request.submit', (): void => {
  it('returns default payload', (): void => {
    expect.assertions(1)
    expect(request.submit(DEFAULT_REQUEST)).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "errors": undefined,
        "loading": false,
        "message": undefined,
        "onSubmit": [Function],
      }
    `)
  })

  it('calling onSubmit from payload calls makeRequest', async (): Promise<void> => {
    expect.assertions(3)
    const makeRequest = jest.spyOn(request, 'makeRequest').mockImplementation((): void => undefined)
    const payload = request.submit(DEFAULT_REQUEST)
    expect(payload.loading).toBe(false)
    await payload.onSubmit()
    // expect(payload.loading).toBe(true)
    expect(makeRequest).toHaveBeenCalledTimes(1)
    makeRequest.mockRestore()
  })
})

describe('request.query', (): void => {
  it('returns default payload', (): void => {
    expect.assertions(2)
    const makeRequest = jest.spyOn(request, 'makeRequest').mockImplementation((): void => undefined)
    expect(request.query(DEFAULT_REQUEST)).toMatchInlineSnapshot(`
      Object {
        "data": undefined,
        "errors": undefined,
        "loading": true,
        "message": undefined,
      }
    `)
    expect(makeRequest).toHaveBeenCalledTimes(1)
    makeRequest.mockRestore()
  })
})
