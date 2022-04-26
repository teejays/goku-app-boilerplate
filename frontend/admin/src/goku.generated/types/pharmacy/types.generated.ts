/*eslint-disable */

import { AppInfo, ServiceInfo, EntityInfo, EnumInfo, EnumValueInfo, EntityInfoInputProps, TypeInfo, TypeInfoInputProps } from 'common'
import * as FieldKind from 'common/FieldKind'

import * as example_app_types from 'goku.generated/types/types.generated'
import * as drug_types from 'goku.generated/types/pharmacy/drug/types.generated'
import * as medicine_types from 'goku.generated/types/pharmacy/medicine/types.generated'
import * as pharmaceutical_company_types from 'goku.generated/types/pharmacy/pharmaceutical_company/types.generated'
import * as product_types from 'goku.generated/types/pharmacy/product/types.generated'
import { MedicineBoxOutlined } from '@ant-design/icons'

/*eslint-disable */

/**
 * Local Types, Type Info Props, Type Infos
 */
// No Local Types

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
// No Entities

/**
 * All Inclusive Union Types
 */

// TypesUnionType is a union of types of all the Type within and under this level. In case of a service, it includes the Types in the service + all Types in the entities under it.
export type TypesUnionType = LocalTypesUnionType | drug_types.TypesUnionType | medicine_types.TypesUnionType | pharmaceutical_company_types.TypesUnionType | product_types.TypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = drug_types.EntitiesUnionType | medicine_types.EntitiesUnionType | pharmaceutical_company_types.EntitiesUnionType | product_types.EntitiesUnionType

// Collect: Entity stuff
const entityInfos = [drug_types.drugInfo, medicine_types.medicineInfo, pharmaceutical_company_types.pharmaceuticalCompanyInfo, product_types.productInfo]
export type EntityName = 'drug' | 'medicine' | 'pharmaceutical_company' | 'product' | never

// Service Info
export const serviceInfo = new ServiceInfo<EntitiesUnionType, TypesUnionType>({ name: 'pharmacy', entityInfos: entityInfos, typeInfos: typeInfos, defaultIcon: MedicineBoxOutlined })
