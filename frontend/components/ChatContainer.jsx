import { useEffect } from "react";
import { formatMessageTime } from "../src/lib/utils";
import { useAuthStore } from "../src/store/useAuthStore";
import { useChatStore } from "../src/store/useChatStore";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const { authUser } = useAuthStore();
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser?._id);
  }, [getMessages, selectedUser]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {/* <ChatMessages /> */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isMessagesLoading ? (
          <>
            {Array(6)
              .fill(null)
              .map((_, idx) => (
                <div
                  key={idx}
                  className={`chat ${
                    idx % 2 === 0 ? "chat-start" : "chat-end"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="size-10 rounded-full">
                      <div className="skeleton w-full h-full rounded-full" />
                    </div>
                  </div>

                  <div className="chat-header mb-1">
                    <div className="skeleton h-4 w-16" />
                  </div>

                  <div className="chat-bubble bg-transparent p-0">
                    <div className="skeleton h-16 w-[200px]" />
                  </div>
                </div>
              ))}
          </>
        ) : (
          <>
            {messages?.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt={authUser?.fullName}
                      src={
                        message.senderId === authUser._id
                          ? authUser?.profilePic || "/avatar.png"
                          : selectedUser?.profilePic || "/avatar.png"
                      }
                    />
                  </div>
                </div>
                <div className="chat-header mb-0.5">
                  {message.senderId === authUser._id
                    ? authUser?.fullName
                    : selectedUser?.fullName}
                </div>
                <div className="chat-bubble">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
                <time className="text-xs opacity-50">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            ))}
          </>
        )}
      </div>
      {/* <ChatInputArea /> */}
    </div>
  );
};

export default ChatContainer;
