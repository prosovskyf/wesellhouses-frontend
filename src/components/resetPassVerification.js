import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { message } from 'antd';
import ResetPassWindow from './resetPassWindow';
import FailureWindow from './failureWindow';

/**
 * Component to verify clicked reset pass token from email and redirect to subcomponent
 * Subcomponents: ResetPassWindow, FailureWindow
 * @category User profile
 * @component
 */
function ResetPassVerification() {
    const [statusCode, setStatusCode] = useState()
    const [alert, setAlert] = useState()
    const [queryApi, setQueryApi] = useState()
    const { query } = useParams()

    /** Verify resetPass token */
    async function verification() {
        const options = {
            method: 'GET',
        };
        await fetch(`${process.env.REACT_APP_API_URL}/verification/resetpass/?${queryApi}`, options)
            .then(res => {
                setStatusCode(res.status)
                res.text().then(msg => setAlert(msg))
            })
            .catch(err => message.error('error occured'));
    }
    /** On mount and when queryApi changes, call verification() */
    useEffect(() => {
        setQueryApi(query)
        if (typeof queryApi != "undefined") {
            verification()
        }
    }, [queryApi])

    return (
        <>
            {((statusCode === 200) && (typeof alert != "undefined"))
                ? <ResetPassWindow message={alert} query={queryApi} status={statusCode} />
                : ((statusCode !== 200) && (typeof alert != "undefined"))
                && <FailureWindow message={alert} status={statusCode} />}
        </>
    );
}
export default ResetPassVerification;