import { Result, Button } from 'antd';
import {
    useHistory
} from "react-router-dom";
import { QuestionCircleFilled } from '@ant-design/icons'

/**
 * Component for showing 404 - not afound page.
 * @category Default pages
 * @component
 */
function NotFound() {
    let history = useHistory()
    /** Get to the main page */
    function backHome() {
        history.push('/')
    }
    return (
        <Result
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            icon={<QuestionCircleFilled size="20" />}
            extra={<Button onClick={backHome} type="primary">Back Home</Button>}
        />
    );
}

export default NotFound;