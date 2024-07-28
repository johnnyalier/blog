import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../components/DashProfile'
import DashSidebar from '../components/DashSidebar'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'

const Dashboard = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')

    useEffect(() => {
        const tabParam = new URLSearchParams(location.search).get('tab')
        if (tabParam) setTab(tabParam)
    }, [location.search])

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-56'>
                <DashSidebar />
            </div>
            {tab === 'profile' && <DashProfile />}
            {tab === 'posts' && <DashPosts />}
            {tab === 'users' && <DashUsers />}
        </div>
    )
}

export default Dashboard