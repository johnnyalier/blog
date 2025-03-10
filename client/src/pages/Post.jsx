import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import axios from 'axios';
import { getPostsRoute } from '../apiRoutes/routes';
import CallToAction from '../components/CallToAction';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

const Post = () => {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${getPostsRoute}?slug=${postSlug}`)
                if (response.status === 200) {
                    setPost(response.data.posts[0]);
                    setLoading(false);
                    setError(false);
                } else {
                    setError(true);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(true);
            }
        }
        fetchPost();
    },[postSlug])

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                const response = await axios.get(`${getPostsRoute}?limit=3&sortBy=createdAt&order=-1`)
                if (response.status === 200) {
                    setRecentPosts(response.data.posts);
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchRecentPosts();
    }, [])

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        )
    }

    return (
        <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
            <h1 className='text-3xl mt-10 p-3 text-center font-serif lg:text-4xl max-w-2xl mx-auto'>{post && post.title}</h1>
            <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
                <Button pill>{post && post.category}</Button>
            </Link>
            <img 
                src={post && post.image} 
                alt={post && post.title} 
                className='mt-10 p-3 max-h[600px] w-full object-cover'
            />
            <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
            </div>
            <div
                className='p-3 max-w-2xl mx-auto w-full post-content'
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            ></div>
            <div className='max-w-4xl mx-auto w-full'>
                <CallToAction />
            </div>
            <CommentSection postId={post && post._id} />
            <div className='w-full flex flex-col justify-center items-center mb-5'>
                <h1 className='text-xl mt-5'>Recent articles</h1>
                <div className='flex flex-wrap gap-5 mt-5 justify-center'>
                    {recentPosts &&
                        recentPosts.map((post) => <PostCard key={post._id} post={post} />
                    )}
                </div>
            </div>
        </main>
    )
}

export default Post