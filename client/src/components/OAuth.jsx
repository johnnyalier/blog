import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase'
import axios from 'axios'
import { googleRoute } from '../apiRoutes/routes'
import { useDispatch } from 'react-redux'
import { signInFailure, signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth = getAuth(app)
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })

        try {
            const authResult = await signInWithPopup(auth, provider)
            const response = await axios.post(googleRoute, {
                name: authResult.user.displayName,
                email: authResult.user.email,
                photoURL: authResult.user.photoURL,
            })
            const data = response.data
            if (response.status === 200) {
                dispatch(signInSuccess(data))
                navigate('/')
            } else {
                dispatch(signInFailure(data.message))
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Button type='button' gradientDuoTone='redToYellow' onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}

export default OAuth