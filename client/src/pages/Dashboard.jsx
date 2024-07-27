import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../components/DashProfile'
import DashSidebar from '../components/DashSidebar'

const Dashboard = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')

    useEffect(() => {
        const tabParam = new URLSearchParams(location.search).get('tab')
        console.log(tabParam);
        if (tabParam) setTab(tabParam)
    }, [location.search])

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-56'>
                <DashSidebar />
            </div>
            {tab === 'profile' && <DashProfile />}
        </div>
    )
}

export default Dashboard