import React from 'react';
import { Card, Divider } from 'antd';
import LinesEllipsis from 'react-lines-ellipsis'
const { Meta } = Card

/**
 * Component of property card used in PropertiesGrid
 * @category Properties
 * @component
 */
function PropertyCard(props) {
    return (
        <Card
            style={{ width: 420 }}
            cover={props.img}
            hoverable={true}>
            <Meta
                title={props.title}
            />
            <Divider />
            <LinesEllipsis
                text={props.description}
                maxLine='3'
                ellipsis='...'
                trimRight
                basedOn='letters'
            />
            <br />
            <p>Location:{props.location}</p>
            <h3>Price: {props.price}£</h3>
        </Card>
    );
}

export default PropertyCard;