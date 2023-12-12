export interface PrimaryNamespace {
    service?: string
    entity?: string
}

export interface Namespace extends PrimaryNamespace {
    type?: string
    enum?: string
    method?: string
}
