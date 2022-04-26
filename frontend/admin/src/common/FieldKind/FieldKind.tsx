import {
    BooleanDisplay,
    DateDisplay,
    DefaultDisplay,
    DisplayProps,
    PersonNameDisplay,
    PhoneNumberDisplay,
    StringDisplay,
    TimestampDisplay,
    TypeDisplay,
} from 'components/DisplayAttributes/DisplayAttributes'
import {
    BooleanInput,
    DateInput,
    DefaultInput,
    ForeignEntitySelectInput,
    FormInputProps,
    NumberInput,
    SelectInput,
    StringInput,
    TimestampInput,
    TypeFormItems,
    getInputComponentWithRepetition,
} from 'common/Form'
import { Card, Form, Input, Select, Spin } from 'antd'
import { PersonName, PhoneNumber } from 'goku.generated/types/types.generated'
import React, { useContext } from 'react'

import { AppInfoContext } from 'common/AppInfoContext'
import { EntityLinkFromID } from 'common/EntityLink'
import { FieldInfo } from 'common'
import { TypeMinimal } from 'common/TypeInfo'
import { capitalCase } from 'change-case'
import cloneDeep from 'lodash.clonedeep'

// getFieldValue takes an Entity and FieldInfo, and returns the value for the Field
export const getValueForField = <T extends TypeMinimal, FT>(props: { obj: T; fieldInfo: FieldInfo }): FT => {
    const { obj, fieldInfo } = props
    // Loop though the entity values and get the right value
    let val: any
    Object.entries(obj).forEach(([k, v]) => {
        if (k === fieldInfo.name) {
            val = v as FT
        }
    })
    return val as FT
}

export interface FieldFormProps extends FormInputProps {
    fieldInfo: FieldInfo
}

// FieldKind describes what category a field falls under e.g. Number, Date, Money, Foreign Object etc.
export interface FieldKind {
    readonly name: string

    getLabel: (props: FieldInfo) => JSX.Element
    getLabelString: (props: FieldInfo) => string
    getDisplayComponent: (fieldInfo: FieldInfo) => React.ComponentType<DisplayProps>
    getDisplayRepeatedComponent: (fieldInfo: FieldInfo) => React.ComponentType<DisplayProps>
    getInputComponent: () => React.ComponentType<FieldFormProps>
    getInputRepeatedComponent: () => React.ComponentType<FieldFormProps>
}

const DefaultFieldKind = {
    name: 'default',
    getLabel: (fieldInfo: FieldInfo): JSX.Element => {
        // How to display list?
        return <>{capitalCase(fieldInfo.name)}</>
    },
    getLabelString: (fieldInfo: FieldInfo): string => {
        // How to display list?
        return capitalCase(fieldInfo.name)
    },
    getDisplayComponent(fieldInfo: FieldInfo) {
        return (props: DisplayProps<any>) => {
            return <DefaultDisplay value={props.value} />
        }
    },
    getDisplayRepeatedComponent(fieldInfo: FieldInfo) {
        const DisplayComponent = this.getDisplayComponent(fieldInfo)
        return (props: DisplayProps) => {
            return (
                <>
                    {props.value?.map((v: any, index: number) => (
                        <Card key={index} title={'# ' + index} bordered={false}>
                            <DisplayComponent value={v} />
                        </Card>
                    ))}
                </>
            )
        }
    },
    getInputComponent() {
        console.log('default.getInputComponent(): getting single InputComponent for ', this.name)
        return (props: FieldFormProps) => {
            const { fieldInfo: fieldInfo, ...forwardProps } = props
            return <Input {...forwardProps} />
        }
    },
    getInputRepeatedComponent() {
        const InputComponent = this.getInputComponent()
        return getInputComponentWithRepetition(InputComponent)
    },
}

export const UUIDKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'uuid',
    getLabel: (fieldInfo: FieldInfo): JSX.Element => {
        // How to display list?
        return <>{capitalCase(fieldInfo.name.replace('_id', ''))}</>
    },
    getLabelString: (fieldInfo: FieldInfo): string => {
        // How to display list?
        return capitalCase(fieldInfo.name.replace('_id', ''))
    },
    getDisplayComponent(fieldInfo: FieldInfo) {
        return (props: DisplayProps<any>) => {
            // Get ServiceInfo from context
            const appInfo = useContext(AppInfoContext)
            if (!appInfo) {
                return <Spin />
            }
            if (!fieldInfo.foreignEntityInfo) {
                throw new Error('UUID field does not have a reference namespace')
            }

            const fieldEntityInfo = appInfo?.getEntityInfoByNamespace({ service: fieldInfo.foreignEntityInfo.serviceName!, entity: fieldInfo.foreignEntityInfo.entityName! })
            if (!fieldEntityInfo) {
                throw new Error('External EntityInfo not found for field')
            }

            return <EntityLinkFromID id={props.value} entityInfo={fieldEntityInfo} />
        }
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo, ...forwardProps } = props
            if (!fieldInfo.foreignEntityInfo) {
                return <DefaultInput {...forwardProps} />
            }
            return <ForeignEntitySelectInput {...props} />
        }
    },
}

export const StringKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'string',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return StringDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <StringInput {...forwardProps} />
        }
    },
}

export const NumberKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'number',
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <NumberInput {...forwardProps} />
        }
    },
}

export const BooleanKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'boolean',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return BooleanDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <BooleanInput {...forwardProps} />
        }
    },
}

export const DateKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'date',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return DateDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <DateInput {...forwardProps} />
        }
    },
}

export const TimestampKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'datetime',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return TimestampDisplay
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo: _, ...forwardProps } = props
            return <TimestampInput {...forwardProps} />
        }
    },
}

// // const AddressKindLocal = {
// //     name: 'address',
// // }
// // export const AddressKind: FieldKind = {
// //     ...DefaultFieldKind,
// //     ...AddressKindLocal,
// // }

// // const PhoneNumberKindLocal = {
// //     name: 'phone_number',
// // }
// // export const PhoneNumberKind: FieldKind = {
// //     ...DefaultFieldKind,
// //     ...PhoneNumberKindLocal,
// // }

// const EmailKindLocal = {
//     name: 'email',
// }
// export const EmailKind: FieldKind = {
//     ...DefaultFieldKind,
//     ...EmailKindLocal,
// }

// const MoneyKindLocal = {
//     name: 'money',
// }
// export const MoneyKind: FieldKind = {
//     ...DefaultFieldKind,
//     ...MoneyKindLocal,
// }

export const EnumKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'enum',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return (props: DisplayProps<any>) => {
            const appInfo = useContext(AppInfoContext)
            const enumInfo = appInfo?.getEnumInfoByNamespace(fieldInfo?.referenceNamespace!)

            return <DefaultDisplay value={enumInfo?.getEnumValueInfo(props.value)?.getDisplayValue()} />
        }
    },
    getInputComponent() {
        return (props: FieldFormProps) => {
            const { fieldInfo, ...formItemProps } = props

            const appInfo = useContext(AppInfoContext)
            const enumInfo = appInfo?.getEnumInfoByNamespace(fieldInfo?.referenceNamespace!)

            const options = enumInfo?.valuesInfo.map((valueInfo) => {
                return (
                    <Select.Option key={valueInfo.id} value={valueInfo.value}>
                        {valueInfo.getDisplayValue()}
                    </Select.Option>
                )
            })
            return <SelectInput {...formItemProps}>{options}</SelectInput>
        }
    },
}

// NestedKind refers to fields that represent sub-types or sub-objects. Basically types that are made of other fields.
export const NestedKind: FieldKind = {
    ...DefaultFieldKind,
    name: 'nested',
    getDisplayComponent(fieldInfo: FieldInfo) {
        return (props: DisplayProps<TypeMinimal>) => {
            const { value } = props

            const store = useContext(AppInfoContext)
            if (!store) {
                return <Spin />
            }
            if (!value) {
                return <span>No Data</span>
            }
            if (!fieldInfo.referenceNamespace) {
                throw new Error('Nested Type Display called with a non-nested FieldKind')
            }

            const nestedTypeInfo = store.getTypeInfoByNamespace(fieldInfo.referenceNamespace)

            if (nestedTypeInfo.name === 'person_name') {
                return <PersonNameDisplay value={(value as unknown) as PersonName} />
            }
            if (nestedTypeInfo.name === 'phone_number') {
                return <PhoneNumberDisplay value={(value as unknown) as PhoneNumber} />
            }

            return <TypeDisplay typeInfo={nestedTypeInfo} objectValue={value} />
        }
    },
    getInputComponent() {
        return NestedInput
    },
}

export const NestedInput = (props: FieldFormProps) => {
    const { fieldInfo, formItemProps } = props
    console.log('nested.getInputComponent(): getting single InputComponent for fieldInfo', fieldInfo.name)

    // Get ServiceInfo from context
    const appInfo = useContext(AppInfoContext)

    if (!appInfo) {
        return <Spin />
    }

    if (!fieldInfo.referenceNamespace) {
        throw new Error('Nested field does not have a reference')
    }

    console.log('nested.getInputComponent(): finding TypeInfo for referenceNamespace', fieldInfo.referenceNamespace)

    const fieldTypeInfo = appInfo?.getTypeInfoByNamespace(fieldInfo.referenceNamespace)
    if (!fieldTypeInfo) {
        throw new Error('Type Info not found for field')
    }

    const copyFormItemProps = cloneDeep(formItemProps)
    const name = formItemProps?.name == undefined ? fieldInfo.name : formItemProps?.name

    // Delete name from formItem props since this Form.Item is just a wrapper around other Form.Items, and AntD doesn't like this

    delete copyFormItemProps?.name

    console.log('nested.getInputComponent(): calling TypeFormItems for typeInfo', fieldTypeInfo)

    return (
        <Form.Item {...copyFormItemProps}>
            <Card bordered={false}>
                <TypeFormItems typeInfo={fieldTypeInfo} parentItemName={name} formItemProps={{ ...copyFormItemProps, ...{ wrapperCol: { span: 24 } } }} noLabels={true} usePlaceholders={true} />
            </Card>
        </Form.Item>
    )
}

// const ForeignObjectKindLocal = {
//     name: 'foreign_object',

//     getLabel: (fieldInfo: FieldInfo) => {
//         if (fieldInfo.isRepeated) {
//             return <>{capitalCase(fieldInfo.name.replace('_ids', ''))}</>
//         }
//         return <>{capitalCase(fieldInfo.name.replace('_id', ''))}</>
//     },

//     InputItem: <T extends TypeMinimal>(props: FieldFormProps<T>) => {
//         return <ForeignEntitySelector {...props} />
//     },

//     InputItemRepeated: <T extends TypeMinimal>(props: FieldFormProps<T>) => {
//         return <ForeignEntitySelector {...props} mode={'multiple'} />
//     },
// }

// export const ForeignObjectKind: FieldKind = {
//     ...DefaultFieldKind,
//     ...ForeignObjectKindLocal,
// }
