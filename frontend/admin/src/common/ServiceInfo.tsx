import { EntityInfo, EntityInfoCommon, EntityMinimal, EnumInfo, TypeInfo, TypeMinimal } from 'common'

export interface ServiceInfoCommon {
    name: string
    defaultIcon?: React.ElementType
    getEntityInfo<E extends EntityMinimal>(name: string): EntityInfo<E>
    entityInfos: EntityInfoCommon[]
    getTypeInfo<T>(name: string): TypeInfo<T>
    getEnumInfo<EnumType = any>(name: string): EnumInfo | undefined
}

export type ServiceInfoT<E extends EntityMinimal, T extends TypeMinimal> = ServiceInfo<E, T>
export type EntityInfoT<E> = E extends EntityMinimal ? EntityInfo<E> : never
export type TypeInfoT<T> = T extends TypeMinimal ? TypeInfo<T> : never

interface ServiceInfoInputProps<E extends EntityMinimal, T extends TypeMinimal> {
    name: string
    entityInfos: EntityInfoT<E>[]
    typeInfos: TypeInfoT<T>[]
    defaultIcon?: React.ElementType
}

// U is a union type of all Entities
export class ServiceInfo<E extends EntityMinimal = any, T extends TypeMinimal = any> implements ServiceInfoCommon {
    name: string
    entityInfos: EntityInfoT<E>[] // Distributive conditional type, that should become []EntityInfo < entA | entB etc. >
    typeInfosMap: Record<string, TypeInfoT<T>> = {} // local service types

    enumInfos: Record<string, EnumInfo> = {}

    defaultIcon?: React.ElementType

    constructor(props: ServiceInfoInputProps<E, T>) {
        this.name = props.name
        this.entityInfos = props.entityInfos
        // Type Infos
        props.typeInfos.forEach((typInfo: TypeInfoT<T>) => {
            this.typeInfosMap[typInfo.name] = typInfo
        })
        this.defaultIcon = props.defaultIcon
    }

    getEntityInfo<E extends EntityMinimal>(name: string) {
        var entityInfo = this.entityInfos.find((elem) => elem.name === name) as unknown
        return entityInfo as EntityInfoT<E>
    }

    // T should be a type, one that is at the service level
    getTypeInfo<T extends TypeMinimal>(name: string) {
        var typeInfo = this.typeInfosMap[name] as unknown
        return typeInfo as TypeInfoT<T>
    }

    getEnumInfo<EnumType = any>(name: string): EnumInfo | undefined {
        return (this.enumInfos[name] as unknown) as EnumInfo<EnumType>
    }
}
