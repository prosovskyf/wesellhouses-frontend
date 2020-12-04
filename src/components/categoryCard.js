import React from 'react';
import { Card } from 'antd';
const { Meta } = Card

/**
 * Component of actual category card used in categories grid
 * @category Categories
 * @component
 */
function Category(props) {
    return (
        <Card
            style={{ width: 320 }}
            cover={props.img}
            hoverable={true}>
            <Meta
                style={{ textAlign: "center" }}
                title={<b>{props.name}</b>} />
                <p>{props.description}</p>
        </Card>
    );
}

export default Category;