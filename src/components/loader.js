import React from 'react';
import { Space, Spin } from 'antd'

/**
 * Component to show loader while fetching data
 * @category Default pages
 * @component
 */
function Loader() {
    return (
        <>
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Space size="large">
                    <Spin size="large" />
                </Space>
            </div>
        </>
    )
}

export default Loader;