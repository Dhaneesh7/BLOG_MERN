 import { useEffect, useState } from "react";
import { usePostStore } from "../store/postStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
// import { deletePost } from "../../../Backend/controllers.js/postControllers";

const Dashboard = () => {
  const{addPost,createPost,deletePost,updatePost,generateSummary}=usePostStore();
  const [editingPostId, setEditingPostId] = useState(null);
const [editPost, setEditPost] = useState({ title: "", content: "", author: "" });
  const [search, setSearch] = useState("");

  const user = useUserStore((s) => s.user);
    const userId = user?._id;
  if (!userId) {
    console.error("User ID is not available");
  }
  const fetchPostByUser = usePostStore((s) => s.fetchPostByUser);

const navigate = useNavigate();
  const userPosts = usePostStore((s) => s.userposts);

  const [newPost, setNewPost] = useState({ title: "", content: "",author: "" ,image: null});
const [summary, setSummary]=useState("")
  // Fetch user posts on mount
  // useEffect(() => {
  //   if (!userId) return;
  //   fetchPostByUser(userId);
  // }, [fetchPostByUser, userId]);

  const handleCreate = async() => {
    // addPost(newPost);
    // createPost(newPost);
    // setPosts([...posts, { id: posts.length + 1, ...newPost }]);
    // setNewPost({ title: "", content: "" });
     const formData = new FormData();

  formData.append("title", newPost.title);
  formData.append("content", newPost.content);
  formData.append("author", newPost.author);

  if (newPost.image) {
    formData.append("image", newPost.image);
  }

     const success = await createPost(formData); // wait for post creation
  if (success) {
    setNewPost({ title: "", content: "", author: "" ,image: null}); // clear form
    fetchPostByUser(userId); // refresh userPosts
  }
  };
  const handleEditClick = (post) => {
  setEditingPostId(post._id);
  setEditPost({
    title: post.title,
    content: post.content,
    author: post.author,
  });
};
const handleUpdate = async () => {
const formData = new FormData();

formData.append("title", editPost.title);
formData.append("content", editPost.content);
formData.append("author", editPost.author);

if (editPost.image) {
  formData.append("image", editPost.image);
}

const success = await updatePost(editingPostId, formData);
  // const success = await updatePost(editingPostId, editPost);

  if (success) {
    setEditingPostId(null);
    setEditPost({ title: "", content: "", author: "" });
    fetchPostByUser(userId);
  }
};
const handleGenarateSummary = async () => {
  if (!newPost.content) {
    alert("Enter content first");
    return;
  }

  const res = await generateSummary(newPost.content);
  setSummary(res);
  }


const handledelete = async (e,postId) => {
    e.stopPropagation(); 
  //   setUserPosts((prev) =>
  //   prev.filter((entry) => (entry._id || entry.post?._id) !== postId)
  // );

  try {
          
    await deletePost(postId);
    console.log("Post deleted successfully");
    fetchPostByUser(userId);
  } catch (error) {
    console.error("Error deleting post:", error);
  }}
  //    const filteredPosts = userPosts.filter((post) =>
  //   post.title?.toLowerCase().includes(search.toLowerCase())
  // );
  

useEffect(() => { 
  if (!userId) {
    console.error("User ID is not available");
    return;
  }
  else{
  fetchPostByUser(userId); }}, [fetchPostByUser,userId]);
  // useEffect(() => {
  //   fetchPostByUser();
  // },[])
  console.log("User ID in Dashboard:", userId);
  console.log("User posts in Dashboard:", userPosts);
      const handlepost = (post) => {
    
      navigate(`/post/${post._id}`);
    
  };
  return (
    // <div className="p-6 border-bold p-1 w-4/5">
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div >
        <h2 className="text-2xl font-bold mb-6">Manage Your Posts</h2>
    
<div className="flex flex-col md:flex-row  border-2 items-center bg-gray-100">
   <div className=" w-full md:w-1/2 space-y-3" >
      <input
        type="text"
        placeholder="Title"
      className="border p-3 w-full rounded"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
      className="border p-3 w-full rounded"
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
      />
      <input
  type="file"
  accept="image/*"
className="border p-2 w-full"  
onChange={(e) =>
    setNewPost({ ...newPost, image: e.target.files[0] })
  }
/>
            <input
        type="text"
        placeholder="author"
        className="border p-5 w-full rounded"
        value={newPost.author}
        onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
      />
      {newPost.image && (
  <img
    src={URL.createObjectURL(newPost.image)}
    alt="preview"
    className="w-40 h-40 object-cover ml-4 mb-2 rounded"
  />
)}
            <div className="mt-2 flex space-x-2 ml-5 ">
      <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 mb-2 ">
        Add Post
      </button>
      <button onClick={handleGenarateSummary} 
        className="border p-3 w-full rounded bg-blue-500 text-white">
        AI summary
      </button>
      </div>
</div>

    <div className="p-6 border-bold w-80">
      <textarea placeholder="AI summary" className="border p-2 h-32 w-full md:w-full mb-2" value={summary} readOnly></textarea>
</div >
</div>
</div>
      <h3 className="text-xl font-bold mt-4">Your Posts</h3>
          {console.log("User posts:", userPosts)}

      {!userPosts || userPosts.length === 0 ? (
  <p>No posts found.</p>
) : (
      userPosts?.filter((entry)=>entry?._id || entry?.post?._id).
      map((entry) => {
         const p = entry.post || entry;
      // userPosts.map((p) => {
         return(
        
        <div key={p._id} className="border p-4 mb-4"
        //  onClick={() => handlepost(p)}
         >{p.image && (
  <img
    src={p.image}
    alt="post"
    className="w-full h-60 object-cover mb-2 rounded"
  />
)}
          {console.log("Post:", p)}
            {editingPostId === p._id ? (
        <>
          <input
            className="border p-2 w-full mb-2"
            value={editPost.title}
            onChange={(e) =>
              setEditPost({ ...editPost, title: e.target.value })
            }
          />
          <textarea
            className="border p-2 w-full mb-2"
            value={editPost.content}
            onChange={(e) =>
              setEditPost({ ...editPost, content: e.target.value })
            }
          />
          <input
            className="border p-2 w-full mb-2"
            value={editPost.author}
            onChange={(e) =>
              setEditPost({ ...editPost, author: e.target.value })
            }
          />
          {p.image && (
  <img
    src={p.image}
    alt="post"
    className="w-full h-60 object-cover mb-2 rounded"
  />
)}
<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setEditPost({ ...editPost, image: e.target.files[0] })
  }
/>

          <button
            // onClick={handleUpdate}
              onClick={(e) => {
    e.stopPropagation();
    handleUpdate();
  }}
            className="bg-green-500 text-white px-3 py-1 mr-2"
          >
            Save
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); 
              setEditingPostId(null);}
            }
            className="bg-gray-500 text-white px-3 py-1"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
        <div onClick={() => handlepost(p)} className="cursor-pointer">
          <h4 className="text-lg font-semibold">{p.title}</h4>
          {console.log("Post content:", p.title) }
          {console.log("Post content:", p.content) }
          <p className="whitespace-normal break-words break-all">{p.content?.slice(0,60)}</p>
          </div>
           <div className="mt-2 space-x-2">

             <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(p);
              }}
              className="bg-yellow-500 text-white px-3 py-1"
            >
              Edit
            </button>
          <button className="text-blue-500 mt-2 g" onClick={(e) => {
            e.stopPropagation();
            handledelete(e, p._id);
          }}>delete</button>
          </div>
        </>
      )}
        </div>
      )}))
    }
    </div>
  );
};

export default Dashboard;