import React from 'react'
import { Link, useParams } from 'react-router-dom'

const PostPage = ({ posts, handleDelete }) => {
    const { id } = useParams();
    const post = posts.find(post => (post.id).toString() === id);
    return (
        <main className="PostPage">
            <article className='post'>
                {post &&
                    <>
                        <h2>{post.title}</h2>
                        <p className="postDate">{post.datetime}</p>
                        <p className="postbody">{post.body}</p>
                        <Link to={`/edit/${post.id}`}> <button className="editButton">
                            Edit Post
                        </button></Link>
                        <button className="deleteButton" onClick={() => handleDelete(post.id)}>
                            Delete Post
                        </button>
                    </>
                }
                {!post &&
                    <>
                        <h2>Post Not Found</h2>
                        <p>Well, that i disappointing</p>
                        <p>
                            <Link to="/">Visit Our Homepage</Link>
                        </p>
                    </>
                }

            </article>

        </main>
    )
}

export default PostPage