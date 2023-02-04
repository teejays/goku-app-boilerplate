import { Alert, Spin } from 'antd'
import { EntityInfo, EntityInfoCommon } from './EntityInfo'
import { EntityInfoCommonV2, EntityMinimal, EntityProps, TypeInfoCommon } from 'common'
import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import { UUID } from './Primitives'
import { capitalCase } from 'change-case'
import { useGetEntity } from 'providers/provider'

interface EntityLinkProps<E extends EntityMinimal> {
    entity: E
    entityInfo: EntityInfo<E>
    text?: JSX.Element
}

export const EntityLink = <E extends EntityMinimal>(props: EntityLinkProps<E>): JSX.Element => {
    const { entity, entityInfo, text } = props
    return <Link to={getEntityDetailPath({ entityInfo, entity })}>{text ? text : entityInfo.getHumanName(entity)}</Link>
}

export const EntityListLink = (props: { entityInfo: EntityInfoCommon; text?: string }) => {
    const { entityInfo, text } = props
    return <Link to={getEntityListPath(entityInfo)}>{text ? text : capitalCase(entityInfo.name)}</Link>
}

interface EntityAddLinkProps<E extends EntityMinimal> {
    entityInfo: EntityInfoCommonV2<E>
    children: React.ReactElement
}

export const EntityAddLink = <E extends EntityMinimal>(props: EntityAddLinkProps<E>) => {
    return <Link to={getEntityAddPath(props.entityInfo)}>{props.children}</Link>
}

export const getEntityDetailPath = <E extends EntityMinimal, UTI extends TypeInfoCommon>({ entityInfo, entity }: EntityProps<E, UTI>): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/' + entity.id
}

export const getEntityListPath = (entityInfo: EntityInfoCommon): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/list'
}

export const getEntityAddPath = (entityInfo: EntityInfoCommon): string => {
    return '/' + entityInfo.serviceName + '/' + entityInfo.name + '/add'
}

interface EntityLinkFromIDProps<E extends EntityMinimal> {
    id: UUID
    entityInfo: EntityInfo<E>
    text?: JSX.Element
}

export const EntityLinkFromID = <E extends EntityMinimal = any>(props: EntityLinkFromIDProps<E>) => {
    const { id, entityInfo } = props

    const [{ loading, error, data: entity }] = useGetEntity<E>({ entityInfo: entityInfo, params: { id: id } })

    if (loading) {
        return <Spin size="small" />
    }

    if (error) {
        return <Alert message={error} type="error" />
    }

    if (!entity) {
        return <Alert message="Panic! No entity data returned" type="error" />
    }

    // Otherwise return a Table view
    return <EntityLink entity={entity} entityInfo={entityInfo} text={props.text} />
}
