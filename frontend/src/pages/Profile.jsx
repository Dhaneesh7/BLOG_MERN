import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
const Profile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
const [editingBio, setEditingBio] = useState(false);
const [bio, setBio] = useState("");
  useEffect(() => {
    axiosInstance.get(`/users/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = async () => {
    try {
      const res = await axiosInstance.put(
        `/users/avatar/${data._id}`,
        { image: reader.result }
      );    

      setData(res.data); // update UI instantly
    } catch (err) {
      console.log(err);
    }
  };

  reader.readAsDataURL(file);
};
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="bg-white shadow-lg rounded-2xl p-6 w-80 text-center">

      {/* Avatar */}
      {/* <img
        src={
          data.avatar?.url ||
          `https://ui-avatars.com/api/?name=${data.name}&background=6366f1&color=fff`
        }
        alt="avatar"
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-indigo-500"
      /> */}
      <input
  type="file"
  accept="image/*"
  className="hidden"
  id="avatarUpload"
  onChange={handleImageChange}
/>

<label htmlFor="avatarUpload" className="items-center justify-center flex cursor-pointer">
  <img
    src={
      data.avatar?.url ||
      `https://ui-avatars.com/api/?name=${data.name}`
    }
    className="w-24 h-24 rounded-full cursor-pointer "
  />
</label>

      {/* Name */}
      <h1 className="text-xl font-bold text-gray-800">
        {data.name}
      </h1>

      {/* Email */}
      <p className="text-gray-500 text-sm mt-1">
        {data.email}
      </p>
      {/* {data.bio ? (
  <p className="text-gray-600 mt-3 text-sm">
    {data.bio}
  </p>
) : (
  <button
    className="mt-3 text-sm text-indigo-600 border border-indigo-500 px-3 py-1 rounded hover:bg-indigo-50"
    onClick={() => alert("Add bio feature coming soon")}
  >
    + Add Bio
  </button>
)} */}
{editingBio ? (
  <div className="mt-3">
    <textarea
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      className="w-full border rounded p-2 text-sm"
      placeholder="Write your bio..."
    />

    <button
      className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded"
      onClick={async () => {
        // temporary (no backend yet)
        // setData({ ...data, bio });
 const res = await axiosInstance.put(`/users/${data._id}`, { bio });

  setData(res.data); 
          setEditingBio(false);
      }}
    >
      Save
    </button>
  </div>
) : data.bio ? (
  <p
    className="text-gray-600 mt-3 text-sm cursor-pointer"
    onClick={() => {
      setBio(data.bio);
      setEditingBio(true);
    }}
  >
   <p className="font-bold">Bio</p> {data.bio}
  </p>
) : (
  <button
    className="mt-3 text-sm text-indigo-600 border border-indigo-500 px-3 py-1 rounded hover:bg-indigo-50"
    onClick={() => setEditingBio(true)}
  >
    + Add Bio
  </button>
)}
<div className="flex justify-around mt-4 text-center">
  <div>
    <p className="font-bold">{data.posts?.length || 0}</p>
    <p className="text-sm text-gray-500">Posts</p>
  </div>
</div>
{data.createdAt && (
<p className="text-xs text-gray-400 mt-2">
  Joined {new Date(data.createdAt).toDateString()}
</p>)}
    </div>
    
  </div>
  );
};

export default Profile;