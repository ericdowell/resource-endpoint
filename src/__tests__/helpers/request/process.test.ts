import { processResponse } from '../../../helpers/request/process'
import * as helper from '../../../helpers/safeResponseData'
import { makePayload } from '../../../helpers/request/payload'

describe('request.processResponse', (): void => {
  it('sets expected payload.data value when passed options.isArray false/not passed', (): void => {
    expect.assertions(3)
    const safeResponseData = jest.spyOn(helper, 'safeResponseData').mockReturnValue({
      users: [],
    })
    const payload = makePayload()
    expect(processResponse({} as any, payload)).toBeUndefined()
    expect(payload).toMatchInlineSnapshot(`
      Object {
        "data": Object {
          "users": Array [],
        },
        "errors": undefined,
        "loading": false,
        "message": undefined,
      }
    `)
    expect(safeResponseData).toHaveBeenCalledTimes(1)
    safeResponseData.mockRestore()
  })

  it('sets expected payload.data value when passed options.isArray true', (): void => {
    expect.assertions(3)
    const safeResponseData = jest.spyOn(helper, 'safeResponseData').mockReturnValue([
      {
        name: 'foobar',
        createdAt: "baz o'clock",
      },
    ])
    const payload = makePayload()
    expect(processResponse({} as any, payload, { isArray: true })).toBeUndefined()
    expect(payload).toMatchInlineSnapshot(`
      Object {
        "data": Array [
          Object {
            "createdAt": "baz o'clock",
            "name": "foobar",
          },
        ],
        "errors": undefined,
        "loading": false,
        "message": undefined,
      }
    `)
    expect(safeResponseData).toHaveBeenCalledTimes(1)
    safeResponseData.mockRestore()
  })
})
