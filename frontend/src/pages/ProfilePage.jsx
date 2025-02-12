import { Camera, Loader, Mail, User } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Img = reader.result;
      setSelectedImg(base64Img);
    };
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImg) return;

    await updateProfile({ profilePic: selectedImg });
    setSelectedImg(null);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <h1 className="text-2xl font-semibold text-center">Profile</h1>

          <div className="flex flex-col items-center gap-4">
            {!isUpdatingProfile ? (
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                >
                  <Camera className="size-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <Loader className="size-10 animate-spin" />
              </div>
            )}

            <p className="text-sm">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="fieldset">
              <label className="label">Full Name</label>
              <label className="input w-full">
                <User className="size-5 text-base-content/40" />
                <input
                  type="text"
                  value={authUser?.fullName}
                  className="input"
                  readOnly
                />
              </label>
            </div>

            <div className="fieldset">
              <label className="label">Email</label>
              <label className="input w-full">
                <Mail className="size-5 text-base-content/40" />
                <input
                  type="text"
                  value={authUser?.email}
                  className="input"
                  readOnly
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              className="btn btn-primary w-32"
              onClick={handleImageUpload}
              disabled={isUpdatingProfile || !selectedImg}
            >
              Save
            </button>
          </div>

          <div className="mt-2 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
