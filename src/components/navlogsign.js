import React from 'react';
import { Button, Space } from 'antd'
import { Link } from "react-router-dom";

/**
 * Component to show Login/Signup panel when user is not logged in
 * @category Navigation
 * @component
 */
function NavLogSign() {
    return (
        <>
            <div style={{ float: "right" }}>
                <Space>
                    <Link to="/login">
                        <Button type="primary">
                            Log In
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button type="default" style={{ colour: "white" }}>
                            Sign Up
                        </Button>
                    </Link>
                </Space>
            </div>
        </>
    );
}

export default NavLogSign;