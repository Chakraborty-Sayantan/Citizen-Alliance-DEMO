import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Messaging = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const chats = [
    {
      name: "Sarah Johnson",
      lastMessage: "Thanks for connecting! Let's catch up soon.",
      time: "2h ago",
      unread: 2,
      online: true
    },
    {
      name: "Michael Chen",
      lastMessage: "I'd love to discuss the project details with you.",
      time: "5h ago",
      unread: 0,
      online: true
    },
    {
      name: "Emily Rodriguez",
      lastMessage: "Great presentation today!",
      time: "1d ago",
      unread: 0,
      online: false
    },
    {
      name: "David Lee",
      lastMessage: "Can we schedule a meeting for next week?",
      time: "2d ago",
      unread: 1,
      online: false
    }
  ];

  const [messages, setMessages] = useState([
    { sender: "Sarah Johnson", text: "Hi! Thanks for accepting my connection request.", time: "10:30 AM", isMe: false },
    { sender: "You", text: "My pleasure! I saw your profile and your work looks impressive.", time: "10:32 AM", isMe: true },
    { sender: "Sarah Johnson", text: "Thanks for connecting! Let's catch up soon.", time: "10:35 AM", isMe: false },
    { sender: "You", text: "Absolutely! Would love to hear more about your projects.", time: "10:36 AM", isMe: true }
  ]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    setMessages([...messages, {
      sender: "You",
      text: newMessage,
      time: currentTime,
      isMe: true
    }]);
    
    setNewMessage("");
    toast({
      description: "Message sent",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-6">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-12 h-[calc(100vh-12rem)]">
            {/* Chat List */}
            <div className="col-span-4 border-r">
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold mb-4">Messaging</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages" className="pl-10" />
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-8rem)]">
                {chats.map((chat, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedChat(index)}
                    className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors border-b ${
                      selectedChat === index ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarFallback>
                            {chat.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {chat.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm truncate">{chat.name}</h4>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unread > 0 && (
                            <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="col-span-8 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {chats[selectedChat].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{chats[selectedChat].name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {chats[selectedChat].online ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${message.isMe ? "order-2" : ""}`}>
                      {!message.isMe && (
                        <p className="text-xs text-muted-foreground mb-1 ml-1">
                          {message.sender}
                        </p>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.isMe
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 ml-1">
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Write a message..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Messaging;
