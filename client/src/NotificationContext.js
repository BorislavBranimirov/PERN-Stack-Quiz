import React from 'react';

const NotificationContext = React.createContext({
    notification: null,
    setNotification: () => { }
});

export default NotificationContext;