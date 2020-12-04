import React, { useState, useEffect } from 'react';
import { Input, Form, Button, message, Upload, Row, Col, Popconfirm } from 'antd';
import { CloudUploadOutlined, LoadingOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuth } from "../context/user";
import { useParams, useHistory } from "react-router-dom";
import { getCategory, updateCategoryById, deleteCategoryImage, deleteCategory } from './editCategoryFunctions'
import Loader from './loader'

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 12,
    },
};
const tailLayout = {
    wrapperCol: { offset: 7, span: 4 },
};

/**
 * Component to edit category and edit thumbnail
 * @category Categories
 * @component
 */
function EditCategory() {
    const { authUser } = useAuth();
    const { id } = useParams();
    const [category, setCategory] = useState()
    const [escUrl, setEscUrl] = useState('')
    const [isUploading, setUploading] = useState(false)
    const [statusCode, setStatusCode] = useState()
    /** Trigger rerender on state change */
    const [change, setChange] = useState(0)
    let history = useHistory();
    /** Update category data on submit */
    async function updateCategory(data) {
        Object.keys(data).forEach(key => data[key] === (undefined || null) && delete data[key])
        let res = await updateCategoryById(authUser.token, data, id)
        if (res.status === 201) {
            message.success(res.body, 2)
            setChange(Math.random())
        }
        else {
            message.error(res.body, 2)
        }
    }
    /** Load category data  */
    async function loadCategory() {
        let category = await getCategory(authUser.token, id)
        return category
    }
    /** Delete category image */
    async function deleteImage() {
        let res = await deleteCategoryImage(authUser.token, id, category.name, category.image_url)
        if (res.status === 200) {
            message.success(res.body, 2)
        }
        else {
            message.error(res.body, 2)
        }
        setChange(Math.random())
    }
    /** Delete whole category */
    async function confirm() {
        let res = await deleteCategory(authUser.token, id)
        if (res.status === 201) {
            message.success(res.body, 3);
            history.push('/admin/categories')
        }
        else {
            message.error(res.body, 3);
        }
    }
    /** Load category on mount and when state 'change' changes */
    useEffect(() => {
        loadCategory().then(result => {
            setStatusCode(result.status)
            if ((result.status >= 200) && (result.status < 400)) {
                if (result.body[0].image_url != null) {
                    setEscUrl(result.body[0].image_url.replace(/\./, ''));
                }
                setCategory(result.body[0])
            }
        })
    }, [change])

    const uploadProps = {
        name: 'image',
        method: 'PUT',
        action: `${process.env.REACT_APP_API_URL}/files/upload/category/image`,
        headers: {
            "Authorization": "Bearer " + authUser.token,
            category_id: id
        },
        showUploadList: false,
        beforeUpload(file) {
            setUploading(true)
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                setUploading(false)
                message.error('You can only upload JPG/PNG file!');
                return false
            }
        },
        onChange(info) {
            if (info.file.status === 'done') {
                setUploading(false)
                setChange(Math.random())
                message.success('Picture uploaded', 1);

            } else if (info.file.status === 'error') {
                setUploading(false)
                message.error('File upload failed.', 3);
            }
        }
    }

    var uploadingIcon;
    isUploading
        ? uploadingIcon = <LoadingOutlined style={{ fontSize: "20px" }} />
        : uploadingIcon = <CloudUploadOutlined style={{ fontSize: "20px" }} />

    return (
        <>
            {category
                ? (
                    <>
                        {statusCode === 404
                            && history.push('/404')}
                        <div style={{ float: "right", padding: "10px" }}>
                            <Popconfirm
                                title="Are you sure you want to delete this category?"
                                onConfirm={confirm}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" danger >
                                    Delete category
                                </Button>
                            </Popconfirm>
                        </div>
                        <div style={{ float: "left", padding: "10px" }}>
                            <Button type="text" style={{ background: "transparent" }}
                                shape="circle" icon={<ArrowLeftOutlined style={{ fontSize: "30px" }} />}
                                onClick={() => history.push('/admin/categories')} />
                        </div>
                        <br />
                        <div style={{ textAlign: "center" }} className={layout}>
                            <h1 style={{ textAlign: "center" }}>Editing category: {category.name}</h1>
                        </div>
                        <br />
                        <Row>
                            <Col span={12}>
                                <br />
                                <Form
                                    {...layout}
                                    name="category"
                                    initialValues={{
                                        name: category.name,
                                        description: category.description,
                                    }}
                                    onFinish={updateCategory}
                                >
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input name!',
                                            },
                                        ]}>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="Description"
                                        name="description"
                                    >
                                        <Input.TextArea />
                                    </Form.Item>

                                    <Form.Item {...tailLayout}>
                                        <Button type="primary" htmlType="submit" shape="round" size="large">
                                            Update category
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col span={8}>
                                {category.image_url != null
                                    ? (
                                        <div style={{ padding: "10px" }} key={category.id}>
                                            <img className="Img" alt="gallery" width={140} height={140}
                                                src={`${process.env.REACT_APP_BACKEND}${escUrl}`} />
                                            <Button size="small" onClick={() => deleteImage()}
                                                icon={<DeleteOutlined />}
                                                type="text" style={{ background: "transparent" }} />
                                        </div>
                                    )
                                    : (
                                        <Upload
                                            {...uploadProps}
                                        >
                                            <Button type="text" style={{ fontSize: "20px", background: "transparent" }}
                                                shape="circle" icon={uploadingIcon} />
                                        </Upload>
                                    )
                                }
                            </Col>
                        </Row>
                    </>
                )
                : <Loader />
            }

        </>
    );
};

export default EditCategory;