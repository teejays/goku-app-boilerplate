import { AuthContext, logout } from 'common/AuthContext'
import React, { useContext, useEffect } from 'react'

import { Redirect } from 'react-router-dom'

export const LogoutPage = (props: {}) => {
    const authInfo = useContext(AuthContext)
    useEffect(() => {
        if (authInfo.setAuthSession) {
            logout(authInfo)
        }
    }, [authInfo])

    return <Redirect to="/" />
}
