import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Avatar, Upload } from 'antd';
import { UserOutlined, EditFilled, LoadingOutlined } from '@ant-design/icons'
import { useAuth } from "../context/user";
import { getProfileData, updateProfileData } from './userProfileFunctions'

const layout = {
    labelCol: {
        span: 9,
    },
    wrapperCol: {
        span: 6,
    },
};

/**
 * Component to show and allow edits in profile and change user avatar
 * @category User profile
 * @component
 */
function UserProfile() {
    const [profileData, setProfileData] = useState()
    const [isLoading, setLoading] = useState(false)
    const [isLoadingButton, setLoadingButton] = useState(false)
    const { authUser } = useAuth();
    /** Load user profile data and set state */
    async function loadProfile() {
        var result = (await getProfileData(authUser.token)).body[0]
        delete result.picture_url
        setProfileData(result)
    }
    /** Update profile with data supplied in form and show message after */
    async function updateProfile(data) {
        setLoadingButton(true)
        var result = await updateProfileData(authUser.token, data)
        if (result.status === 201) {
            setLoadingButton(false)
            message.success('Your profile was updated!', 3);
            setProfileData(result.body[0])
        }
        else {
            message.error('Please check your values and try again!');
            setLoadingButton(false)
        }
    }
    /** On mount and when profileData state changes, call loadProfile() */
    useEffect(() => {
        loadProfile()
    }, [profileData])

    const uploadProps = {
        name: 'avatar',
        method: 'PUT',
        action: `${process.env.REACT_APP_API_URL}/user/avatar`,
        headers: {
            "Authorization": "Bearer " + authUser.token
        },
        showUploadList: false,
        beforeUpload(file) {
            setLoading(true)
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                setLoading(false)
                message.error('You can only upload JPG/PNG file!');
                return isJpgOrPng
            }
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success('Picture was changed successfully', 3);
                setLoading(false)
                window.location.reload();

            } else if (info.file.status === 'error') {
                message.error('File upload failed.', 3);
            }
        }
    }

    var uploadingIcon;
    isLoading
        ? uploadingIcon = <LoadingOutlined />
        : uploadingIcon = <EditFilled style={{ fontSize: "12px" }} />

    return (
        <>
            {profileData
                && (
                    <>
                        <br />
                        <div style={{ textAlign: "center" }} className={layout}>
                            <h1 style={{ textAlign: "center" }}>Hello {authUser.username}</h1>
                            <Avatar size={120} icon={<UserOutlined />}
                                src={`${process.env.REACT_APP_BACKEND}/public/avatars/agent_${authUser.username}.png`} />
                            {' '}
                            <Upload {...uploadProps}>
                                <Button type="text" style={{ bottom: "40px", fontSize: "10px", background: "transparent" }}
                                    shape="circle" icon={uploadingIcon} />

                            </Upload>
                        </div>
                        <br />
                        <Form
                            {...layout}
                            name="userinfo"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                            >
                                <Input disabled defaultValue={profileData.username} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                            >
                                <Input disabled defaultValue={profileData.email} />
                            </Form.Item>
                        </Form>
                        <Form
                            {...layout}
                            name="profile"
                            initialValues={{
                                firstname: profileData.firstname,
                                lastname: profileData.lastname,
                                about: profileData.about,
                                phone: profileData.phone
                            }}
                            onFinish={updateProfile}
                        >
                            <Form.Item
                                label="First name"
                                name="firstname">
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Last name"
                                name="lastname"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="About"
                                name="about"
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Phone"
                                name="phone"
                            >
                                <Input />
                            </Form.Item>
                            <div style={{ textAlign: "center" }}>
                                <Button type="primary" htmlType="submit" loading={isLoadingButton}>
                                    Update your profile
                    </Button>
                            </div>


                        </Form>
                    </>
                )}
        </>
    );
};

export default UserProfile;