import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Send, Paperclip, Smile, MoreVertical, FileText } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getConnections, getMessages, sendMessage, User, Message } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/contexts/SocketContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "react-router-dom";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const Messaging = () => {
    const location = useLocation();
    const [selectedUser, setSelectedUser] = useState<User | null>(location.state?.selectedUser || null);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [highlightedMessageIndex, setHighlightedMessageIndex] = useState(-1);
    const [activePanel, setActivePanel] = useState<'connections' | 'messages'>('connections');
    const { toast } = useToast();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const socket = useSocket();
    const lastMessageRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const connectionsListRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const { data: connections, isLoading: isLoadingConnections } = useQuery<User[]>({
        queryKey: ["connections"],
        queryFn: getConnections,
        enabled: !!user,
    });

    const filteredConnections = useMemo(() => {
        if (!connections) return [];
        return connections.filter(
            (connection) =>
                connection.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [connections, searchTerm]);

    const { data: messages, isLoading } = useQuery<Message[]>({
        queryKey: ["messages", selectedUser?._id],
        queryFn: () => getMessages(selectedUser!._id),
        enabled: !!selectedUser,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activePanel !== 'connections' || !filteredConnections.length) return;
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return;
            
            let newIndex = highlightedIndex;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = highlightedIndex >= filteredConnections.length - 1 ? 0 : highlightedIndex + 1;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = highlightedIndex <= 0 ? filteredConnections.length - 1 : highlightedIndex - 1;
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0 && filteredConnections[highlightedIndex]) {
                    setSelectedUser(filteredConnections[highlightedIndex]);
                }
                return;
            }
            if (newIndex !== highlightedIndex) {
                setHighlightedIndex(newIndex);
                const listEl = connectionsListRef.current;
                const itemEl = listEl?.children[newIndex] as HTMLElement;
                if (itemEl) itemEl.scrollIntoView({ block: 'nearest' });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filteredConnections, highlightedIndex, activePanel]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activePanel !== 'messages' || !messages || messages.length === 0) return;
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return;

            let newIndex = highlightedMessageIndex;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = newIndex >= messages.length - 1 ? messages.length - 1 : newIndex + 1;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = newIndex <= 0 ? 0 : newIndex - 1;
            } else return;
            
            if (newIndex !== highlightedMessageIndex) {
                setHighlightedMessageIndex(newIndex);
                const containerEl = messagesContainerRef.current;
                const itemEl = containerEl?.children[newIndex] as HTMLElement;
                if (itemEl) itemEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [messages, highlightedMessageIndex, activePanel]);
    
    useEffect(() => {
        if (selectedUser) {
            messagesContainerRef.current?.focus();
            setActivePanel('messages');
            setHighlightedMessageIndex(-1);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (newMessage: Message) => {
            const partnerId = newMessage.senderId === user?._id ? newMessage.receiverId : newMessage.senderId;
            queryClient.invalidateQueries({ queryKey: ["messages", partnerId] });
            if (selectedUser?._id === partnerId) {
                queryClient.setQueryData(['messages', partnerId], (oldData: Message[] = []) => oldData.some(msg => msg._id === newMessage._id) ? oldData : [...oldData, newMessage]);
            } else {
                const sender = connections?.find(c => c._id === partnerId);
                if (sender) toast({ title: `New message from ${sender.name}`, description: newMessage.message || "Sent a file." });
            }
        };
        const handleOnlineUsers = (users: string[]) => setOnlineUsers(users);
        socket.on("newMessage", handleNewMessage);
        socket.on("getOnlineUsers", handleOnlineUsers);
        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("getOnlineUsers", handleOnlineUsers);
        };
    }, [socket, selectedUser, queryClient, user, connections, toast]);

    useEffect(() => {
        if (highlightedMessageIndex === -1) {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, highlightedMessageIndex]);

    const sendMessageMutation = useMutation({
        mutationFn: ({ userId, formData }: { userId: string, formData: FormData }) => sendMessage(userId, formData),
        onSuccess: (newMessage) => {
            queryClient.setQueryData(["messages", selectedUser?._id], (oldData: Message[] = []) => [...oldData, newMessage]);
            setNewMessage("");
        },
        onError: (error) => toast({ title: "Error", description: `Failed to send message: ${error.message}`, variant: "destructive" }),
    });

    const handleSendMessage = (file?: File) => {
        if ((!newMessage.trim() && !file) || !selectedUser) return;
        const formData = new FormData();
        if (newMessage.trim()) formData.append('message', newMessage);
        if (file) formData.append('file', file);
        sendMessageMutation.mutate({ userId: selectedUser._id, formData });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 30 * 1024 * 1024) {
            toast({ title: "File too large", description: "Please select a file smaller than 30MB.", variant: "destructive" });
            return;
        }
        handleSendMessage(file);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isOnline = (userId: string) => onlineUsers.includes(userId);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-6 py-6">
                <Card className="overflow-hidden">
                    <div className="grid grid-cols-12 h-[calc(100vh-12rem)]">
                        <div className="col-span-4 border-r">
                            <div className="p-4 border-b">
                                <h2 className="text-xl font-bold mb-4">Messaging</h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search connections..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            <div ref={connectionsListRef} tabIndex={0} onFocus={() => setActivePanel('connections')} className="overflow-y-auto h-[calc(100%-8rem)] custom-scrollbar outline-none">
                                {isLoadingConnections ? <div className="p-4 space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div> : 
                                filteredConnections.length > 0 ? filteredConnections.map((connection, index) => {
                                    if (!connection || !connection.name) return null;
                                    return (
                                    <div key={connection._id} onClick={() => { setSelectedUser(connection); setHighlightedIndex(index); }} className={`p-4 cursor-pointer hover:bg-accent/50 transition-colors border-b ${selectedUser?._id === connection._id ? "bg-accent" : ""} ${highlightedIndex === index && activePanel === 'connections' ? "ring-2 ring-primary ring-inset" : ""}`}>
                                        <div className="flex items-start gap-3"><div className="relative"><Avatar><AvatarImage src={connection.profileImage} /><AvatarFallback>{connection.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>{isOnline(connection._id) && (<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>)}</div><div className="flex-1 min-w-0"><h4 className="font-semibold text-sm truncate">{connection.name}</h4></div></div>
                                    </div>
                                )}) : <p className="p-4 text-sm text-muted-foreground">No connections found.</p>}
                            </div>
                        </div>
                        <div className="col-span-8 flex flex-col">
                            {selectedUser ? (
                                <>
                                    <div className="p-4 border-b flex items-center justify-between">
                                        <div className="flex items-center gap-3"><Avatar><AvatarImage src={selectedUser.profileImage} /><AvatarFallback>{selectedUser.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar><div><h3 className="font-semibold">{selectedUser.name}</h3><p className="text-xs text-muted-foreground">{isOnline(selectedUser._id) ? "Online" : "Offline"}</p></div></div>
                                        <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                                    </div>
                                    <div ref={messagesContainerRef} tabIndex={0} onFocus={() => setActivePanel('messages')} className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar outline-none">
                                        {isLoading ? <div className="space-y-4"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-10 w-3/4 ml-auto" /><Skeleton className="h-10 w-3/4" /></div> : 
                                        messages?.map((message, index) => (
                                            <div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null} className={`p-1 rounded-lg transition-all ${highlightedMessageIndex === index && activePanel === 'messages' ? 'ring-2 ring-sky-500' : ''}`}>
                                                <div className={`flex ${message.senderId === user?._id ? "justify-end" : "justify-start"}`}>
                                                    <div className="max-w-[70%]"><div className={`rounded-2xl px-1 py-1 ${message.senderId === user?._id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                                        {message.fileType === 'image' && message.fileUrl && (<img src={message.fileUrl} alt="sent content" className="rounded-2xl max-w-xs" />)}
                                                        {message.fileType === 'video' && message.fileUrl && (<video src={message.fileUrl} controls className="rounded-2xl max-w-xs" />)}
                                                        {message.fileType === 'document' && message.fileUrl && (<a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-background/50 rounded-lg m-2 text-primary-foreground hover:underline"><FileText className="h-6 w-6" /><span className="truncate">{message.fileUrl?.split('/').pop()?.split('%20').join(' ')}</span></a>)}
                                                        {message.message && (<p className="text-sm px-3 py-2">{message.message}</p>)}
                                                    </div><p className="text-xs text-muted-foreground mt-1 ml-1">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t"><div className="flex items-center gap-2">
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="h-5 w-5" /></Button>
                                        <Input placeholder="Write a message..." className="flex-1" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} />
                                        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}><PopoverTrigger asChild><Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button></PopoverTrigger><PopoverContent className="w-auto p-0 border-none"><EmojiPicker onEmojiClick={handleEmojiClick} /></PopoverContent></Popover>
                                        <Button size="icon" onClick={() => handleSendMessage()} disabled={sendMessageMutation.isPending}><Send className="h-5 w-5" /></Button>
                                    </div></div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full"><div className="text-center"><h2 className="text-2xl font-semibold">Select a chat</h2><p className="text-muted-foreground">Search for a connection to start a conversation.</p></div></div>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Messaging;