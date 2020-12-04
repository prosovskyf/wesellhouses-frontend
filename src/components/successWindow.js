import React, { useEffect } from 'react';
import { Result, Button } from 'antd'
import { useHistory } from "react-router-dom";

/**
 * Component to show success window if action had success, for example activated account
 * @category Default pages
 * @component
 */
function SuccessWindow(props) {
    let history = useHistory();
    const message = props.message
    /** Redirect to /login button */
    function redirect() {
        history.push('/login')
    }
    /** If button not clicked, redirect to /login automatically after 5sec */
    useEffect(() => {
        setTimeout(() => {
            history.push('/login')
        }, 5000)
    }, [])

    return (
        <>
            <Result
                status="success"
                title={message}
                extra={[
                    <Button type="primary" key="console" onClick={redirect}>
                        Go to Log-In
                    </Button>
                ]}
            />
        </>

    );
}
export default SuccessWindow;