import React from 'react'

export interface AuthSession {
    token: string
}

export interface AuthContextProps {
    authSession?: AuthSession
    setAuthSession?: (value: AuthSession | undefined) => void
}

export const AuthContext = React.createContext<AuthContextProps>({})
AuthContext.displayName = 'AuthContext'

// Helpers
export const authenticate = (props: AuthContextProps | undefined): boolean => {
    if (!props || !props.authSession || !props.setAuthSession) {
        return false
    }
    props.setAuthSession(props.authSession)
    return true
}

export const logout = (props: AuthContextProps | undefined) => {
    if (props && props.setAuthSession) {
        console.log('setting authSession to undefined')
        props.setAuthSession(undefined)
    }
}

export const isAuthenticated = (authSession: AuthSession | undefined): boolean => {
    return !!authSession && !!authSession.token
}
