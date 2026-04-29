import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useUserStore } from "./userStore";
import toast from "react-hot-toast";

export const usePostStore = create((set, get) => ({
  loading: false,
  posts: [],
  userposts: [],

  // ✅ CREATE POST
  createPost: async (postData) => {
    const userId = useUserStore.getState().user?._id;

    if (!userId) {
      toast.error("User not logged in");
      return false;
    }

    try {
      set({ loading: true });

      // const res = await axiosInstance.post(`/posts`, postData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
const res = await axiosInstance.post(`/posts`, postData);
      set((state) => ({
        posts: [...state.posts, res.data],
        userposts: [...state.userposts, res.data],
        loading: false,
      }));

      toast.success("Post created");
      return true;

    } catch (error) {
      console.error("Create post error:", error);
      set({ loading: false });
      toast.error("Failed to create post");
      return false;
    }
  },

  // ✅ FETCH ALL POSTS
  fetchAllposts: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/posts");
       console.log("API RESPONSE:", res.data);
 let postsData = [];
    // ✅ Handle all cases safely
    if (Array.isArray(res.data)) {
      postsData = res.data;
    } else if (Array.isArray(res.data.posts)) {
      postsData = res.data.posts;
    } else {
      console.error("❌ Unexpected response format:", res.data);
    }
      // set({ posts: res.data, loading: false });
      set({posts:postsData,loading:false});
    } catch (error) {
      console.error(error);
      
      set({ loading: false });
    }
  },

  // ✅ FETCH USER POSTS
  fetchPostByUser: async (userId) => {
    if (!userId) return;

    try {
      const res = await axiosInstance.get(`/posts/${userId}`);
      set({ userposts: res.data });
    } catch (error) {
      console.error("Fetch user posts error:", error);
    }
  },

  // ✅ UPDATE POST
  updatePost: async (id, updatedData) => {
    try {
      // await axiosInstance.put(`/posts/${id}`, updatedData, {
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });
      await axiosInstance.put(`/posts/${id}`, updatedData);
      set((state) => ({
  posts: state.posts.map((post) =>
    post._id === id ? get.data : post
  ),
}));



      toast.success("Post updated");
      return true;

    } catch (err) {
      console.error(err);
      toast.error("Update failed");
      return false;
    }
  },

  // ✅ DELETE POST
  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);

      set((state) => ({
        userposts: state.userposts.filter(
          (post) => post._id !== postId
        ),
        posts: state.posts.filter((post) => post._id !== postId)
      }));

      toast.success("Post deleted");

    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  },
  toggleLike: async (postId) => {
  try {
    const res = await axiosInstance.put(`/posts/like/${postId}`);

    const { liked, likesCount } = res.data;

    // update posts in store
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === postId
          ? {
              ...post,
              likes: liked
                ? [...(post.likes || []), "temp"] // UI count fix
                : post.likes.slice(0, -1),
              liked,
            }
          : post
      ),
    }));

    return res.data;

  } catch (error) {
    console.error(error);
    toast.error("Like failed");
  }
},

  // ✅ AI SUMMARY
  generateSummary: async (content) => {
    try {
      const res = await axiosInstance.post("/ai/summary", { content });
      return res.data.summary;
    } catch (error) {
      console.error(error);
      return "AI limit reached";
    }
  },
}));