import { Drug } from 'goku.generated/types/pharmacy/drug/types.generated'
import { OverrideProps } from '.'
import { PharmaceuticalCompany } from 'goku.generated/types/pharmacy/pharmaceutical_company/types.generated'
import { User } from 'goku.generated/types/users/user/types.generated'

export function commonOverrides(props: OverrideProps) {
    const { appInfo } = props

    {
        const entityInfo = appInfo.getEntityInfo<PharmaceuticalCompany>('pharmacy', 'pharmaceutical_company')
        entityInfo.columnsFieldsForListView = ['name', 'updated_at', 'created_at']
        entityInfo.getHumanNameFunc = (r, entityInfo) => r.name
        appInfo.updateEntityInfo(entityInfo)
    }

    {
        const entityInfo = appInfo.getEntityInfo<User>('users', 'user')
        entityInfo.columnsFieldsForListView = ['name', 'email', 'created_at']
        appInfo.updateEntityInfo(entityInfo)
    }

    {
        const entityInfo = appInfo.getEntityInfo<Drug>('pharmacy', 'drug')
        entityInfo.columnsFieldsForListView = ['name', 'created_at', 'updated_at']
        entityInfo.getHumanNameFunc = (r, entityInfo) => r.name
        appInfo.updateEntityInfo(entityInfo)
    }

    console.log('Common Overrides:', appInfo)
}
