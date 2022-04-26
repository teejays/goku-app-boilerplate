/*eslint-disable */

import { AppInfo, ServiceInfo, EntityInfo, EnumInfo, EnumValueInfo, EntityInfoInputProps, TypeInfo, TypeInfoInputProps } from 'common'
import * as FieldKind from 'common/FieldKind'

import * as example_app_types from 'goku.generated/types/types.generated'
import * as pharmacy_types from 'goku.generated/types/pharmacy/types.generated'

/*eslint-disable */

/**
 * Local Types, Type Info Props, Type Infos
 */
// Ingredient: <description of the type>
export type Ingredient = {
    drug_id: string
    is_primary_ingredient: boolean
}
// IngredientTypeInfoProps implements the props that are specific to Ingredient, for a EntityInfo implementation
const IngredientTypeInfoProps: TypeInfoInputProps = {
    name: 'ingredient',
    serviceName: 'pharmacy',
    fieldInfos: [
        {
            name: 'drug_id',
            kind: FieldKind.UUIDKind,
            foreignEntityInfo: {
                serviceName: 'pharmacy',
                entityName: 'drug',
            },
        },
        {
            name: 'is_primary_ingredient',
            kind: FieldKind.BooleanKind,
        },
    ],
}
export const IngredientTypeInfo = new TypeInfo<Ingredient>(IngredientTypeInfoProps)

// IngredientWithMeta: <description of the type>
export type IngredientWithMeta = {
    parent_id: string
    id: string
    drug_id: string
    is_primary_ingredient: boolean
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// IngredientWithMetaTypeInfoProps implements the props that are specific to IngredientWithMeta, for a EntityInfo implementation
const IngredientWithMetaTypeInfoProps: TypeInfoInputProps = {
    name: 'ingredient_with_meta',
    serviceName: 'pharmacy',
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
            name: 'drug_id',
            kind: FieldKind.UUIDKind,
            foreignEntityInfo: {
                serviceName: 'pharmacy',
                entityName: 'drug',
            },
        },
        {
            name: 'is_primary_ingredient',
            kind: FieldKind.BooleanKind,
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
export const IngredientWithMetaTypeInfo = new TypeInfo<IngredientWithMeta>(IngredientWithMetaTypeInfoProps)
// ModeOfDelivery: <description of the enum>
export type ModeOfDelivery = 'Tablet' | 'Syrup' | 'Capsule' | 'Injection' | never

export const ModeOfDeliveryValuesInfo: EnumValueInfo<ModeOfDelivery>[] = [
    new EnumValueInfo({ id: 1, value: 'Tablet' }),
    new EnumValueInfo({ id: 2, value: 'Syrup', displayValue: 'Liquid Syrup' }),
    new EnumValueInfo({ id: 3, value: 'Capsule' }),
    new EnumValueInfo({ id: 4, value: 'Injection' }),
]
export const ModeOfDeliveryEnumInfo: EnumInfo<ModeOfDelivery> = new EnumInfo({ name: 'mode_of_delivery', valuesInfo: ModeOfDeliveryValuesInfo })

// IngredientField: <description of the enum>
export type IngredientField = 'ParentID' | 'ID' | 'DrugID' | 'IsPrimaryIngredient' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | never

export const IngredientFieldValuesInfo: EnumValueInfo<IngredientField>[] = [
    new EnumValueInfo({ id: 1, value: 'ParentID' }),
    new EnumValueInfo({ id: 2, value: 'ID' }),
    new EnumValueInfo({ id: 3, value: 'DrugID' }),
    new EnumValueInfo({ id: 4, value: 'IsPrimaryIngredient' }),
    new EnumValueInfo({ id: 5, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 6, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 7, value: 'DeletedAt' }),
]
export const IngredientFieldEnumInfo: EnumInfo<IngredientField> = new EnumInfo({ name: 'ingredient__field', valuesInfo: IngredientFieldValuesInfo })

// MedicineField: <description of the enum>
export type MedicineField =
    | 'ID'
    | 'Name'
    | 'CompanyID'
    | 'PrimaryIngredient'
    | 'PrimaryIngredient_DrugID'
    | 'PrimaryIngredient_IsPrimaryIngredient'
    | 'Ingredients'
    | 'Ingredients_ParentID'
    | 'Ingredients_ID'
    | 'Ingredients_DrugID'
    | 'Ingredients_IsPrimaryIngredient'
    | 'Ingredients_CreatedAt'
    | 'Ingredients_UpdatedAt'
    | 'Ingredients_DeletedAt'
    | 'ModeOfDelivery'
    | 'CreatedAt'
    | 'UpdatedAt'
    | 'DeletedAt'
    | never

export const MedicineFieldValuesInfo: EnumValueInfo<MedicineField>[] = [
    new EnumValueInfo({ id: 1, value: 'ID' }),
    new EnumValueInfo({ id: 2, value: 'Name' }),
    new EnumValueInfo({ id: 3, value: 'CompanyID' }),
    new EnumValueInfo({ id: 4, value: 'PrimaryIngredient' }),
    new EnumValueInfo({ id: 5, value: 'PrimaryIngredient_DrugID' }),
    new EnumValueInfo({ id: 6, value: 'PrimaryIngredient_IsPrimaryIngredient' }),
    new EnumValueInfo({ id: 7, value: 'Ingredients' }),
    new EnumValueInfo({ id: 8, value: 'Ingredients_ParentID' }),
    new EnumValueInfo({ id: 9, value: 'Ingredients_ID' }),
    new EnumValueInfo({ id: 10, value: 'Ingredients_DrugID' }),
    new EnumValueInfo({ id: 11, value: 'Ingredients_IsPrimaryIngredient' }),
    new EnumValueInfo({ id: 12, value: 'Ingredients_CreatedAt' }),
    new EnumValueInfo({ id: 13, value: 'Ingredients_UpdatedAt' }),
    new EnumValueInfo({ id: 14, value: 'Ingredients_DeletedAt' }),
    new EnumValueInfo({ id: 15, value: 'ModeOfDelivery' }),
    new EnumValueInfo({ id: 16, value: 'CreatedAt' }),
    new EnumValueInfo({ id: 17, value: 'UpdatedAt' }),
    new EnumValueInfo({ id: 18, value: 'DeletedAt' }),
]
export const MedicineFieldEnumInfo: EnumInfo<MedicineField> = new EnumInfo({ name: 'medicine__field', valuesInfo: MedicineFieldValuesInfo })

/**
 * Union of local Types
 */

// LocalTypesUnionType represents the union of all the non-entity Types within this level. It includes FooWithMeta types as well.
type LocalTypesUnionType = Ingredient | IngredientWithMeta

// LocalTypeInfosUnionType represents the union of all the TypeInfos within this level. It includes TypeInfos<FooWithMeta> as well.
type LocalTypeInfosUnionType = TypeInfo<Ingredient> | TypeInfo<IngredientWithMeta>

// A collection of TypeInfos of all the Types exclusively declared in this level
export const typeInfos: LocalTypeInfosUnionType[] = [IngredientTypeInfo, IngredientWithMetaTypeInfo]

/**
 * Entity Type, Entity Info Props
 */
// Medicine: <description of the type>
export type Medicine = {
    id: string
    name: string
    company_id: string
    primary_ingredient: Ingredient
    ingredients: IngredientWithMeta[]
    mode_of_delivery: ModeOfDelivery
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
// MedicineInfoProps implements the props that are specific to Medicine, for a EntityInfo implementation
const MedicineInfoProps: EntityInfoInputProps = {
    name: 'medicine',
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
            name: 'company_id',
            kind: FieldKind.UUIDKind,
            foreignEntityInfo: {
                serviceName: 'pharmacy',
                entityName: 'pharmaceutical_company',
            },
        },
        {
            name: 'primary_ingredient',
            kind: FieldKind.NestedKind,
            referenceNamespace: { service: 'pharmacy', entity: 'medicine', type: 'ingredient' },
        },
        {
            name: 'ingredients',
            kind: FieldKind.NestedKind,
            isRepeated: true,
            referenceNamespace: { service: 'pharmacy', entity: 'medicine', type: 'ingredient' },
        },
        {
            name: 'mode_of_delivery',
            kind: FieldKind.EnumKind,
            referenceNamespace: { service: 'pharmacy', entity: 'medicine', enum: 'mode_of_delivery' },
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
    enumInfos: [ModeOfDeliveryEnumInfo, IngredientFieldEnumInfo, MedicineFieldEnumInfo],
    typeInfos: typeInfos,
}

/**
 * All Inclusive Union Types
 */

// TypesUnionType is a union of types of all the Type within and under this level. In case of an entity, this is only the local Types type.
export type TypesUnionType = LocalTypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = Medicine

// Entity Info
export const medicineInfo = new EntityInfo<Medicine>(MedicineInfoProps)
