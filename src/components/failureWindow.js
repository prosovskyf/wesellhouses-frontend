import React, { useEffect, useState } from 'react';
import { Result, message, Button } from 'antd'
import { useHistory } from "react-router-dom";

/**
 * Component to show failure window if error or any event occurs, for example expired activation link
 * @category Default pages
 * @component
 */
function FailureWindow(props) {
    const [statusCode, setStatusCode] = useState()
    const [alert, setAlert] = useState()
    const [text, setText] = useState()
    const [link, setLink] = useState()
    let history = useHistory();
    /** On mount, determine the status code passed in props to process data */
    useEffect(() => {
        if (props.status === 400) {
            setText(props.message)
            setTimeout(() => {
                history.push('/')
            }, 5000)
        }
        else if (props.status === 498) {
            setText(JSON.parse(props.message).text)
            setLink(JSON.parse(props.message).link)
        }
        else if (props.status === 409) {
            setText((props.message).text)
            setLink((props.message).link)
        }
    }, [])
    /** When alert or statusCode changes, determine the message to display */
    useEffect(() => {
        if ((typeof alert != "undefined") && (statusCode === 200)) {
            message.success(alert, 7)
            history.push('/')
        }
        else if ((typeof alert != "undefined") && (statusCode !== 200)) {
            message.error(alert, 3)
        }
    }, [alert, statusCode])
    /** Resend activation link */
    async function send() {
        const options = {
            method: 'GET',
        };
        await fetch(`${link}`, options)
            .then(res => {
                setStatusCode(res.status)
                res.text().then(msg => setAlert(msg))
            })
            .catch(err => message.error('Error occured'));
    }
    return (
        <div style={{ textAlign: "center" }}>
            <Result
                status="warning"
                title={text}
            >
                {((props.status === 498) || (props.status === 409))
                    && <Button type="primary" key="console" onClick={send}>
                        Resend activation link
                    </Button>}
            </Result>
        </div>
    );
}
export default FailureWindow;