const ThinkingBubble = () => {
  return (
    <div className="flex gap-4 justify-start">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
        H
      </div>
      <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-5 py-3.5 shadow-sm">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingBubble;