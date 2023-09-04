import Header from './Header';
import Nav from './Nav';
import Footer from './Footer';
import Home from './Home';
import NewPost from './NewPost';
import PostPage from './PostPage';
import EditPost from './EditPost';
import About from './About';
import Missing from './Missing';
import { Route, useNavigate } from 'react-router-dom';
import { Routes } from "react-router";
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import api from './api/posts';


function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          //Not in the 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error:${err.message}`)
        }
      }
    }
    fetchPosts();
  }, [])

  useEffect(() => {
    const filteredResults = posts.filter(post =>
      ((post.body).toLowerCase()).includes(search.toLocaleLowerCase())
      || ((post.title).toLowerCase()).includes(search.toLocaleLowerCase())
    );
    setSearchResults(filteredResults.reverse());
  }, [posts, search])

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPosts(posts.map(post => post.id === id ?
        { ...response.data } : post
      ));
      setEditTitle('');
      setEditBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error:${err.message}`);
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postList = posts.filter(post => post.id !== id);
      setPosts(postList);
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }
  }

  return (
    <div className="App">
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route exact path="/" element={<Home posts={searchResults} />} />
        <Route exact path="/post" element={<NewPost
          postTitle={postTitle}
          setPostTitle={setPostTitle}
          postBody={postBody}
          setPostBody={setPostBody}
          handleSubmit={handleSubmit}
        />} />
        <Route path="/edit/:id" element={<EditPost
          posts={posts}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editBody={editBody}
          setEditBody={setEditBody}
          handleEdit={handleEdit}
        />} />
        <Route exact path="/post/:id" element={
          <PostPage
            posts={posts}
            handleDelete={handleDelete}
          />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="*" element={<Missing />} />
      </Routes>
      <Footer />

    </div>
  );
}

export default App;
