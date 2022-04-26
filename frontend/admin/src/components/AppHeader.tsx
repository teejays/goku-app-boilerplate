import { Col, Dropdown, Menu, Row, Space } from 'antd'

import { Link } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons'
import React from 'react'

export const AppHeader = (props: {}) => {
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Link to="/logout">Logout</Link>
            </Menu.Item>
            <Menu.Item key="1">
                <Link to="/">Profile [todo]</Link>
            </Menu.Item>
        </Menu>
    )

    return (
        <Row>
            <Col span={1} offset={23}>
                <Space align="end" direction="vertical" style={{ width: '100%' }}>
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
                        <MenuOutlined style={{ color: '#efefef', marginLeft: '10px' }} />
                    </Dropdown>
                </Space>
            </Col>
        </Row>
    )
}
