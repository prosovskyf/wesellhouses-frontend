import React from 'react';
import { Menu } from 'antd';
import '../App.css';
import {
    Link,
    useLocation
} from "react-router-dom";

/**
 * Component to show main Navigation menu on left side
 * @category Navigation
 * @component
 */
function Nav() {
    const { pathname } = useLocation()
    return (
        <>
            <Link to="/" ><div className="logo" /></Link>
            <Menu theme="dark" mode="horizontal" selectedKeys={[pathname]} defaultSelectedKeys={['/']} style={{ float: "left" }}>
                <Menu.Item key="/"><Link to="/" />Home</Menu.Item>
                <Menu.Item key="/properties/"><Link to="/properties/" />Properties</Menu.Item>
            </Menu>
        </>
    )
}
export default Nav;