import { Col, Dropdown, Menu, Row, Space } from 'antd'

import { Link } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons'
import React from 'react'

export const AppHeader = (props: {}) => {
    const menuItems = [
        { key: '0', label: <Link to="/logout">Logout</Link> },
        { key: '1', label: <Link to="/">Profile [todo]</Link> },
    ]

    return (
        <Row>
            <Col span={1} offset={23}>
                <Space align="end" direction="vertical" style={{ width: '100%' }}>
                    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomLeft">
                        <MenuOutlined style={{ color: '#efefef', marginLeft: '10px' }} />
                    </Dropdown>
                </Space>
            </Col>
        </Row>
    )
}
