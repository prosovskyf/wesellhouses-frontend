import React, { useState, useEffect } from 'react';
import { Menu } from 'antd'

/**
 * Component to show menu and select redirection based on user role
 * @category Navigation
 * @component
 */
function NavUserMenu(props) {
    const [menu, setMenu] = useState()
    /** Set state of menu based on role on mount */
    useEffect(() => {
        if (props.role === 'user') {
            setMenu(userMenu)
        }
        else if (props.role === 'agent') {
            setMenu(agentMenu)
        }
    }, [])
    /** User menu map */
    const userMenu = (
        <Menu>
            <Menu.Item key="0">
                <a href="/profile">My profile</a>
            </Menu.Item>
            <Menu.Item key="1">
                <a href="/messages">Messages</a>
            </Menu.Item>
            <Menu.Item key="2">
                <a href="/profile/changepass">Change password</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={props.logout} key="3">Logout</Menu.Item>
        </Menu>
    )
    /** Agent menu map */
    const agentMenu = (
        <Menu>
            <Menu.Item key="0">
                <a href="/profile">My profile</a>
            </Menu.Item>
            <Menu.Item key="1">
                <a href="/messages">Messages</a>
            </Menu.Item>
            <Menu.Item key="3">
                <a href="/admin/createlisting">Create property</a>
            </Menu.Item>
            <Menu.Item key="4">
                <a href="/admin/properties">Manage your properties</a>
            </Menu.Item>
            <Menu.Item key="5">
                <a href="/admin/categories">Manage categories</a>
            </Menu.Item>
            <Menu.Item key="6">
                <a href="/profile/changepass">Change password</a>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={props.logout} key="7">Logout</Menu.Item>
        </Menu>
    )
    return (
        <>
            {menu}
        </>
    );
}

export default NavUserMenu;