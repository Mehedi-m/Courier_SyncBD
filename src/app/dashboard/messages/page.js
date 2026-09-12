'use client';

import { useState } from 'react';
import { Plus, Search, Phone, Video, MoreVertical, Paperclip, Smile, Send, Truck, Check } from 'lucide-react';

const merchantConversations = [
  {
    id: '1',
    name: 'Sadia Islam',
    time: '2 min ago',
    type: 'Customer',
    online: true,
    lastMessage: 'Ami ki courier tracking ta check korte parbo?',
    avatar: 'SI',
    chatHistory: [
      { id: 'm1', sender: 'them', text: 'Assalamu Alaikum, ami Hydrating Glow Facial Serum order korechi.', time: '08:30 PM' },
      { id: 'm2', sender: 'me', text: 'Walaikum Assalam! Apnar parcel Steadfast courier a dispatch kora hoyeche. Tracking Code: SF-782194.', time: '08:32 PM' },
      { id: 'm3', sender: 'them', text: 'Ami ki courier tracking ta check korte parbo?', time: '08:34 PM' },
    ],
  },
  {
    id: '2',
    name: 'Rahim Uddin',
    time: '15 min ago',
    type: 'Customer',
    online: false,
    lastMessage: 'Parcel peyechi, onnek bhalo quality! Thank you.',
    avatar: 'RU',
    chatHistory: [
      { id: 'm1', sender: 'them', text: 'Bhaiya, Panjabi delivery Mirpur 10 a koto din lagbe?', time: '11:10 AM' },
      { id: 'm2', sender: 'me', text: 'Within 24-48 hours delivery hoye jabe inshaAllah.', time: '11:15 AM' },
      { id: 'm3', sender: 'them', text: 'Parcel peyechi, onnek bhalo quality! Thank you.', time: '04:20 PM' },
    ],
  },
  {
    id: '3',
    name: 'Nusrat Jahan',
    time: '1 hour ago',
    type: 'Customer',
    online: true,
    lastMessage: 'Chittagong a Pathao rider ajke deliver korbe?',
    avatar: 'NJ',
    chatHistory: [
      { id: 'm1', sender: 'them', text: 'Hello, amar Wireless Earbuds er consignment number ta pabo?', time: '02:00 PM' },
      { id: 'm2', sender: 'me', text: 'Yes, Pathao tracking consignment: PTH-102938.', time: '02:05 PM' },
      { id: 'm3', sender: 'them', text: 'Chittagong a Pathao rider ajke deliver korbe?', time: '02:10 PM' },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(merchantConversations);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(merchantConversations[0]);
  const [inputMessage, setInputMessage] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...selectedChat.chatHistory, newMsg];
    const updatedChat = { ...selectedChat, chatHistory: updatedHistory, lastMessage: inputMessage.trim() };

    setSelectedChat(updatedChat);
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedChat.id ? updatedChat : c))
    );
    setInputMessage('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen text-slate-700 dark:text-slate-200 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-120px)]">
        
        {/* Left Conversation List Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs h-full flex flex-col p-5 space-y-4">
          
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Customer Inbox</h1>
            <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
              F-Commerce Chat
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search chat or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Chat List */}
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {filteredConversations.map((chat) => {
              const isSelected = selectedChat?.id === chat.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                    isSelected 
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/60 shadow-2xs' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </div>

                  <div className="flex-1 truncate">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{chat.name}</span>
                      <span className="text-[10px] text-slate-400">{chat.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Active Chat Window */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xs h-full flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white text-xs font-bold">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">{selectedChat.name}</h3>
                    <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active Customer
                    </span>
                  </div>
                </div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl">
                  1-Click Dispatch Enabled
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {selectedChat.chatHistory.map((m) => {
                  const isMe = m.sender === 'me';

                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                        }`}
                      >
                        <p>{m.text}</p>
                        <span className={`text-[9px] block text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {m.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type customer reply or tracking link..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl shadow-md transition"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}