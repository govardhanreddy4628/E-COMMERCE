import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface SidebarContextType {
    isExpand: boolean;
    toggleExpand: () => void;
    setIsExpand: Dispatch<SetStateAction<boolean>>;
}

const sideBarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarContextProviderProps {
    children: ReactNode;
}

const SidebarContextProvider = ({ children }: SidebarContextProviderProps) => {
    const [isExpand, setIsExpand] = useState(true);
    const toggleExpand = () => { setIsExpand(!isExpand) }
    return (
        <sideBarContext.Provider value={{ isExpand, toggleExpand, setIsExpand }}>
            {children}
        </sideBarContext.Provider>
    )
}

export { sideBarContext, SidebarContextProvider };
