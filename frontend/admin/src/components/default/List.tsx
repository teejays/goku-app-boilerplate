import { Button, Card, Spin } from 'antd'
import { EntityAddLink, EntityInfo, EntityLink, EntityMinimal } from 'common'
import React, { useEffect, useState } from 'react'
import Table, { ColumnProps } from 'antd/lib/table/'

import { FieldDisplay } from 'components/DisplayAttributes/DisplayAttributes'
import { PlusOutlined } from '@ant-design/icons'
import { capitalCase } from 'change-case'
import { listEntity } from 'providers/provider'

interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
}

export const DefaultListView = <E extends EntityMinimal>({ entityInfo }: Props<E>) => {
    console.log('Rendering: List View', 'EntityInfo', entityInfo.name)
    const [data, setData] = useState<E[]>([])
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    console.log('List Data:', data)

    useEffect(() => {
        console.log('List View: Fetching data...')
        const fetchData = async () => {
            const result = await listEntity<E>(entityInfo)
            if (result) {
                setData(result.items)
                setIsLoaded(true)
            }
        }

        fetchData().catch(console.error)
    }, [entityInfo.name])

    // If we're loading data, show loading sign
    if (!isLoaded) {
        return <Spin size="large" />
    }

    // Otherwise return a Table view
    let columns: ColumnProps<E>[] = []
    console.log('* entityInfo.name: ', entityInfo.name)
    console.log('Columns', entityInfo.columnsFieldsForListView)
    entityInfo.columnsFieldsForListView.forEach((fieldName) => {
        const fieldInfo = entityInfo.getFieldInfo(fieldName)
        if (!fieldInfo) {
            throw new Error(`Attempted to fetch list column field '${fieldName}' for entity '${entityInfo.name}'`)
        }
        const fieldKind = fieldInfo?.kind
        console.log('* FieldName:', fieldName, 'FieldKind: ', fieldKind.name)
        const DisplayComponent = fieldKind.getDisplayComponent(fieldInfo)

        const col = {
            title: fieldInfo.kind.getLabel(fieldInfo),
            dataIndex: fieldName as string,
            render: (text: string, entity: E) => {
                console.log('List: Col: Entity ', entity, 'FieldInfo', fieldInfo)
                return <EntityLink entity={entity} entityInfo={entityInfo} text={<FieldDisplay fieldInfo={fieldInfo} objectValue={entity} DisplayComponent={DisplayComponent} />} />
            },
        }
        columns.push(col)
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
            <Table columns={columns} dataSource={data} rowKey={(record: E) => record.id} />
        </Card>
    )
}
