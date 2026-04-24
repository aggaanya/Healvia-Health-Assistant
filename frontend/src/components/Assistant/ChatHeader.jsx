import { Upload, Share2, FileDown, PanelLeft } from "lucide-react";
import healgiaLogo from '../../assets/fav-icon.png'; 

const ChatHeader = ({ onUpload, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="flex-shrink-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <PanelLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-3">
            <img 
              src={healgiaLogo} 
              alt="Healvia Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-lg font-bold text-gray-800">Healvia Assistant</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Upload size={18} className="text-gray-600" />
            <input type="file" multiple className="hidden" onChange={onUpload} />
          </label>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FileDown size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;