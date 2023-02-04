import React from 'react'
import { json } from 'stream/consumers'

export interface AuthSession {
    token: string
}

export interface AuthContextProps {
    authSession?: AuthSession
    setAuthSession?: (value: AuthSession | undefined) => void
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

// Helpers
export const authenticate = (props: AuthContextProps): boolean => {
    if (!props.setAuthSession) {
        throw new Error('No setAuthSession method provided')
    }

    const storedAuthSessionJSON = localStorage.getItem('authSession')
    const storedAuthSession = storedAuthSessionJSON ? JSON.parse(storedAuthSessionJSON) : undefined

    const authSession = props.authSession ?? storedAuthSession

    if (!authSession) {
        // No session provided or found
        return false
    }

    props.setAuthSession(authSession)
    if (authSession !== storedAuthSession) {
        localStorage.setItem('authSession', JSON.stringify(authSession))
    }

    return true
}

export const logout = (props?: AuthContextProps) => {
    if (props?.setAuthSession) {
        props.setAuthSession(undefined)
    }
    localStorage.removeItem('authSession')
}

export const isAuthenticated = (authSession?: AuthSession): boolean => {
    return !!authSession && !!authSession.token
}
