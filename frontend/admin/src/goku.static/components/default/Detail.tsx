import { Card, Result, Spin } from 'antd'
import { EntityInfo, EntityMinimal, UUID } from 'goku.static/common'
import React, { useEffect, useState } from 'react'

import { TypeDisplay } from 'goku.static/components/DisplayAttributes/DisplayAttributes'
import { useGetEntity } from 'goku.static/providers/provider'

interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
    objectId: UUID
}

export const DefaultDetailView = <E extends EntityMinimal>(props: Props<E>) => {
    const { entityInfo, objectId } = props

    const [{ loading, error, data: entity }] = useGetEntity<E>({ entityInfo: entityInfo, params: { id: objectId } })

    if (loading) {
        return <Spin size="large" />
    }

    if (error) {
        return <Result status="error" title="Something went wrong" subTitle={error} />
    }

    if (!entity) {
        return <Result status="error" subTitle="Panic! No entity data returned" />
    }

    // Otherwise return a Table view
    return (
        <Card title={entityInfo.getEntityNameFormatted() + ' Details: ' + entityInfo.getHumanName(entity)}>
            <TypeDisplay typeInfo={entityInfo} objectValue={entity} />
        </Card>
    )
}
