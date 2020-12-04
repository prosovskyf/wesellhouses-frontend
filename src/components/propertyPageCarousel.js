import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/file'
import { Button, Modal } from 'antd';
import { Carousel } from 'antd';
import "antd/lib/carousel/style/index.css";
import { FullscreenOutlined, LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'
import { getMediaNames } from './propertyPageFunctions'

/**
 * Component to show carousel of images or video, depend of selected value of button
 * Also reconfigured antd carousel and added button for modal to open image in large scale carousel
 * @category Properties
 * @component
 */
function PropertyPageCarousel(props) {
    const [visible, setVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState([]);

    var url;
    var button = props.value
    button === 'images'
        ? url = props.image_url
        : url = props.video_url
    /** Close carousel with images */
    function handleClose() {
        setVisible(false);
    }
    /** Show carousel with images */
    function handleShow() {
        setVisible(true);
    }
    /** Get media names and set states Images and Video */
    async function getFileNames() {
        if (url != null) {
            let data = await getMediaNames(url);
            if (data.status === 200) {
                if (button === 'images') {
                    setImages(data.body)
                }
                else {
                    setVideo(data.body)
                }
            }
        }
    }
    /** On mount and when url changes, call getFileNames */
    useEffect(() => {
        getFileNames();
    }, [url])

    if ((button === 'images') && (images.length > 0)) {
        /** Map gallery */
        var propertyImages = images.map(image => {
            let escUrl = url.replace(/\./, '');
            return (
                <img className="carImg" alt="gallery" key={image.id}
                    src={`${process.env.REACT_APP_BACKEND}${escUrl}${image.name}`} />)
        })
    }
    else if ((button === 'video') && (video.length > 0)) {
        var player = video.map(vid => {
            let escUrl = url.replace(/\./, '');
            return (<ReactPlayer url={`${process.env.REACT_APP_BACKEND}${escUrl}${vid.name}`}
                controls={true} width="100%" height="50%" />)
        })
    }
    const gallery = (
        <>
            <Carousel arrows nextArrow={<RightCircleOutlined />} prevArrow={<LeftCircleOutlined />} draggable={true} className="car">
                {(images.length > 0)
                    ? propertyImages
                    : <div className="placeholder" />}
            </Carousel>
            <Button icon={<FullscreenOutlined />}
                style={{ float: "right", background: "transparent", top: "-33px", left: "-2px", color: "blue" }}
                onClick={handleShow} />
        </>)

    return (
        <>
            {button === 'images'
                ? gallery
                : player}
            <Modal
                visible={visible}
                onCancel={handleClose}
                footer={null}
                width={800}
                height={400}
            >
                {button === 'images'
                    ? gallery
                    : player}
            </Modal>
        </>
    );
}

export default PropertyPageCarousel;