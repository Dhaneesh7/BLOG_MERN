 import { useEffect, useState } from "react";
import { usePostStore } from "../store/postStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
// import { deletePost } from "../../../Backend/controllers.js/postControllers";

const Dashboard = () => {
  const{addPost,createPost,deletePost}=usePostStore();
  
  const [search, setSearch] = useState("");

  const user = useUserStore((s) => s.user);
    const userId = user?._id;
  if (!userId) {
    console.error("User ID is not available");
  }
  const fetchPostByUser = usePostStore((s) => s.fetchPostByUser);

const navigate = useNavigate();
  const userPosts = usePostStore((s) => s.userposts);

  const [newPost, setNewPost] = useState({ title: "", content: "",author: "" });
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
     const success = await createPost(newPost); // wait for post creation
  if (success) {
    setNewPost({ title: "", content: "", author: "" }); // clear form
    fetchPostByUser(userId); // refresh userPosts
  }
  };
  const generateSummary = async () => {
 console.log("Generating summary for:", newPost.content);
};
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
    <div className="p-6 border-bold p-1">
      <h2 className="text-2xl font-bold mb-4">Manage Your Posts</h2>
    
<div className="flex md:space-x-4 w-3/5 border-2 items-center bg-gray-100">
   <div className="flex-1" >
      <input
        type="text"
        placeholder="Title"
        className="border p-5 w-3/5 mb-2 ml-4 mt-2"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <textarea
        placeholder="Content"
        className="border p-5 w-3/5 mb-2 ml-4 mt-2"
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
      />
            <input
        type="text"
        placeholder="author"
        className="border p-5 w-3/5 mb-2 ml-4 mt-2"
        value={newPost.author}
        onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
      />
            <div className="mt-2 flex space-x-2 ml-5 ">
      <button onClick={handleCreate} className="bg-blue-500 text-white px-4 py-2 mb-2 ">
        Add Post
      </button>
      <button onClick={generateSummary} className="bg-blue-500 text-white px-4 py-2 ml-8 mb-2">
        AI summary
      </button>
      </div>
</div>

    <div className="p-6 border-bold w-80">
      <textarea placeholder="AI summary" className="border p-2 w-full md:w-full mb-2" value={summary} readOnly></textarea>
</div >
</div>
      <h3 className="text-xl font-bold mt-4">Your Posts</h3>
          {console.log("User posts:", userPosts)}

      {userPosts.length === 0 ? (
  <p>No posts found.</p>
) : (
      userPosts.filter((entry)=>entry?._id || entry?.post?._id).
      map((entry) => {
         const p = entry.post || entry;
      // userPosts.map((p) => {
         return(
        
        <div key={p._id} className="border p-4 mb-4" onClick={() => handlepost(p)}>
          {console.log("Post:", p)}
          <h4 className="text-lg font-semibold">{p.title}</h4>
          {console.log("Post content:", p.title) }
          {console.log("Post content:", p.content) }
          <p className="whitespace-normal break-words break-all">{p.content?.slice(0,60)}</p>
          <button className="text-blue-500 mt-2 g" onClick={(e) => handledelete(e, p._id)}>delete</button>
        </div>
      );}))} 
    </div>
  );
};

export default Dashboard;