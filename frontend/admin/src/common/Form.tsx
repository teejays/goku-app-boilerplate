import { AppInfoContext, EntityMinimal, TypeInfo, TypeMinimal } from 'common'
import { Button, Card, DatePicker, DatePickerProps, Form, FormItemProps, Input, InputNumber, InputNumberProps, InputProps, Select, Spin, Switch, SwitchProps, TimePickerProps } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import React, { useContext, useState } from 'react'

import { FieldFormProps } from './FieldKind'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { capitalCase } from 'change-case'
import { queryByTextEntity } from 'providers/provider'

export const combineFormItemName = (parentName: NamePath | undefined, currentName: string | number): NamePath => {
    if (parentName !== undefined) {
        if (Array.isArray(parentName)) {
            return [...parentName, currentName]
        }
        return [parentName, currentName]
    }
    return currentName
}

type NamePath = string | number | (string | number)[]

interface TypeFormItemsProps<T extends TypeMinimal> {
    typeInfo: TypeInfo<T>
    parentItemName?: NamePath
    formItemProps?: Partial<FormItemProps> // antd's props
    noLabels?: boolean
    usePlaceholders?: boolean
}

export const TypeFormItems = <T extends TypeMinimal>(props: TypeFormItemsProps<T>) => {
    const { typeInfo, parentItemName, formItemProps } = props

    // Filter to remove the fields that we don't want to show in an Add form
    // Do not create form input for meta fields like ID, created_at etc.
    const filteredFieldInfos = typeInfo.fieldInfos.filter((fieldInfo) => {
        if (fieldInfo.isMetaField) {
            return false
        }
        return true
    })

    // Create a list of all the form items by looping over all applicable fieldInfo
    const formItems: JSX.Element[] = filteredFieldInfos.map((fieldInfo) => {
        const name = combineFormItemName(parentItemName, fieldInfo.name)

        const fieldKind = fieldInfo.kind
        const label = fieldKind.getLabel(fieldInfo)
        const labelString = fieldKind.getLabelString(fieldInfo)

        const finalFormItemProps = { ...formItemProps, ...{ label: props.noLabels ? undefined : label, name: name } }
        const sharedInputProps: LocalSharedInputProps = {
            placeholder: props.usePlaceholders ? labelString : undefined,
            size: 'small',
        }

        console.log('TypeFormItems: getting InputComponent for', fieldInfo.name, 'kind', fieldKind.name)
        let InputComponent: React.ComponentType<FieldFormProps> = fieldKind.getInputComponent()

        // If a field is an array, use the isRepeated InputItem for that Field's Kind
        if (fieldInfo.isRepeated) {
            console.log('TypeFormItems: getting Repeated InputComponent for', fieldInfo.name, 'kind', fieldKind.name)
            InputComponent = fieldKind.getInputRepeatedComponent()
        }

        return <InputComponent key={fieldInfo.name} fieldInfo={fieldInfo} formItemProps={finalFormItemProps} sharedInputProps={sharedInputProps} />
    })

    return <>{formItems}</>
}

export interface FormInputProps {
    formItemProps?: Partial<FormItemProps>
    sharedInputProps?: LocalSharedInputProps
    stringInputProps?: Partial<InputProps>
    numberInputProps?: Partial<InputNumberProps>
    switchProps?: Partial<SwitchProps>
    datePickerProps?: DatePickerProps
    timePickerProps?: TimePickerProps
}

export interface LocalSharedInputProps {
    placeholder?: string
    size?: SizeType // antd's SizeType
}

export const DefaultInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <Input {...props.sharedInputProps} {...props.stringInputProps} />
        </Form.Item>
    )
}

export const StringInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <Input {...props.sharedInputProps} {...props.stringInputProps} />
        </Form.Item>
    )
}

export const NumberInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <InputNumber {...props.sharedInputProps} {...props.numberInputProps} />
        </Form.Item>
    )
}

export const BooleanInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps} label={props.sharedInputProps?.placeholder} colon={false}>
            <Switch {...props.switchProps} />
        </Form.Item>
    )
}

export const DateInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <DatePicker {...props.sharedInputProps} {...props.datePickerProps} />
        </Form.Item>
    )
}

export const TimestampInput = (props: FormInputProps) => {
    return (
        <Form.Item {...props.formItemProps}>
            <DatePicker showTime={true} {...props.sharedInputProps} {...props.timePickerProps} />
        </Form.Item>
    )
}

export const SelectInput = (props: React.PropsWithChildren<FormInputProps>) => {
    return (
        <Form.Item {...props.formItemProps}>
            <Select>{props.children}</Select>
        </Form.Item>
    )
}

export const ForeignEntitySelectInput = <FET extends EntityMinimal = any>(props: FieldFormProps & { mode?: 'multiple' | 'tags' }) => {
    const { fieldInfo } = props

    const [options, setOptions] = useState<{}[]>([])
    const [isFetching, setIsFetching] = useState<boolean>(false)

    // Get ServiceInfo from context
    const store = useContext(AppInfoContext)

    if (!store) {
        return <Spin />
    }

    if (!fieldInfo.foreignEntityInfo) {
        throw new Error('ForeignEntitySelectInput for field with no foreignEntityInfo')
    }
    if (!fieldInfo.foreignEntityInfo.serviceName) {
        throw new Error('ForeignObjectField with no foreignEntityInfo.serviceName')
    }

    if (!fieldInfo.foreignEntityInfo.entityName) {
        throw new Error('ForeignObjectField with no foreignEntityName')
    }
    const foreignEntityInfo = store.getEntityInfo<FET>(fieldInfo.foreignEntityInfo.serviceName, fieldInfo.foreignEntityInfo.entityName)
    if (!foreignEntityInfo) {
        throw new Error('ForeignObjectField with no foreignEntityInfo')
    }

    const handleSearch = (value: string) => {
        if (!value) {
            return
        }
        console.log('Searching for Foreign Entity with value:', value)
        setIsFetching(true)
        queryByTextEntity<FET>(foreignEntityInfo, value).then((resp) => {
            console.log('ForeignObject Data:', resp)
            if (resp?.items) {
                console.log('Foreign Entity Search Response', resp.items)
                setOptions(
                    resp.items.map((e: FET) => ({
                        value: e.id,
                        label: foreignEntityInfo.getHumanName(e),
                    }))
                )
                setIsFetching(false)
            }
        })
    }
    const handleChange = (value: string) => {
        console.log('Foreign Entity - Change detected:', value)
    }

    const placeholder = props.sharedInputProps?.placeholder ?? 'Please type to search'

    console.log('Foreign Entity Select, options:', options)

    return (
        <Form.Item {...props.formItemProps}>
            <Select
                {...props.sharedInputProps}
                placeholder={placeholder}
                // mode="multiple"
                // style={style}
                // defaultActiveFirstOption={false}
                // showArrow={false}
                showSearch
                onSearch={handleSearch}
                filterOption={true}
                optionFilterProp="label"
                optionLabelProp="label"
                onChange={handleChange}
                allowClear={true}
                loading={isFetching}
                options={options}
            />
        </Form.Item>
    )
}

export const getInputComponentWithRepetition = (InputComponent: React.ComponentType<FieldFormProps>): React.ComponentType<FieldFormProps> => {
    return (props: FieldFormProps) => {
        const { fieldInfo, formItemProps } = props

        console.log('Repeated component for fieldInfo', fieldInfo, 'with InputComponent', InputComponent)

        // Show label for the list, but not for individual items
        const label = formItemProps?.label
        if (formItemProps?.label) {
            delete formItemProps.label
        }

        const name = formItemProps?.name ?? fieldInfo.name
        if (formItemProps?.name) {
            delete formItemProps.name
        }

        return (
            <Form.Item {...formItemProps} label={label}>
                <Form.List name={name}>
                    {(fields, { add, remove }) => {
                        console.log('FormList: outer function. fields=', fields)
                        return (
                            <>
                                {fields.map((field, index) => {
                                    console.log('FormList: inner map. field', field, 'index', index)
                                    const DeleteItem = (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            style={{ margin: '0 8px' }}
                                            onClick={() => {
                                                remove(field.name)
                                            }}
                                        />
                                    )
                                    return (
                                        <Card key={field.key} size="small" type="inner" title={`#${index + 1}`} extra={DeleteItem} style={{ padding: 0 }}>
                                            <InputComponent {...props} formItemProps={{ ...formItemProps, ...{ wrapperCol: { span: 24 } }, ...field }} />
                                        </Card>
                                    )
                                })}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add()
                                        }}
                                    >
                                        <PlusOutlined /> Add {capitalCase(fieldInfo.referenceNamespace?.type!)}
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
            </Form.Item>
        )
    }
}
