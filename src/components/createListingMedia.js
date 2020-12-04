import React, { useState } from 'react';
import { Button, message, Upload, Form } from 'antd';
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
 * Component to upload images and videos of property in property creation process
 * @category Properties
 * @component
 */
function CreateListingMedia(props) {
    const [thumbnailList, setThumbnailList] = useState([])
    const [imageList, setImageList] = useState([])
    const [videoList, setVideoList] = useState([])
    /** On save return all media states to parent and give success message */
    function returnMedia() {
        let files = {}
        files.image = imageList;
        files.thumbnail = thumbnailList;
        files.video = videoList;
        Object.keys(files).forEach(key => files[key].length === 0 && delete files[key])
        props.passToParentMedia(files);
        message.success('Media files loaded, click Submit to create listing');
    }

    const uploadPropsThumbnail = {
        name: 'thumbnail',
        fileList: thumbnailList,
        onRemove() { setThumbnailList([]) },
        beforeUpload(file, fileList) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                setThumbnailList([])
                message.error('You can only upload JPG/PNG file!');
                return false
            }
            else {
                setThumbnailList(fileList)
                return false
            }
        },
    }
    const uploadPropsImage = {
        name: 'image',
        fileList: imageList,
        multiple: true,
        onRemove(file) {
            /** Find file in state by uid and delete, set state afterwards */
            let filtered = imageList.filter(e => { return e.uid !== file.uid });
            setImageList(filtered)
        },
        beforeUpload(file, fileList) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('You can only upload JPG/PNG file!');
                return false
            }
            else {
                /** Append files + all from imageList together to set state */
                let newArr = imageList.concat(fileList)
                setImageList(newArr)
                return false
            }
        },
    }

    const uploadPropsVideo = {
        name: 'video',
        fileList: videoList,
        multiple: false,
        onRemove() { setVideoList([]) },
        beforeUpload(file, fileList) {
            const isMp4 = file.type === 'video/mp4';
            if (!isMp4) {
                setVideoList([])
                message.error('You can only upload MP4 video file!')
                return false
            }
            else {
                setVideoList(fileList)
                return false
            }
        },
    }



    return (
        <>
            <Form
                {...layout}
                name="Media"
                onFinish={returnMedia}
            >
                <Form.Item
                    label="Thumbnail"
                    name="thumbnail"
                >
                    <Upload
                        {...uploadPropsThumbnail}
                    >
                        {(thumbnailList.length === 0)
                            &&
                            <Button type="text" style={{ fontSize: "20px", background: "transparent" }}
                                shape="circle" icon={<CloudUploadOutlined style={{ fontSize: "20px" }} />} />
                        }
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Images"
                    name="image"
                >
                    <Upload
                        {...uploadPropsImage}
                    >
                        <Button type="text" style={{ fontSize: "20px", background: "transparent" }}
                            shape="circle" icon={<CloudUploadOutlined style={{ fontSize: "20px" }} />}
                        />
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Video"
                    name="video"
                >
                    <Upload
                        {...uploadPropsVideo}
                    >
                        {(videoList.length === 0)
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

export default CreateListingMedia;