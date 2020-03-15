export function BasicMock(options: any): Promise<any> {
  return new Promise((resolve, reject) => {
    if (options.errors) {
      const error = {
        config: {},
        response: {
          data: {
            errors: options.errors,
          },
          status: options.status || 422,
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
