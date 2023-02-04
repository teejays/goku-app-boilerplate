import { Button, Form, Layout, Typography, notification } from 'antd'
import { EntityInfo, EntityMinimal, getEntityDetailPath } from 'common'
import React, { CSSProperties, useState } from 'react'

import { Redirect } from 'react-router-dom'
import { TypeFormItems } from 'common/Form'
import { capitalCase } from 'change-case'
import { useAddEntity } from 'providers/provider'

interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
}

export const DefaultAddView = <E extends EntityMinimal>(props: Props<E>) => {
    const { entityInfo } = props

    const [submitted, setSubmitted] = useState<boolean>(false)
    const [entity, setEntity] = useState<E | null>(null)

    const [form] = Form.useForm()

    const onFinish = (values: E) => {
        console.log('Form onFinish', values)

        const [{ loading, error, data }] = useAddEntity<E>({
            entityInfo: entityInfo,
            data: values,
        })

        if (loading) {
            return
        }
        if (error) {
            return
        }
        if (data) {
            setSubmitted(true)
            setEntity(data)
        }
    }

    // After form has been submitted and entity created, redirect to the detail page
    if (submitted && entity) {
        return <Redirect push to={getEntityDetailPath({ entityInfo, entity })} />
    }

    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 },
    }

    const formItemProps = { ...layout }
    const buttonStyle: CSSProperties = {}

    return (
        <Layout>
            <Layout.Header style={{ background: 'none' }}>
                <Typography.Title level={3}>Add {capitalCase(entityInfo.name)} Form</Typography.Title>
            </Layout.Header>
            <Layout.Content>
                <Form form={form} onFinish={onFinish} {...layout} layout={'horizontal'}>
                    <TypeFormItems typeInfo={entityInfo} formItemProps={formItemProps} usePlaceholders />
                    <Form.Item {...formItemProps} wrapperCol={{ offset: 3 }}>
                        <Button type="primary" htmlType="submit" style={{ ...buttonStyle }} key="default-add-button">
                            Add {capitalCase(entityInfo.name)}
                        </Button>
                    </Form.Item>
                </Form>
            </Layout.Content>
            <Layout.Footer></Layout.Footer>
        </Layout>
    )
}
