import { AppInfoContext, EntityListLink } from 'common'
import { Menu, Spin } from 'antd'
import React, { useContext } from 'react'

import { HeartOutlined } from '@ant-design/icons'
import { capitalCase } from 'change-case'

// MenuWrapper is the Menu component of the App. We're calling it MenuWrapper because Menu is an already defined component
// in the Antd library.
export const MenuWrapper = (props: {}) => {
    const { SubMenu } = Menu
    // Get Store from context
    const store = useContext(AppInfoContext)
    if (!store) {
        return <Spin />
    }

    // Services
    const serviceInfos = store.getServiceInfos()
    const subMenus = serviceInfos.map((svcInfo) => {
        const entityInfos = svcInfo.entityInfos

        const subMenuItems = entityInfos.map((entityInfo) => {
            return (
                <Menu.Item key={`${svcInfo.name}-${entityInfo.name}`}>
                    <EntityListLink entityInfo={entityInfo} />
                </Menu.Item>
            )
        })
        return (
            <SubMenu key={`${svcInfo.name}`} title={capitalCase(svcInfo.name)} icon={svcInfo.defaultIcon ? <svcInfo.defaultIcon /> : <HeartOutlined />}>
                {subMenuItems}
            </SubMenu>
        )
    })
    return (
        <div>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                {subMenus}
            </Menu>
        </div>
    )
}
