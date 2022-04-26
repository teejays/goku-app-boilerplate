import { AppInfo, ServiceInfoCommon } from 'common'

export interface OverrideProps {
    appInfo: AppInfo<ServiceInfoCommon>
}

export const applyEntityInfoOverrides = (props: OverrideProps) => {
    // Sample override looks like:
    /*
    {
        const entityInfo = appInfo.getEntityInfo<PharmaceuticalCompany>('pharmacy', 'pharmaceutical_company')
        entityInfo.columnsFieldsForListView = ['name', 'updated_at', 'created_at']
        entityInfo.getHumanNameFunc = (r, entityInfo) => r.name
        appInfo.updateEntityInfo(entityInfo)
    }
    */
}
