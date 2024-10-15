// NotificationContext
import { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const [newsCount, setNewsCount] = useState(0);
    const [manualReportcount, setManualReportcount]=useState(0);

    return (
        <NotificationContext.Provider value={{ 
            notificationCount, setNotificationCount, messageCount, setMessageCount, newsCount, setNewsCount,
            manualReportcount, setManualReportcount }}>
            {children}
        </NotificationContext.Provider>
    );
};