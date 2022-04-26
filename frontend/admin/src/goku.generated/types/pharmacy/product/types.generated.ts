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
// ProductField: <description of the enum>
export type ProductField = 'ID' | 'MedicineID' | 'Mass' | 'Count' | 'Name' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | never

export const ProductFieldValuesInfo: EnumValueInfo<ProductField>[] = [
    new EnumValueInfo({ id: 1, value: 'ID' }),
    new EnumValueInfo({ id: 2, value: 'MedicineID' }),
    new EnumValueInfo({ id: 3, value: 'Mass' }),
    new EnumValueInfo({ id: 4, value: 'Count' }),
    new EnumValueInfo({ id: 5, value: 'Name' }),
    new EnumValueInfo({ id: 6, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 7, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 8, value: 'DeletedAt' }),
]
export const ProductFieldEnumInfo: EnumInfo<ProductField> = new EnumInfo({ name: 'product__field', valuesInfo: ProductFieldValuesInfo })

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
// Product: <description of the type>
export type Product = {
    id: string
    medicine_id: string
    mass: number
    count: number
    name: string | null
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// ProductInfoProps implements the props that are specific to Product, for a EntityInfo implementation
const ProductInfoProps: EntityInfoInputProps = {
    name: 'product',
    serviceName: 'pharmacy',
    fieldInfos: [
        {
            name: 'id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
        },
        {
            name: 'medicine_id',
            kind: FieldKind.UUIDKind,
            foreignEntityInfo: {
                serviceName: 'pharmacy',
                entityName: 'medicine',
            },
        },
        {
            name: 'mass',
            kind: FieldKind.NumberKind,
        },
        {
            name: 'count',
            kind: FieldKind.NumberKind,
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
    enumInfos: [ProductFieldEnumInfo],
    typeInfos: typeInfos,
}

/**
 * All Inclusive Union Types
 */

// TypesUnionType is a union of types of all the Type within and under this level. In case of an entity, this is only the local Types type.
export type TypesUnionType = LocalTypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = Product

// Entity Info
export const productInfo = new EntityInfo<Product>(ProductInfoProps)
