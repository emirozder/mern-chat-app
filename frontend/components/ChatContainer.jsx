import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      {/* <ChatMessages /> */}
      <p>messages</p>
      {/* <ChatInputArea /> */}
    </div>
  );
};

export default ChatContainer;
