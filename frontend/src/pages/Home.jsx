 import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePostStore } from "../store/postStore";
import { shallow } from "zustand/shallow";

const Home = () => {
  const [search, setSearch] = useState("");
// const { fetchAllposts ,posts} = usePostStore();
const fetchAllposts = usePostStore((state) =>  state.fetchAllposts);

const posts = usePostStore((state) => state.posts);

// const { fetchAllposts, posts } = usePostStore(
//   state => ({ fetchAllposts: state.fetchAllposts, posts: state.posts }),
// );

  // const filteredPosts = posts.filter((post) =>
  //   post.title.toLowerCase().includes(search.toLowerCase())
  // );
  const navigate=useNavigate();

   useEffect(() => {

      fetchAllposts();
    },[] );
    
// useEffect(() => {
//   console.log("📬 Posts updated:", posts);
// }, [posts]);
    console.log("Posts in state:", posts);
console.log("post author",posts.author);
  const handlepost = (post) => {
    
      navigate(`/post/${post._id}`);
    
  };
    const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(search.toLowerCase())
  );
  
 
  return (
    <div className="p-6  ">
      <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
      <input
        type="text"
        placeholder="Search posts..."
          className="w-full p-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
        // className="border p-2 mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
     {posts.length === 0 ? (
  <p>No posts available.</p>
) : (
  <div className=" items-start justify-between grid grid-cols-1 md:grid-cols-2 gap-6">
     {filteredPosts.map((post) => (
        <div key={post._id} onClick={()=>handlepost(post)}className="border p-4 mb-4 rounded w-full shadow hover:bg-gray-200 hover:shadow-xl 3/5 cursor-pointer transition duration-300">
          <h3 className="text-xl font-semibold">{post.title}</h3>
          <div className="flex items-center">
           {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-16 h-16 object-cover rounded mr-4"
              />
            )}
            </div>
          <p className="whitespace-normal break-words break-all">{post.content.slice(0,30)}...</p>
          {console.log("Post content:", post.author)}
          <p className="text-gray-500 allign-end text right">By {post.author || "Unknown"}</p>
          <Link to={`/post/${post}`} className="text-blue-500">Read More</Link>
        </div>
      ))}
      </div>)}
    </div>
  );
};

export default Home;