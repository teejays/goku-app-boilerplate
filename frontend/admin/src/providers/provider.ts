import { AuthContext, AuthContextProps } from 'common/AuthContext'
import { EntityInfo, EntityInfoCommon, EntityMinimal, UUID } from 'common'
import React, { useContext, useEffect, useRef, useState } from 'react'
import axios, { AxiosError, AxiosRequestConfig, ParamsSerializerOptions } from 'axios'

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
        config: {
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
            console.log(result)
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

// export const useHttp = <T = any, D = any>(props: HTTPRequest<D>): readonly [HTTPResponse<T>] => {
//     const { path, errorCb } = props

//     const { authSession } = useContext<AuthContextProps>(AuthContext)

//     const url = getUrl(path)
//     const config: AxiosRequestConfig<D> = {
//         url: url,
//         headers: props.headers ?? {},
//         ...props,
//     }
//     config.headers!['Access-Control-Allow-Origin'] = '*'

//     // Add auth token
//     if (authSession?.token) {
//         config.headers!['Authorization'] = 'Bearer ' + authSession.token
//     }
//     console.log(`Making a ${config.method} request`, config)

//     // if (props.induceError) {
//     //     return { error: props.induceError }
//     // }

//     // if (props.skip) {
//     //     return {}
//     // }

//     const [{ data, loading, error }] = useAxios<T>(config)

//     // if (loading !== resp.loading) {
//     //     setResp({ ...resp, loading: loading })
//     // }

//     // Run any error call back
//     if (error && errorCb) {
//         errorCb(error.message)
//         // if (error.message !== resp.error) {
//         //     setResp({ ...resp, error: error.message })
//         // }
//     }

//     // if (data && resp.data !== data) {
//     //     setResp({ ...resp, data: data })
//     // }

//     return [{ loading: loading, error: error?.message, data: data }] as const
// // }

// export const makeUseHttp = <T = any, D = any>(req: HttpRequestInitial) => {
//     return (props: Omit<HTTPRequest<D>, 'method' | 'path'>): readonly [HTTPResponse<T>] => {
//         const doUseAxios = makeUseAxios()
//         const url = getUrl(req.path)
//         const [{ loading, error, data }] = doUseAxios<T>({
//             method: req.method,
//             url: url,
//             ...props,
//         })
//         return [{ loading: loading, error: error?.message, data: data }] as const
//     }
// }

function mergeObject(a: any, b: any) {
    function isValueEmpty(value: any) {
        return value === '' || value === undefined || value === null
    }

    return Object.fromEntries(
        Object.entries(a).map(([key, aValue]): any => {
            const bValue = b[key]

            return [key, typeof aValue === 'object' ? mergeObject(aValue, bValue) : isValueEmpty(aValue) ? bValue : aValue]
        })
    )
}
