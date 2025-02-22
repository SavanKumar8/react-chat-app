import React, { useState, useEffect } from "react";
import "./index.css";
import ChatIcon from "./assets/chat-icon.svg";
import ArrowDownIcon from "./assets/arrow-down.svg";
import SendIcon from "./assets/sender.svg";

// Define types for message structure
interface Message {
  sender: string;
  text: string;
  timestamp: string;
  seen: boolean;
}

const ChatPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hi there! How can I help?",
      timestamp: "",
      seen: false,
    },
  ]);
  const [input, setInput] = useState<string>("");

  const toggleChat = (): void => {
    setIsOpen((prev: boolean) => !prev);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      sender: "user",
      text: input,
      timestamp: "2m ago",
      seen: true,
    };
    setMessages((prev: Message[]) => [...prev, newMessage]);
    setInput("");

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify({ message: input }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) throw new Error("Failed to send message");
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setTimeout(() => {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          sender: "bot",
          text: "No problem.\n\nIf you need help you can type below to ask a question 👇",
          timestamp: "Just now",
          seen: true,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 left-5 font-inter">
      <div
        className={`fixed top-[30px] left-[30px] w-[420px] h-[calc(90%-60px)] bg-white border shadow-lg rounded-3xl overflow-hidden flex flex-col duration-300 ease-in-out font-inter ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#3047EC] h-14 text-white p-2 flex justify-between font-inter">
          <span className="text-lg leading-3 p-3">{"Support Chat"}</span>
        </div>
        <div className="flex-1 p-6 font-inter overflow-y-auto">
          <div className="flex flex-col">
            {messages.map((msg: Message, idx: number) => (
              <div
                key={idx}
                className={`${
                  msg.sender !== "user" ? "flex items-end" : "contents"
                }`}
              >
                {msg.sender !== "user" && (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      backgroundColor: "#FFF4D0",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={SendIcon}
                      alt="Send"
                      style={{ width: "15px", height: "22px" }}
                    />
                  </div>
                )}
                <div
                  className={`my-1 ml-4 p-2 rounded-lg font-inter text-base max-w-64 ${
                    msg.sender === "user" ? "text-white" : "#000000"
                  } ${
                    msg.sender === "user"
                      ? "bg-[#3047EC] self-end"
                      : "bg-gray-100 self-start"
                  }`}
                >
                  {msg.text}
                </div>

                <div className="text-xs text-right mt-1 text-gray-400">
                  {msg.sender === "user"
                    ? `${msg.timestamp}${msg.seen ? ". Seen" : ""}`
                    : `${msg.timestamp}`}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-2 border-t flex font-inter bg-white">
          <input
            type="text"
            className="flex-1 p-2 rounded font-inter"
            value={input}
            placeholder="Type a reply..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" && sendMessage()
            }
          />
        </div>
      </div>
      <div className="flex w-[420px] justify-between">
        <button
          className="bg-[#3047EC] text-white w-[60px] h-[60px] rounded-full shadow-lg fixed bottom-5 left-5 flex items-center justify-center relative duration-300 ease-in-out font-inter"
          onClick={toggleChat}
        >
          <img
            src={ChatIcon}
            alt="chat"
            className="absolute w-[30px] h-[26.25px]"
          />
        </button>
        {isOpen && (
          <button
            className="bg-[#3047EC] text-white w-[60px] h-[60px] rounded-full shadow-lg fixed bottom-5 right-5 flex items-center justify-center relative duration-300 ease-in-out font-inter"
            onClick={toggleChat}
          >
            <img
              src={ArrowDownIcon}
              alt="crossArrow"
              className="absolute w-[21px] h-[12px]"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatPopup;
