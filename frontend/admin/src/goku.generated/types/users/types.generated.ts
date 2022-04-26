/*eslint-disable */

import { AppInfo, ServiceInfo, EntityInfo, EnumInfo, EnumValueInfo, EntityInfoInputProps, TypeInfo, TypeInfoInputProps } from 'common'
import * as FieldKind from 'common/FieldKind'

import * as example_app_types from 'goku.generated/types/types.generated'
import * as user_types from 'goku.generated/types/users/user/types.generated'
import { TeamOutlined } from '@ant-design/icons'

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
export type TypesUnionType = LocalTypesUnionType | user_types.TypesUnionType

// EntitiesUnionType is the union of all Entity types within this level.
export type EntitiesUnionType = user_types.EntitiesUnionType

// Collect: Entity stuff
const entityInfos = [user_types.userInfo]
export type EntityName = 'user' | never

// Service Info
export const serviceInfo = new ServiceInfo<EntitiesUnionType, TypesUnionType>({ name: 'users', entityInfos: entityInfos, typeInfos: typeInfos, defaultIcon: TeamOutlined })
