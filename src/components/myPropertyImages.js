import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { getMediaNames } from './propertyPageFunctions'
import { deleteImage } from './myPropertyFunctions'
import { Upload, message, Row, Button } from 'antd';
import { CloudUploadOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from "../context/user";

/**
 * Component to view and upload images for specific agent's property
 * @category Properties
 * @component
 */
function MyPropertyImages(props) {
    const { authUser } = useAuth();
    const { id } = useParams();
    const [images, setImages] = useState([])
    const [isUploading, setUploading] = useState(false)
    const { image_url, property_id } = props
    /** Get media names from backend */
    async function getFileNames() {
        if (image_url != null) {
            var img = await getMediaNames(image_url);
            if (img.status === 200) {
                setImages(img.body)
            }
            else {
                setImages([])
            }
        }
    }
    /** Delete photo function */
    async function deletePhoto(img_name) {
        let res = await deleteImage(authUser.token, property_id, img_name)
        if (res.status === 200) {
            getFileNames()
            message.success(res.body, 2)
        }
    }
    /** Call getFileNames on mount and when image_url changes */
    useEffect(() => {
        getFileNames();
    }, [image_url])

    var thumbnail = [];

    var propertyImages;
    if ((image_url != null) && (images.length > 0)) {

        var mapThumbnail = images.filter(image => {
            return image.name.includes('thumbnail')
        })
        var mapPropertyImages = images.filter(image => {
            return image.name.includes('image')
        })
        /** Map thumbnail */
        thumbnail = mapThumbnail.map(image => {
            let escUrl = image_url.replace(/\./, '');
            return (
                <div style={{ padding: "10px" }} key={image.id}>
                    <img className="Img" alt="gallery" width={140} height={140}
                        src={`${process.env.REACT_APP_BACKEND}${escUrl}${image.name}`} />
                    <Button size="small" onClick={() => deletePhoto(image.name)}
                        icon={<DeleteOutlined />}
                        type="text" style={{ background: "transparent" }} />
                </div>
            )
        })
        /** Map images */
        propertyImages = mapPropertyImages.map(image => {
            let escUrl = image_url.replace(/\./, '');
            return (
                <div style={{ padding: "10px" }} key={image.id}>
                    <img className="Img" alt="gallery" width={140} height={140}
                        src={`${process.env.REACT_APP_BACKEND}${escUrl}${image.name}`} />
                    <Button size="small" onClick={() => deletePhoto(image.name)}
                        icon={<DeleteOutlined />}
                        type="text" style={{ background: "transparent" }} />
                </div>
            )
        })
    }

    const uploadPropsThumbnail = {
        name: 'thumbnail',
        method: 'PUT',
        action: `${process.env.REACT_APP_API_URL}/files/upload/property/images`,
        headers: {
            "Authorization": "Bearer " + authUser.token,
            property_id: id
        },
        showUploadList: false,
        beforeUpload(file) {
            setUploading(true)
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                setUploading(false)
                message.error('You can only upload JPG/PNG file!');
                return isJpgOrPng
            }
        },
        onChange(info) {
            if (info.file.status === 'done') {
                if (image_url === null) {
                    (async () => { await props.onMediaChange(Math.random()); })()
                }
                else {
                    getFileNames()
                }
                setUploading(false)
                message.success('Picture uploaded', 1);

            } else if (info.file.status === 'error') {
                setUploading(false)
                message.error('File upload failed.', 3);
            }
        }
    }

    const uploadPropsImages = {
        name: 'image',
        multiple: true,
        method: 'PUT',
        action: `${process.env.REACT_APP_API_URL}/files/upload/property/images`,
        headers: {
            "Authorization": "Bearer " + authUser.token,
            property_id: id
        },
        showUploadList: false,
        beforeUpload(file) {
            setUploading(true)
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                setUploading(false)
                message.error('You can only upload JPG/PNG file!');
                return isJpgOrPng
            }
        },
        onChange(info) {
            if (info.file.status === 'done') {
                if ((image_url === null) && (info.file[0]))  {
                    (async () => { await props.onMediaChange(Math.random()); })()
                }
                else {
                    getFileNames()
                }
                setUploading(false)
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
            <br />
            <Row>
                Thumbnail:
            </Row>
            <Row type="flex">
                {thumbnail}
                {((typeof thumbnail == 'undefined') || (thumbnail.length === 0))
                    && <Upload
                        {...uploadPropsThumbnail}
                    >
                        <Button type="text" style={{ fontSize: "20px", background: "transparent" }}
                            shape="circle" icon={uploadingIcon} />
                    </Upload>

                }
            </Row>
            <br />
            <Row>
                Images:
            </Row>
            <Row type="flex">
                {propertyImages}
                <Upload
                    {...uploadPropsImages}
                >
                    <Button type="text" style={{ fontSize: "20px", background: "transparent" }}
                        shape="circle" icon={uploadingIcon} />
                </Upload>
            </Row>
        </>
    );
}
export default MyPropertyImages;