import { useRef, useEffect, useState } from "react";
import { Plus, Search, Settings, MessageSquare, MoreHorizontal, Share2, Edit3, Pin, Archive, Trash2, PanelLeftClose, PanelLeft, User, Palette, HelpCircle, LogOut, Bell, Shield, Globe } from "lucide-react";
import logo from '../../assets/fav-icon.png'; 

const Sidebar = ({ chats, activeChatId, setActiveChatId, createNewChat, onMenuAction, openMenuId, setOpenMenuId, sidebarOpen, setSidebarOpen }) => {
  const menuRef = useRef(null);
  const settingsRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setOpenMenuId]);

  const groupChatsByDate = (chats) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const last7Days = new Date(today); last7Days.setDate(last7Days.getDate() - 7);
    const last30Days = new Date(today); last30Days.setDate(last30Days.getDate() - 30);

    const groups = { Today: [], Yesterday: [], "Last 7 days": [], "Last 30 days": [], Older: [] };

    chats.forEach(chat => {
      const chatDate = new Date(chat.date); chatDate.setHours(0, 0, 0, 0);
      if (chatDate.getTime() === today.getTime()) groups.Today.push(chat);
      else if (chatDate.getTime() === yesterday.getTime()) groups.Yesterday.push(chat);
      else if (chatDate >= last7Days) groups["Last 7 days"].push(chat);
      else if (chatDate >= last30Days) groups["Last 30 days"].push(chat);
      else groups.Older.push(chat);
    });

    return groups;
  };

  const chatGroups = groupChatsByDate(chats);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log("Dark mode:", !darkMode);
  };

  return (
    <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 ease-in-out bg-gray-100 border-r border-gray-200 flex flex-col overflow-hidden relative`}>
      <div className="p-3 flex items-center justify-between border-b border-gray-200">
        {sidebarOpen ? (
          <>
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Healvia Logo" 
                className="w-9 h-9 object-contain"
              />
              <span className="text-xl font-bold text-gray-800">
                Healvia
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors text-gray-600"
              title="Close sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors mx-auto text-gray-600"
            title="Open sidebar"
          >
            <PanelLeft size={20} />
          </button>
        )}
      </div>

      <div className="p-3">
        {sidebarOpen ? (
          <button onClick={createNewChat} className="flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2.5 text-sm font-medium transition-all shadow-sm">
            <Plus size={18} />
            New chat
          </button>
        ) : (
          <button onClick={createNewChat} className="p-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all shadow-sm mx-auto block">
            <Plus size={20} />
          </button>
        )}
      </div>

      {sidebarOpen && (
        <>
          <div className="px-3 pb-3">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 hover:border-gray-400 transition-colors">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search chats..." className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {Object.entries(chatGroups).map(([groupName, groupChats]) => {
              if (groupChats.length === 0) return null;
              return (
                <div key={groupName} className="mb-4">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {groupName}
                  </div>
                  <div className="space-y-1">
                    {groupChats.map(chat => (
                      <div key={chat.id} className="relative">
                        <div
                          onClick={() => setActiveChatId(chat.id)}
                          className={`group w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                            chat.id === activeChatId
                              ? "bg-white text-cyan-700 shadow-sm border border-gray-200"
                              : "hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare size={16} className={chat.id === activeChatId ? "text-cyan-600" : "text-gray-400"} />
                            <span className="flex-1 truncate font-medium">{chat.title}</span>
                            <div
                              onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === chat.id ? null : chat.id); }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-300 cursor-pointer"
                            >
                              <MoreHorizontal size={14} />
                            </div>
                          </div>
                        </div>

                        {openMenuId === chat.id && (
                          <div ref={menuRef} className="absolute right-2 top-full mt-1 w-56 bg-white text-gray-900 rounded-lg shadow-xl py-1 z-50 text-sm border border-gray-200">
                            <button onClick={() => onMenuAction('share', chat.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3">
                              <Share2 size={16} /><span>Share</span>
                            </button>
                            <button onClick={() => onMenuAction('rename', chat.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3">
                              <Edit3 size={16} /><span>Rename</span>
                            </button>
                            <button onClick={() => onMenuAction('pin', chat.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3">
                              <Pin size={16} /><span>Pin chat</span>
                            </button>
                            <button onClick={() => onMenuAction('archive', chat.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3">
                              <Archive size={16} /><span>Archive</span>
                            </button>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button onClick={() => onMenuAction('delete', chat.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 text-red-600 hover:text-red-700">
                              <Trash2 size={16} /><span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 p-3 relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-200 w-full"
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            {showSettings && (
              <div ref={settingsRef} className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</p>
                </div>
                
                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700">
                  <User size={16} className="text-gray-500" />
                  <span>Account</span>
                </button>

                <button 
                  onClick={toggleDarkMode}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center justify-between text-sm text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Palette size={16} className="text-gray-500" />
                    <span>Appearance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{darkMode ? "Dark" : "Light"}</span>
                    <div 
                      className={`w-10 h-5 rounded-full transition-colors ${darkMode ? "bg-cyan-500" : "bg-gray-300"} relative`}
                    >
                      <div 
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? "translate-x-5" : "translate-x-0.5"}`}
                      ></div>
                    </div>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700">
                  <Bell size={16} className="text-gray-500" />
                  <span>Notifications</span>
                </button>

                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700">
                  <Shield size={16} className="text-gray-500" />
                  <span>Privacy & Security</span>
                </button>

                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700">
                  <Globe size={16} className="text-gray-500" />
                  <span>Language</span>
                </button>

                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-gray-700">
                  <HelpCircle size={16} className="text-gray-500" />
                  <span>Help & Support</span>
                </button>

                <div className="border-t border-gray-200 my-1"></div>

                <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 flex items-center gap-3 text-sm text-red-600">
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;