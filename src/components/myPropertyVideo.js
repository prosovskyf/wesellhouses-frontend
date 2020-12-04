import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/file'
import { useParams } from "react-router-dom";
import { getMediaNames } from './propertyPageFunctions'
import { deleteVideo } from './myPropertyFunctions'
import { Upload, message, Row, Button } from 'antd';
import { CloudUploadOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from "../context/user";

/**
 * Component to view and upload video for specific agent's property
 * @category Properties
 * @component
 */
function MyPropertyVideo(props) {
    const { authUser } = useAuth();
    const { id } = useParams();
    const [video, setVideo] = useState([]);
    const [isUploading, setUploading] = useState(false)
    const { property_id, video_url } = props
    /** Get media names */
    async function getFileNames() {
        if (video_url != null) {
            var vid = await getMediaNames(video_url);
            if (vid.status === 200) {
                setVideo(vid.body)
            }
            else {
                setVideo([])
            }
        }
    }
    /** Delete video */
    async function deleteVid(video_name) {
        let res = await deleteVideo(authUser.token, property_id, video_name)
        if (res.status === 200) {
            getFileNames()
            message.success(res.body, 2)
        }
    }
    /** Call getFileNames on mount and when video_url changes */
    useEffect(() => {
        getFileNames();
    }, [video_url])

    var mappedVideo = [];
    if ((video_url != null) && (video.length > 0)) {
        /** Map Video */
        mappedVideo = video.map(video => {
            let escUrl = video_url.replace(/\./, '');
            return (
                <div style={{ padding: "10px" }} key={video.id}>
                    <ReactPlayer url={`${process.env.REACT_APP_BACKEND}${escUrl}${video.name}`}
                        controls={true} width="100%" height="50%" />
                    <Button size="small" onClick={() => deleteVid(video.name)}
                        icon={<DeleteOutlined />}
                        type="text" style={{ background: "transparent" }} />
                </div>
            )
        })
    }

    const uploadPropsVideo = {
        name: 'video',
        method: 'PUT',
        action: `${process.env.REACT_APP_API_URL}/files/upload/property/video`,
        headers: {
            "Authorization": "Bearer " + authUser.token,
            property_id: id
        },
        showUploadList: false,
        beforeUpload(file) {
            setUploading(true)
            const isMp4 = file.type === 'video/mp4';
            if (!isMp4) {
                setUploading(false)
                message.error('You can only upload only video in MP4 format!');
                return isMp4
            }
        },
        onChange(info) {
            if (info.file.status === 'done') {
                (async () => { await props.onMediaChange(Math.random()); })()
                getFileNames()
                setUploading(false)
                message.success('Video uploaded', 1);

            } else if (info.file.status === 'error') {
                setUploading(false)
                message.error('Video upload failed.', 3);
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
                Video:
            </Row>
            <Row type="flex">
                {mappedVideo}
                {((typeof mappedVideo == 'undefined') || (mappedVideo.length === 0))
                    && <Upload
                        {...uploadPropsVideo}
                    >
                        <Button type="text" style={{ fontSize: "20px", background: "transparent" }}
                            shape="circle" icon={uploadingIcon} />
                    </Upload>

                }
            </Row>
        </>
    );
}
export default MyPropertyVideo;