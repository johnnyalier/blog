import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
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

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(null)
    const [uploadError, setUploadError] = useState(null)
    const filePickerRef = useRef()
    const dispatch = useDispatch()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return;

        setImageFile(file)
        setImageFileUrl(URL.createObjectURL(file))
    }
    const uploadImageFile = async() => {
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
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {                    
                    setImageFileUrl(downloadURL)
                })
            }
        );
    }

    useEffect(() => {
        if (imageFile) {
            uploadImageFile()
        }
    }, [imageFile])

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-4'>
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
                />
                <TextInput 
                    type='email' 
                    id='email' 
                    placeholder='email'
                    defaultValue={currentUser.email}
                />
                <TextInput 
                    type='password' 
                    id='passowrd' 
                    placeholder='password'
                />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update Profile</Button>
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile