import React, { useState } from 'react';
import { Form, Input, Button, message, Divider } from 'antd';
import { sendFirstMessage } from './propertyPageFunctions'

/**
 * Component to show modal on click and send first message to agent's property
 * @category Properties
 * @component
 */
function PropertyPageAgentContact(props) {
    const [isLoadingButton, setLoadingButton] = useState(false)
    /** Send first message to agent from property page */
    async function sendMessage(data) {
        if (data.message) {
            setLoadingButton(true)
            let res = await sendFirstMessage(props.user.token, props.property.id, data.message)
            if (res.status === 201) {
                message.success(res.body, 3)
            }
            else {
                message.error(res.body, 3)
            }
            setLoadingButton(false)
            props.visible(true)
        }
        else {
            message.error('Cannot send blank message!', 2)
        }
    }

    return (
        <>
            {props.agent.firstname || props.agent.lastname
                ?
                <h3 style={{ textAlign: "center" }}>
                    Message to: {props.agent.firstname + ' ' + props.agent.lastname}</h3>
                :
                <h3 style={{ textAlign: "center" }}>
                    Contact agent</h3>
            }
            <Divider />
            <Form
                name="message"
                onFinish={sendMessage}
                layout="vertical"
            >
                <Form.Item
                    label="Subject"
                    name="subject"
                >
                    <h3>{props.property.title}</h3>
                </Form.Item>

                <Form.Item
                    label="Message"
                    name="message"
                >
                    <Input.TextArea autoSize={{ maxRows: 6, minRows: 3 }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isLoadingButton}>
                        Send message
                                </Button>
                </Form.Item>
            </Form>
        </>
    )
};

export default PropertyPageAgentContact;