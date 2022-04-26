import { AppInfo, ServiceInfoCommon } from 'common'

import { commonOverrides } from './Overrides'
import { medicineInfoOverrides } from './Medicine'

export interface OverrideProps {
    appInfo: AppInfo<ServiceInfoCommon>
}

export const applyEntityInfoOverrides = (props: OverrideProps) => {
    commonOverrides(props)
    medicineInfoOverrides(props)
}
