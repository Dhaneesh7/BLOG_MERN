import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { usePostStore } from "../store/postStore";

import axiosInstance from "../lib/axios";

const PostDetails = () => {
  const { id } = useParams();
  const posts = usePostStore((state) => state.posts);
  const fetchAllposts = usePostStore((state) => state.fetchAllposts);
    const toggleLike = usePostStore((state) => state.toggleLike);
  const [loading, setLoading] = useState(true);
   const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Comment state
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

//   useEffect(() => {
//   if (posts.length === 0) {
//     fetchAllposts();
//   }
// }, [posts.length, fetchAllposts]);

useEffect(() => {
  const load = async () => {
    if (posts.length === 0) {
      await fetchAllposts();
    }
    setLoading(false);
  };
  load();
}, [posts.length, fetchAllposts]);
console.log("posts",posts);
console.log("id",id);
  const post = posts.find((p) => p._id === id);
  console.log("post",post);
   useEffect(() => {
    if (post) {
      setLiked(post.liked || false);
      setLikesCount(post.likes?.length || 0);
    }
  }, [post]);
    useEffect(() => {
    const fetchComments = async () => {
      const res = await axiosInstance.get(`/comments/post/${id}`);
      setComments(res.data.comments || res.data);
    };
    fetchComments();
  }, [id]);
const navigate=useNavigate();
  const handleback = () => {
    
      navigate(-1);
    
  };
    const handleLike = async () => {
    try {
      const res = await toggleLike(post._id);
      if(!res) return;
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;

    const res = await axiosInstance.post(
      `/comments/add/${id}`,
      { text },
      { withCredentials: true }
    );

    setComments([res.data.comment || res.data, ...comments]);
    setText("");
  };

  const handleDeleteComment = async (commentId) => {
    await axiosInstance.delete(`/comments/delete/${commentId}`, {
      withCredentials: true
    });

    setComments(comments.filter((c) => c._id !== commentId));
  };

if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">

   {
      post ? (
        <>
          <h2 className="text-2xl font-bold font-color-black mb-4">{post.title}</h2>
          <div className="flex items-center mt-2 justify-center">
           {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className=" w-2/5 h-2/5 object-cover rounded"
              />
            )}
            </div>
          <p className="whitespace-normal break-words break-all">{post.content}</p>
            <div className="mb-6">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded ${
            liked ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          ❤️ {likesCount}
        </button>
      </div>
            <div>
        <h3 className="text-lg font-semibold mb-2">Comments</h3>

        {/* Add comment */}
        <div className="flex gap-2 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-2 flex-1 rounded"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Post
          </button>
        </div>      {comments.map((c) => (
          <div key={c._id} className="border p-2 mb-2 rounded">
            <p className="text-sm text-gray-600">
              {c.user?.name || "User"}
            </p>
            <p>{c.text}</p>

            <button
              onClick={() => handleDeleteComment(c._id)}
              className="text-red-500 text-xs mt-1"
            >
              Delete
            </button>
          </div>
        ))}
        </div>

          <button onClick={handleback}>back</button>
        </>
      ) : (
        <p>Post not found</p>
      )}
    </div>
  );
};

export default PostDetails;