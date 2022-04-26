import './App.less'

import * as global from 'goku.generated/types/types.generated'

import { AppInfoContext, EntityInfo, EntityMinimal, ServiceInfoContext } from 'common'
import { AuthContext, AuthSession, isAuthenticated } from 'common/AuthContext'
import { BrowserRouter, Route, Switch, useParams } from 'react-router-dom'
import { DefaultAddView, DefaultDetailView, DefaultListView } from 'components/default'
import { Layout, Spin } from 'antd'
import React, { useContext, useEffect, useState } from 'react'

import { AppHeader } from 'components/AppHeader'
import { LoginPage } from 'components/Login/Login'
import { LogoutPage } from 'components/Logout/Logout'
import { MenuWrapper } from 'components/Menu'
import { RegisterPage } from 'components/Register/Register'
import { applyEntityInfoOverrides } from 'overrides/entities'

const App = () => {
    const [authSession, setAuthSession] = useState<AuthSession>()

    const defaultAuthContextInfo = {
        authSession: authSession,
        setAuthSession: setAuthSession,
    }

    // Load Auth Session from local storage, upon loading
    useEffect(() => {
        const loadedAuthSessionJSON = localStorage.getItem('authSession')
        if (loadedAuthSessionJSON && loadedAuthSessionJSON !== 'undefined') {
            console.log('Loaded AuthSession', loadedAuthSessionJSON)
            const loadedAuthSession = JSON.parse(loadedAuthSessionJSON) as AuthSession
            setAuthSession(loadedAuthSession)
        }
    }, [])

    // If Auth session changes, update the local storage
    useEffect(() => {
        console.log('useEffect(): Auth session changed, changing local storage to', authSession)
        localStorage.setItem('authSession', JSON.stringify(authSession))
    }, [authSession])

    return (
        <div className="App">
            <AuthContext.Provider value={defaultAuthContextInfo}>
                <AppContexted />
            </AuthContext.Provider>
        </div>
    )
}

const AppContexted = (props: {}) => {
    const authInfo = useContext(AuthContext)
    const authenticated = isAuthenticated(authInfo.authSession)

    if (!authenticated) {
        return <UnauthenticatedApp />
    }

    return <AuthenticatedApp />
}

const UnauthenticatedApp = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route path="/register">
                    <RegisterPage />
                </Route>
                <Route>
                    <LoginPage />
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

const AuthenticatedApp = (props = {}) => {
    let appInfo = global.appInfo
    console.log('Store:', appInfo)

    applyEntityInfoOverrides({ appInfo: appInfo })

    const { Header, Content, Footer, Sider } = Layout

    const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false)

    return (
        <AppInfoContext.Provider value={appInfo}>
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider width={250} collapsible collapsed={siderCollapsed} onCollapse={() => setSiderCollapsed(!siderCollapsed)}>
                        <div
                            className="logo"
                            style={{
                                height: '32px',
                                margin: '16px',
                                background: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            LOGO
                        </div>
                        <MenuWrapper />
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background">
                            <AppHeader />
                        </Header>
                        <Content>
                            <Switch>
                                <Route path="/logout">
                                    <LogoutPage />
                                </Route>
                                <Route path="/:serviceName">
                                    <ServiceRoutes />
                                </Route>
                                <Route path="/">
                                    <Home />
                                </Route>
                            </Switch>
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>Pharmacy Goku ©2021 Created by Ansari Labs</Footer>
                    </Layout>
                </Layout>
            </BrowserRouter>
        </AppInfoContext.Provider>
    )
}

interface ServiceRoutesProps {
    children?: React.ReactNode
}

const ServiceRoutes: (props: ServiceRoutesProps) => JSX.Element = (props): JSX.Element => {
    const { serviceName } = useParams<{ serviceName: string }>()

    // Get Store from context
    const store = useContext(AppInfoContext)
    if (!store) {
        return <Spin />
    }

    const serviceInfo = store.getServiceInfo(serviceName)

    console.log('ServiceRoutes: Service Name:', serviceInfo)

    if (!serviceInfo) {
        return <p>{`Service '${serviceName}' not recognized`}</p>
    }

    return (
        <ServiceInfoContext.Provider value={serviceInfo}>
            <Route path={'/' + serviceInfo.name + '/:entityName'}>
                <EntityRoutes />
            </Route>
        </ServiceInfoContext.Provider>
    )
}

interface EntityRoutesProps {
    children?: React.ReactNode
}

const EntityRoutes: (props: EntityRoutesProps) => JSX.Element = (props) => {
    const { entityName } = useParams<{ entityName: string }>()

    const [entityInfo, setEntityInfo] = useState<EntityInfo>()

    // Get Store from context
    const serviceInfo = useContext(ServiceInfoContext)
    if (!serviceInfo) {
        return <Spin />
    }

    useEffect(() => {
        const entityInfoL = serviceInfo.getEntityInfo(entityName)
        if (entityInfoL) {
            setEntityInfo(entityInfoL)
        }
    }, [entityName])

    if (!entityInfo) {
        return <Spin />
    }

    // if (!entityInfo) {
    //     return <p>{`Entity '${entityName}' not recognized for service '${serviceInfo.name}'`}</p>
    // }

    return (
        <Switch>
            {/* Add Entity */}
            <Route path={'/' + serviceInfo.name + '/' + entityInfo.name + '/add'}>
                <DefaultAddView entityInfo={entityInfo} />
            </Route>
            {/* List Entity */}
            <Route path={'/' + serviceInfo.name + '/' + entityInfo.name + '/list'}>
                <DefaultListView entityInfo={entityInfo} />
            </Route>
            {/* Detail View */}
            <Route path={'/' + serviceInfo.name + '/' + entityInfo.name + '/:id'}>
                <EntityDetailRoute entityInfo={entityInfo} />
            </Route>
            {/* TODO: Edit View */}
            {/*
            <Route path={'/' + serviceInfo.name + '/' + entityInfo.name + '/:id/edit'}>
                <EntityEditRoute entityInfo={entityInfo} />
            </Route>
            */}
        </Switch>
    )
}

const EntityDetailRoute = <E extends EntityMinimal>(props: { entityInfo: EntityInfo<E> }) => {
    const { id } = useParams<{ id: string }>()
    return <DefaultDetailView entityInfo={props.entityInfo} objectId={id} />
}

const Home = () => {
    return (
        <header className="App-header">
            <p>
                Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                Learn React
            </a>
        </header>
    )
}

export default App
