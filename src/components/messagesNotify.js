import { notification } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

/**
 * Component to show notification on new message
 * @category Messaging
 * @component
 */
export function messagesNotify(name) {
    notification.open({
        duration: 5,
        message: `You got a new message from ${name}!`,
        description:
            'Go to messages tab to see your new message!',
        icon: <MessageOutlined style={{ color: '#108ee9' }} />,
    });
};
