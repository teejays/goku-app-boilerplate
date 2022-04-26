/*eslint-disable */

import { AppInfo, ServiceInfo, EntityInfo, EnumInfo, EnumValueInfo, EntityInfoInputProps, TypeInfo, TypeInfoInputProps } from 'common'
import * as FieldKind from 'common/FieldKind'

import * as example_app_types from 'goku.generated/types/types.generated'
import * as pharmacy_types from 'goku.generated/types/pharmacy/types.generated'

/*eslint-disable */

/**
 * Local Types, Type Info Props, Type Infos
 */
// No Local Types
// DrugField: <description of the enum>
export type DrugField = 'ID' | 'Name' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | never

export const DrugFieldValuesInfo: EnumValueInfo<DrugField>[] = [
    new EnumValueInfo({ id: 1, value: 'ID' }),
    new EnumValueInfo({ id: 2, value: 'Name' }),
    new EnumValueInfo({ id: 3, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 4, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 5, value: 'DeletedAt' }),
]
export const DrugFieldEnumInfo: EnumInfo<DrugField> = new EnumInfo({ name: 'drug__field', valuesInfo: DrugFieldValuesInfo })

/**
 * Union of local Types
 */

// LocalTypesUnionType represents the union of all the non-entity Types within this level. It includes FooWithMeta types as well.
type LocalTypesUnionType = never

// LocalTypeInfosUnionType represents the union of all the TypeInfos within this level. It includes TypeInfos<FooWithMeta> as well.
type LocalTypeInfosUnionType = never

// A collection of TypeInfos of all the Types exclusively declared in this level
export const typeInfos: LocalTypeInfosUnionType[] = []

/**
 * Entity Type, Entity Info Props
 */
// Drug: <description of the type>
export type Drug = {
    id: string
    name: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// DrugInfoProps implements the props that are specific to Drug, for a EntityInfo implementation
const DrugInfoProps: EntityInfoInputProps = {
    name: 'drug',
    serviceName: 'pharmacy',
    fieldInfos: [
        {
            name: 'id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
        },
        {
            name: 'name',
            kind: FieldKind.StringKind,
        },
        {
            name: 'created_at',
            kind: FieldKind.TimestampKind,
            isMetaField: true,
        },
        {
            name: 'updated_at',
            kind: FieldKind.TimestampKind,
            isMetaField: true,
        },
        {
            name: 'deleted_at',
            kind: FieldKind.TimestampKind,
            isMetaField: true,
        },
    ],
    enumInfos: [DrugFieldEnumInfo],
    typeInfos: typeInfos,
}

/**
 * All Inclusive Union Types
 */

// TypesUnionType is a union of types of all the Type within and under this level. In case of an entity, this is only the local Types type.
export type TypesUnionType = LocalTypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = Drug

// Entity Info
export const drugInfo = new EntityInfo<Drug>(DrugInfoProps)
