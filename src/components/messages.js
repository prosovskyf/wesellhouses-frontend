import React, { useEffect, useState } from 'react';
import { Col, List, Avatar, Divider, Radio } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom";
import { useAuth } from "../context/user";
import { getThreads, getArchivedThreads } from './messagesFunctions'
import Loader from './loader'

/**
 * Component to show message threads for specific user
 * @category Messaging
 * @component
 */
function Messages() {
    const [threads, setThreads] = useState([]);
    const [statusCode, setStatusCode] = useState()
    const [buttonValue, setButtonValue] = useState('main')
    const [uri, setUri] = useState('messages')
    const { authUser } = useAuth();
    /** Get message threads based on button archived/messages */
    async function getMessageThreads() {
        let messages;
        if (buttonValue === 'archived') {
            setUri('messages/archive')
            messages = await getArchivedThreads(authUser.token)
        }
        else {
            setUri('messages')
            messages = await getThreads(authUser.token)
        }

        if (messages.status === 200) {
            setStatusCode(messages.status)
            setThreads(messages.body)
        }
        else {
            setStatusCode(messages.status)
        }

    }
    /** Button to change value */
    function onChange(e) {
        const { value } = e.target;
        setButtonValue(value)
        setThreads([])
    };
    /** Call getMessageThread when button value changes */
    useEffect(() => {
        getMessageThreads();
    }, [buttonValue])

    const options = [
        { label: 'Main', value: 'main' },
        { label: 'Archived', value: 'archived' },
    ];

    return (
        <>
            <br />
            <Col span={10} offset={7} style={{ borderStyle: "groove" }}>
                <h1>Your messages</h1>
                <Radio.Group
                    defaultValue={buttonValue}
                    options={options}
                    onChange={onChange}
                    value={buttonValue}
                    optionType="button"
                    buttonStyle="solid"
                    style={{ float: "right" }}
                />
                <Divider />
                {((threads) && (threads.length > 0))
                    ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={threads}
                            renderItem={thread => (
                                <Link to={`/${uri}/${thread.id}`}>
                                    <List.Item>
                                        <List.Item.Meta
                                            style={{ paddingLeft: "30px" }}
                                            avatar=
                                            {authUser.role === 'agent'
                                                ? <Avatar icon={<UserOutlined />}
                                                    src={`${process.env.REACT_APP_BACKEND}/public/avatars/agent_${thread.user_name}.png`} />
                                                : <Avatar icon={<UserOutlined />}
                                                    src={`h${process.env.REACT_APP_BACKEND}/public/avatars/agent_${thread.agent_name}.png`} />
                                            }
                                            title={thread.subject + ` with: ` + (authUser.role === 'agent'
                                                ? thread.user_name : thread.agent_name)}
                                            description={`Last message date: ` +
                                                thread.updated_time.replace('Z', ' ').replace('T', ' ')
                                            }
                                        />
                                    </List.Item>
                                </Link>
                            )}
                        />
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