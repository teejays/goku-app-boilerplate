/*eslint-disable */

import { AppInfo, ServiceInfo, EntityInfo, EnumInfo, EnumValueInfo, EntityInfoInputProps, TypeInfo, TypeInfoInputProps } from 'common'
import * as FieldKind from 'common/FieldKind'

import * as example_app_types from 'goku.generated/types/types.generated'
import * as users_types from 'goku.generated/types/users/types.generated'

/*eslint-disable */

/**
 * Local Types, Type Info Props, Type Infos
 */
// No Local Types
// UserField: <description of the enum>
export type UserField =
    | 'ID'
    | 'Name'
    | 'Name_First'
    | 'Name_MiddleInitial'
    | 'Name_Last'
    | 'Email'
    | 'PhoneNumber'
    | 'PhoneNumber_CountryCode'
    | 'PhoneNumber_Number'
    | 'PhoneNumber_Extension'
    | 'PasswordHash'
    | 'CreatedAt'
    | 'UpdatedAt'
    | 'DeletedAt'
    | never

export const UserFieldValuesInfo: EnumValueInfo<UserField>[] = [
    new EnumValueInfo({ id: 1, value: 'ID' }),
    new EnumValueInfo({ id: 2, value: 'Name' }),
    new EnumValueInfo({ id: 3, value: 'Name_First' }),
    new EnumValueInfo({ id: 4, value: 'Name_MiddleInitial' }),
    new EnumValueInfo({ id: 5, value: 'Name_Last' }),
    new EnumValueInfo({ id: 6, value: 'Email' }),
    new EnumValueInfo({ id: 7, value: 'PhoneNumber' }),
    new EnumValueInfo({ id: 8, value: 'PhoneNumber_CountryCode' }),
    new EnumValueInfo({ id: 9, value: 'PhoneNumber_Number' }),
    new EnumValueInfo({ id: 10, value: 'PhoneNumber_Extension' }),
    new EnumValueInfo({ id: 11, value: 'PasswordHash' }),
    new EnumValueInfo({ id: 12, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 13, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 14, value: 'DeletedAt' }),
]
export const UserFieldEnumInfo: EnumInfo<UserField> = new EnumInfo({ name: 'user__field', valuesInfo: UserFieldValuesInfo })

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
// User: <description of the type>
export type User = {
    id: string
    name: example_app_types.PersonName
    email: string
    phone_number: example_app_types.PhoneNumber | null
    password_hash: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// UserInfoProps implements the props that are specific to User, for a EntityInfo implementation
const UserInfoProps: EntityInfoInputProps = {
    name: 'user',
    serviceName: 'users',
    fieldInfos: [
        {
            name: 'id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
        },
        {
            name: 'name',
            kind: FieldKind.NestedKind,
            referenceNamespace: { service: '', entity: '', type: 'person_name' },
        },
        {
            name: 'email',
            kind: FieldKind.StringKind,
        },
        {
            name: 'phone_number',
            kind: FieldKind.NestedKind,
            referenceNamespace: { service: '', entity: '', type: 'phone_number' },
        },
        {
            name: 'password_hash',
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
    enumInfos: [UserFieldEnumInfo],
    typeInfos: typeInfos,
}

/**
 * All Inclusive Union Types
 */

// TypesUnionType is a union of types of all the Type within and under this level. In case of an entity, this is only the local Types type.
export type TypesUnionType = LocalTypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = User

// Entity Info
export const userInfo = new EntityInfo<User>(UserInfoProps)
