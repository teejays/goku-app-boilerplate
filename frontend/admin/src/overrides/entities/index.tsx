import { AppInfo, ServiceInfoCommon } from 'common'

import { PersonName } from 'goku.generated/types/types.generated'
import { User } from 'goku.generated/types/users/user/types.generated'

export interface OverrideProps {
    appInfo: AppInfo<ServiceInfoCommon>
}

export const applyEntityInfoOverrides = (props: OverrideProps) => {
    const { appInfo } = props
    // Sample override looks like:
    /*
    {
        const entityInfo = appInfo.getEntityInfo<PharmaceuticalCompany>('pharmacy', 'pharmaceutical_company')
        entityInfo.columnsFieldsForListView = ['name', 'updated_at', 'created_at']
        entityInfo.getHumanNameFunc = (r, entityInfo) => r.name
        appInfo.updateEntityInfo(entityInfo)
    }
    */

    {
        const entityInfo = appInfo.getEntityInfo<User>('users', 'user')
        entityInfo.columnsFieldsForListView = ['id', 'email', 'phone_number', 'created_at']
        entityInfo.getHumanNameFunc = (r, entityInfo) => `${r.name.first} ${r.name.middle_initial ?? ''} ${r.name.last}`
        appInfo.updateEntityInfo(entityInfo)
    }
}
