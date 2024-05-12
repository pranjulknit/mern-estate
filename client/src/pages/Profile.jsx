import { useSelector } from "react-redux"

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"src={currentUser.avatar} alt="Profile"/>
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
