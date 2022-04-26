import { AppInfoContext, EntityInfo, EntityLink, EntityMinimal, FieldInfo, TypeInfo, TypeMinimal, UUID } from 'common'
import { Descriptions, Empty, List, Spin } from 'antd'
import { PersonName, PhoneNumber } from 'goku.generated/types/types.generated'
import React, { useContext, useEffect, useState } from 'react'

import ReactJson from 'react-json-view'
import { getEntity } from 'providers/provider'
import { getValueForField } from 'common/FieldKind'

// TypeDisplay component displays a Type
export interface TypeDisplayProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
    objectValue: T
    showMetaFields?: boolean
}
export const TypeDisplay = <T extends TypeMinimal>(props: TypeDisplayProps<T>) => {
    const { typeInfo, objectValue } = props

    // Construct Description Items
    let filteredFields = typeInfo.fieldInfos
    // - Remove Meta fields?
    if (!props.showMetaFields) {
        filteredFields = filteredFields.filter((fieldInfo) => {
            return !fieldInfo.isMetaField
        })
    }
    const descriptionsItems: JSX.Element[] = filteredFields.map(
        (fieldInfo): JSX.Element => {
            const fieldKind = fieldInfo.kind
            let DisplayComponent = fieldKind.getDisplayComponent(fieldInfo)
            if (fieldInfo.isRepeated) {
                DisplayComponent = fieldKind.getDisplayRepeatedComponent(fieldInfo)
            }

            return (
                <Descriptions.Item key={fieldInfo.name} label={fieldInfo.kind.getLabel(fieldInfo)} span={3}>
                    <FieldDisplay fieldInfo={fieldInfo} objectValue={objectValue} DisplayComponent={DisplayComponent} />
                </Descriptions.Item>
            )
        }
    )

    // Return a Table view
    return (
        <Descriptions bordered layout="horizontal">
            {descriptionsItems}
        </Descriptions>
    )
}

export interface FieldDisplayProps<T extends TypeMinimal> {
    fieldInfo: FieldInfo
    objectValue: T
    DisplayComponent: React.ComponentType<DisplayProps<any>>
}

export const FieldDisplay = <T extends TypeMinimal | TypeMinimal[]>(props: FieldDisplayProps<T>) => {
    const { fieldInfo, objectValue, DisplayComponent } = props
    const fieldValue = getValueForField({ obj: objectValue, fieldInfo: fieldInfo })

    return <DisplayComponent value={fieldValue} />
}

export interface DisplayProps<T = any> {
    value?: T
}

export const DefaultDisplay = <FT extends any>(props: DisplayProps<FT>) => {
    return <>{props.value}</>
}

export const ObjectDisplay = <FT extends Object>(props: DisplayProps<FT>) => {
    return <ReactJson src={props.value!} />
}

export const StringDisplay = <FT extends string>(props: DisplayProps<FT>) => {
    return <>{props.value}</>
}

export const BooleanDisplay = <FT extends boolean>(props: DisplayProps<FT>) => {
    // TODO: Handle null
    return <>{props.value ? 'YES' : 'NO'}</>
}

export const DateDisplay = <FT extends Date>(props: DisplayProps<FT>) => {
    const d = new Date(props.value as Date)
    return <DefaultDisplay value={d.toDateString()} />
}

export const TimestampDisplay = <FT extends Date>(props: DisplayProps<FT>) => {
    if (!props.value) {
        return (
            <span>
                <i>No Data</i>
            </span>
        )
    }
    const d = new Date(props.value as Date)
    return <DefaultDisplay value={d.toUTCString()} />
}

export const RepeatedDisplay = <FT extends any>(props: { value: FT[]; DisplayComponent: React.ComponentType<DisplayProps<FT>> }) => {
    return (
        <List
            size="small"
            dataSource={props.value}
            renderItem={(item: FT) => (
                <List.Item>
                    <props.DisplayComponent value={item} />
                </List.Item>
            )}
        />
    )
}

export const PersonNameDisplay = <T extends PersonName>(props: DisplayProps<T>) => {
    const { value } = props
    let text = ''
    text += value?.first
    if (value?.middle_initial) {
        text += ' ' + value.middle_initial
    }
    text += ' ' + value?.last
    return <DefaultDisplay value={text} />
}

export const PhoneNumberDisplay = <T extends PhoneNumber>(props: DisplayProps<T>) => {
    const { value } = props
    let text = ''
    text += `+${value?.country_code} ${value?.number}`
    if (value?.extension) {
        text += ` x${value?.extension}`
    }
    return <DefaultDisplay value={text} />
}

export interface ForeignEntityFieldDisplayProps {
    fieldInfo: FieldInfo
}

export const getForeignEntityFieldDisplayComponent = <ForeignEntityType extends EntityMinimal>(props: ForeignEntityFieldDisplayProps): React.ComponentType<DisplayProps<any>> => {
    const { fieldInfo } = props

    return (props: DisplayProps<UUID>) => {
        const [foreignEntityInfo, setForeignEntityInfo] = useState<EntityInfo<ForeignEntityType>>()

        // Get ServiceInfo from context
        const store = useContext(AppInfoContext)

        if (!fieldInfo.foreignEntityInfo) {
            throw new Error('ForeignEntity DisplayProps for field with no foreignEntityInfo')
        }

        if (fieldInfo.foreignEntityInfo.serviceName && fieldInfo.foreignEntityInfo.entityName) {
            const foreignEntityInfoLocal = store?.getEntityInfo<ForeignEntityType>(fieldInfo.foreignEntityInfo.serviceName, fieldInfo.foreignEntityInfo.entityName)
            if (foreignEntityInfoLocal) {
                setForeignEntityInfo(foreignEntityInfoLocal)
            }
        }

        const { value: foreignEntityId } = props
        const [foreignEntity, setForeignEntity] = useState<ForeignEntityType>()

        useEffect(() => {
            async function fetchData(foreignId: UUID, foreignEntityInfo: EntityInfo<ForeignEntityType>) {
                const data = await getEntity(foreignEntityInfo, foreignId)
                if (data) {
                    setForeignEntity(data)
                }
            }

            if (!foreignEntityId) {
                return
            }

            if (!foreignEntityInfo) {
                return
            }

            fetchData(foreignEntityId, foreignEntityInfo)
        }, [store, foreignEntityId, foreignEntityInfo])

        if (!props.value) {
            return <Empty />
        }
        if (!store) {
            return <Spin />
        }

        if (!foreignEntityInfo) {
            return <Spin />
        }
        if (!foreignEntity) {
            return <Spin />
        }

        return <EntityLink entity={foreignEntity} entityInfo={foreignEntityInfo} />
    }
}
