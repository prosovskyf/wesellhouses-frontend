import React, { useState } from 'react';
import { message, Button, Form, Input, Checkbox, Select, Col, Row } from 'antd';
import CreateListingZoopla from './createListingZoopla'

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 14,
        offset: 1
    },
};
const tailLayout = {
    wrapperCol: { offset: 6 },
};

/**
 * Component to create property information in property creation process
 * Subcomponents: CreateListingZoopla
 * @category Properties
 * @component
 */
function CreateListingProperty(props) {
    const [published, setPublished] = useState(false)
    const [high_priority, setHigh] = useState(false)
    const [under_offer, setUnder] = useState(false)

    const token = props.token
    const returnProperty = (property) => {
        Object.keys(property).forEach(key => property[key] === undefined && delete property[key])
        message.success('Property will be created on finish, click next', 3)
        property.published = published;
        property.high_priority = high_priority
        property.under_offer = under_offer
        props.passToParent(property);
    }
    /** Checkbox published, change value */
    function onCheckPublished(e) {
        setPublished(e.target.checked)
    }
    /** Checkbox high priority, change value */
    function onCheckHigh(e) {
        setHigh(e.target.checked)
    }
    /** Checkbox under offer, change value */
    function onCheckUnder(e) {
        setUnder(e.target.checked)
    }

    return (
        <>
            <Row>
                <Col span={14}>
                    <Form
                        {...layout}
                        name="property"
                        onFinish={returnProperty}
                    >
                        <Form.Item
                            label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please write title!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please write description!',
                                },
                            ]}>
                            <Input.TextArea autoSize={{ maxRows: 3 }} />
                        </Form.Item>

                        <Form.Item
                            label="Features"
                            name="features"
                        >
                            <Select
                                mode="tags"
                                placeholder="Add features"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Location"
                            name="location"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter price"
                                },
                                () => ({
                                    validator(rule, value) {
                                        let format = (/^([0-9]{1,10})$/);
                                        if (!value || format.test(value)) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Enter valid price!');
                                    },
                                }),
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item {...tailLayout} name="under_offer" checked={published}>
                            <Checkbox onChange={onCheckUnder}>Under offer</Checkbox>
                        </Form.Item>
                        <Form.Item {...tailLayout} name="high_priority" checked={high_priority} >
                            <Checkbox onChange={onCheckHigh}>High priority</Checkbox>
                        </Form.Item>
                        <Form.Item {...tailLayout} name="published" checked={under_offer}>
                            <Checkbox onChange={onCheckPublished}>Publish</Checkbox>
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit">
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={10}>
                    <CreateListingZoopla token={token} />
                </Col>
            </Row>
        </>
    );
};

export default CreateListingProperty;