import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';
import axios from 'axios';
import { getPostsRoute, searchPostsRoute } from '../apiRoutes/routes';

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') 
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order });
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSidebarData({ ...sidebarData, category });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?${new URLSearchParams(sidebarData).toString()}`);
    };

    const handleShowMore = async () => {
        setLoading(true);
        const startIndex = posts.length
        const urlParams = new URLSearchParams(sidebarData)
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const response = await axios.get(`${getPostsRoute}?${searchQuery}`);

        if (response.status === 200) {
            setPosts([...posts,...response.data.posts]);
            setLoading(false);

            if (response.data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        }
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        
        if (searchTermFromUrl !== null) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
            });
        }
        if (sortFromUrl !== null) {
            setSidebarData({
                ...sidebarData,
                sort: sortFromUrl,
            });
        }
        if (categoryFromUrl !== null) {
            setSidebarData({
                ...sidebarData,
                category: categoryFromUrl,
            });
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const response = await axios.get(`${getPostsRoute}?${searchQuery}`);
            
            if (response.status === 200) {
                setPosts(response.data.posts);
                setLoading(false);

                if (response.data.posts.length === 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            } else {
                console.error(response.data.message);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [location.search]);

    console.log(sidebarData);

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className='flex   items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold'>Search Term</label>
                        <TextInput
                            placeholder='Search...'
                            id='searchTerm'
                            type='text'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
                            <option value='desc'>Latest</option>
                            <option value='asc'>Oldest</option>
                        </Select>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Category:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.category}
                            id='category'
                        >
                            <option value='uncategorized'>Uncategorized</option>
                            <option value='reactjs'>React.js</option>
                            <option value='nextjs'>Next.js</option>
                            <option value='javascript'>JavaScript</option>
                        </Select>
                    </div>
                    <Button type='submit' outline gradientDuoTone='purpleToPink'>
                        Apply Filters
                    </Button>
                </form>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
                    Posts results:
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                    {!loading && posts && posts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Search