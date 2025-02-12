import { Users } from "lucide-react";
import { useEffect } from "react";
import { useChatStore } from "../src/store/useChatStore";
import SidebarSkeleton from "./SidebarSkeleton";

const Sidebar = () => {
  const { users, selectedUser, isUsersLoading, getUsers, setSelectedUser } =
    useChatStore();

  useEffect(() => {
    users.length === 0 && getUsers();
  }, [getUsers, users.length]);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {isUsersLoading ? (
        <SidebarSkeleton />
      ) : (
        <div className="overflow-y-auto w-full py-3">
          {users?.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <span className="font-medium truncate">{user.fullName}</span>
                <div className="text-sm text-zinc-500">Online or Offline</div>
              </div>
            </button>
          ))}

          {users?.length === 0 && (
            <div className="text-center text-accent-content py-4">No users</div>
          )}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
