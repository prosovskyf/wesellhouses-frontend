import { Result, Button } from 'antd';
import {
    useHistory
} from "react-router-dom";
import { CloseCircleTwoTone } from '@ant-design/icons'

/**
 * Component for showing 401 - not authorized page.
 * @category Default pages
 * @component
 */
function NotPermitted() {
    let history = useHistory()
    /** Get to the main page */
    function backHome() {
        history.push('/')
    }
    return (
        <Result
            title="403"
            icon={<CloseCircleTwoTone twoToneColor="#FF0000" />}
            subTitle="You are not authorized to access requested resources"
            extra={<Button onClick={backHome} type="primary">Back Home</Button>}
        />
    );
}

export default NotPermitted;