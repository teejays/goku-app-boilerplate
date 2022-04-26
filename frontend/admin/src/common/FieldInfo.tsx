import { EntityName, ServiceName } from 'goku.generated/types/types.generated'
import { Namespace, TypeInfoProps } from 'common'
import { TypeMinimal, TypeProps } from 'common/TypeInfo'

import { FieldKind } from 'common/FieldKind'

// FieldInfoProps require both FieldInfo and EntityInfo
export interface FieldInfoProps<T extends TypeMinimal> extends TypeInfoProps<T> {
    fieldInfo: FieldInfo
}

export interface FieldProps<T extends TypeMinimal> extends TypeProps<T> {
    fieldInfo: FieldInfo
}

export interface FieldInfo {
    name: string
    kind: FieldKind
    isRepeated?: boolean
    referenceNamespace?: Namespace // required when field is a nested type

    isMetaField?: boolean
    foreignEntityInfo?: ForeignEntityInfo
}

interface ForeignEntityInfo {
    serviceName?: ServiceName
    entityName?: EntityName
}

// export interface NewFieldInfoCProps {
//     name: string
//     kind: FieldKind
//     isRepeated?: boolean
//     referenceNamespace?: Namespace // required when field is a nested type

//     isMetaField?: boolean
//     foreignEntityServiceName?: ServiceName
//     foreignEntityName?: EntityName
// }

// export class FieldInfoC {
//     name: string
//     kind: FieldKind
//     isRepeated?: boolean
//     isMetaField?: boolean
//     referenceNamespace?: Namespace // required when field is a nested type
//     foreignEntityServiceName?: ServiceName
//     foreignEntityName?: EntityName

//     constructor(props: NewFieldInfoCProps) {
//         this.name = props.name
//         this.kind = props.kind
//         this.isRepeated = props.isRepeated
//         this.isMetaField = props.isMetaField
//         this.referenceNamespace = props.referenceNamespace
//         this.foreignEntityServiceName = props.foreignEntityServiceName
//         this.foreignEntityName = props.foreignEntityName
//     }

//     getDisplayComponent(): React.ComponentType<DisplayProps<any>> {}
// }

// interface FieldFormProps extends Partial<FormItemProps> {
//     fieldInfo: FieldInfo
// }

// interface FieldKindI<T extends any> {
//     name: string
//     getLabel: (props: FieldInfo) => JSX.Element
//     getDisplayComponent: () => React.ComponentType<DisplayProps<T>>
//     getInputComponent: () => React.ComponentType<FieldFormProps>
//     getInputRepeatedComponent: () => React.ComponentType<FieldFormProps>
// }

// export interface NewFieldKindCProps<T extends any> {
//     name: string
//     getDisplayComponent: () => React.ComponentType<DisplayProps<T>>
//     getInputComponent: () => React.ComponentType<FieldFormProps>
//     getInputRepeatedComponent: () => React.ComponentType<FieldFormProps>
// }

// export class FieldKindC<T extends any> {
//     name: string
//     getDisplayComponent: () => React.ComponentType<DisplayProps<T>>
//     getInputComponent: () => React.ComponentType<FieldFormProps>
//     getInputRepeatedComponent: () => React.ComponentType<FieldFormProps>

//     constructor(props: NewFieldKindCProps<T>) {
//         this.name = props.name
//         this.getDisplayComponent = props.getDisplayComponent
//         this.getInputComponent = props.getInputComponent
//         this.getInputRepeatedComponent = props.getInputRepeatedComponent
//     }
// }
// const DefaultFieldKind = new FieldKindC({
//     name: '',
//     getDisplayComponent: () => {
//         return (props: DisplayProps<any>) => {
//             return <DefaultDisplay {...props} />
//         }
//     },
//     getInputComponent: () => {
//         return (props: FieldFormProps) => {
//             const { fieldInfo, ...formItemProps } = props
//             return <StringInput {...formItemProps} />
//         }
//     },
//     getInputRepeatedComponent: () => {
//         return (props: FieldFormProps) => {
//             return getRepeatedFormComponent({
//                 getInputComponent: () => {
//                     return (props: FieldFormProps) => {
//                         const { fieldInfo, ...formItemProps } = props
//                         return <StringInput {...formItemProps} />
//                     }
//                 },
//             })
//         }
//     },
// })
