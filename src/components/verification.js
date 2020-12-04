import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { message } from 'antd';
import SuccessWindow from './successWindow';
import FailureWindow from './failureWindow';

/**
 * Component to verify clicked activation token from email and redirect to subcomponent
 * Subcomponents: SuccessWindow, FailureWindow
 * @category User profile
 * @component
 */
function Verification() {
    const [statusCode, setStatusCode] = useState()
    const [alert, setAlert] = useState()
    const [queryApi, setQueryApi] = useState()
    const { query } = useParams()
    /** Verify token */
    async function verification() {
        const options = {
            method: 'GET',
        };
        await fetch(`${process.env.REACT_APP_API_URL}/verification/?${queryApi}`, options)
            .then(res => {
                setStatusCode(res.status)
                res.text().then(msg => setAlert(msg))
            })
            .catch(err => message.error('Error occured'));
    }
    /** On mount and when queryApi changes, set queryApi from query and call verificationb() */
    useEffect(() => {
        setQueryApi(query)
        if (typeof queryApi != "undefined") {
            verification()
        }
    }, [queryApi])

    return (
        <>
            {((statusCode === 200) && (typeof alert != "undefined"))
                ? <SuccessWindow message={alert} />
                : ((statusCode !== 200) && (typeof alert != "undefined"))
                && <FailureWindow message={alert} status={statusCode} />}
        </>

    );
}
export default Verification;