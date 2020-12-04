import React, { useEffect, useState } from 'react';
import { Result, message, Button, Form, Input } from 'antd'
import { useHistory } from "react-router-dom";

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 8,
    },
};

/**
 * Component to show form for change password after reset
 * @category User profile
 * @component
 */
function ResetPassWindow(props) {
    const [statusCode, setStatusCode] = useState()
    const [alert, setAlert] = useState()
    const [text, setText] = useState()
    const [query, setQuery] = useState()
    const [isLoading, setLoading] = useState()
    let history = useHistory();
    /** Change user password */
    async function changepass(data) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch(`${process.env.REACT_APP_API_URL}/verification/changepass/?${query}`, options)
            .then(res => {
                setStatusCode(res.status)
                res.text().then(msg => setAlert(msg))
            })
            .catch(err => message.error('Error occured'));
    }
    /** On mount, determine status from props and do actions based on that */
    useEffect(() => {
        if (props.status === 400) {
            setLoading(false)
            setText(props.message)
            setTimeout(() => {
                history.push('/')
            }, 5000)
        }
        else if (props.status !== 200) {
            setLoading(false)
            setText(props.message)
        }
        else if (props.status === 200) {
            setLoading(false)
            setText(props.message)
            setQuery(props.query)
        }
    }, [])
    /** When alert or statusCode changes, show message based on statusCode */
    useEffect(() => {
        if ((typeof alert != "undefined") && (statusCode === 200)) {
            message.success(alert, 7)
            history.push('/login')
        }
        else if ((typeof alert != "undefined") && (statusCode !== 200)) {
            message.error(alert, 3)
        }
    }, [alert, statusCode])
    /** Call changepass() on submit */
    async function onSubmit(data) {
        setLoading(true)
        delete data.repeatpassword
        await changepass(data)
    }
    return (
        <>
            <div style={{ textAlign: "center" }}>
                <Result
                    status="warning"
                    title={text}
                >
                    <br />
                    <div style={{ textAlign: "center" }}>
                        <h1 style={{ textAlign: "center" }}>Reset your password</h1>
                        <br />
                    </div>
                    <br />
                    <Form
                        {...layout}
                        name="basic"
                        onFinish={onSubmit}
                    >
                        <nobr>

                            <Form.Item
                                label="Password"
                                name="secret"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    () => ({
                                        validator(rule, value) {
                                            let format = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
                                            if (!value || format.test(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Password is not strong enough!');
                                        },
                                    }),
                                ]}
                            >

                                <Input.Password />
                            </Form.Item>
                        </nobr>
                        <Form.Item
                            label="Repeat password"
                            name="repeatpassword"
                            dependencies={['secret']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Repeat password',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('secret') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <div style={{ textAlign: "center" }}>
                            <br /><br />
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Reset password
                    </Button>
                        </div>
                    </Form>
                </Result>
            </div>
        </>


    );
}
export default ResetPassWindow;