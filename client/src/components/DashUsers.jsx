import { useEffect, useState } from 'react'
import axios from 'axios';
import { getUsersRoute, deleteUserRoute } from '../apiRoutes/routes';
import { useSelector } from'react-redux';
import { Modal, Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

const DashUsers = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [userIdToDelete, setUserIdToDelete] = useState('');

    const handleShowMore = async () => {
        const startIndex = users.length
        try {
            const response = await axios.get(`${getUsersRoute}?startIndex=${startIndex}`)
            if (response.status === 200) {
                setUsers([...users,...response.data.users])
                if (response.data.users.length < 9)
                    setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            console.log(userIdToDelete);
            const response = await axios.delete(`${deleteUserRoute}/${userIdToDelete}`);
            if (response.status === 200) {
                const updatedusers = users.filter(user => user._id!== userIdToDelete)
                setUsers(updatedusers)
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const getusers = async () => {
            try {
                const response = await axios.get(`${getUsersRoute}`);
                if (response.status === 200) {
                    setUsers(response.data.users);
                    if (response.data.users.length < 9)
                        setShowMore(false);
    
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (currentUser.isAdmin)
            getusers()
        
    }, [currentUser._id])
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map(user => (
                            <Table.Body key={user._id}  className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(user.createdAt).toLocaleString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/users/${user.slug}`}>
                                            <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='font-medium text-gray-900 dark:text-white'
                                            to={`/user/${user.username}`}
                                        >
                                            {user.username}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className='text-green-500' />
                                        ) : (
                                            <FaTimes className='text-red-500' />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span 
                                            onClick={() => {
                                                setShowModal(true)
                                                setUserIdToDelete(user._id)
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button 
                            className='w-full self-center text-teal-500 py-7'
                            onClick={handleShowMore}
                        >
                            Show More
                        </button>
                    )}
                </>
            ) : (
                <h1>No users found</h1>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this user?
                        </h3>
                        <div className='flex justify-center gap-20'>
                            <Button onClick={handleDeleteUser} color='failure'>Yes</Button>
                            <Button onClick={() => setShowModal(false)} gradientDuoTone='purpleToBlue' outline>No</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashUsers