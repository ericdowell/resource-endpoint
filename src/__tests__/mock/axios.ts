export function BasicMock(config: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (config.errors) {
      const error = {
        config: {},
        response: {
          data: {
            errors: config.errors,
          },
          status: config.status || 422,
        },
      }
      return reject(error)
    }
    return resolve({
      config: {},
      data: { foo: 'bar' },
    })
  })
}
