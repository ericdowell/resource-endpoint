// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FormEvent, ReactChildren } from 'react'
import { func, node, object, string } from 'prop-types'
import { Endpoint } from '../endpoint'

type Props = {
  children: ReactChildren
  makeRequest: (inputs: any) => Promise<any>
  values: Record<string, any>
  setValues: (values: any) => void
  className?: string
  onError?: (errors: any, onSubmit: (event: FormEvent) => Promise<void>) => void
  onSuccess?: (payload: any) => Promise<any>
  initialState?: Record<string, any>
  rowClassName?: string
}

export function Form(props: Props): any {
  const onSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    props.setValues({ ...props.values, isLoading: true })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
