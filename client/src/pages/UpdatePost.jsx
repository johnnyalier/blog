import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import { getPostsRoute, updatePostRoute } from '../apiRoutes/routes'
import { useSelector } from 'react-redux';

const UpdatePost = () => {
    const [file, setFile] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const { postId } = useParams();
    const { currentUser } = useSelector(state => state.user)

    const navigate = useNavigate();

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(`${getPostsRoute}?postId=${postId}`)
                if (response.status === 200) {
                    setFormData(response.data.posts[0]);
                } else {
                    console.log(response.data.message);
                    setPublishError(response.data.message)
                }
            } catch (error) {
                setPublishError(null)
                console.log(error.message);
            }
        }
        getPost();
    }, [postId])

    const handleImageUpload = async () => {
        try {
            if (!file) {
                setUploadError('No file selected.');
                return
            }

            setUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setUploadError('Image upload failed');
                    setUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setUploadProgress(null);
                        setUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            console.log(error);
            setUploadError('Image upload failed');
            setUploadProgress(null);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setPublishError(null);

        try {
            const response = await axios.put(`${updatePostRoute}/${formData._id}/${currentUser._id}`, {
                ...formData
            });

            if (!response.status === 200) {
                setPublishError(response.data.message);
            }

            navigate(`/post/${response.data.slug}`);
        } catch (error) {
            console.log(error);
            setPublishError('Failed to publish post');
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput 
                        type="text" 
                        placeholder='Title' 
                        id='title'
                        required
                        className='flex-1' 
                        onChange={(e) => setFormData({ ...formData, title: e.target.value})}
                        value={formData.title}
                    />
                    <Select 
                        onChange={(e) => setFormData({ ...formData, category: e.target.value})}
                        value={formData.category}
                    >
                        <option value="uncategorized">Select Category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="reactjs">React.JS</option>
                        <option value="python">Python</option>                        
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button 
                        type='button' 
                        gradientDuoTone='purpleToBlue' 
                        size='sm' 
                        outline
                        onClick={handleImageUpload}
                        disabled={uploadProgress}
                    >
                        {uploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar 
                                    value={uploadProgress} 
                                    text={`${uploadProgress || 0}%`} 
                                    styles={{
                                        root: { width: '100%', height: '100%' },
                                        path: { stroke: '#63B3ED' },
                                    }}
                                />
                            </div>
                        ) :
                            'Upload Image'
                        }
                    </Button>
                </div>
                {uploadError && <Alert color='failure'>{uploadError}</Alert>}
                {formData.image && (
                    <img 
                        src={formData.image} 
                        alt='uploaded image' 
                        className='w-full h-72 object-cover' 
                    />
                )}
                <ReactQuill 
                    theme="snow" 
                    placeholder='Write something...'
                    className='h-72 mb-12'
                    required
                    onChange={(value) => setFormData({ ...formData, content: value })} 
                    value={formData.content}
                />
                <Button gradientDuoTone='purpleToPink' type='submit'>Update</Button>
                {publishError && <Alert color='failure' className='mt-5'>{publishError}</Alert>}
            </form>
        </div>
    )
}

export default UpdatePost