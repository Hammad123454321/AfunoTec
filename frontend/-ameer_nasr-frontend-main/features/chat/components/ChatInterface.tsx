"use client";

import React, { useState } from "react";
import { Send, Menu, Search, Plus } from "lucide-react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
      time: "10:30",
    },
    {
      id: 2,
      text: "I have a question about my account",
      sender: "user",
      time: "10:31",
    },
    {
      id: 3,
      text: "Of course! I'd be happy to help. What would you like to know?",
      sender: "bot",
      time: "10:31",
    },
    {
      id: 4,
      text: "How do I update my profile information?",
      sender: "user",
      time: "10:32",
    },
  ]);

  const [conversations] = useState([
    {
      id: 1,
      name: "Support Bot",
      lastMessage: "How can I help you today?",
      time: "10:32",
      unread: 0,
      active: true,
    },
    {
      id: 2,
      name: "Previous Chat",
      lastMessage: "Thank you for your help!",
      time: "Yesterday",
      unread: 0,
      active: false,
    },
    {
      id: 3,
      name: "Account Issue",
      lastMessage: "I need assistance with...",
      time: "2 days ago",
      unread: 0,
      active: false,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "user",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "I understand. Let me help you with that.",
          sender: "bot",
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Plus size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-green-500 text-white text-sm rounded-full font-medium">
              All
            </button>
            <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-50">
              Unread
            </button>
            <button className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm rounded-full hover:bg-gray-50">
              Archive
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                conv.active ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">
                    {conv.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {conv.name}
                    </h3>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">S</span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Support Bot</h2>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Online
              </span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Menu size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
              Today
            </span>
          </div>

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span
                  className={`text-xs mt-1 block ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
