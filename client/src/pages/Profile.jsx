
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"
import {
 
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {app} from "../firebase.js";

import { updateUserStart,
  updateUserFailure,updateUserSuccess,deleteUserFailure,
  deleteUserStart,deleteUserSuccess,
  signOutUserFailure,signOutUserStart,signOutUserSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser,loading,error} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData]  = useState({});
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();


 // console.log(filePerc)

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload =  (file) => {
    const storage =  getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) =>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      // console.log('Upload is '+ progress + '% done');

      setFilePerc(Math.round(progress));
      
  
    },
    (error)=>{
      if(error)
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL});

      });
     
    }
  );
  }
  //console.log(formData);

  // firebase storage
  // allow read;
  //     allow write: if
  //     request.resource.size < 2*1024*1024 && 
  //     request.resource.contentType.matches('image/.*');

  const handleChange = (e)=>{
    setFormData({...formData,[e.target.id]:e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
       setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };


  const handleDeleteUser = async()=>{
      try {

        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {method: 'DELETE'});

        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }

        dispatch(deleteUserSuccess(data));
        setUpdateSuccess(false);
       
        
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
        
      }
  }

  const handleSignOut = async()=>{
      try {
        dispatch(signOutUserStart());
        const res = await fetch('api/auth/signout');

        const data = await res.json();

        if(data.success === false){
          dispatch(signOutUserFailure(data.message));
          return;
        }

        dispatch(signOutUserSuccess(data));
        setUpdateSuccess(false);

      } catch (error) {
        dispatch(signOutUserFailure(error.message));
      }
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange = {(e)=> setFile(e.target.files[0])}type="file" ref={fileRef} hidden/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-sm text-center">
          {
            fileUploadError ? (<span className="text-red-600">Error Image Upload (image should be less than 2MB</span>):
             filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>)
             : filePerc === 100 ? (<span className="text-green-600">Image Successfully Uploaded!</span>)
             : ("")


          }
        </p>
        <input type="text" defaultValue={currentUser.username} placeholder="username" id="username" onChange={handleChange} className="broder p-3 rounded-lg"/>
        <input type="email" defaultValue={currentUser.email} placeholder="email" id="email"onChange={handleChange} className="broder p-3 rounded-lg"/>
        <input type="password" placeholder="password" id="password"onChange={handleChange} className="broder p-3 rounded-lg"/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 ">
         {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
          Create Listing
         </Link>
      </form>
      <div className="flex justify-between mt-5">
        <button onClick={handleDeleteUser} className="text-red-800 cursor-pointer ">
          Delete account
        </button>
        <button onClick={handleSignOut} className="text-red-800 p-3 cursor-pointer ">
          Sign out
        </button>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' :''}</p>
    </div>
  )
}
