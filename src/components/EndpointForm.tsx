import React from 'react'
import { AxiosRequestConfig } from 'axios'
import { func, node, object, string } from 'prop-types'
import { Constructor } from '../mixins'
import { AxiosCrudEndpoint, FormEndpoint } from '../endpoints'
import { RequestForm, RequestFormProps } from './RequestForm'

export type EndpointFormConfig = Omit<AxiosRequestConfig, 'url' | 'method'>
export type EndpointFormMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

export interface EndpointFormProps extends Omit<RequestFormProps, 'makeRequest'> {
  url: string
  baseURL?: string
  config: (inputs: any, key: string, baseURL?: string) => EndpointFormConfig
  createEndpoint: (EndpointClass: Constructor<AxiosCrudEndpoint>) => AxiosCrudEndpoint
  endpointClass: Constructor<AxiosCrudEndpoint>
  method: EndpointFormMethod
}

export function EndpointForm(props: EndpointFormProps): React.ReactElement<EndpointFormProps> {
  const makeRequest = async (inputs: any): Promise<any> => {
    const endpoint = props.createEndpoint(props.endpointClass)
    switch (props.method) {
      case 'delete':
      case 'get':
        return endpoint[props.method](props.url, props.config(inputs, 'params', props.baseURL))
      case 'patch':
      case 'post':
      case 'put':
        return endpoint[props.method](props.url, props.config(inputs, 'data', props.baseURL))
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
    // headers set via FormMixin if using FormEndpoint
  }),
  createEndpoint: (EndpointClass: Constructor<AxiosCrudEndpoint>): AxiosCrudEndpoint => new EndpointClass(),
  endpointClass: FormEndpoint,
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
  endpointClass: func,
  initialState: object,
  onError: func,
  onSuccess: func,
}
