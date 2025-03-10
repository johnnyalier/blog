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
import { useSelector } from 'react-redux';

const DashSidebar = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const { handleSignout } =useUtils()
    const {currentUser} = useSelector(state => state.user)

    useEffect(() => {
        const tabParam = new URLSearchParams(location.search).get('tab')
        if (tabParam) setTab(tabParam)
    }, [location])


    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-4'>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item 
                            active={tab === 'profile'} 
                            icon={HiUser} 
                            label={currentUser.isAdmin ? "Admin" : "User"} 
                            labelColor='dark'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <>
                            <Link to='/dashboard?tab=overview'>
                                <Sidebar.Item 
                                    active={tab === 'overview' || !tab} 
                                    icon={HiChartPie} 
                                    labelColor='dark'
                                    as='div'
                                >
                                    Overview
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=posts'>
                                <Sidebar.Item 
                                    active={tab === 'posts'} 
                                    icon={HiDocumentText} 
                                    labelColor='dark'
                                    as='div'
                                >
                                    Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=comments'>
                                <Sidebar.Item 
                                    active={tab === 'comments'} 
                                    icon={HiAnnotation} 
                                    labelColor='dark'
                                    as='div'
                                >
                                    Comments
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=users'>
                                <Sidebar.Item 
                                    active={tab === 'users'} 
                                    icon={HiOutlineUserGroup} 
                                    labelColor='dark'
                                    as='div'
                                >
                                    Users
                                </Sidebar.Item>
                            </Link>
                        </>
                    )}
                    <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar