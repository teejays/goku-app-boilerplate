export interface NewEnumInfoProps<EnumType = any> {
    name: string
    valuesInfo: EnumValueInfo<EnumType>[]
}
export class EnumInfo<EnumType = any> {
    readonly name: string
    readonly valuesInfo: EnumValueInfo<EnumType>[]

    // inferred props
    readonly valuesMap: { [key: number]: EnumType }

    constructor(props: NewEnumInfoProps) {
        this.name = props.name
        this.valuesInfo = props.valuesInfo

        this.valuesMap = {}
        this.valuesInfo.map((valueInfo) => {
            this.valuesMap[valueInfo.id] = valueInfo.value
        })
    }

    getValue(id: number) {
        return this.valuesMap[id]
    }

    getEnumValueInfo(value: EnumType) {
        return this.valuesInfo.find((enumValueInfo) => enumValueInfo.value === value)
    }
}

export class EnumValueInfo<EnumType = any> {
    readonly id: number
    readonly value: EnumType
    readonly displayValue?: string

    constructor(props: { id: number; value: EnumType; displayValue?: string }) {
        this.id = props.id
        this.value = props.value
        this.displayValue = props.displayValue
    }
    getDisplayValue() {
        return this.displayValue ?? this.value
    }
}
