import React, { useState } from 'react'
import Sidebar from './sidebar'
import { Navbar } from './navbar';
import { Outlet } from 'react-router-dom';

 

const AdminLayout: React.FC = () => {
    const [isExpand, setIsExpand] = useState(true);
    const toggleExpand = () => { setIsExpand(!isExpand) }

    return (
        <div className="flex flex-col w-full h-screen">
            
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar isExpand={isExpand} toggleExpand={toggleExpand} setIsExpand={setIsExpand}/>    
                <main className='flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800'><Outlet/></main>
            </div>

        </div>

    )
}

export default AdminLayout
