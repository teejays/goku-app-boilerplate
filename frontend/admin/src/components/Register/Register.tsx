import { AuthContext, authenticate } from 'common/AuthContext'
import { Button, Card, Form, Input, Layout, Select, notification } from 'antd'
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { PersonName, PhoneNumber } from 'goku.generated/types/types.generated'
import React, { useContext } from 'react'

import { Email } from 'common'
import { httpPostCall } from 'providers/provider'
import { useHistory } from 'react-router-dom'

interface RegisterUserRequest {
    name: PersonName
    email: Email
    phone_number?: PhoneNumber
    password: string
}

interface RegisterUserResponse {
    token: string
}

export const RegisterForm = (props: {}) => {
    const authInfo = useContext(AuthContext)
    const history = useHistory()

    const onFinish = (values: any) => {
        console.log('Register Form: Submission', values)
        httpPostCall<RegisterUserResponse, RegisterUserRequest>({ path: 'users/register', params: values }).then((resp) => {
            if (resp.errMessage) {
                notification['error']({
                    message: 'HTTP GET',
                    description: `${resp.errMessage}`,
                })
                return
            }
            if (resp.data) {
                authenticate({ authSession: { token: resp.data.token }, setAuthSession: authInfo.setAuthSession })
                history.push('/')
            }
        })
    }

    const inputStyles = {
        minWidth: 300,
        maxWidth: 600,
    }

    return (
        <Card title="Register">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Form name="register" style={{ maxWidth: 400 }} initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ required: true, type: 'email' }]} style={inputStyles}>
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="name">
                        <Form.Item name={['name', 'first']} rules={[{ required: true }]} style={inputStyles}>
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="First Name" />
                        </Form.Item>
                        <Form.Item name={['name', 'middle_initial']} rules={[{}]} style={inputStyles}>
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Middle" />
                        </Form.Item>
                        <Form.Item name={['name', 'last']} rules={[{}]} style={inputStyles}>
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Last Name" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item name="phone_number">
                        <Form.Item name={['phone_number', 'country_code']} rules={[{ required: true, type: 'number' }]} style={inputStyles}>
                            <Select style={inputStyles} placeholder="Country Code">
                                <Select.Option value={1}>+1</Select.Option>
                                <Select.Option value={92}>+92</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name={['phone_number', 'number']} rules={[{}]} style={inputStyles}>
                            <Input prefix={<PhoneOutlined className="site-form-item-icon" />} placeholder="Phone Number" />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true }]} style={inputStyles}>
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Card>
    )
}

export const RegisterPage = (props: {}) => {
    return (
        <Layout>
            <Layout>
                <Layout.Header />
                <Layout.Content>
                    <RegisterForm />
                </Layout.Content>
            </Layout>
        </Layout>
    )
}
