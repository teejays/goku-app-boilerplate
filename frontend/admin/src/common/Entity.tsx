import { TypeMinimal, UUID } from 'common'

// EntityMinimal represents fields that all Entities should have.
export interface EntityMinimal extends TypeMinimal {
    id: UUID
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}
