import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useSelector, useDispatch } from 'react-redux'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { 
    deleteUserStart,
    deleteUserFailure,
    deleteUserSuccess,
    updateFailure, 
    updateStart, 
    updateSuccess 
} from '../redux/user/userSlice';
import { updateProfileRoute, deleteUserRoute } from '../apiRoutes/routes';

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(null)
    const [uploadError, setUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const filePickerRef = useRef()
    const dispatch = useDispatch()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return;

        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file))
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdateUserError(null);
        setUpdateUserSuccess(null);

        if (Object.keys(formData).length === 0) {
            setUpdateUserError('Please fill out at least one field to update')
            return
        }

        if (isUploading) {
            setUpdateUserError('Image upload in progress')
            return
        }

        try {
            dispatch(updateStart())
            const response  = await axios.put(`${updateProfileRoute}/${currentUser._id}`, {
                ...formData
            })
            if (response.status === 200) {
                dispatch(updateSuccess(response.data))
                setUpdateUserSuccess('Profile updated successfully!')
                setFormData({})
            } else {
                dispatch(updateFailure(response.data.message))
                setUpdateUserError(response.data.message)
            }
        } catch (error) {
            dispatch(updateFailure(error))
            setUpdateUserError(error.message)
        }
    }
    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            dispatch(deleteUserStart());
            const response = await axios.delete(`${deleteUserRoute}/${currentUser._id}`)
            if (response.status === 200) {
                dispatch(deleteUserSuccess());
            } else {
                dispatch(deleteUserFailure(response.data.message))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }
    
    useEffect(() => {
        const uploadImageFile = async() => {
            setIsUploading(true)
            setUploadError(null)
            const storage = getStorage(app)
            const fileName = new Date().getTime().toString() + imageFile.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, imageFile)
            uploadTask.on(
                'state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress.toFixed(0))
                },
                (error) => {
                    setUploadError("File not uploaded! Accept only image file size < 2MB")
                    setUploadProgress(null)
                    setImageFile(null)
                    setImageFileUrl(null)
                    setIsUploading(false)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {                    
                        setImageFileUrl(downloadURL)
                        setFormData({...formData, profilePicture: downloadURL })
                        setIsUploading(false)
                    })
                }
            );
        }
        if (imageFile) {
            uploadImageFile()
        }
    }, [imageFile])

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
                <div 
                    className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
                    onClick={() => filePickerRef.current.click()}
                >
                    {uploadProgress && (
                        <CircularProgressbar 
                            value={uploadProgress || 0} 
                            text={`${uploadProgress}%`} 
                            strokeWidth={5}
                            styles={{
                                root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                },
                                path: {
                                stroke: `rgba(62, 152, 199, ${
                                    uploadProgress / 100
                                })`,
                                },
                            }}
                        />
                    )}            
                    <img
                        src={imageFileUrl || currentUser.profilePicture} 
                        alt="user" 
                        className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${uploadProgress && uploadProgress < 100 && 'opacity-60'}`}
                    />
                </div>
                {uploadError && (
                    <Alert color='failure'>
                        {uploadError}
                    </Alert>
                )}
                <TextInput 
                    type='text' 
                    id='username' 
                    placeholder='username' 
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput 
                    type='email' 
                    id='email' 
                    placeholder='email'
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput 
                    type='password' 
                    id='passowrd' 
                    placeholder='password'
                    onChange={handleChange}
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update Profile</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color='success' className='mt-5'>
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color='failure' className='mt-5'>
                    {updateUserError}
                </Alert>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
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

export default DashProfile