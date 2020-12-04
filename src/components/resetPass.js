import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
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
 * Component for showing reset password form
 * @category User profile
 * @component
 */
function ResetPassword() {
    const [isLoading, setLoading] = useState(false)
    const [statusCode, setStatusCode] = useState()
    const [alert, setAlert] = useState()

    let history = useHistory();
    /** Display message and do actions based on status after reset password */
    useEffect(() => {
        if (isLoading) {
            if ((typeof alert != "undefined") && (statusCode === 200)) {
                message.success(alert, 7)
                setAlert()
                setStatusCode()
                history.push('/')
            }
            else if ((typeof alert != "undefined") && (statusCode !== 200)) {
                setLoading(false)
                message.error(alert, 3)
                setAlert()
                setStatusCode()
            }
        }
    }, [alert, statusCode])
    /** Reset password function */
    async function reset(data) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch(`${process.env.REACT_APP_API_URL}/login/reset`, options)
            .then(res => {
                setStatusCode(res.status)
                res.text().then(msg => setAlert(msg))
            })
            .catch(err => message.error('error occured'));
    }
    /** Set loading to true and call reset() */
    async function onSubmit(data) {
        setLoading(true)
        await reset(data)
    }

    return (
        <>
            <br />
            <div style={{ textAlign: "center" }}>
                <h1 style={{ textAlign: "center" }}>Reset your password</h1>
            </div>
            <br />
            <Form
                {...layout}
                name="basic"
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Username/Email"
                    name="user"
                    rules={[
                        {
                            required: true,
                            message: 'Enter username or email!',
                        },
                    ]}>
                    <Input />
                </Form.Item>

                <div style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Submit
                    </Button>
                </div>

            </Form>

        </>
    );
};

export default ResetPassword;