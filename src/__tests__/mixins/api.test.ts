import { Endpoint } from '../../endpoint'
import { ApiMixin } from '../../mixins'

class TestEndpoint extends ApiMixin(Endpoint) {}

describe(`${ApiMixin.name}`, (): void => {
  it('values are inherited by Endpoint', (): void => {
    expect.assertions(4)
    const endpoint = new TestEndpoint()
    expect(endpoint.config).toStrictEqual({})
    expect(endpoint.version).toBe('')
    expect(endpoint.path).toBe('api')
    expect(endpoint.requestConfig({ url: 'test/url', method: 'get', data: { foo: 'bar' } }))
      .toMatchInlineSnapshot(`
      Object {
        "baseURL": "http://localhost/api",
        "data": Object {
          "foo": "bar",
        },
        "headers": Object {},
        "method": "get",
        "paramsSerializer": [Function],
        "url": "test/url",
      }
    `)
  })
})
