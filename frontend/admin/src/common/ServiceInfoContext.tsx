import React from 'react'
import { ServiceInfoCommon } from 'common'

export const ServiceInfoContext = React.createContext<ServiceInfoCommon | null>(null)
ServiceInfoContext.displayName = 'ServiceInfoContext'
