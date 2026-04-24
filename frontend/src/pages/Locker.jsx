import React, { useState } from 'react';
import { Trash2, Download, Folder, Plus, Edit2, Check, Search, Star, Clock, Menu, Grid3x3, List, MoreVertical, Upload, Video, Image, Music, Lock, ChevronLeft, ChevronRight } from 'lucide-react';

const DigitalLocker = () => {
  const LOCKER_PASSWORD = '1234';
  const MAX_ATTEMPTS = 3;

  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);


  const [folders, setFolders] = useState([
    { name: 'Documents', files: [], starred: false, dateModified: new Date().toLocaleDateString() },
    { name: 'Photos', files: [], starred: true, dateModified: new Date().toLocaleDateString() },
  ]);
  const [files, setFiles] = useState([]);
  const [activeView, setActiveView] = useState('myDrive');
  const [activeFolder, setActiveFolder] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [uploadTab, setUploadTab] = useState('folder');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Password handling
  const handlePasswordSubmit = () => {
    if (password === LOCKER_PASSWORD) {
      setIsUnlocked(true);
    } else {
      setAttempts(attempts + 1);
      setPassword('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  if (attempts >= MAX_ATTEMPTS) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={48} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Locker Locked</h2>
          <p className="text-gray-600">Too many failed attempts. Access denied.</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="w-full max-w-md px-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={48} className="text-red-400" />
            </div>
            <h1 className="text-4xl font-bold mb-4">This page is protected</h1>
          </div>
          
          <div>
            <div className="mb-6">
              <label className="block text-gray-600 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border border-gray-300 p-3 rounded-lg text-lg"
                placeholder="Enter you password"
              />
            </div>
            
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-red-50 text-red-500 py-4 rounded-lg text-lg font-medium hover:bg-red-100 transition"
            >
              Submit
            </button>
            
            {attempts > 0 && (
              <p className="text-red-500 text-center mt-4">Incorrect password. Attempts: {attempts}/{MAX_ATTEMPTS}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // File operations
  const addFolder = () => {
    if (!folderName) return;
    setFolders([...folders, { 
      name: folderName, 
      files: [], 
      starred: false,
      dateModified: new Date().toLocaleDateString()
    }]);
    setFolderName('');
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      dateModified: new Date().toLocaleDateString(),
      starred: false,
      deleted: false,
      owner: 'me'
    }));
    
    if (activeFolder) {
      setFolders(folders.map((f) =>
        f.name === activeFolder.name
          ? { ...f, files: [...f.files, ...uploadedFiles], dateModified: new Date().toLocaleDateString() }
          : f
      ));
    } else {
      setFiles([...files, ...uploadedFiles]);
    }
    setShowUploadModal(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      dateModified: new Date().toLocaleDateString(),
      starred: false,
      deleted: false,
      owner: 'me'
    }));
    
    if (activeFolder) {
      setFolders(folders.map((f) =>
        f.name === activeFolder.name
          ? { ...f, files: [...f.files, ...droppedFiles], dateModified: new Date().toLocaleDateString() }
          : f
      ));
    } else {
      setFiles([...files, ...droppedFiles]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleStar = (item, type) => {
    if (type === 'folder') {
      setFolders(folders.map(f => 
        f.name === item.name ? { ...f, starred: !f.starred } : f
      ));
    } else {
      setFiles(files.map(file => 
        file.name === item.name ? { ...file, starred: !file.starred } : file
      ));
    }
  };

  const deleteItem = (item, type) => {
    if (type === 'folder') {
      setFolders(folders.map(f => 
        f.name === item.name ? { ...f, deleted: true } : f
      ));
    } else {
      setFiles(files.map(file => 
        file.name === item.name ? { ...file, deleted: true } : file
      ));
    }
  };

  const getFilteredItems = () => {
    let allItems = [];
    
    if (activeView === 'myDrive') {
      if (activeFolder) {
        allItems = activeFolder.files.filter(f => !f.deleted);
      } else {
        allItems = [
          ...folders.filter(f => !f.deleted).map(f => ({ ...f, type: 'folder' })),
          ...files.filter(f => !f.deleted).map(f => ({ ...f, type: 'file' }))
        ];
      }
    } else if (activeView === 'starred') {
      allItems = [
        ...folders.filter(f => f.starred && !f.deleted).map(f => ({ ...f, type: 'folder' })),
        ...files.filter(f => f.starred && !f.deleted).map(f => ({ ...f, type: 'file' }))
      ];
    } else if (activeView === 'recent') {
      allItems = [
        ...folders.filter(f => !f.deleted).map(f => ({ ...f, type: 'folder' })),
        ...files.filter(f => !f.deleted).map(f => ({ ...f, type: 'file' }))
      ].sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified));
    } else if (activeView === 'trash') {
      allItems = [
        ...folders.filter(f => f.deleted).map(f => ({ ...f, type: 'folder' })),
        ...files.filter(f => f.deleted).map(f => ({ ...f, type: 'file' }))
      ];
    }
    
    if (searchQuery) {
      allItems = allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return allItems;
  };

  const UploadModal = () => (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setUploadTab('folder')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 transition ${uploadTab === 'folder' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            <Folder size={20} />
            Folder
          </button>
          <button
            onClick={() => setUploadTab('file')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 transition ${uploadTab === 'file' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            <Upload size={20} />
            File
          </button>
          <button
            onClick={() => setUploadTab('image')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 transition ${uploadTab === 'image' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            <Image size={20} />
            Image
          </button>
        </div>
        
        <div className="p-8">
          <label 
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Upload size={28} className="text-blue-500" />
            </div>
            <p className="text-lg mb-2 text-gray-700">
              Drag & drop or <span className="text-blue-500 font-medium">click to upload</span>
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept={uploadTab === 'folder' ? '' : uploadTab === 'image' ? 'image/*' : '*/*'}
            />
          </label>
        </div>
        
        <div className="flex justify-end p-4 border-t border-gray-100">
          <button
            onClick={() => setShowUploadModal(false)}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-white relative">
      <div className="flex items-center justify-center gap-4 p-4 border-b border-gray-100">
        <div className="w-full max-w-2xl">
          <div className="relative shadow-md rounded-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} border-r border-gray-100 p-4 transition-all duration-300 bg-gray-50 relative shadow-sm`}>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-200 rounded-full transition shadow-sm"
            >
              {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className={`w-full mb-4 ${sidebarCollapsed ? 'px-3' : 'px-4'} py-3 bg-white border border-gray-200 shadow-md rounded-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} hover:shadow-lg hover:border-blue-400 transition`}
          >
            <Plus size={20} />
            {!sidebarCollapsed && 'New'}
          </button>
          
          <div className="space-y-1">
            <button
              onClick={() => { setActiveView('myDrive'); setActiveFolder(null); }}
              className={`w-full px-4 py-2 rounded-lg flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} transition shadow-sm ${activeView === 'myDrive' ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
            >
              <Folder size={20} />
              {!sidebarCollapsed && 'My Files'}
            </button>
            
            <button
              onClick={() => { setActiveView('starred'); setActiveFolder(null); }}
              className={`w-full px-4 py-2 rounded-lg flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} transition shadow-sm ${activeView === 'starred' ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
            >
              <Star size={20} />
              {!sidebarCollapsed && 'Starred'}
            </button>
            
            <button
              onClick={() => { setActiveView('recent'); setActiveFolder(null); }}
              className={`w-full px-4 py-2 rounded-lg flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} transition shadow-sm ${activeView === 'recent' ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
            >
              <Clock size={20} />
              {!sidebarCollapsed && 'Recent'}
            </button>
            
            <button
              onClick={() => { setActiveView('trash'); setActiveFolder(null); }}
              className={`w-full px-4 py-2 rounded-lg flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} transition shadow-sm ${activeView === 'trash' ? 'bg-blue-50 text-blue-600' : 'bg-white hover:bg-gray-100 text-gray-700'}`}
            >
              <Trash2 size={20} />
              {!sidebarCollapsed && 'Trash'}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
              <div className="text-sm text-gray-700 font-medium mb-2">Storage</div>
              <div className="w-full h-2 bg-white rounded-full mb-1">
                <div className="w-4/5 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <div className="text-xs text-gray-600">12.42 GB of 15 GB used</div>
              <button className="mt-2 text-sm text-blue-600 font-medium hover:underline">Get more storage</button>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeFolder ? activeFolder.name : activeView === 'myDrive' ? 'My Files' : 
                 activeView === 'starred' ? 'Starred' : activeView === 'recent' ? 'Recent' : 'Trash'}
              </h2>
              {activeFolder && (
                <button
                  onClick={() => setActiveFolder(null)}
                  className="text-blue-500 text-sm hover:underline"
                >
                  ← Back
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {activeView === 'myDrive' && !activeFolder && (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="New folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFolder()}
                  className="border border-gray-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={addFolder}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 hover:shadow-md transition"
                >
                  Create Folder
                </button>
              </div>
            )}

            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Owner</th>
                  <th className="pb-3 font-medium">Date modified</th>
                  <th className="pb-3 font-medium">File size</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {getFilteredItems().map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => item.type === 'folder' && setActiveFolder(item)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          {item.type === 'folder' ? <Folder size={20} className="text-blue-500" /> : 
                           <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-xs text-blue-600 font-medium">
                             {item.name.split('.').pop().toUpperCase().slice(0, 3)}
                           </div>}
                          <span className="text-gray-800">{item.name}</span>
                        </button>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{item.owner || 'me'}</td>
                    <td className="py-3 text-sm text-gray-600">{item.dateModified}</td>
                    <td className="py-3 text-sm text-gray-600">{item.size || '—'}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStar(item, item.type)}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Star size={16} className={item.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} />
                        </button>
                        <button
                          onClick={() => deleteItem(item, item.type)}
                          className="p-1 hover:bg-gray-100 rounded transition"
                        >
                          <Trash2 size={16} className="text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {getFilteredItems().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {activeView === 'trash' ? 'Trash is empty' : 
                 activeView === 'starred' ? 'No starred items' : 
                 'No files or folders'}
              </div>
            )}
          </div>
        </div>
      </div>

      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default DigitalLocker;