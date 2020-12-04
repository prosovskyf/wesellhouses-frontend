import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Tooltip, message } from 'antd';
import { useHistory } from "react-router-dom";
import { QuestionCircleOutlined } from '@ant-design/icons'

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 8,
    },
};

/**
 * Component to show sign up form and signup user
 * Role is determined by button value, showing signup code input for agent
 * @category User profile
 * @component
 */
function SignupForm() {
    const [buttonValue, setButtonValue] = useState('user')
    const [isLoading, setLoading] = useState(false)
    const [statusCode, setStatusCode] = useState()
    const [alert, setAlert] = useState()
    const [disabled, setDisabled] = useState(false)
    const text = 'Username must be longer than 5 characters. \
                  Email must be in valid format ex: name@domain.com \
                  Password must be minimum 8 char long and contain lower, UPPER cases and special char.'
    let history = useHistory();
    /** Button values User/Agent */
    const options = [
        { label: 'User', value: 'user' },
        { label: 'Agent', value: 'agent' },
    ];
    /** When alert or statusCode changes, show message based on status */
    useEffect(() => {
        if (isLoading) {
            if ((typeof alert != "undefined") && (statusCode === 200)) {
                setDisabled(true)
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
    /** Sign up user */
    async function signup(data) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        await fetch(`${process.env.REACT_APP_API_URL}/signup`, options)
            .then(res => {
                setStatusCode(res.status)
                res.text().then(msg => setAlert(msg))
            })
            .catch(err => message.error('Error occured'));
    }
    /** Set button value */
    function onChange(e) {
        setButtonValue(e.target.value)
    }
    /** Submit form, set loading and call signup() */
    async function onSubmit(data) {
        setLoading(true)
        if (buttonValue === 'user') {
            delete data.code
        }
        delete data.repeatpassword
        await signup(data)
    }

    return (
        <>
            <br />
            <div style={{ textAlign: "center" }}>
                <h1 style={{ textAlign: "center" }}>Sign up with We Sell Houses</h1>
                <br />
                <Radio.Group
                    defaultValue={buttonValue}
                    options={options}
                    onChange={onChange}
                    value={buttonValue}
                    optionType="button"
                    buttonStyle="solid"
                /> {' '}
                <Tooltip placement="right" title={text}>
                    <QuestionCircleOutlined />
                </Tooltip>
            </div>
            <br />
            <Form
                {...layout}
                name="basic"
                onFinish={onSubmit}
            >
                <nobr>
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
                </nobr>
                <nobr>
                    <Form.Item
                        label="Email"
                        name="email"
                        hidden={disabled}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                            () => ({
                                validator(rule, value) {
                                    let format = (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
                                    if (!value || format.test(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Enter valid email address!');
                                },
                            }),
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </nobr>
                <nobr>
                    <Form.Item
                        label="Password"
                        name="password"
                        hidden={disabled}
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
                    dependencies={['password']}
                    hasFeedback
                    hidden={disabled}
                    rules={[
                        {
                            required: true,
                            message: 'Repeat password',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                {buttonValue === 'agent'
                    && <Form.Item
                        label="Signup Code"
                        name="code"
                        hidden={disabled}
                        rules={[
                            {
                                required: false,
                                message: 'Please enter sign-up code',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                }

                <div style={{ textAlign: "center" }}>
                    <a href="/login">Already have an account?</a>
                    <br /><br />
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Submit
                    </Button>
                </div>

            </Form>

        </>
    );
};

export default SignupForm;