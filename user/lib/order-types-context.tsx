import React, { createContext, useContext, useState } from "react";
import { OrderType, SubscriptionData, CustomOrderData } from "./mock-data";

interface OrderTypesContextType {
    orderType: OrderType;
    setOrderType: (type: OrderType) => void;
    scheduledDateTime: Date | null;
    setScheduledDateTime: (date: Date | null) => void;
    subscriptionData: SubscriptionData | null;
    setSubscriptionData: (data: SubscriptionData | null) => void;
    customOrderData: CustomOrderData | null;
    setCustomOrderData: (data: CustomOrderData | null) => void;
    resetOrderTypeData: () => void;
}

const OrderTypesContext = createContext<OrderTypesContextType | undefined>(undefined);

export function OrderTypesProvider({ children }: { children: React.ReactNode }) {
    const [orderType, setOrderTypeState] = useState<OrderType>('quick');
    const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
    const [customOrderData, setCustomOrderData] = useState<CustomOrderData | null>(null);

    const setOrderType = (type: OrderType) => {
        // Reset type-specific data when switching order types
        if (type !== 'scheduled') setScheduledDateTime(null);
        if (type !== 'regular') setSubscriptionData(null);
        if (type !== 'custom') setCustomOrderData(null);
        setOrderTypeState(type);
    };

    const resetOrderTypeData = () => {
        setOrderTypeState('quick');
        setScheduledDateTime(null);
        setSubscriptionData(null);
        setCustomOrderData(null);
    };

    const value = {
        orderType,
        setOrderType,
        scheduledDateTime,
        setScheduledDateTime,
        subscriptionData,
        setSubscriptionData,
        customOrderData,
        setCustomOrderData,
        resetOrderTypeData,
    };

    return <OrderTypesContext.Provider value={value}>{children}</OrderTypesContext.Provider>;
}

export function useOrderTypes() {
    const context = useContext(OrderTypesContext);
    if (!context) {
        throw new Error("useOrderTypes must be used within an OrderTypesProvider");
    }
    return context;
}
