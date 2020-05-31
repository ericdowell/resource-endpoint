import React from 'react'
import { AxiosRequestConfig } from 'axios'
import { func, node, object, string } from 'prop-types'
import { RequestForm, RequestFormProps } from './RequestForm'
import { AxiosCrudEndpoint, CrudEndpoint } from '../endpoints'

export type EndpointFormConfig = Omit<AxiosRequestConfig, 'url' | 'method'>
export type EndpointFormMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

export interface EndpointFormProps extends Omit<RequestFormProps, 'makeRequest'> {
  url: string
  baseURL?: string
  config: (inputs: any, key: string, baseURL?: string) => EndpointFormConfig
  createEndpoint: () => AxiosCrudEndpoint
  method: EndpointFormMethod
}

export function EndpointForm(props: EndpointFormProps): React.ReactElement {
  const makeRequest = async (inputs: any): Promise<any> => {
    switch (props.method) {
      case 'delete':
      case 'get':
        return props.createEndpoint()[props.method](props.url, props.config(inputs, 'params', props.baseURL))
      case 'patch':
      case 'post':
      case 'put':
        return props.createEndpoint()[props.method](props.url, props.config(inputs, 'data', props.baseURL))
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
  createEndpoint: (): AxiosCrudEndpoint => new CrudEndpoint(),
}

EndpointForm.displayName = 'EndpointForm'

EndpointForm.propTypes = {
  children: node.isRequired,
  setValues: func.isRequired,
  values: object.isRequired,
  url: string.isRequired,
  baseURL: string,
  className: string,
  config: func,
  createEndpoint: func,
  initialState: object,
  onError: func,
  onSuccess: func,
}
