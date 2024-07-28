import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { getPostsRoute, deletePostsRoute } from '../apiRoutes/routes';
import { useSelector } from'react-redux';
import { Modal, Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashPosts = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [postIdToDelete, setPostIdToDelete] = useState('');

    const handleShowMore = async () => {
        const startIndex = userPosts.length
        try {
            const response = await axios.get(`${getPostsRoute}?userId=${currentUser._id}&startIndex=${startIndex}`)
            if (response.status === 200) {
                setUserPosts([...userPosts,...response.data.posts])
                if (response.data.posts.length < 9)
                    setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleDeletePost = async () => {
        setShowModal(false)
        try {
            const response = await axios.delete(`${deletePostsRoute}/${postIdToDelete}/${currentUser._id}`);
            if (response.status === 200) {
                const updatedPosts = userPosts.filter(post => post._id!== postIdToDelete)
                setUserPosts(updatedPosts)
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const getPosts = async () => {
            try {
                const response = await axios.get(`${getPostsRoute}?userId=${currentUser._id}`);
                if (response.status === 200) {
                    setUserPosts(response.data.posts);
                    if (response.data.posts.length < 9)
                        setShowMore(false);
    
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (currentUser.isAdmin)
            getPosts()
    }, [])
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Edit</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {userPosts.map(post => (
                            <Table.Body key={post._id}  className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(post.updatedAt).toLocaleString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/posts/${post.slug}`}>
                                            <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='font-medium text-gray-900 dark:text-white'
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <Link 
                                            className='text-teal-500 hover:underline'
                                            to={`/update-post/${post._id}`}
                                        >
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span 
                                            onClick={() => {
                                                setShowModal(true)
                                                setPostIdToDelete(post._id)
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
                <h1>No posts found</h1>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this post?
                        </h3>
                        <div className='flex justify-center gap-20'>
                            <Button onClick={handleDeletePost} color='failure'>Yes</Button>
                            <Button onClick={() => setShowModal(false)} gradientDuoTone='purpleToBlue' outline>No</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashPosts