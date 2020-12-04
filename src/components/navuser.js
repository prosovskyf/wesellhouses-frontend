import React, { useState, useEffect } from 'react';
import { Space, Dropdown, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useHistory } from "react-router-dom";
import { useAuth, logout } from "../context/user";
import NavUserMenu from './navuserMenu'

/**
 * Component to show user avatar with submenu
 * Submenu use NavUserMenu subcomponent
 * @category Navigation
 * @component
 */
function NavLogSign() {
    const { authUser } = useAuth();
    const [avatar, setAvatar] = useState()
    let history = useHistory();
    /** Set avatar on mount, failover to icon UserOutlined */
    useEffect(() => {
        setAvatar(<Avatar size={50} icon={<UserOutlined />}
            src={`${process.env.REACT_APP_BACKEND}/public/avatars/agent_${authUser.username}.png`} />)
    }, [])
    /** Log out user */
    function redirectLogout() {
        logout();
        history.push('/')
        window.location.reload();
    }

    return (
        <>
            <div style={{ float: "right" }}>
                <Dropdown overlay={<NavUserMenu logout={redirectLogout} role={authUser.role} />} trigger={['click']} style={{}}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <Space>{authUser.username}    {avatar}</Space>
                    </a>
                </Dropdown>
            </div>
        </>
    );
}

export default NavLogSign;