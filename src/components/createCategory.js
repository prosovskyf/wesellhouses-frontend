import React, { useState } from 'react';
import { Input, Form, Button, message, Upload } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
const layout = {
    labelCol: {
        span: 2,
    },
    wrapperCol: {
        span: 6,
    },
};
const tailLayout = {
    wrapperCol: { offset: 3 },
};

/**
 * Component to create new category and upload thumbnail
 * @category Categories
 * @component
 */
function CreateCategory(props) {
    const [fileList, setFileList] = useState([])
    /** When clicked save, return data to parent */
    function returnCategory(category) {
        category.image = fileList
        Object.keys(category).forEach(key => category[key] === undefined && delete category[key])
        props.pass(category);
    }

    const uploadProps = {
        name: 'image',
        fileList: fileList,
        onRemove() { setFileList([]) },
        beforeUpload(file, fileList) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                setFileList([])
                message.error('You can only upload JPG/PNG file!');
                return false
            }
            else {
                setFileList(fileList)
                return false
            }
        },
    }

    return (
        <>
            <Form
                {...layout}
                name="category"
                onFinish={returnCategory}
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

                <Form.Item
                    label="Thumbnail"
                    name="image"
                >
                    <Upload
                        {...uploadProps}
                    >
                        {(fileList.length === 0)
                            &&
                            <Button type="text" style={{ fontSize: "20px", background: "transparent" }}
                                shape="circle" icon={<CloudUploadOutlined style={{ fontSize: "20px" }} />} />
                        }
                    </Upload>


                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" shape="round" size="large">
                        Save
                    </Button>
                </Form.Item>
            </Form>


        </>
    );
};

export default CreateCategory;