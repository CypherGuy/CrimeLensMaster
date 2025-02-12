import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../../Providers/AuthProvider.jsx";

function Peter({ setIsSidePanelOpen = () => {}, setAutoCall = () => {} }) {
  const { user } = useContext(AuthContext);
  const userId = user.uid;

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, I'm Peter. If it's an emergency, type 'SOS'. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef(null);

  // Quick Replies
  const [availableQuickReplies, setAvailableQuickReplies] = useState([
    "Where is the nearest police station?",
    "How do I report a crime?",
    "What should I do in an emergency?",
  ]);

  const sendMessage = async (message) => {
    setIsTyping(true);

    // If "SOS" is detected, trigger sidebar and auto call.
    if (message.toLowerCase().includes("sos")) {
      setIsSidePanelOpen(true);
      setAutoCall(true);
    }

    try {
      const response = await fetch("http://localhost:23232/peter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Include both userId and message in the request payload.
        body: JSON.stringify({ userId, message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setIsTyping(false);
      return data.reply;
    } catch (error) {
      setIsTyping(false);
      return "Error: Could not reach Peter.";
    }
  };

  const handleSendMessage = async (message = input) => {
    if (message.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    const reply = await sendMessage(message);
    setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    setInput("");
  };

  // Handles Quick Replies – removes them after clicking.
  const handleQuickReply = (reply) => {
    setAvailableQuickReplies((prev) => prev.filter((q) => q !== reply));
    handleSendMessage(reply);
  };

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex justify-center text-white w-full">
      <div className="w-full max-w-xs rounded-2xl p-6 flex flex-col shadow-lg border border-white bg-[#1A1B1D] max-h-screen">
        
        {/* Chat Header */}
        <div className="chat-header flex flex-col items-start pb-2 border-b border-gray-600">
          <h2 className="text-xl font-bold">Peter</h2>
          <p className="text-gray-400 text-sm">CrimeLens AI Assistant</p>
        </div>

        {/* Chat Body */}
        <div className="chat-body flex-1 overflow-y-auto space-y-3 p-2" ref={chatBodyRef}>
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === "bot" ? "items-start" : "items-end"}`}>
              <div
                className={`p-3 rounded-lg max-w-xs leading-relaxed ${
                  message.sender === "bot" ? "bg-gray-700 text-left" : "bg-blue-500 text-left"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="p-3 rounded-lg max-w-xs bg-gray-700 text-gray-400 text-sm italic">
              Peter is typing...
            </div>
          )}
        </div>

        {/* Quick Replies */}
        {availableQuickReplies.length > 0 && (
          <div className="quick-replies flex flex-wrap gap-2 mb-3">
            {availableQuickReplies.map((reply, index) => (
              <button
                key={index}
                className="px-3 py-2 bg-gray-700 text-sm rounded-lg hover:bg-gray-600 transition"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Chat Footer */}
        <div className="chat-footer w-full border-t border-gray-600 pt-3">
          <div className="flex items-center border border-gray-500 rounded-lg overflow-hidden w-full">
            <input
              placeholder="Message Peter"
              className="w-full bg-transparent px-4 py-3 outline-none text-white placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button className="px-4 py-3 bg-gray-700 hover:bg-gray-600" onClick={() => handleSendMessage()}>
              <img className="w-4 h-4" src="/arrow_up.svg" alt="Send" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Peter;
