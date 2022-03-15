import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import About from './About';
import Missing from './Missing';
import EditPost from './EditPost';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {format} from 'date-fns';
import api from './api/posts';
import useWindowSize from './hooks/useWindowSize';
import useAxiosFetch from './hooks/useAxiosFetch';

function App() {

    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [postTitle, setPostTitle] = useState('');
    const [postBody, setPostBody] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editBody, setEditBody] = useState('');
    let navigate = useNavigate();
    const { width } = useWindowSize();
    const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3500/posts')

    // ********************************************************

    useEffect(()=>{
        setPosts(data);
    }, [data]);

    // *********************************************************

    // useEffect(()=>{
    //     const fetchPosts = async () => {
    //         try {
    //             const response = await api.get('/posts');
    //             setPosts(response.data);
    //         } catch (error) {
    //             console.log(`Error: ${error.message}`);
    //         }
    //     }
    //     fetchPosts();
    // }, [])

    // *********************************************************

    useEffect(() => {
        const filteredResults = posts.filter(
            post => ((post.body).toLowerCase()).includes(search.toLowerCase()) || ((post.title).toLowerCase()).includes(search.toLowerCase())
        )
        setSearchResults(filteredResults.reverse());
    }, [posts, search])

    // *********************************************************

    const handleDelete = async (id) => {
        try {
            await api.delete(`/posts/${id}`)
            const postsList = posts.filter(post => post.id !== id);
            setPosts(postsList);
            navigate('/');
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }

    }

    // ************************************************************

    const handleSubmit = async (e) => {
        console.log('hello');
        e.preventDefault();
        const id = posts.length
            ? posts[posts.length - 1].id + 1
            : 1;
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const newPost = {
            id,
            title: postTitle,
            datetime,
            body: postBody
        };
        try {
            const response = await api.post('posts', newPost);
            const allPosts = [
                ...posts,
                response.data
            ];
            setPosts(allPosts);
            setPostBody('');
            setPostTitle('');
            navigate('/');
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    const handleEdit = async (id) => {
        const datetime = format(new Date(), 'MMMM dd, yyyy pp');
        const updatedPost = {
            id,
            title: editTitle,
            datetime,
            body: editBody
        };
        try {
            const response = await api.put(`/posts/${id}`, updatedPost);
            setPosts(posts.map(post => post.id === id ? {...response.data} : post));
            setEditTitle('');
            setEditBody('');
            navigate('/');
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    return (
        <div className="App">
            <Header title={'React Js Blog'} width={width} />
            <Nav search={search} setSearch={setSearch}/>
            <Routes>
                <Route
                    path='/'
                    element={<Home posts = {
                        searchResults
                    } 
                    fetchError={fetchError}
                    isLoading={isLoading}
                    />
}/>
                <Route
                    path='/post'
                    element={<NewPost handleSubmit = {
                        handleSubmit
                    }
                    postTitle = {
                        postTitle
                    }
                    setPostTitle = {
                        setPostTitle
                    }
                    postBody = {
                        postBody
                    }
                    setPostBody = {
                        setPostBody
                    } />
}/>
                <Route
                    path='/post/:id'
                    element={<PostPage posts = {
                        posts
                    }
                    handleDelete = {
                        handleDelete
                    } />
}/>
                <Route
                    path='/edit/:id'
                    element={<EditPost 
                    posts={posts}
                    handleEdit = {
                        handleEdit
                    }
                    editTitle = {
                        editTitle
                    }
                    setEditTitle = {
                        setEditTitle
                    }
                    editBody = {
                        editBody
                    }
                    setEditBody = {
                        setEditBody
                    } />
}/>
                <Route path='/about' element={<About />}/>
                <Route path='*' element={<Missing />}/>
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
