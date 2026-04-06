import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useUserStore } from "./userStore";
import toast from "react-hot-toast";
// import { createPost } from "../../../Backend/controllers.js/postControllers";
// import { deletePost } from "../../../Backend/controllers.js/postControllers";
export const usePostStore = create((set,get) => ({
  loading: false,
  posts: [],
  userposts: [],
  
  addPost: async (postData) => {
           const userId = useUserStore.getState().user?._id;
           if (!userId) {
      toast.error("User not logged in");
      return false;
           }
               try {

      set({ loading: true });
      const response = await axiosInstance.post('/posts', postData); // adjust to your backend API
      console.log("Post created:", response.data);
      set((state) => ({
        posts: [...state.posts, response.data],
        loading: false,
      }));
      toast.success("Post added successfully");
      return true;
    } catch (error) {
      console.error("post creation failed:", error);
      set({ loading: false }); 
      return false;
    }
  },
  createPost: async (postData) => {
           const userId = useUserStore.getState().user?._id;
           if (!userId) {
      toast.error("User not logged in");
      return false;
           }
               try {

      set({ loading: true });
      const response = await axiosInstance.post(`/posts/${userId}`, postData); // adjust to your backend API
      console.log("Post created:", response.data);
      set((state) => ({
        posts: [...state.posts, response.data],
        userposts: [...state.userposts, response.data],
        loading: false,
      }));
      toast.success("Post added successfully");
      return true;
    } catch (error) {
      console.error("post creation failed:", error);
      set({ loading: false }); 
      return false;
    }
  },
  fetchAllposts: async () => {
    try {
                //    const userId = useUserStore.getState().user?._id;

      const response = await axiosInstance.get('/posts');
      console.log("Fetched posts:", response.data);
      set({ posts: response.data });
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  },
  fetchPostByUser: async (userId) => {
    try {
      const response = await axiosInstance.get(`/posts/${userId}`);
      console.log("Fetched user posts:", response.data);
      set({ userposts: response.data });
    } catch (error) {
      console.error("Failed to fetch user posts", error);
    } 
  },
   deletePost: async (postId) => {
    const userId = useUserStore.getState().user?._id;
    if (!userId) {
      toast.error("User not logged in");
      return;
    }
    try {
      // Fix endpoint: your backend expects DELETE /api/carts/:userId with productId in body
      await axiosInstance.delete(`/posts/${postId}`);
      // set((prevState) => ({
      //   userposts: prevState.posts.filter((item) => item._id !== postId),
      // }));
      // get().calculateTotals();
   set((state) => ({
        // userposts: state.userposts.filter((item) => {
        //  const id= item._id || item.post?._id; // handle both _id and id
        //  return id !== postId;
      
        // } ),
        userposts: state.userposts.filter((item) => item._id !== postId)
     
      }));
      toast.success("Product removed from posts");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  },
}));
