import React, { useState } from 'react';
import { message, Button, Form, Input, Typography } from 'antd';
import { getPriceInfo } from './createListingZooplaFunctions'
const { Text } = Typography;

/**
 * Component to check historical prices for location for property in property creation process
 * @category Properties
 * @component
 */

function CreateListingZoopla(props) {
    const token = props.token
    const [zooplaData, setZooplaData] = useState({})
    /** Get zoopla data from backend, set state */
    async function returnZoopla(zip) {
        let result = await getPriceInfo(token, zip);
        if (result.status === 200) {
            setZooplaData(result.body)
        }
        else {
            message.error('Problem occured, try again', 2)
        }
    };
    /** Button to hide data */
    function hideData() {
        setZooplaData({})
    };

    return (
        <>
            <div style={{ textAlign: "left" }}>
                <h3>Check average historical prices by location</h3>
                <Form
                    name="property"
                    onFinish={returnZoopla}
                >
                    <Form.Item
                        label="Zipcode"
                        name="postcode"
                        rules={[
                            {
                                required: true,
                                message: "Enter zip code!"
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <div style={{ textAlign: "center" }}>
                        {Object.keys(zooplaData).length > 0
                            &&

                            <Button type="dashed" htmlType="submit" onClick={hideData}>
                                Hide
                            </Button>
                        }
                        <Button type="primary" htmlType="submit">
                            Show
                        </Button>
                    </div>
                </Form>
            </div>
            {Object.keys(zooplaData).length > 0
                &&
                <>
                    <Text strong>Zipcode: </Text> <p>{zooplaData.postcode}</p>
                    <Text strong>County: </Text> <p>{zooplaData.county}</p>
                    <Text strong>Turnover: </Text> <p>{zooplaData.turnover}</p>
                    <Text strong>Average sold price - 1 Year: </Text> <p>{zooplaData.average_sold_price_1year}£</p>
                    <Text strong>Average sold price - 3 Years: </Text> <p>{zooplaData.average_sold_price_3year}£</p>
                    <Text strong>Average sold price - 5 Years: </Text> <p>{zooplaData.average_sold_price_5year}£</p>
                    <Text strong>Average sold price - 7 Years: </Text> <p>{zooplaData.average_sold_price_7year}£</p>
                    <Text strong>Number of sales - 1 Year: </Text> <p>{zooplaData.number_of_sales_1year}</p>
                    <Text strong>Number of sales - 3 Years: </Text> <p>{zooplaData.number_of_sales_3year}</p>
                    <Text strong>Number of sales - 5 Years: </Text> <p>{zooplaData.number_of_sales_5year}</p>
                    <Text strong>Number of sales - 7 Years: </Text> <p>{zooplaData.number_of_sales_7year}</p>
                </>
            }

        </>
    )
}
export default CreateListingZoopla;