import { useEffect, useState } from 'react'
import { getUserRoute, editCommentRoute } from '../apiRoutes/routes'
import axios from 'axios'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
    const [user, setUser] = useState({})
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const { currentUser } = useSelector((state) => state.user);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async () => {
        try {
            const response = await axios.put(`${editCommentRoute}/${comment._id}`, { content: editedContent })
            if (response.status === 200) {
                onEdit(comment, editedContent)
                setIsEditing(false);
            } else {
                console.log(response.data.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`${getUserRoute}/${comment.userId}`)
                if (response.status === 200) {
                    setUser(response.data)
                } else {
                    console.log(response.data.message)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        getUser()
    }, [comment])
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img 
                    src={user.profilePicture} 
                    alt={user.username} 
                    className='h-10 w-10 bg-gray-500 object-cover rounded-full'
                />
            </div>
            <div className='flex-1'>                
                <div className='flex items-center gap-1'>
                    <span className='font-bold text-xs truncate'>
                        {user ? `@${user.username}` : 'anonymous user'}
                    </span>
                    <span className='text-gray-500 text-xs'>
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea
                            className='mb-2'
                            value={editedContent}
                            placeholder='Write a comment...'
                            onChange={(e) => setEditedContent(e.target.value)}
                            maxLength={200}
                        />
                        <div className='flex items-center justify-between mt-5'>
                            <p className='text-gray-500 text-xs'>{200 - editedContent.length} characters remaining</p>
                            <div className='flex justify-end gap-2 text-xs'>
                                <Button
                                    type='button'
                                    size='sm'
                                    gradientDuoTone='purpleToBlue'
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                                <Button
                                    type='button'
                                    size='sm'
                                    gradientDuoTone='purpleToBlue'
                                    outline
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-gray-500 pb-2'>{comment.content}</p>
                        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
                            <button
                                type='button'
                                onClick={() => onLike(comment._id)}
                                className={`text-gray-400 hover:text-blue-500 ${
                                    currentUser &&
                                    comment.likes.includes(currentUser._id) &&
                                    '!text-blue-500'
                                }`}
                            >
                                <FaThumbsUp className='text-sm' />
                            </button>
                            <p className='text-gray-400'>
                                {
                                    comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes +
                                    ' ' +
                                    (comment.numberOfLikes === 1 ? 'like' : 'likes')
                                }
                            </p>
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <>
                                    <button
                                        type='button'
                                        onClick={handleEdit}
                                        className='text-gray-400 hover:text-blue-500'
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => onDelete(comment._id)}
                                        className='text-gray-400 hover:text-red-500'
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Comment