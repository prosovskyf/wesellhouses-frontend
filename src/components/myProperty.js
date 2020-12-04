import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Col, Row, Select, message, Checkbox, Popconfirm } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useHistory } from "react-router-dom";
import { useAuth } from "../context/user";
import { getById } from './myPropertiesFunctions'
import {
    updatePropertyById,
    addFeatures,
    deleteFeatures,
    deleteProperty,
    deleteAllFeatures
} from './myPropertyFunctions'
import MyPropertyImages from './myPropertyImages'
import MyPropertyVideo from './myPropertyVideo'
import Loader from './loader'

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 24,
    },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

/**
 * Component to show and allow edit for specific agent's property
 * Sub components: MyPropertyImages, MyPropertyVideo
 * @category Properties
 * @component
 */
function MyProperty() {
    const [property, setProperty] = useState()
    const [featuresToDelete, setDeleteFeatures] = useState([])
    const [featuresToAdd, setAddFeatures] = useState([])
    const [isLoadingButton, setLoadingButton] = useState(false)
    const [statusCode, setStatusCode] = useState()
    const [change, setChange] = useState(0)
    const { authUser } = useAuth();
    const { id } = useParams();
    let history = useHistory();
    /** Load specific user property */
    async function loadProperty() {
        let property = await getById(authUser.token, id)
        return property
    }
    /** Update property data */
    async function updateProperty(data) {
        try {
            setLoadingButton(true)
            if (featuresToDelete.length > 0) {
                let add = await deleteFeatures(authUser.token, featuresToDelete, property.id)
                setDeleteFeatures([])
                if (add.status !== 201) {
                    return message.error(add.body)
                }
            }
            if (featuresToAdd.length > 0) {
                let del = await addFeatures(authUser.token, featuresToAdd, property.id)
                setAddFeatures([])
                if (del.status !== 201) {
                    return message.error(del.body)
                }
            }
            delete data.features
            Object.keys(data).forEach(key => data[key] === (undefined || null) && delete data[key])
            var result = await updatePropertyById(authUser.token, data, property.id)
            if (result.status === 201) {
                setLoadingButton(false)
                message.success('Property was updated!', 3);
                setProperty(result.body[0])
            }
            else {
                message.error('Please check your values and try again!');
                setLoadingButton(false)
            }
            setChange(Math.random())
        }
        catch (err) {
            message.error('Error occured')
        }
    }
    /** Load property and set state on mount and when change state changes */
    useEffect(() => {
        loadProperty().then(result => {
            setStatusCode(result.status)
            if ((result.status >= 200) && (result.status < 400)) {
                if (result.body[0].features[0] == null) {
                    result.body[0].features = []
                }
                setProperty(result.body[0])
            }
        })

    }, [change])
    /** Set property as published */
    function onPublished() {
        setProperty({ ...property, published: !property.published })
    }
    /** Set property as under offer */
    function onOffer() {
        setProperty({ ...property, under_offer: !property.under_offer })
    }
    /** Set property as high priority */
    function onHigh() {
        setProperty({ ...property, high_priority: !property.high_priority })
    }
    /** Add features to property */
    function onAddFeature(value) {
        setAddFeatures([...featuresToAdd, value])
    }
    /** Delete features from property */
    function onDeleteFeature(value) {
        setDeleteFeatures([...featuresToDelete, value])
    }
    /** Confirm changes  */
    async function confirm() {
        if (property.features.length > 0) {
            await deleteAllFeatures(authUser.token, id)
        }
        let res = await deleteProperty(authUser.token, id)
        if (res.status === 201) {
            message.success(res.body, 3);
            history.push('/admin/properties')
        }
        else {
            message.error(res.body, 3);
        }
    }

    return (
        <>
            {property
                ? (
                    <>
                        {statusCode === 404
                            && history.push('/404')}
                        <div style={{ float: "left", padding: "10px" }}>
                            <Button type="text" style={{ background: "transparent" }}
                                shape="circle" icon={<ArrowLeftOutlined style={{ fontSize: "30px" }} />}
                                onClick={() => history.push('/admin/properties')} />
                        </div>
                        <div style={{ float: "right", padding: "10px" }}>
                            <Popconfirm
                                title="Are you sure you want to delete whole property?"
                                onConfirm={confirm}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" danger >
                                    Delete property
                                </Button>
                            </Popconfirm>
                        </div>
                        <br />
                        <div style={{ textAlign: "center" }} className={layout}>
                            <h1 style={{ textAlign: "center" }}>Property management</h1>
                        </div>
                        <br />
                        <Row>
                            <Col span={12}>
                                <br />
                                <Form
                                    {...layout}
                                    name="property"
                                    initialValues={{
                                        title: property.title,
                                        description: property.description,
                                        location: property.location,
                                        price: property.price,
                                        features: property.features,
                                        under_offer: property.under_offer,
                                        high_priority: property.high_priority,
                                        published: property.published
                                    }}
                                    onFinish={updateProperty}
                                >
                                    <Form.Item
                                        label="Title"
                                        name="title"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input title!',
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Description"
                                        name="description"
                                    >
                                        <Input.TextArea autoSize={{ maxRows: 3 }} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Features"
                                        name="features"
                                    >
                                        <Select
                                            mode="tags"
                                            placeholder="Add features"
                                            onSelect={onAddFeature}
                                            onDeselect={onDeleteFeature}
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
                                    <Form.Item {...tailLayout} name="under_offer" valuePropName="checked">
                                        <Checkbox onChange={onOffer}>Under offer</Checkbox>
                                    </Form.Item>
                                    <Form.Item {...tailLayout} name="high_priority" valuePropName="checked">
                                        <Checkbox onChange={onHigh}>High priority</Checkbox>
                                    </Form.Item>
                                    <Form.Item {...tailLayout} name="published" valuePropName="checked">
                                        <Checkbox onChange={onPublished}>Published</Checkbox>
                                    </Form.Item>
                                    <Form.Item {...tailLayout}>
                                        <Button type="primary" htmlType="submit" loading={isLoadingButton}>
                                            Update property
                                </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col span={10} offset={2}>
                                <MyPropertyImages property_id={property.id} image_url={property.image_url}
                                    onMediaChange={setChange} />
                                <MyPropertyVideo property_id={property.id} video_url={property.video_url}
                                    onMediaChange={setChange} />
                            </Col>
                        </Row>
                    </>
                )
                : <Loader />
            }
        </>
    );
};

export default MyProperty;