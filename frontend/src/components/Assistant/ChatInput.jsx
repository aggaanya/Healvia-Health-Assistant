import { useRef, useEffect } from "react";
import { Send, Paperclip, Sparkles, Mic } from "lucide-react";

const ChatInput = ({ onSend, onUpload, value, setValue, centered = false }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (centered) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6">
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-normal text-gray-800">
              How can I help you today?
            </h1>
          </div>
          
          <div className="bg-white border border-gray-300 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow">
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Healvia Assistant"
              className="w-full resize-none bg-transparent px-6 py-5 text-base focus:outline-none max-h-[200px]"
            />
            
            <div className="flex items-center justify-between px-4 pb-4 border-t border-gray-200 pt-3">
              <div className="flex items-center gap-2">
                <label className="cursor-pointer p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={20} className="text-gray-600" />
                  <input type="file" multiple hidden onChange={onUpload} />
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Mic size={20} className="text-gray-600" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!value.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 bg-white px-6 py-4 border-t border-gray-200">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-white border-2 border-gray-200 rounded-3xl shadow-lg hover:shadow-xl hover:border-gray-300 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 p-2">
          <label className="cursor-pointer p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
            <Paperclip size={20} className="text-gray-500" />
            <input type="file" multiple hidden onChange={onUpload} />
          </label>

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Anything"
            className="flex-1 resize-none bg-transparent text-base focus:outline-none max-h-[200px] py-2.5 text-gray-800 placeholder-gray-400"
          />

          <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
            <Mic size={20} className="text-gray-500" />
          </button>

          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;