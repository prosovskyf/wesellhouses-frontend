import { useState } from 'react';
import useInterval from '@use-it/interval';
import moment from 'moment'
import { getThreads, getMessages } from './messagesFunctions'
import { messagesNotify } from './messagesNotify'

/**
 * Component to poll for new messages for specific user comparing dates
 * @category Messaging
 * @component
 */
function MessagesNotification(props) {
    const user = props.user
    const [date, setDate] = useState(moment().format())
    const delay = 5000
    /** Get messages for specific user and set date based on
     * last updated time of thread, if it is higher then current time in date state,
     * call messagesNotify to show notification
     */
    async function getNewMessages() {
        let res = await getThreads(user.token)
        if (res.status === 200) {
            res.body.forEach(async (message) => {
                if (moment(message.updated_time).format() > date) {
                    let thread = (await getMessages(user.token, message.id)).body.messages
                    if (user.username !== thread[thread.length - 1].author) {
                        messagesNotify(thread[thread.length - 1].author)
                    }
                    setDate(moment().format())
                }
            });
        }
    }
    /** Custom hook to poll for message based on set up delay */
    useInterval(() => {
        getNewMessages();
    }, delay);

    return false
};

export default MessagesNotification;