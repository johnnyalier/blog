import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import axios from 'axios'
import { signInRoute } from '../apiRoutes/routes'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const {loading, error: errorMessage} = useSelector(state => state.user)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            return dispatch(signInFailure('Please fill out all fields.'));
        }

        try {
            dispatch(signInStart())
            const result = await axios.post(signInRoute, {
                ...formData
            })
            console.log(result.data)

            if (result.status === 200){
                dispatch(signInSuccess(result.data))
                navigate('/')
            } else {
                dispatch(signInFailure(result.data.message))
            }
        } catch (error) {
            dispatch(signInFailure(error.message))
        }
    }

    return (
        <div className='min-h-screen mt-20'>
            <div className='flex flex-col md:flex-row md:items-center p-3 max-w-3xl mx-auto gap-5'>
                <div className='flex-1'>
                    <Link to="/" className='text-6xl font-bold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>David&rsquo;s</span>
                        Blog
                    </Link>
                    <p className='text-sm mt-5'>This is a demo blog for showcasing my web development skills as well as other important skills related to technology industry. Check in frequently to get informed on fun and interesting topics to expand your knowledge.</p>
                </div>
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Your email' />
                            <TextInput type='email' id='email' className='mt-2 w-full' placeholder='name@email.com' onChange={handleChange} />
                        </div>
                        <div>
                            <Label value='Your password' />
                            <TextInput type='password' id='password' className='mt-2 w-full' placeholder='Password' onChange={handleChange} />
                        </div>
                        <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
                            {loading? (
                                <>
                                    <Spinner size='sm' />
                                    <span>Loading...</span>
                                </>
                            ) : 'Sign In'}
                        </Button>
                        <OAuth />
                    </form>
                    <div className='flex gap-2 text-sm mt-5'>                        
                        <span>Don&rsquo;t have an account?</span>
                        <Link to='/signup' className='text-blue-500'>Sign Up</Link>
                    </div>
                    {errorMessage && (
                        <Alert className='mt-5' color='failure'>
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SignIn