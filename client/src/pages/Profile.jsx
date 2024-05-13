
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"
import {
 
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {app} from "../firebase.js";

export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser} = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData]  = useState({});


  console.log(filePerc)

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
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
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
        <input type="text" placeholder="username" id="username" className="broder p-3 rounded-lg"/>
        <input type="email" placeholder="email" id="email" className="broder p-3 rounded-lg"/>
        <input type="password" placeholder="passwprd" id="password" className="broder p-3 rounded-lg"/>
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 ">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <button className="text-red-800 cursor-pointer ">
          Delete account
        </button>
        <button className="text-red-800 p-3 cursor-pointer ">
          Sign out
        </button>
      </div>
    </div>
  )
}
