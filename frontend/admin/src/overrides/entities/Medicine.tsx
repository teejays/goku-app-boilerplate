import { EntityInfo } from 'common'
import { Medicine } from 'goku.generated/types/pharmacy/medicine/types.generated'
import { OverrideProps } from '.'

export function medicineInfoOverrides(props: OverrideProps) {
    const { appInfo } = props
    const entityInfo = appInfo.getEntityInfo<Medicine>('pharmacy', 'medicine')
    if (!entityInfo) {
        return null
    }

    entityInfo.columnsFieldsForListView = ['name', 'mode_of_delivery', 'created_at']
    entityInfo.getHumanNameFunc = (r: Medicine, entityInfo: EntityInfo<Medicine>) => {
        return r.name
    }
    console.log('Overriding Medicine Info:', entityInfo)
}
