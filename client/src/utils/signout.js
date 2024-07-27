import { signoutSuccess } from "../redux/user/userSlice"
import { signoutRoute } from "../apiRoutes/routes"
import axios from 'axios';
import { useDispatch } from 'react-redux'

export const useUtils = () => {
    const dispatch = useDispatch()
    const handleSignout = async () => {
        try {
            const response = await axios.post(signoutRoute)
            if (response.status === 200) {
                dispatch(signoutSuccess())
            } else {
                console.log(response.data.message)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return {
        handleSignout,
    }
}