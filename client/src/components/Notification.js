import React, { useRef, useContext } from 'react';
import NotificationContext from '../NotificationContext';
import { useEffect } from 'react';

const Notification = (props) => {
    const { notification, setNotification } = useContext(NotificationContext);
    const timer = useRef(null);

    useEffect(() => {
        if (notification) {
            // if a timeout is already set when a new notification is added, reset it
            if (timer.current) {
                clearTimeout(timer.current);
            }

            // clear notifications automatically after 5 seconds
            timer.current = setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    }, [notification]);

    if (!notification) {
        return null;
    }

    return (
        <div className="fixed-bottom">
            <div className="alert alert-warning m-0 text-break">
                {notification.body}
            </div>
        </div>
    );
};

export default Notification;