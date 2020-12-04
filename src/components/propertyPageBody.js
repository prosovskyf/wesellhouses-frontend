import React, { useEffect, useState } from 'react';
import { Divider } from 'antd';
import Loader from './loader'

/**
 * Component to list all information about property
 * @category Properties
 * @component
 */
function PropertyPageBody(props) {
    const [features, updateFeatures] = useState([props.property.features])
    /** Set state for displaying features based on length */
    useEffect(() => {
        if ((props.property.features) && (props.property.features.length > 1)) {
            updateFeatures(props.property.features.join(", "))
        }
        else {
            updateFeatures(props.property.features)
        }
    }, [props.property.features])

    if (props.property.length <= 0) {
        return <Loader />
    }

    return (
        <>
            <div style={{ textAlign: "left", paddingLeft: "50px" }}>
                <Divider />
                <h1>{props.property.title}</h1>
                <Divider />
                <p><b>Description:</b> {props.property.description}</p>
                <p><b>Features:</b> {features}</p>
                <p><b>Address:</b> {props.property.location}</p>
                <h3><b>Price:</b> {props.property.price}£</h3>
            </div>
        </>
    );
}

export default PropertyPageBody;