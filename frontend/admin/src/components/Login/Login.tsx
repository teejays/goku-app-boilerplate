import { AuthContext, authenticate } from 'common/AuthContext'
import { Button, Card, Form, Input, Layout } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import React, { useContext } from 'react'

import { httpPostCall } from 'providers/provider'
import { useHistory } from 'react-router-dom'

interface AuthenticateRequest {
    email: string
    password: string
}

interface AuthenticateResponse {
    token: string
}

export const LoginForm = (props: {}) => {
    const authInfo = useContext(AuthContext)
    const history = useHistory()

    const onFinish = (values: any) => {
        console.log('Login Form: Submission', values)
        httpPostCall<AuthenticateResponse, AuthenticateRequest>({ path: 'users/authenticate', params: values }).then((resp) => {
            if (resp.errMessage) {
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
        <Card title="Login">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Form name="normal_login" style={{ maxWidth: 400 }} initialValues={{ remember: true }} onFinish={onFinish}>
                    <Form.Item name="email" rules={[{ required: true, type: 'email' }]} style={inputStyles}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true }]} style={inputStyles}>
                        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Log in
                        </Button>
                        Or <a href="/register">register now!</a>
                    </Form.Item>
                </Form>
            </div>
        </Card>
    )
}

export const LoginPage = (props: {}) => {
    return (
        <Layout>
            <Layout>
                <Layout.Header />
                <Layout.Content>
                    <LoginForm />
                </Layout.Content>
            </Layout>
        </Layout>
    )
}
