import { use, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { usePostStore } from "../store/postStore";



const PostDetails = () => {
  const { id } = useParams();
  const posts = usePostStore((state) => state.posts);
  const fetchAllposts = usePostStore((state) => state.fetchAllposts);
  useEffect(() => {
  if (posts.length === 0) {
    fetchAllposts();
  }
}, [posts.length, fetchAllposts]);
console.log("posts",posts);
console.log("id",id);
  const post = posts.find((p) => p._id === id);
  console.log("post",post);
const navigate=useNavigate();
  const handleback = () => {
    
      navigate(-1);
    
  };

  return (
    <div className="p-6">
      {post ? (
        <>
          <h2 className="text-2xl font-bold font-color-black mb-4">{post.title}</h2>
          <p className="whitespace-normal break-words break-all">{post.content}</p>
          <button onClick={handleback}>back</button>
        </>
      ) : (
        <p>Post not found</p>
      )}
    </div>
  );
};

export default PostDetails;