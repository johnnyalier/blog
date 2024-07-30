import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import axios from 'axios';
import { getPostsRoute } from '../apiRoutes/routes';

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(getPostsRoute)
                if (response.status === 200) {
                    setPosts(response.data.posts);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchPosts()
    },[])

    return (
        <div>
            <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to David&rsquo;s Blog</h1>
                <p className='sm:text-sm text-gray-500 text-xs'>This is a demo blog for showcasing my web development skills as well as other important skills related to technology industry. Check in frequently to get informed on fun and interesting topics to expand your knowledge.</p>
                <Link
                    to='/search'
                    className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
                >
                    View all posts
                </Link>
            </div>
            <div className='max-w-6xl mx-auto p-3 bg-amber-100 dark:bg-slate-700'>
                <CallToAction />
            </div>
            <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
                {posts && posts.length > 0 && (
                    <div className='flex flex-col gap-6 justify-center'>
                        <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
                        <div className='flex flex-wrap gap-4 justify-center'>
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Link
                            to={'/search'}
                            className='text-lg text-teal-500 hover:underline text-center'
                        >
                            View all posts
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home