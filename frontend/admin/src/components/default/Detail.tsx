import { Card, Spin } from 'antd'
import { EntityInfo, EntityMinimal, UUID } from 'common'
import React, { useEffect, useState } from 'react'

import { TypeDisplay } from 'components/DisplayAttributes/DisplayAttributes'
import { getEntity } from 'providers/provider'

interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
    objectId: UUID
}

export const DefaultDetailView = <E extends EntityMinimal>(props: Props<E>) => {
    const { entityInfo, objectId } = props

    const [entity, setEntity] = useState<E | null>(null)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        async function fetchData() {
            const data = await getEntity<E>(entityInfo, objectId)
            setEntity(data)
            setIsLoaded(true)
        }

        fetchData()
    }, [entityInfo, objectId])

    if (!isLoaded) {
        return <Spin size="large" />
    }

    if (!entity) {
        return <p>No Entity data found</p>
    }

    // Otherwise return a Table view
    return (
        <Card title={entityInfo.getEntityNameFormatted() + ' Details: ' + entityInfo.getHumanName(entity)}>
            <TypeDisplay typeInfo={entityInfo} objectValue={entity} />
        </Card>
    )
}
