import { AuthContext, logout } from 'goku.static/common/AuthContext'
import React, { useContext, useEffect } from 'react'

import { Redirect } from 'react-router-dom'

export const LogoutPage = (props: {}) => {
    const authContext = useContext(AuthContext)
    console.log('Logging out')

    useEffect(() => {
        logout(authContext)
    }, [authContext])

    return <Redirect to="/" />
}
