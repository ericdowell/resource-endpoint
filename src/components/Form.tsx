// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { func, node, object, string } from 'prop-types'
import { Endpoint } from '../endpoint'

export interface Props {
  children: React.ReactNode | React.ReactNode[]
  makeRequest: (inputs: any) => Promise<any>
  values: Record<string, any>
  setValues: React.Dispatch<React.SetStateAction<any>>
  className?: string
  onError?: (errors: any, onSubmit: (event: React.FormEvent) => Promise<void>) => void
  onSuccess?: (payload: any) => Promise<any>
  initialState?: Record<string, any>
}

export function Form(props: Props): React.ReactElement<Props> {
  const onSubmit = async (event: React.FormEvent): Promise<void> => {
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
    <form onSubmit={onSubmit} className={props.className}>
      {props.children}
    </form>
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
}
