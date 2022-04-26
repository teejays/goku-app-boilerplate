/*eslint-disable */

import { AppInfo, ServiceInfo, EntityInfo, EnumInfo, EnumValueInfo, EntityInfoInputProps, TypeInfo, TypeInfoInputProps } from 'common'
import * as FieldKind from 'common/FieldKind'

import * as pharmacy_types from 'goku.generated/types/pharmacy/types.generated'
import * as users_types from 'goku.generated/types/users/types.generated'

/*eslint-disable */

/**
 * Local Types, Type Info Props, Type Infos
 */
// Address: <description of the type>
export type Address = {
    line_1: string
    line_2: string | null
    city: string
    province: PakistaniProvince
    postal_code: string | null
    country: Country
}
// AddressTypeInfoProps implements the props that are specific to Address, for a EntityInfo implementation
const AddressTypeInfoProps: TypeInfoInputProps = {
    name: 'address',
    serviceName: '',
    fieldInfos: [
        {
            name: 'line_1',
            kind: FieldKind.StringKind,
        },
        {
            name: 'line_2',
            kind: FieldKind.StringKind,
        },
        {
            name: 'city',
            kind: FieldKind.StringKind,
        },
        {
            name: 'province',
            kind: FieldKind.EnumKind,
            referenceNamespace: { service: '', entity: '', enum: 'pakistani_province' },
        },
        {
            name: 'postal_code',
            kind: FieldKind.StringKind,
        },
        {
            name: 'country',
            kind: FieldKind.EnumKind,
            referenceNamespace: { service: '', entity: '', enum: 'country' },
        },
    ],
}
export const AddressTypeInfo = new TypeInfo<Address>(AddressTypeInfoProps)

// AddressWithMeta: <description of the type>
export type AddressWithMeta = {
    parent_id: string
    id: string
    line_1: string
    line_2: string | null
    city: string
    province: PakistaniProvince
    postal_code: string | null
    country: Country
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// AddressWithMetaTypeInfoProps implements the props that are specific to AddressWithMeta, for a EntityInfo implementation
const AddressWithMetaTypeInfoProps: TypeInfoInputProps = {
    name: 'address_with_meta',
    serviceName: '',
    fieldInfos: [
        {
            name: 'parent_id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
            foreignEntityInfo: {},
        },
        {
            name: 'id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
        },
        {
            name: 'line_1',
            kind: FieldKind.StringKind,
        },
        {
            name: 'line_2',
            kind: FieldKind.StringKind,
        },
        {
            name: 'city',
            kind: FieldKind.StringKind,
        },
        {
            name: 'province',
            kind: FieldKind.EnumKind,
            referenceNamespace: { service: '', entity: '', enum: 'pakistani_province' },
        },
        {
            name: 'postal_code',
            kind: FieldKind.StringKind,
        },
        {
            name: 'country',
            kind: FieldKind.EnumKind,
            referenceNamespace: { service: '', entity: '', enum: 'country' },
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
}
export const AddressWithMetaTypeInfo = new TypeInfo<AddressWithMeta>(AddressWithMetaTypeInfoProps)
// Contact: <description of the type>
export type Contact = {
    name: PersonName
    email: string
    address: Address
}
// ContactTypeInfoProps implements the props that are specific to Contact, for a EntityInfo implementation
const ContactTypeInfoProps: TypeInfoInputProps = {
    name: 'contact',
    serviceName: '',
    fieldInfos: [
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
            name: 'address',
            kind: FieldKind.NestedKind,
            referenceNamespace: { service: '', entity: '', type: 'address' },
        },
    ],
}
export const ContactTypeInfo = new TypeInfo<Contact>(ContactTypeInfoProps)

// ContactWithMeta: <description of the type>
export type ContactWithMeta = {
    parent_id: string
    id: string
    name: PersonName
    email: string
    address: Address
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// ContactWithMetaTypeInfoProps implements the props that are specific to ContactWithMeta, for a EntityInfo implementation
const ContactWithMetaTypeInfoProps: TypeInfoInputProps = {
    name: 'contact_with_meta',
    serviceName: '',
    fieldInfos: [
        {
            name: 'parent_id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
            foreignEntityInfo: {},
        },
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
            name: 'address',
            kind: FieldKind.NestedKind,
            referenceNamespace: { service: '', entity: '', type: 'address' },
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
}
export const ContactWithMetaTypeInfo = new TypeInfo<ContactWithMeta>(ContactWithMetaTypeInfoProps)
// PersonName: <description of the type>
export type PersonName = {
    first: string
    middle_initial: string | null
    last: string
}
// PersonNameTypeInfoProps implements the props that are specific to PersonName, for a EntityInfo implementation
const PersonNameTypeInfoProps: TypeInfoInputProps = {
    name: 'person_name',
    serviceName: '',
    fieldInfos: [
        {
            name: 'first',
            kind: FieldKind.StringKind,
        },
        {
            name: 'middle_initial',
            kind: FieldKind.StringKind,
        },
        {
            name: 'last',
            kind: FieldKind.StringKind,
        },
    ],
}
export const PersonNameTypeInfo = new TypeInfo<PersonName>(PersonNameTypeInfoProps)

// PersonNameWithMeta: <description of the type>
export type PersonNameWithMeta = {
    parent_id: string
    id: string
    first: string
    middle_initial: string | null
    last: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// PersonNameWithMetaTypeInfoProps implements the props that are specific to PersonNameWithMeta, for a EntityInfo implementation
const PersonNameWithMetaTypeInfoProps: TypeInfoInputProps = {
    name: 'person_name_with_meta',
    serviceName: '',
    fieldInfos: [
        {
            name: 'parent_id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
            foreignEntityInfo: {},
        },
        {
            name: 'id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
        },
        {
            name: 'first',
            kind: FieldKind.StringKind,
        },
        {
            name: 'middle_initial',
            kind: FieldKind.StringKind,
        },
        {
            name: 'last',
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
}
export const PersonNameWithMetaTypeInfo = new TypeInfo<PersonNameWithMeta>(PersonNameWithMetaTypeInfoProps)
// PhoneNumber: <description of the type>
export type PhoneNumber = {
    country_code: number
    number: string
    extension: string | null
}
// PhoneNumberTypeInfoProps implements the props that are specific to PhoneNumber, for a EntityInfo implementation
const PhoneNumberTypeInfoProps: TypeInfoInputProps = {
    name: 'phone_number',
    serviceName: '',
    fieldInfos: [
        {
            name: 'country_code',
            kind: FieldKind.NumberKind,
        },
        {
            name: 'number',
            kind: FieldKind.StringKind,
        },
        {
            name: 'extension',
            kind: FieldKind.StringKind,
        },
    ],
}
export const PhoneNumberTypeInfo = new TypeInfo<PhoneNumber>(PhoneNumberTypeInfoProps)

// PhoneNumberWithMeta: <description of the type>
export type PhoneNumberWithMeta = {
    parent_id: string
    id: string
    country_code: number
    number: string
    extension: string | null
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// PhoneNumberWithMetaTypeInfoProps implements the props that are specific to PhoneNumberWithMeta, for a EntityInfo implementation
const PhoneNumberWithMetaTypeInfoProps: TypeInfoInputProps = {
    name: 'phone_number_with_meta',
    serviceName: '',
    fieldInfos: [
        {
            name: 'parent_id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
            foreignEntityInfo: {},
        },
        {
            name: 'id',
            kind: FieldKind.UUIDKind,
            isMetaField: true,
        },
        {
            name: 'country_code',
            kind: FieldKind.NumberKind,
        },
        {
            name: 'number',
            kind: FieldKind.StringKind,
        },
        {
            name: 'extension',
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
}
export const PhoneNumberWithMetaTypeInfo = new TypeInfo<PhoneNumberWithMeta>(PhoneNumberWithMetaTypeInfoProps)
// Country: <description of the enum>
export type Country = 'Pakistan' | 'USA' | never

export const CountryValuesInfo: EnumValueInfo<Country>[] = [new EnumValueInfo({ id: 1, value: 'Pakistan' }), new EnumValueInfo({ id: 2, value: 'USA' })]
export const CountryEnumInfo: EnumInfo<Country> = new EnumInfo({ name: 'country', valuesInfo: CountryValuesInfo })

// PakistaniProvince: <description of the enum>
export type PakistaniProvince = 'Punjab' | 'Sindh' | 'KhyberPakhtoonkhwa' | 'Balochistan' | 'GilgitBaltistan' | 'AzadKashmir' | never

export const PakistaniProvinceValuesInfo: EnumValueInfo<PakistaniProvince>[] = [
    new EnumValueInfo({ id: 1, value: 'Punjab' }),
    new EnumValueInfo({ id: 2, value: 'Sindh' }),
    new EnumValueInfo({ id: 3, value: 'KhyberPakhtoonkhwa' }),
    new EnumValueInfo({ id: 4, value: 'Balochistan' }),
    new EnumValueInfo({ id: 5, value: 'GilgitBaltistan' }),
    new EnumValueInfo({ id: 6, value: 'AzadKashmir' }),
]
export const PakistaniProvinceEnumInfo: EnumInfo<PakistaniProvince> = new EnumInfo({ name: 'pakistani_province', valuesInfo: PakistaniProvinceValuesInfo })

// AddressField: <description of the enum>
export type AddressField = 'ParentID' | 'ID' | 'Line1' | 'Line2' | 'City' | 'Province' | 'PostalCode' | 'Country' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | never

export const AddressFieldValuesInfo: EnumValueInfo<AddressField>[] = [
    new EnumValueInfo({ id: 1, value: 'ParentID' }),
    new EnumValueInfo({ id: 2, value: 'ID' }),
    new EnumValueInfo({ id: 3, value: 'Line1' }),
    new EnumValueInfo({ id: 4, value: 'Line2' }),
    new EnumValueInfo({ id: 5, value: 'City' }),
    new EnumValueInfo({ id: 6, value: 'Province' }),
    new EnumValueInfo({ id: 7, value: 'PostalCode' }),
    new EnumValueInfo({ id: 8, value: 'Country' }),
    new EnumValueInfo({ id: 9, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 10, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 11, value: 'DeletedAt' }),
]
export const AddressFieldEnumInfo: EnumInfo<AddressField> = new EnumInfo({ name: 'address__field', valuesInfo: AddressFieldValuesInfo })

// ContactField: <description of the enum>
export type ContactField =
    | 'ParentID'
    | 'ID'
    | 'Name'
    | 'Name_First'
    | 'Name_MiddleInitial'
    | 'Name_Last'
    | 'Email'
    | 'Address'
    | 'Address_Line1'
    | 'Address_Line2'
    | 'Address_City'
    | 'Address_Province'
    | 'Address_PostalCode'
    | 'Address_Country'
    | 'CreatedAt'
    | 'UpdatedAt'
    | 'DeletedAt'
    | never

export const ContactFieldValuesInfo: EnumValueInfo<ContactField>[] = [
    new EnumValueInfo({ id: 1, value: 'ParentID' }),
    new EnumValueInfo({ id: 2, value: 'ID' }),
    new EnumValueInfo({ id: 3, value: 'Name' }),
    new EnumValueInfo({ id: 4, value: 'Name_First' }),
    new EnumValueInfo({ id: 5, value: 'Name_MiddleInitial' }),
    new EnumValueInfo({ id: 6, value: 'Name_Last' }),
    new EnumValueInfo({ id: 7, value: 'Email' }),
    new EnumValueInfo({ id: 8, value: 'Address' }),
    new EnumValueInfo({ id: 9, value: 'Address_Line1' }),
    new EnumValueInfo({ id: 10, value: 'Address_Line2' }),
    new EnumValueInfo({ id: 11, value: 'Address_City' }),
    new EnumValueInfo({ id: 12, value: 'Address_Province' }),
    new EnumValueInfo({ id: 13, value: 'Address_PostalCode' }),
    new EnumValueInfo({ id: 14, value: 'Address_Country' }),
    new EnumValueInfo({ id: 15, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 16, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 17, value: 'DeletedAt' }),
]
export const ContactFieldEnumInfo: EnumInfo<ContactField> = new EnumInfo({ name: 'contact__field', valuesInfo: ContactFieldValuesInfo })

// PersonNameField: <description of the enum>
export type PersonNameField = 'ParentID' | 'ID' | 'First' | 'MiddleInitial' | 'Last' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | never

export const PersonNameFieldValuesInfo: EnumValueInfo<PersonNameField>[] = [
    new EnumValueInfo({ id: 1, value: 'ParentID' }),
    new EnumValueInfo({ id: 2, value: 'ID' }),
    new EnumValueInfo({ id: 3, value: 'First' }),
    new EnumValueInfo({ id: 4, value: 'MiddleInitial' }),
    new EnumValueInfo({ id: 5, value: 'Last' }),
    new EnumValueInfo({ id: 6, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 7, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 8, value: 'DeletedAt' }),
]
export const PersonNameFieldEnumInfo: EnumInfo<PersonNameField> = new EnumInfo({ name: 'person_name__field', valuesInfo: PersonNameFieldValuesInfo })

// PhoneNumberField: <description of the enum>
export type PhoneNumberField = 'ParentID' | 'ID' | 'CountryCode' | 'Number' | 'Extension' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | never

export const PhoneNumberFieldValuesInfo: EnumValueInfo<PhoneNumberField>[] = [
    new EnumValueInfo({ id: 1, value: 'ParentID' }),
    new EnumValueInfo({ id: 2, value: 'ID' }),
    new EnumValueInfo({ id: 3, value: 'CountryCode' }),
    new EnumValueInfo({ id: 4, value: 'Number' }),
    new EnumValueInfo({ id: 5, value: 'Extension' }),
    new EnumValueInfo({ id: 6, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 7, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 8, value: 'DeletedAt' }),
]
export const PhoneNumberFieldEnumInfo: EnumInfo<PhoneNumberField> = new EnumInfo({ name: 'phone_number__field', valuesInfo: PhoneNumberFieldValuesInfo })

/**
 * Union of local Types
 */

// LocalTypesUnionType represents the union of all the non-entity Types within this level. It includes FooWithMeta types as well.
type LocalTypesUnionType = Address | AddressWithMeta | Contact | ContactWithMeta | PersonName | PersonNameWithMeta | PhoneNumber | PhoneNumberWithMeta

// LocalTypeInfosUnionType represents the union of all the TypeInfos within this level. It includes TypeInfos<FooWithMeta> as well.
type LocalTypeInfosUnionType =
    | TypeInfo<Address>
    | TypeInfo<AddressWithMeta>
    | TypeInfo<Contact>
    | TypeInfo<ContactWithMeta>
    | TypeInfo<PersonName>
    | TypeInfo<PersonNameWithMeta>
    | TypeInfo<PhoneNumber>
    | TypeInfo<PhoneNumberWithMeta>

// A collection of TypeInfos of all the Types exclusively declared in this level
export const typeInfos: LocalTypeInfosUnionType[] = [
    AddressTypeInfo,
    AddressWithMetaTypeInfo,
    ContactTypeInfo,
    ContactWithMetaTypeInfo,
    PersonNameTypeInfo,
    PersonNameWithMetaTypeInfo,
    PhoneNumberTypeInfo,
    PhoneNumberWithMetaTypeInfo,
]

/**
 * Entity Type, Entity Info Props
 */
// No Entities

/**
 * All Inclusive Union Types
 */

// TypesUnionType is a union of types of all the Type within and under this level. In case of an App, it is all the types.
export type TypesUnionType = LocalTypesUnionType | pharmacy_types.TypesUnionType | users_types.TypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = pharmacy_types.EntitiesUnionType | users_types.EntitiesUnionType

export type EntityName = pharmacy_types.EntityName | users_types.EntityName | never

// Collect: Service Infos
export const serviceInfos = [pharmacy_types.serviceInfo, users_types.serviceInfo]
export type ServiceName = 'pharmacy' | 'users' | never

// App Info
export const appInfo = new AppInfo({ serviceInfos: serviceInfos, typeInfos: typeInfos })
