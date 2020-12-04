import React, { useEffect, useState } from 'react';
import { Divider, Avatar, Col, Button, message, Modal } from 'antd';
import { useAuth } from "../context/user";
import { UserOutlined } from '@ant-design/icons'
import PropertyPageAgentContact from './propertyPageAgentContact'

/**
 * Component to show agent's info on property page
 * Sub components: PropertyPageAgentContact
 * @category Properties
 * @component
 */
function PropertyPageAgent(props) {
    const [avatar, setAvatar] = useState()
    const [visible, setVisible] = useState(false)
    const { authUser } = useAuth();
    /** Set agent avatar on property page */
    useEffect(() => {
        if (props.agent.picture_url) {
            var escUrl = props.agent.picture_url.replace(/\./, '');
        }
        setAvatar(<Avatar size={100} icon={<UserOutlined />}
            src={`${process.env.REACT_APP_BACKEND}${escUrl}`} />)

    }, [props.agent.picture_url])
    /** On click to contact agent, determine user role.
     * Only if user, open modal
     */
    function contactAgent() {
        if (authUser) {
            if (authUser.role === 'agent') {
                message.error('You cannot contact another agent, you need user profile', 4)
            }
            else {
                setVisible(true)
            }
        }
        else {
            message.error('You need to be logged in to contact agent', 4)
        }
    }
    /** Close modal */
    function onCancel(e) {
        setVisible(!e)
    }

    return (
        <>
            <Divider />
            <Col span={8}>
                {avatar}
                <br />
                <br />
                <br />
                <Button type="primary" htmlType="button" onClick={contactAgent}>
                    Contact agent
                    </Button>
            </Col>
            <Col span={16} style={{ textAlign: "left" }}>
                <h2>Agent info</h2>
                <Divider />
                {((props.agent.firstname != null) || (props.agent.lastname != null))
                    && <p><b>Name:</b> {props.agent.firstname + ' ' + props.agent.lastname} </p>}
                {(props.agent.about != null)
                    && <p><b>About:</b> {props.agent.about}</p>}
                <p><b>e-mail:</b> {props.agent.email}</p>
                {(props.agent.phone != null)
                    && <p><b>Phone Number:</b> {props.agent.phone}</p>}
            </Col>
            <Modal
                title="Message"
                visible={visible}
                onCancel={onCancel}
                footer={null}
            >
                {< PropertyPageAgentContact property={props.property} agent={props.agent}
                    user={authUser} visible={onCancel} />}
            </Modal>
        </>
    );
}

export default PropertyPageAgent;