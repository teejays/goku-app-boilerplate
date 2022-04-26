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
// PharmaceuticalCompanyField: <description of the enum>
export type PharmaceuticalCompanyField = 'ID' | 'Name' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | never

export const PharmaceuticalCompanyFieldValuesInfo: EnumValueInfo<PharmaceuticalCompanyField>[] = [
    new EnumValueInfo({ id: 1, value: 'ID' }),
    new EnumValueInfo({ id: 2, value: 'Name' }),
    new EnumValueInfo({ id: 3, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 4, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 5, value: 'DeletedAt' }),
]
export const PharmaceuticalCompanyFieldEnumInfo: EnumInfo<PharmaceuticalCompanyField> = new EnumInfo({ name: 'pharmaceutical_company__field', valuesInfo: PharmaceuticalCompanyFieldValuesInfo })

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
// PharmaceuticalCompany: <description of the type>
export type PharmaceuticalCompany = {
    id: string
    name: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// PharmaceuticalCompanyInfoProps implements the props that are specific to PharmaceuticalCompany, for a EntityInfo implementation
const PharmaceuticalCompanyInfoProps: EntityInfoInputProps = {
    name: 'pharmaceutical_company',
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
    enumInfos: [PharmaceuticalCompanyFieldEnumInfo],
    typeInfos: typeInfos,
}

/**
 * All Inclusive Union Types
 */

// TypesUnionType is a union of types of all the Type within and under this level. In case of an entity, this is only the local Types type.
export type TypesUnionType = LocalTypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = PharmaceuticalCompany

// Entity Info
export const pharmaceuticalCompanyInfo = new EntityInfo<PharmaceuticalCompany>(PharmaceuticalCompanyInfoProps)
