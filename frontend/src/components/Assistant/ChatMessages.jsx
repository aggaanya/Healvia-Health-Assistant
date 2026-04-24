import { useRef, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import ThinkingBubble from "./ThinkingBubble";

const ChatMessages = ({ messages, isThinking }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages, isThinking]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {isThinking && <ThinkingBubble />}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;