import React, { useEffect, useState } from 'react';
import { Col, List, Avatar, Divider, Button, Input, Form, message, Popconfirm, Space } from 'antd'
import { UserOutlined, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons'
import { useLocation, useParams, useHistory } from "react-router-dom";
import { useAuth } from "../context/user";
import {
    getMessages,
    getArchivedMessages,
    sendMessage,
    archiveThread,
    unarchiveThread,
    deleteThread,
} from './messagesFunctions'
import Loader from './loader'

/**
 * Component to show messages after thread selection
 * @category Messaging
 * @component
 */
function Messages() {
    const [messages, setMessages] = useState();
    const [thread, setThread] = useState()
    const [statusCode, setStatusCode] = useState();
    const [change, setChange] = useState(0);
    const { authUser } = useAuth();
    let location = useLocation();
    let history = useHistory();
    const { id } = useParams();
    const [form] = Form.useForm();
    /** Load all messages in specific thread */
    async function loadMessages() {
        let res;
        if (location.pathname.includes('/messages/archive/')) {
            res = await getArchivedMessages(authUser.token, id)
        }
        else {
            res = await getMessages(authUser.token, id)
        }
        if (res.status === 200) {
            setStatusCode(res.status)
            setThread(res.body.thread)
            setMessages(res.body.messages)

            var scroll = document.getElementById('scrollDiv');
            if (scroll != null) {
                scroll.scrollTop = scroll.scrollHeight;
            }
        }
        else {
            setStatusCode(res.status)
        }
    }
    /** Unarchive thread */
    async function unarchive() {
        let res = await unarchiveThread(authUser.token, id)
        if (res.status === 200) {
            message.success(res.body, 2)
            history.push('/messages')
        }
        else {
            message.error(res.body, 2)
        }
    }
    /** Archive thread */
    async function archive() {
        let res = await archiveThread(authUser.token, id)
        if (res.status === 200) {
            message.success(res.body, 2)
            history.push('/messages')
        }
        else {
            message.error(res.body, 2)
        }
    }
    /** Delete thread and messages for specific user */
    async function deleteAllMessages() {
        let res = await deleteThread(authUser.token, id)
        if (res.status === 200) {
            message.success(res.body, 2)
            history.push('/messages')
        }
        else {
            message.error(res.body, 2)
        }
    }
    /** Send message */
    async function submitMessage(data) {
        if (data.msg.length > 0) {
            let res = await sendMessage(authUser.token, data.msg, id)
            if (res.status === 400) {
                message.error(res.body, 1)
            }
            else {
                form.resetFields();
                setChange(Math.random())
            }
        }
        else {
            message.error('Cannot send blank message', 1)
        }
    }
    /** Call load messages on change or location */
    useEffect(() => {
        loadMessages();
    }, [change, location])

    return (
        <>
            <div style={{ float: "left", padding: "10px" }}>
                <Button type="text" style={{ background: "transparent" }}
                    shape="circle" icon={<ArrowLeftOutlined style={{ fontSize: "30px" }} />}
                    onClick={() => history.push('/messages')} />
            </div>
            <br />
            <Col span={12} offset={6} style={{
                backgroundImage: "linear-gradient(#e4e4e4, #f0f0f0 30%)",
                borderStyle: "groove"
            }}>
                {messages && thread
                    ? (
                        <>
                            <h1 style={{ textAlign: "left" }}>{thread.subject}</h1>
                            <div style={{ float: "right" }}>
                                <Space>
                                    {authUser.username === thread.agent_name
                                        ? thread.archived_agent
                                            ? <Button type="primary" onClick={unarchive}>Unarchive</Button>
                                            : <Button type="primary" onClick={archive}>Archive</Button>
                                        : thread.archived_user
                                            ? <Button type="primary" onClick={unarchive}>Unarchive</Button>
                                            : <Button type="primary" onClick={archive}>Archive</Button>}
                                    <Popconfirm
                                        title="Are you sure you want to delete conversation?"
                                        onConfirm={deleteAllMessages}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="danger">Delete</Button>
                                    </Popconfirm>
                                </Space>
                            </div>
                            <Divider />
                            <div id={'scrollDiv'} style={{ maxHeight: "400px", overflow: "auto" }}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={messages}
                                    renderItem={(message, index) => (
                                        <List.Item
                                            key={index}
                                            extra={`From: ${message.author}`}
                                            style={{ paddingRight: "30px" }}>

                                            <List.Item.Meta
                                                style={{ paddingLeft: "5px" }}
                                                avatar={
                                                    <Avatar icon={<UserOutlined />}
                                                        src={`${process.env.REACT_APP_BACKEND}/public/avatars/agent_${message.author}.png`} />}
                                                title={message.message}
                                                description={`Date: ` +
                                                    message.date.replace('Z', ' ').replace('T', ' ')
                                                }
                                            />

                                        </List.Item>
                                    )}
                                />
                            </div>
                            <Form
                                name="message"
                                onFinish={submitMessage}
                                form={form}
                            >
                                <Form.Item
                                    name="msg"
                                >
                                    <Input id="msg" bordered={true}
                                        placeholder="Write message"
                                        autoComplete="false"
                                        addonAfter={
                                            <Button
                                                type="text" style={{
                                                    height: "10px",
                                                    background: "transparent",
                                                }}
                                                icon={<SendOutlined />}
                                                htmlType="submit" />
                                        } />
                                </Form.Item>
                            </Form>
                        </>
                    )
                    : (statusCode === 404)
                        ? 'No messages'
                        : <Loader />
                }
            </Col>
        </>
    );
}

export default Messages;