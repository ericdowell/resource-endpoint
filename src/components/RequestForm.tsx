import React from 'react'
import { func, node, object, string } from 'prop-types'
import { createOnSubmit, OnSubmitOptions } from '../helpers'

export interface RequestFormProps extends Omit<OnSubmitOptions, 'useState'> {
  children: React.ReactNode
  className?: string
  setValues: React.Dispatch<React.SetStateAction<any>>
  values: any
}

export function RequestForm(props: RequestFormProps): React.ReactElement<RequestFormProps> {
  return (
    <form
      onSubmit={createOnSubmit({
        initialState: props.initialState,
        makeRequest: props.makeRequest,
        onError: props.onError,
        onSuccess: props.onSuccess,
        useState: [props.values, props.setValues],
      })}
      className={props.className}
    >
      {props.children}
    </form>
  )
}

RequestForm.displayName = 'RequestForm'

RequestForm.propTypes = {
  children: node.isRequired,
  makeRequest: func.isRequired,
  values: object.isRequired,
  setValues: func.isRequired,
  className: string,
  onError: func,
  onSuccess: func,
  initialState: object,
}
