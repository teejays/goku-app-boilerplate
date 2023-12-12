import React from 'react'
import { ServiceInfoCommon } from 'goku.static/common'

export const ServiceInfoContext = React.createContext<ServiceInfoCommon | null>(null)
ServiceInfoContext.displayName = 'ServiceInfoContext'
