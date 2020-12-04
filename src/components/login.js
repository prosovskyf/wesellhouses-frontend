import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Avatar } from 'antd';
import { useHistory } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons'
import { useAuth } from "../context/user";
import FailureWindow from './failureWindow'

const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 4,
    },
};

/**
 * Component to show log in page and process login
 * Subcomponents: FailureWindow
 * @category User profile
 * @component
 */
function LoginForm() {
    const [isLoading, setLoading] = useState(false)
    const [statusCode, setStatusCode] = useState()
    const [alert, setAlert] = useState()
    const [disabled, setDisabled] = useState(false)
    const { setAuthUser } = useAuth();
    let history = useHistory();
    /** Send user entered data to backend for processing */
    async function login(data) {
        const options = {
            method: 'POST',
            headers: {
                "Authorization": "Basic " + btoa(data.username + ":" + data.password)
            },
        };
        await fetch(`${process.env.REACT_APP_API_URL}/login`, options)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(obj => {
                if (obj.status > 300) {
                    setStatusCode(obj.status)
                    setAlert(obj.body.message)
                    setLoading(false)
                }
                else if (obj.status === 200) {
                    setStatusCode(obj.status)
                    setDisabled(true)
                    setAuthUser(obj.body.user);
                    setAlert(obj.body.message)
                }
            })
            .catch(err => {
                message.error('Error occured', 3)
                setLoading(false)
            });
    }
    /** Determine the action based on status code of login() */
    useEffect(() => {
        if (isLoading) {
            if ((typeof alert != "undefined") && (statusCode === 200)) {
                setDisabled(true)
                message.success(alert, 7)
                history.push('/')
            }
            else if ((typeof alert != "undefined") && (statusCode !== 200) && (statusCode !== 409)) {
                setLoading(false)
                message.error(alert, 3)
                setAlert()
                setStatusCode()
            }
            else if (statusCode === 409) {
                setDisabled(true)
            }
        }
    }, [alert, statusCode])
    /** On submit, set loading and call login() */
    async function onSubmit(data) {
        setLoading(true)
        await login(data)
    }

    return (
        <>
            {((statusCode === 409) && (typeof alert != "undefined")) ? (
                <FailureWindow message={alert} status={statusCode} />)
                : (<>
                    <br />
                    <div style={{ textAlign: "center" }} className={layout}>
                        <h1 style={{ textAlign: "center" }}>Log in</h1>
                        <Avatar size={100} icon={<UserOutlined />} />
                    </div>
                    <br />
                    <Form
                        {...layout}
                        name="basic"
                        onFinish={onSubmit}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            hidden={disabled}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            hidden={disabled}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >

                            <Input.Password />
                        </Form.Item>
                        <div style={{ textAlign: "center" }}>
                            <a href="/reset">Forgot your password? Let's reset!</a>
                            <br /><br />
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Submit
                    </Button>
                        </div>
                    </Form>
                </>)}
        </>
    );
};

export default LoginForm;