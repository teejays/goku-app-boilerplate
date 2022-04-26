import { EntityInfoCommon, EnumInfo, PrimaryNamespace, ServiceInfoCommon, TypeInfo } from 'common'
import { EntityName, ServiceName } from 'goku.generated/types/types.generated'
import { TypeInfoCommon, TypeMinimal } from './TypeInfo'

import { EntityMinimal } from './Entity'
import { Namespace } from './Namespace'
import { snakeCase } from 'change-case'

export interface AppInfoInputProps<ServiceInfoTypes extends ServiceInfoCommon> {
    serviceInfos: ServiceInfoTypes[]
    typeInfos: TypeInfoCommon[]
}
/* U is the union type of all entities in the App, T is the union type of all types in the app.
 * UTI is the union of all possible nested types
 */
export class AppInfo<ServiceInfoTypes extends ServiceInfoCommon> {
    serviceInfosMap: Record<string, ServiceInfoTypes> = {}

    // typeInfosMap is a collection of Types stored at the global level
    typeInfosMap: Record<string, TypeInfoCommon> = {}

    enumInfos: Record<string, EnumInfo> = {}

    // Constructor shouldn't need to do anything
    constructor(props: AppInfoInputProps<ServiceInfoTypes>) {
        // Service Infos
        props.serviceInfos.forEach((svcInfo) => {
            this.serviceInfosMap[svcInfo.name] = svcInfo
        })
        // Type Infos
        props.typeInfos.forEach((typInfo) => {
            this.typeInfosMap[typInfo.name] = typInfo
        })
        return
    }

    getEntityInfo<E extends EntityMinimal>(serviceName: ServiceName, entityName: EntityName) {
        const serviceInfo = this.getServiceInfo(serviceName)

        const entityInfo = serviceInfo.getEntityInfo<E>(entityName)

        return entityInfo
    }

    updateEntityInfo(ei: EntityInfoCommon) {
        const serviceInfo = this.getServiceInfo(ei.serviceName)
        serviceInfo.entityInfos.forEach((v, index) => {
            if (ei.name === v.name) {
                serviceInfo.entityInfos[index] = ei
                return
            }
        })
    }

    getServiceInfo(name: string) {
        return this.serviceInfosMap[name]
    }

    getServiceInfos() {
        return Object.values(this.serviceInfosMap)
    }

    getTypeInfo<T extends TypeMinimal>(name: string) {
        return this.typeInfosMap[name] as TypeInfo<T>
    }

    getEntityInfoByNamespace<E extends EntityMinimal = any>(ns: Required<PrimaryNamespace>) {

        const serviceName = snakeCase(ns.service)
        const entityName = snakeCase(ns.entity)

        const svcInfo = this.getServiceInfo(serviceName)
        if (!svcInfo) {
            throw new Error(`ServiceInfo not found for service ${serviceName}`)
        }

        // Service Level
        const entityInfo = svcInfo.getEntityInfo<E>(entityName)
        if (!entityInfo) {
            throw new Error(`EntityInfo not found for entity ${entityName} in service ${serviceName}`)
        }
        return entityInfo
    }

    getTypeInfoByNamespace<T extends TypeMinimal>(ns: Namespace) {
        if (!ns.type) {
            throw new Error('getTypeInfoByNamespace() called with empty type name')
        }

        const typeName = snakeCase(ns.type)

        // App Level
        if (!ns.service && !ns.entity) {
            const typeInfo = this.getTypeInfo<T>(typeName)
            if (!typeInfo) {
                throw new Error(`TypeInfo ${typeName} not found at the app level`)
            }
            return typeInfo
        }

        if (!ns.service) {
            throw new Error('getTypeInfoByNamespace() called with empty service name but non-empty entity name')
        }

        const serviceName = snakeCase(ns.service!)
        const svcInfo = this.getServiceInfo(serviceName)
        if (!svcInfo) {
            throw new Error(`ServiceInfo not found for service ${serviceName}`)
        }
        
        if (!ns.entity) {
            const typeInfo = svcInfo.getTypeInfo<T>(typeName)
            if (!typeInfo) {
                throw new Error(`TypeInfo ${typeName} not found in service ${serviceName}`)
            }
            return typeInfo
        }

        // Entity Level
        const entityName = snakeCase(ns.entity)
        const entityInfo = svcInfo.getEntityInfo(ns.entity)
        if (!entityInfo) {
            throw new Error(`EntityInfo ${entityName} not found for service ${serviceName}`)
        }
        const typeInfo = entityInfo.getTypeInfo<T>(typeName)
        if (!typeInfo) {
            throw new Error(`TypeInfo ${typeName} not found in service ${serviceName} and entity ${entityName}`)
        }
        return typeInfo        
    }

    getEnumInfo<EnumType = any>(name: string): EnumInfo | undefined {
        return (this.enumInfos[name] as unknown) as EnumInfo<EnumType>
    }

    getEnumInfoByNamespace<EnumType = any>(ns: Namespace): EnumInfo<EnumType>|undefined {
        
        if (!ns.enum) {
            throw new Error('getTypeInfoByNamespace() called with empty enum name')
        }

        const enumName = snakeCase(ns.enum)

        // App Level
        if (!ns.service && !ns.entity) {
            return this.getEnumInfo<EnumType>(enumName)
        }

        const svcInfo = this.getServiceInfo(ns.service!)
        if (!svcInfo) {
            throw new Error(`ServiceInfo not found for service "${ns.service}"`)
        }

        // Service Level
        if (!ns.entity) {
            return svcInfo.getEnumInfo<EnumType>(enumName)
        }

        // Entity Level
        const entInfo = svcInfo.getEntityInfo(ns.entity)

        return entInfo.getEnumInfo<EnumType>(enumName)
    }
}
