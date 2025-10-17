'use client';
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import logo from "@/assets/img/logo.png";
import profilepicture from "@/assets/img/profile_picture.jpg";

// // data fetch from class-sync api when available currently only hardcoded is the way
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5";
import { User } from "@/models/user.type";
import { navit_server } from "@/utils/constant";

const Profile = () => {
  const [error, setError] = useState("");
  const [sendbuttonfreeze, setSendButtonFreeze] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userexists = localStorage.getItem('user');
    if (userexists) {
      setUser(JSON.parse(userexists));
    } else {
      localStorage.clear();
      window.location.href = '/signin';
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendButtonFreeze(true);

    if (!localStorage.getItem("token")) {
      toast.error("You are not logged in. Please log in to update your profile.");
      setSendButtonFreeze(false);
      return;
    }

    const toastid = toast.loading("Updating profile...");
    try {
      fetch(`${navit_server}/upload_face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          face_image: user?.face_image || "",
          email: user?.email || "",
          face_descriptor: user?.face_descriptor || ""
        })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem("user", JSON.stringify(data.data.user));
            setUser(data.data.user);
            toast.success("Profile updated successfully!", { id: toastid });
            setSendButtonFreeze(false);
            setError("");
          } else {
            setSendButtonFreeze(false);
            setError(data.errors || "Something went wrong.");
            toast.error(data.errors || "Failed to update profile. Please try again later.", { id: toastid });
          }
        }).catch(error => {
          setSendButtonFreeze(false);
          setError("Failed to update profile. Please try again later.");
          toast.error("Failed to update profile. Please try again later.", { id: toastid });
          console.error('out of service.. ~_~  @_@', error);
        });
    } catch (err) {
      setError("Failed to register. Please try again later.");
    }
  };

  // Handle image upload, resize to max 400px, compress to <300KB, and convert to base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageProcessing(true);
      const maxFileSize = 300 * 1024; // 300KB
      const maxDim = 400; // Resize to 400x400

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Calculate square crop from center
          const side = Math.min(img.width, img.height);
          const sx = (img.width - side) / 2;
          const sy = (img.height - side) / 2;

          // Prepare canvas
          const canvas = document.createElement("canvas");
          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext("2d");
          // Ensure we have a valid 2D rendering context before drawing
          if (!ctx) {
            setError("Unable to process image. Your browser may not support canvas.");
            setImageProcessing(false);
            return;
          }

          // Draw cropped and resized image
          ctx.drawImage(
            img,
            sx, sy, side, side,       // crop source
            0, 0, maxDim, maxDim       // draw to canvas (resize)
          );

          // Compress to JPEG under 300KB
          let quality = 0.92;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length > maxFileSize * 1.37 && quality > 0.4) {
            quality -= 0.07;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }

          if (dataUrl.length > maxFileSize * 1.37) {
            setError("Image is too large, please choose a smaller image.");
          } else {
            setUser((prev: any) => ({ ...prev, face_image: dataUrl }));
          }

          setImageProcessing(false);
        };

        img.onerror = () => {
          setError("Invalid image file.");
          setImageProcessing(false);
        };

        // Ensure the FileReader result is a string before assigning to img.src
        const result = event?.target?.result;
        if (typeof result === "string") {
          img.src = result;
        } else {
          setError("Unable to read image data.");
          setImageProcessing(false);
        }
      };

      reader.readAsDataURL(file);
      setError(""); // Clear error
    }
  };
  const [uploading, setUploading] = useState(false);

  if (!user) {
    return null;
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col lg:flex-row flex-grow min-h-screen mb-10">
        <div className="flex flex-grow justify-center items-center bg-white p-6">
          <div className="w-full max-w-xl flex flex-col justify-center min-h-[80vh] mx-auto"> {/* Added vertical centering */}
            <button
              type="button"
              onClick={() => (window.location.href = "/faculty")}
              className="flex items-center gap-2 mb-4 text-brand-primary-dark hover:text-primary-dark font-semibold"
            >
              <IoChevronBackOutline size={20} />
              Back
            </button>
            <div className="space-y-6 flex flex-col items-center">
              <div className="md:flex items-center gap-6 shadow-lg p-6 rounded-2xl w-full max-w-2xl mx-auto">
                <img
                  src={user?.profile_picture || profilepicture.src}
                  alt="Profile"
                  aria-label="Change profile picture"
                  className="h-32 w-32 rounded-full border-2 border-primary object-cover flex-shrink-0"
                />
                <div className="flex flex-col text-left">
                  <p className="text my-1 text-xl font-bold">{`${user?.first_name || ''} ${user?.last_name || ''}`.trim()}</p>
                  <p className="text my-1 text-gray-500 text-sm uppercase font-bold">{user?.role}</p>
                  <p className="text my-1 text-gray-500 text-sm font-bold">{user?.email}</p>
                  <div className="md:flex items-center gap-4 text-gray-500 text-sm text font-bold md:my-1">
                    {user?.course && <p className="m-0">Course: {user.course}</p>}
                    {user?.semester && <p className="m-0">Semester: {user.semester}</p>}
                    {user?.section && <p className="m-0">Section: {user.section}</p>}
                  </div>

                  <a
                    href="https://navit.vercel.app/profile"
                    className="text my-1 text-sm font-semibold text-primary hover:underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Edit Profile
                  </a>
                  <p className="text text-xs">Logout and re-login to see changes.</p>
                </div>
              </div>

              <div className="flex flex-col items-center md:flex shadow-lg p-6 rounded-2xl w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-3 flex flex-col items-center w-full">
                  <img
                    src={user.face_image || profilepicture.src}
                    alt="Face match"
                    className="h-40 w-40 rounded-lg border-2 border-gray-400 object-cover cursor-pointer hover:opacity-80 transition"
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to change face match image"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <p className="text text-xs text-center"> This image is used for face verification. <br />It will be approved by faculty member.</p>
                  <div className={`text text-center p-2 my-0 rounded-md ${user.face_verified ? "bg-green-200" : "bg-red-200"} w-full`}>
                    <p className={`my-1 text-sm uppercase font-bold ${user.face_verified ? "text-green-700" : "text-red-700"}`}>{user.face_verified ? "Verified" : "Not Verified"}</p>
                  </div>
                  {uploading && <p className="text-blue-500 text-sm m-0">Processing image...</p>}
                  {error && <p className="text-red-500 text-sm m-0">{error}</p>}
                </form>

                {/* Error/Success Messages */}
                <div className="h-2 font-semibold">
                  {imageProcessing && <span className="text-blue-500 text-sm">Processing image...</span>}
                  {<p className="text-red-500 text-sm">{error}</p>}
                </div>

                {/* Buttons */}
                <button
                  type="submit"
                  disabled={sendbuttonfreeze || imageProcessing}
                  className={`flex w-full justify-center items-center py-3 text px-4 rounded-3xl gap-2 text-white font-bold ${sendbuttonfreeze || imageProcessing ? "cursor-not-allowed bg-gray-400" : "bg-blue-600 hover:cursor-pointer hover:bg-blue-700"}`}
                >
                  <span>{imageProcessing ? "Processing..." : "Update Face"}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-brand-primary-dark text-white py-3 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Brand Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="flex items-center">
              <img
                className="h-[4rem] object-contain"
                src={logo.src}
                alt="Navit app logo"
              />
              <p className="text-gray-400 text-sm mt-1 align-baseline">Attendance Manager</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-2 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ProxyProof. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a
                href="https://github.com/ayush-saklani/navit"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition duration-300"
              >
                <FaGithub className="text-[#053a4c]" size={22} />
              </a>
              <a
                href="https://www.linkedin.in/ayush-saklani/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition duration-300"
              >
                <FaLinkedin className="text-[#053a4c]" size={22} />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div >
  );
};

export default Profile;