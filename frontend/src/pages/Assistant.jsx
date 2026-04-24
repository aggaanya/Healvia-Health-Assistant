import { useState, useEffect } from "react";
import Sidebar from "../components/Assistant/Sidebar";
import ChatHeader from "../components/Assistant/ChatHeader";
import ChatMessages from "../components/Assistant/ChatMessages";
import ChatInput from "../components/Assistant/ChatInput";

const Assistant = () => {
  const initialChats = [
    {
      id: 1,
      title: "New conversation",
      date: new Date(),
      messages: []
    }
  ];

  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(1);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [files, setFiles] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const footers = document.querySelectorAll('footer');
    footers.forEach(footer => {
      footer.style.display = 'none';
    });

    return () => {
      footers.forEach(footer => {
        footer.style.display = '';
      });
    };
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId);
  const hasMessages = activeChat?.messages.length > 0;

  const handleSend = (msg) => {
    if (!msg.trim()) return;

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: msg
    };

    setChats(prev => prev.map(chat =>
      chat.id === activeChatId
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            title: chat.messages.length === 0 ? msg.slice(0, 30) + (msg.length > 30 ? "..." : "") : chat.title
          }
        : chat
    ));

    setMessage("");
    setIsThinking(true);

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: "This is a temporary response"
      };

      setChats(prev => prev.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, aiResponse] }
          : chat
      ));
      setIsThinking(false);
    }, 2000);
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New conversation",
      date: new Date(),
      messages: []
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const handleMenuAction = (action, chatId) => {
    setOpenMenuId(null);

    switch(action) {
      case "share":
        console.log("Share chat:", chatId);
        break;
      case "rename":
        const newTitle = prompt("Enter new chat name:");
        if (newTitle) {
          setChats(prev => prev.map(chat =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
          ));
        }
        break;
      case "pin":
        console.log("Pin chat:", chatId);
        break;
      case "archive":
        console.log("Archive chat:", chatId);
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this chat?")) {
          setChats(prev => prev.filter(chat => chat.id !== chatId));
          if (activeChatId === chatId && chats.length > 1) {
            setActiveChatId(chats.find(c => c.id !== chatId).id);
          }
        }
        break;
    }
  };

  return (
    <div className="assistant-page flex h-screen bg-white overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
        onMenuAction={handleMenuAction}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
        {hasMessages ? (
          <>
            <ChatHeader
              onUpload={handleFileUpload}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              user={user}
              setUser={setUser}
            />

            <ChatMessages messages={activeChat.messages} isThinking={isThinking && activeChat.messages.length > 0} />
            <ChatInput
              onSend={handleSend}
              onUpload={handleFileUpload}
              value={message}
              setValue={setMessage}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatInput
              onSend={handleSend}
              onUpload={handleFileUpload}
              value={message}
              setValue={setMessage}
              centered={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;