import { EntityInfo, EntityInfoCommon, EntityMinimal, UUID } from 'goku.static/common'
import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useContext, useEffect, useState } from 'react'

import { AuthContext } from 'goku.static/common/AuthContext'
import { config } from 'process'
import { notification } from 'antd'

const getBaseURL = (): string => {
    return `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/v1/`
}

const getEntityPath = (entityInfo: EntityInfoCommon): string => {
    return entityInfo.serviceName + '/' + entityInfo.name
}

const getUrl = (path: string): string => {
    return getBaseURL() + path
}

export interface HTTPRequestWithEntityInfo<E extends EntityMinimal, P = never, D = never> {
    entityInfo: EntityInfo<E>
    params?: P
    data?: D
    config?: Partial<Omit<HTTPRequestFetchConfig<D>, 'data' | 'params'>> // because params field in here is of any type, data field: we just want it outside
}

export interface AddEntityRequest<E extends EntityMinimal> {
    entity: E
}

export const useAddEntity = <E extends EntityMinimal>(props: HTTPRequestWithEntityInfo<E, undefined, E>): readonly [HTTPResponse<E>, FetchFunc<E>] => {
    const { entityInfo, data, config } = props

    console.log('Add Entity: ' + entityInfo.name)

    // fetch data from a url endpoint

    return useAxiosV2<E, E>({
        method: 'POST',
        path: getEntityPath(entityInfo),
        skipInitialCall: true,
        config: {
            ...config,
            data: data,
            notifyOnError: true,
        },
    })
}

export interface GetEntityRequest {
    id: UUID
}

export const useGetEntity = <E extends EntityMinimal = any>(props: HTTPRequestWithEntityInfo<E, GetEntityRequest>): readonly [HTTPResponse<E>, FetchFunc<E>] => {
    const { entityInfo, params } = props

    console.log('Get Entity: ' + entityInfo.name)

    // fetch data from a url endpoint
    return useAxiosV2<E>({
        method: 'GET',
        path: getEntityPath(entityInfo),
        config: {
            params: { req: params },
            notifyOnError: true,
        },
    })
}

export interface ListEntityRequestParams {
    req: any
}

export interface ListEntityResponse<E extends EntityMinimal> {
    items: E[]
    // Page: number
    // HasNextPage: boolean
}

export const useListEntity = <E extends EntityMinimal>(
    props: HTTPRequestWithEntityInfo<E, ListEntityRequestParams>
): readonly [HTTPResponse<ListEntityResponse<E>>, FetchFunc<ListEntityResponse<E>>] => {
    const { entityInfo, params } = props

    console.log('List Entity: ' + entityInfo.name)

    // fetch data from a url endpoint
    return useAxiosV2<ListEntityResponse<E>>({
        method: 'GET',
        path: getEntityPath(entityInfo) + `/list`,

        config: {
            ...config,
            params: params, // can include any filters here
            notifyOnError: true,
        },
    })
}

export interface ListByTextQueryRequest {
    query_text: string
}

export const useListEntityByTextQuery = <E extends EntityMinimal = any>(
    props: HTTPRequestWithEntityInfo<E, ListByTextQueryRequest>
): readonly [HTTPResponse<ListEntityResponse<E>>, FetchFunc<ListByTextQueryRequest>] => {
    const { entityInfo, params, config } = props

    console.log('Query by Text Entity: ' + entityInfo.name)

    // fetch data from a url endpoint
    return useAxiosV2({
        method: 'GET',
        path: getEntityPath(entityInfo) + `/query_by_text`,
        config: {
            ...config,
            params: params,
            notifyOnError: true,
        },
    })
}

// HTTPRequestCustomConfig are params that are open to the caller component to set, when they call our helpers like useGetEntity etc.

// Options, ONLY allowed during the initial phase
export interface HTTPRequestInitConfig<D = any> {
    method: 'GET' | 'POST'
    path: string
    // If set to true, do not make a call, and simply return empty data
    skipInitialCall?: boolean
}

// Options used during fetch phase.
export interface HTTPRequestFetchConfig<D = any> extends Omit<AxiosRequestConfig<D>, 'method' | 'url'> {
    // If set, it will be called in case we get an error
    errorCb?: (errMsg: string) => void
    // If set, we will trigger a temporary UI notification to show the error
    notifyOnError?: boolean
}

export interface HTTPRequest<D = any> extends HTTPRequestInitConfig<D> {
    config: HTTPRequestFetchConfig<D>
}

interface HTTPResponse<T = any> {
    loading?: boolean
    error?: string
    data?: T
}

interface GokuHTTPResponse<T = any> {
    data: T
    error?: string
    status_code: number
}

type FetchFunc<D = any> = (config: HTTPRequestFetchConfig<D>) => void

export const useAxiosV2 = <T = any, D = any>(props: HTTPRequest<D>): readonly [HTTPResponse<T>, FetchFunc<D>] => {
    const { method, path, config: initialConfig } = props

    console.log('useAxios: Setting up HTTP call with props', props)

    const [data, setData] = useState<T>()
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>()

    const authContext = useContext(AuthContext)

    const fetch = async (config: HTTPRequestFetchConfig<D>) => {
        // Overwrite the props with any new values in the config
        const finalConfig = { ...initialConfig, ...config }

        setLoading(true)

        // Add auth token
        finalConfig.headers = finalConfig.headers ?? {}
        if (authContext?.authSession?.token) {
            finalConfig.headers['Authorization'] = 'Bearer ' + authContext.authSession.token
        }

        console.log('useAxios: Making an HTTP call with config', finalConfig)

        try {
            const result = await axios.request<GokuHTTPResponse<T>>({
                method: method,
                url: getUrl(path),
                // paramsSerializer: We need to be able to pass objects a param values in the URL, so need to implement our own params serializer
                paramsSerializer: {
                    serialize: (p) => {
                        const urlP = new URLSearchParams(p)
                        Object.entries(p).forEach(([k, v]) => {
                            urlP.set(k, JSON.stringify(v))
                        })
                        const r = decodeURI(urlP.toString())
                        return r
                    },
                },
                ...finalConfig,
            })
            console.log('useAxios: result', result)
            setData(result.data?.data)
            if (result.data?.error) {
                const errMsg = result.data?.error
                setError(errMsg)
            }
        } catch (err) {
            // Handle Error
            let errMsg: string = ''
            console.error(err)
            if (err instanceof AxiosError) {
                errMsg = err.response?.data?.error ?? err.message
            } else if (err instanceof Error) {
                errMsg = err.message
            } else {
                errMsg = String(err)
            }

            setError(errMsg)

            if (finalConfig.notifyOnError) {
                notification['error']({
                    message: 'Error',
                    description: errMsg,
                })
            }

            if (finalConfig.errorCb) {
                finalConfig.errorCb(errMsg)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!props.skipInitialCall) {
            fetch(initialConfig)
        }
    }, [method, path, props.skipInitialCall]) // execute once only

    return [{ data, error, loading }, fetch] as const
}
