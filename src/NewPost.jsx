const NewPost = ({handleSubmit, postTitle, setPostTitle, postBody, setPostBody}) => {
  return (
    <main className="NewPost">
      <h2>
        New Post
      </h2>
      <form className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Title:</label>
        <input type="text" id="postTitle" required value={postTitle} onChange={(e)=>setPostTitle(e.target.value)} /> 
        <label htmlFor="post">Post:</label>
        <textarea id="post" required value={postBody} onChange={(e)=>setPostBody(e.target.value)} />
        <button type="submit">Submit</button>
     </form>
      
    </main>
  )
}

export default NewPost
