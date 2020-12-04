import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useHistory } from "react-router-dom";
import { useAuth, logout } from "../context/user";
import { changePass } from './changePassFunctions'

const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 4,
    },
};

/**
 * Component to change user password form
 * @category User profile
 * @component
 */
function ChangePassword() {
    const { authUser } = useAuth();
    const [isLoading, setLoading] = useState(false)

    let history = useHistory();
    /** Submit user entered data and check result status, if 200 redirect to home */
    async function onSubmit(data) {
        setLoading(true)
        delete data.repeatpassword
        let result = await changePass(authUser.token, data)
        if (result.status === 200) {
            setLoading(false)
            message.success(result.body, 3)
            logout();
            history.push('/login')
            window.location.reload();
        }
        else if (result.status >= 400) {
            setLoading(false)
            message.error(result.body, 3)
        }
    }

    return (
        <>
            <br />
            <h1 style={{ textAlign: "center" }}>Change you password</h1>
            <br />
            <Form
                {...layout}
                name="basic"
                onFinish={onSubmit}
            >
                <Form.Item
                    label="Current password"
                    name="currentPassword"
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="New password"
                    name="newPassword"
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
                <Form.Item
                    label="Repeat password"
                    name="repeatpassword"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Repeat password',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('newPassword') === value) {
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
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Submit
                    </Button>
                </div>
            </Form>

        </>
    );
};

export default ChangePassword;