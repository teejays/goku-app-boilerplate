import { Button, Card, Result, Spin } from 'antd'
import { EntityAddLink, EntityInfo, EntityLink, EntityMinimal } from 'common'
import { ListEntityResponse, useListEntity } from 'providers/provider'
import React, { useEffect, useState } from 'react'
import Table, { ColumnProps } from 'antd/lib/table/'

import { FieldDisplay } from 'components/DisplayAttributes/DisplayAttributes'
import { PlusOutlined } from '@ant-design/icons'
import { capitalCase } from 'change-case'

interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
}

export const DefaultListView = <E extends EntityMinimal>({ entityInfo }: Props<E>) => {
    console.log('List View: Rendering...', 'EntityInfo', entityInfo.name)

    const [{ loading, error, data }, fetch] = useListEntity<E>({
        entityInfo: entityInfo,
        params: {
            req: {},
        },
    })

    console.log('List View: data status', loading, error, data)

    if (loading) {
        return <Spin size="large" />
    }

    if (error) {
        return <Result status="error" title="Something went wrong" subTitle={error} />
    }

    if (!data) {
        return <Result status="error" subTitle="Panic! No entity data returned" />
    }

    // Otherwise return a Table view
    console.log('* entityInfo.name: ', entityInfo.name)
    console.log('Columns', entityInfo.columnsFieldsForListView)

    const columns: ColumnProps<E>[] = entityInfo.columnsFieldsForListView.map((fieldName) => {
        const fieldInfo = entityInfo.getFieldInfo(fieldName)
        if (!fieldInfo) {
            throw new Error(`Attempted to fetch list column field '${String(fieldName)}' for entity '${entityInfo.name}'`)
        }
        const fieldKind = fieldInfo?.kind
        console.log('* FieldName:', fieldName, 'FieldKind: ', fieldKind.name)
        const DisplayComponent = fieldKind.getDisplayComponent(fieldInfo, entityInfo)

        return {
            title: fieldInfo.kind.getLabel(fieldInfo),
            dataIndex: fieldName as string,
            render: (value: any, entity: E) => {
                console.log('List: Col: Entity ', entity, 'FieldInfo', fieldInfo)
                return <DisplayComponent value={value} />
            },
        }
    })

    const addButton = (
        <EntityAddLink entityInfo={entityInfo}>
            <Button type="primary" icon={<PlusOutlined />}>
                Add {capitalCase(entityInfo.getEntityName())}
            </Button>
        </EntityAddLink>
    )

    return (
        <Card title={`List ${capitalCase(entityInfo.getEntityName())}`} extra={addButton}>
            <Table columns={columns} dataSource={data?.items} rowKey={(record: E) => record.id} />
        </Card>
    )
}
