import { Alert, Button, Textarea, Modal } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { BiSend } from 'react-icons/bi'
import axios from 'axios'
import { 
    createCommentRoute, 
    getPostCommentsRoute,
    deleteCommentRoute, 
    likeCommentRoute 
} from '../apiRoutes/routes'
import Comment from './Comment'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector((state) => state.user)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [commentError, setCommentError] = useState(null)
    const [showModal, setShowModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setCommentError(null)
        if (!comment) {
            setCommentError('Please enter a comment.')
            return
        }

        if (comment.length > 200) {
            setCommentError('Comment must be less than 200 characters')
            return
        }

        try {
            const response = await axios.post(createCommentRoute, {
                postId,
                content: comment,
                userId: currentUser._id,
            })
            if (response.status === 201) {
                setComment('')
                setCommentError(null)
                setComments([response.data, ...comments])
            } else {
                setCommentError(response.data.message)
            }
        } catch (error) {
            setCommentError(error)
        }
    }

    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }
            const response = await axios.put(`${likeCommentRoute}/${commentId}`)
            if (response.status === 200) {
                const updatedComments = comments.map((c) =>
                    c._id === commentId ? {...c, likes: response.data.likes, numberOfLikes: response.data.likes.length } : c
                )
                setComments(updatedComments)
            } else {
                setCommentError(response.data.message)
            }
        } catch (error) {
            setCommentError(error.message)
        }
    }

    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) =>
                c._id === comment._id ? { ...c, content: editedContent } : c
            )
        );
    }

    const handleDelete = async (commentId) => {
        setShowModal(false)
        try {
            if (!currentUser) {
                navigate('/sign-in');
                return;
            }

            const response = await axios.delete(`${deleteCommentRoute}/${commentId}`)
            if (response.status === 200) {
                const updatedComments = comments.filter((c) => c._id!== commentId)
                setComments(updatedComments)
                setCommentToDelete(null)
            }
        } catch (error) {
            console.log(error.message);
        }
        setCommentToDelete(commentId)
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`${getPostCommentsRoute}/${postId}`)
                if (response.status === 200) {
                    setComments(response.data)
                } else {
                    console.log(response.data.message)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchComments()
    },[postId])

    return (
        <div className='max-w-2xl mx-auto w-full p-3'>
            {currentUser ? (
                <div className='flex gap-1 my-5 items-center text-gray-500 text-sm'>
                    <p>Signed in as:</p>
                    <img 
                        src={currentUser.profilePicture} 
                        alt={currentUser.username} 
                        className='h-5 w-5 object-cover rounded-full'
                    />
                    <Link to='/dashboard?tab=profile'>@{currentUser.username}</Link>
                </div>
            ) : (
                <div className='text-sm text-teal-500 my-5 flex gap-1'>
                    <p>Please sign in to comment.</p>
                    <Link className='text-blue-500 hover:underline' to='/signin'>Sign In</Link>                    
                </div>
            )}
            {currentUser && (
                <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
                    <Textarea 
                        placeholder='Write a comment...'
                        rows={3}
                        maxLength='200'
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <div className='flex items-center justify-between mt-5'>
                        <p className='text-gray-500 text-xs'>{200 - comment.length} Characters remaining</p>
                        <Button type='submit' outline gradientDuoTone='purpleToBlue'>
                            <BiSend className='text-2xl' />
                        </Button>
                    </div>
                    {commentError &&
                        <Alert color='failure' className='mt-5'>
                            {commentError}
                        </Alert>
                    }
                </form>
            )}
            {comments.length === 0 ? (
                <p className='my-5 text-sm'>No comments yet.</p>
            ) : (
                <>
                    <div className='text-sm my-5 flex items-center gap-1'>
                        <p>Comments</p>
                        <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map(comment => (
                        <Comment 
                            key={comment._id} 
                            comment={comment}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={(commentId) => {
                                setShowModal(true);
                                setCommentToDelete(commentId);
                            }}
                        />
                    ))}
                </>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                <div className='text-center'>
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                    Are you sure you want to delete this comment?
                    </h3>
                    <div className='flex justify-center gap-4'>
                    <Button
                        color='failure'
                        onClick={() => handleDelete(commentToDelete)}
                    >
                        Yes
                    </Button>
                    <Button color='gray' onClick={() => setShowModal(false)}>
                        No
                    </Button>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default CommentSection