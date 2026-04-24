const ChatBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 mt-1">
          H
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
            : "bg-white text-gray-800 border border-gray-200 shadow-sm"
        }`}
      >
        <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0 mt-1">
          U
        </div>
      )}
    </div>
  );
};

export default ChatBubble;