import React from 'react'
import { AxiosRequestConfig } from 'axios'
import { func, node, object, string } from 'prop-types'
import { RequestForm, RequestFormProps } from './RequestForm'
import { CrudEndpoint } from '../endpoints'

export type EndpointFormConfig = Omit<AxiosRequestConfig, 'url' | 'method'>
export type EndpointFormMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

export interface EndpointFormProps extends Omit<RequestFormProps, 'makeRequest'> {
  action: string
  baseURL?: string
  config: (inputs: any, key: string, baseURL?: string) => EndpointFormConfig
  method: EndpointFormMethod
}

export function EndpointForm(props: EndpointFormProps): React.ReactElement {
  const makeRequest = async (inputs: any): Promise<any> => {
    const endpoint = new CrudEndpoint()
    const method = props.method.toLowerCase()
    switch (method) {
      case 'delete':
      case 'get':
        return endpoint[method](props.action, props.config(inputs, 'params', props.baseURL))
      case 'patch':
      case 'post':
      case 'put':
        return endpoint[method](props.action, props.config(inputs, 'data', props.baseURL))
    }
  }
  return (
    <RequestForm
      className={props.className}
      initialState={props.initialState}
      makeRequest={makeRequest}
      onError={props.onError}
      onSuccess={props.onSuccess}
      setValues={props.setValues}
      values={props.values}
    >
      {props.children}
    </RequestForm>
  )
}

EndpointForm.defaultProps = {
  baseURL: window.location.origin,
  config: (inputs: any, key: string, baseURL?: string): EndpointFormConfig => ({
    [key]: inputs,
    baseURL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  }),
}

EndpointForm.displayName = 'EndpointForm'

EndpointForm.propTypes = {
  children: node.isRequired,
  values: object.isRequired,
  setValues: func.isRequired,
  baseURL: string,
  className: string,
  config: func,
  onError: func,
  onSuccess: func,
  initialState: object,
}
