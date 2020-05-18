import React from 'react'
import { func, node, object, string } from 'prop-types'
import { Endpoint } from '../endpoint'

export function Form(props): any {
  const onSubmit = async (e) => {
    e.preventDefault()
    props.setValues({ ...props.values, isLoading: true })
    const { errors, isLoading, ...inputs } = props.values
    const data = Endpoint.safeResponseData(await props.makeRequest(inputs))
    if (data.errors) {
      props.setValues({
        ...props.values,
        errors: data.errors,
        isLoading: false,
      })
      if (typeof props.onError !== 'function') {
        return
      }
      return props.onError(data.errors, onSubmit)
    }
    if (typeof props.onSuccess === 'function') {
      await props.onSuccess(data)
    } else {
      props.setValues({ ...props.initialState, isLoading: false })
    }
  }
  return (
    <div className={props.rowClassName}>
      <form onSubmit={onSubmit} className={props.className}>
        {props.children}
      </form>
    </div>
  )
}

Form.defaultProps = {
  className: 'bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4',
  rowClassName: 'w-full max-w-xs',
}

Form.displayName = 'Form'

Form.propTypes = {
  children: node.isRequired,
  makeRequest: func.isRequired,
  values: object.isRequired,
  setValues: func.isRequired,
  className: string,
  onError: func,
  onSuccess: func,
  initialState: object,
  rowClassName: string,
}
