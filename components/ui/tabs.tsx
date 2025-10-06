import React, { createContext, useContext, useState, ReactNode, FC } from "react";

// Context untuk menyimpan state tab aktif
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue?: string;
  children: ReactNode;
  className?: string; // ← tambahkan className
}

export const Tabs: FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || "");

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div> {/* ← pakai className */}
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}
export const TabsList: FC<TabsListProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}
export const TabsTrigger: FC<TabsTriggerProps> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used inside Tabs");

  const { activeTab, setActiveTab } = context;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 -mb-px font-medium border-b-2 ${
        activeTab === value
          ? "border-blue-500 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      } ${className || ""}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string; // ← tambahkan className
}
export const TabsContent: FC<TabsContentProps> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used inside Tabs");

  const { activeTab } = context;

  return <div className={className}>{activeTab === value ? children : null}</div>; // ← pakai className
};
