import { HiLogout } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";

const ProfilePictureMenu = ({ user }: { user: any }) => {
    return (
        <div className="w-70 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl p-4 flex flex-col gap-1 slim-dark-scrollbar" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center w-full">
                    <div className="flex flex-col w-full">
                        <img src={user.profile_picture} alt="x" className='h-12 w-12 rounded-full p-0 cursor-pointer ' />
                        <p className="text text-xl text-white font-semibold my-2">
                            {user.first_name + " " + user.last_name}
                        </p>
                        <div className="flex gap-2 items-center flex-wrap w-full text-gray-300">
                            <p className="text text-sm break-words w-full">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-700"></div>

            {/* Logout Option */}
            <div className="gap-2">
                <div className="text flex items-center gap-2 text-gray-400 hover:bg-indigo-800 hover:text-white transition-all duration-300 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                        if (user.role === 'faculty' || user.role === 'admin') {
                            window.location.replace("/faculty/profile");
                        } else {
                            window.location.replace("/student/profile");
                        }
                    }}>
                    <CgProfile size={24} />
                    <span className="font-semibold">Edit Profile</span>
                </div>
                <div className="text flex items-center gap-2 text-gray-400 hover:bg-pink-800 hover:text-white transition-all duration-300 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                        window.location.replace("https://gehutimetable.vercel.app/view/students/");
                    }}>
                    <div className="p-0">
                        <p className="text-xs m-0">See Timetable on </p>
                        <span className="font-semibold">Class-Sync™</span>
                    </div>
                </div>
                <div className="text flex items-center gap-2 text-gray-400 hover:bg-cyan-800 hover:text-white transition-all duration-300 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                        window.location.replace("https://gehutimetable.vercel.app/view/students/");
                    }}>
                    <div className="p-0">
                        <p className="text-xs m-0">See Room Status on </p>
                        <span className="font-semibold">Navit™</span>
                    </div>
                </div>
                <div className="text flex items-center gap-2 text-gray-400 hover:bg-red-800 hover:text-white transition-all duration-300 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/signin";  // Redirect to login page
                    }}>
                    <HiLogout size={24} />
                    <span className="font-semibold">Logout</span>
                </div>
                <div className="text flex items-center gap-2 text-gray-400 hover:bg-red-800 hover:text-white transition-all duration-300 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                        window.location.href = "/student";  // Redirect to student page
                    }}>
                    <span className="font-semibold">Student</span>
                </div>
                <div className="text flex items-center gap-2 text-gray-400 hover:bg-red-800 hover:text-white transition-all duration-300 p-2 rounded-md cursor-pointer"
                    onClick={() => {
                        window.location.href = "/faculty";  // Redirect to faculty page
                    }}>
                    <span className="font-semibold">Faculty</span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePictureMenu;
