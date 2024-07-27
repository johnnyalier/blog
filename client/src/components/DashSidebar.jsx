import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sidebar } from 'flowbite-react'
import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
} from 'react-icons/hi';
import { useUtils } from '../utils/signout';

const DashSidebar = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const { handleSignout } =useUtils()

    useEffect(() => {
        const tabParam = new URLSearchParams(location.search).get('tab')
        console.log(tabParam);
        if (tabParam) setTab(tabParam)
    }, [location])


    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item 
                            active={tab === 'profile'} 
                            icon={HiUser} 
                            label="User" 
                            labelColor='dark'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar