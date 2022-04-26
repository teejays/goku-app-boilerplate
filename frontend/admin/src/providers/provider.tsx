import { EntityInfo, EntityInfoCommon, EntityMinimal, UUID } from 'common'

import axios from 'axios'
import { notification } from 'antd'

const getBaseURL = (): string => {
    return `http://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/v1/`
}
const getEntityUrl = (entityInfo: EntityInfoCommon): string => {
    return getBaseURL() + entityInfo.serviceName + '/' + entityInfo.name
}

const getUrl = (path: string): string => {
    return getBaseURL() + path
}

export const addEntity = async <E extends EntityMinimal>(entityInfo: EntityInfoCommon, entity: EntityMinimal): Promise<E> => {
    // fetch data from a url endpoint
    console.log('Adding ' + entityInfo.getEntityName())
    let result
    try {
        result = await axios.post(getEntityUrl(entityInfo), entity)
    } catch (err) {
        console.log(`Adding ${entityInfo.getEntityName()} error:`, err.response)
        notification['error']({
            message: 'Adding ' + entityInfo.getEntityNameFormatted(),
            description: `${err} \n\n ${err.response.data.message}`,
        })
    }
    return result?.data
}

export const getEntity = async <E extends EntityMinimal = any>(entityInfo: EntityInfo<E>, id: UUID): Promise<E | null> => {
    // fetch data from a url endpoint
    const req = JSON.stringify({ ID: id })
    const url = getEntityUrl(entityInfo) + `?req=${req}`
    console.log('Getting entity: ' + entityInfo.name, 'with ID', id)
    try {
        const result = await axios.get(url)
        console.log('Get ' + entityInfo.getEntityName(), result)
        // Transform some fields before returning e.g. enum fields
        const entity = result.data as E
        return entity
    } catch (err) {
        console.log(err.response)
        notification['error']({
            message: 'Get ' + entityInfo.getEntityNameFormatted(),
            description: `${err}`,
        })
        return null
    }
}

export interface ListEntityResponse<E extends EntityMinimal> {
    items: E[]
    // Page: number
    // HasNextPage: boolean
    error: string
}

export const listEntity = async <E extends EntityMinimal>(entityInfo: EntityInfoCommon): Promise<ListEntityResponse<E>> => {
    console.log('List Entity: ' + entityInfo.name)
    // fetch data from a url endpoint
    const req = JSON.stringify({})
    const url = getEntityUrl(entityInfo) + `/list?req=${req}`
    console.log('Request to: ' + url)
    try {
        const result = await axios.get(url)
        console.log('List ' + entityInfo.getEntityName(), result)
        return result.data
    } catch (err) {
        console.error(err)
        notification['error']({
            message: 'List ' + entityInfo.getEntityNameFormatted(),
            description: `${err}`,
        })
        return { items: [], error: err }
    }
}

export const queryByTextEntity = async <E extends EntityMinimal = any>(entityInfo: EntityInfo<E>, text: string): Promise<ListEntityResponse<E>> => {
    console.log('Query by Text Entity: ' + entityInfo.name)
    // fetch data from a url endpoint
    const req = JSON.stringify({ query_text: text })
    const url = getEntityUrl(entityInfo) + `/query_by_text?req=${req}`
    console.log('Request to: ' + url)
    try {
        const result = await axios.get(url)
        console.log('Query by Text ' + entityInfo.getEntityName(), result)
        return result.data
    } catch (err) {
        console.error(err)
        notification['error']({
            message: 'Query by Text ' + entityInfo.getEntityNameFormatted(),
            description: `${err}`,
        })
        return { items: [], error: err }
    }
}

interface HTTPRequest<P> {
    path: string
    params?: P
}

interface HTTPResponse<T> {
    errMessage?: string
    data?: T
}

export const httpGetCall = async <T, P>(req: HTTPRequest<P>): Promise<HTTPResponse<T>> => {
    //const req = JSON.stringify(params)
    const url = getUrl(req.path)
    console.log('Request to: ' + url)
    try {
        const result = await axios.get(url, { params: req.params })
        return { data: result.data as T }
    } catch (err) {
        console.error(err)
        notification['error']({
            message: 'HTTP GET',
            description: `${err}`,
        })
        return { errMessage: err as string }
    }
}

export const httpPostCall = async <T, P>(req: HTTPRequest<P>): Promise<HTTPResponse<T>> => {
    //const req = JSON.stringify(params)
    const url = getUrl(req.path)
    console.log('Request to: ' + url)
    try {
        const result = await axios.post(url, { ...req.params })
        return { data: result.data as T }
    } catch (err) {
        console.error(err)
        return { errMessage: err as string }
    }
}
