import { AppInfo } from 'goku.static/common'
import React from 'react'
import { ServiceInfoCommon } from './ServiceInfo'

export const AppInfoContext = React.createContext<AppInfo<ServiceInfoCommon> | null>(null)
AppInfoContext.displayName = 'AppInfoContext'
