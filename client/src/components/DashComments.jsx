import { useEffect, useState } from 'react'
import axios from 'axios';
import { getCommentsRoute, deleteCommentRoute } from '../apiRoutes/routes';
import { useSelector } from'react-redux';
import { Modal, Button, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashComments = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([])
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [commentIdToDelete, setCommentIdToDelete] = useState('');

    const handleShowMore = async () => {
        const startIndex = comments.length
        try {
            const response = await axios.get(`${getCommentsRoute}?startIndex=${startIndex}`)
            if (response.status === 200) {
                setComments([...comments,...response.data.comments])
                if (response.data.comments.length < 9)
                    setShowMore(false);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    const handleDeleteComment = async () => {
        setShowModal(false)
        try {
            const response = await axios.delete(`${deleteCommentRoute}/${commentIdToDelete}`);
            if (response.status === 200) {
                const updatedcomments = comments.filter(comment => comment._id!== commentIdToDelete)
                setComments(updatedcomments)
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        const getcomments = async () => {
            try {
                const response = await axios.get(`${getCommentsRoute}`);
                if (response.status === 200) {
                    setComments(response.data.comments);
                    if (response.data.comments.length < 9)
                        setShowMore(false);
    
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (currentUser.isAdmin)
            getcomments()
        
    }, [currentUser._id])
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && comments.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                            <Table.HeadCell>PostId</Table.HeadCell>
                            <Table.HeadCell>UserId</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map(comment => (
                            <Table.Body key={comment._id}  className='divide-y'>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(comment.createdAt).toLocaleString()}</Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(comment._id);
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
                <h1>No comments found</h1>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className='flex justify-center gap-20'>
                            <Button onClick={handleDeleteComment} color='failure'>Yes</Button>
                            <Button onClick={() => setShowModal(false)} gradientDuoTone='purpleToBlue' outline>No</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashComments