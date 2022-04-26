import { FieldInfo } from 'common/FieldInfo'

export interface TypeInfoProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
}

export interface TypeProps<T extends TypeMinimal> {
    obj: T
    typeInfo: TypeInfo<T>
}

export interface TypeInfoCommon {
    name: string
    fieldInfos: FieldInfo[]
    getTypeName: () => string
}

export interface TypeInfoInputProps {
    name: string
    serviceName: string
    fieldInfos: FieldInfo[]
}

// EntityMinimal represents fields that all Entities should have.
export interface TypeMinimal extends Object {}

// EntityInfo holds all the information about how to render/manipulate a particular Entity type.
export class TypeInfo<T extends TypeMinimal = any> implements TypeInfoCommon {
    readonly name: string
    readonly fieldInfos: FieldInfo[]
    readonly serviceName: string

    constructor(props: TypeInfoInputProps) {
        this.name = props.name
        this.serviceName = props.serviceName
        this.fieldInfos = props.fieldInfos
    }

    // Name of the Type
    getTypeName(): string {
        return this.getTypeNameFunc(this)
    }
    // overridable
    getTypeNameFunc = function (info: TypeInfo<T>): string {
        return info.name
    }

    // getFieldInfo provides the FieldInfo corresponding to the field name provided
    getFieldInfo(fieldName: keyof T): FieldInfo | undefined {
        return this.fieldInfos.find((elem) => elem.name === fieldName)
    }
}
