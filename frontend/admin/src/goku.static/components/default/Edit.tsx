import { Button, Form, Layout, Result, Spin, Typography, notification } from 'antd'
import { EntityInfo, EntityMinimal, UUID, getEntityDetailPath } from 'goku.static/common'
import React, { CSSProperties, useState } from 'react'

import { Redirect } from 'react-router-dom'
import { TypeFormItems } from 'goku.static/common/Form'
import { capitalCase } from 'change-case'
import { useGetEntity, useUpdateEntity } from 'goku.static/providers/provider'

interface Props<E extends EntityMinimal> {
    entityInfo: EntityInfo<E>
    objectId: UUID
}

export const DefaultEditView = <E extends EntityMinimal>(props: Props<E>) => {
    const { entityInfo, objectId } = props

    const [{ loading: loadingGet, error: errorGet, data: entity }] = useGetEntity<E>({ entityInfo: entityInfo, params: { id: objectId } })

    const [form] = Form.useForm()

    const [{ loading, error, data }, fetch] = useUpdateEntity<E, string>({
        entityInfo: entityInfo,
    })

    console.log('States:', loading, error, data)

    if (loadingGet || loading) {
        return <Spin size="large" />
    }
    if (errorGet || error) {
        return <Result status="error" title="Something went wrong" subTitle={errorGet} />
    }
    if (!entity) {
        return <Result status="error" subTitle="Panic! No entity data returned" />
    }

    const onFinish = (values: E) => {
        console.log('Form onFinish', values)
        values.id = entity.id // since the form values do not have fields without a displayed input
        fetch({
            data: {
                object: values,
            },
        })
    }

    // After form has been submitted and entity created, redirect to the detail page
    if (!loading && !error && data) {
        console.log('Redirecting...')
        return <Redirect push to={getEntityDetailPath({ entityInfo, entity })} />
    }

    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 },
    }

    const formItemProps = { ...layout, initialValue: entity }
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
                        {loading && <Spin />}
                    </Form.Item>
                </Form>
            </Layout.Content>
            <Layout.Footer></Layout.Footer>
        </Layout>
    )
}
