'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { 
  Search, 
  MoreVertical,
  Info,
  Send,
  Paperclip,
  Smile,
  Bot,
  User,
  Clock,
  Check,
  CheckCheck,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { faker } from '@faker-js/faker';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
  isRead: boolean;
  isDelivered: boolean;
}

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  isAutoReply: boolean;
  messages: ChatMessage[];
}

const generateChats = (): Chat[] => {
  return Array.from({ length: 12 }).map(() => {
    const messages: ChatMessage[] = Array.from({ length: faker.number.int({ min: 3, max: 15 }) }).map(() => ({
      id: faker.string.uuid(),
      text: faker.lorem.sentence(),
      timestamp: faker.date.recent({ days: 1 }),
      isFromUser: faker.datatype.boolean(),
      isRead: faker.datatype.boolean(),
      isDelivered: faker.datatype.boolean(),
    }));

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      lastMessage: messages[messages.length - 1].text,
      lastMessageTime: messages[messages.length - 1].timestamp,
      unreadCount: faker.number.int({ min: 0, max: 5 }),
      isOnline: faker.datatype.boolean(),
      isAutoReply: faker.datatype.boolean(),
      messages: messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    };
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return date.toLocaleDateString('pt-BR', { weekday: 'short' });
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const generatedChats = generateChats();
    setChats(generatedChats);
    setSelectedChat(generatedChats[0]);
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: ChatMessage = {
      id: faker.string.uuid(),
      text: newMessage,
      timestamp: new Date(),
      isFromUser: true,
      isRead: false,
      isDelivered: false,
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastMessage: message.text,
              lastMessageTime: message.timestamp,
            }
          : chat
      )
    );

    setSelectedChat(prev => prev ? {
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: message.text,
      lastMessageTime: message.timestamp,
    } : null);

    setNewMessage('');
  };

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-muted-foreground">Carregando chats...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Botão de IA */}
      <div className="absolute top-4 right-4 z-10">
        <RainbowButton 
          size="sm"
          onClick={() => console.log('IA ativada')}
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">IA</span>
        </RainbowButton>
      </div>
      
      <div className="flex h-full bg-background/95 backdrop-blur-md overflow-hidden">
        {/* Sidebar de Chats */}
        <div className="w-1/4 border-r border-border/50 flex flex-col">
          {/* Header da Sidebar */}
          <div className="p-3 border-b border-border/50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">Conversas</h2>
              <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-primary/30 focus:border-primary focus:ring-[#04CDD4]"
              />
            </div>
          </div>

          {/* Lista de Chats */}
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-border/30 cursor-pointer transition-colors ${
                  selectedChat?.id === chat.id 
                    ? 'bg-primary-100 dark:bg-primary-900/30 border-r-2 border-r-primary' 
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8 border border-border/50">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-foreground text-xs">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full dark:bg-green-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-foreground truncate">{chat.name}</h3>
                      <div className="flex items-center gap-1">
                        {chat.isAutoReply && (
                          <div className="flex items-center gap-1 bg-primary-100 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-full">
                            <Bot className="h-2.5 w-2.5 text-primary" />
                            <span className="text-xs text-primary font-medium">Auto</span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate flex-1">
                          {chat.lastMessage.length > 25 
                            ? `${chat.lastMessage.substring(0, 25)}...` 
                            : chat.lastMessage
                          }
                        </p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 text-xs min-w-[16px] h-4 flex items-center justify-center ml-1 font-semibold">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </ScrollArea>
          </div>
        </div>

        {/* Área do Chat */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Header do Chat */}
              <div className="p-3 border-b border-border/50 bg-background/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border border-border/50">
                        <AvatarImage src={selectedChat.avatar} />
                        <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-foreground text-xs">
                          {selectedChat.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {selectedChat.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full dark:bg-green-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">{selectedChat.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {selectedChat.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {selectedChat.isAutoReply && (
                          <div className="flex items-center gap-1 bg-primary-100 dark:bg-primary-900/30 px-1.5 py-0.5 rounded-full">
                            <Bot className="h-2.5 w-2.5 text-primary" />
                            <span className="text-xs text-primary font-medium">Auto</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full p-3 bg-muted/20">
                  <div className="space-y-4">
                    {selectedChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-2xl ${
                            message.isFromUser
                              ? 'bg-primary text-white dark:bg-primary-600 rounded-br-md'
                              : 'bg-white border border-border/50 text-foreground rounded-bl-md shadow-sm dark:bg-background'
                          }`}
                        >
                          <p className={`text-sm ${message.isFromUser ? 'font-semibold' : ''}`}>{message.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            message.isFromUser ? 'text-white/70' : 'text-muted-foreground'
                          }`}>
                            <span className="text-xs">{formatTime(message.timestamp)}</span>
                            {message.isFromUser && (
                              <div className="flex items-center">
                                {message.isDelivered ? (
                                  message.isRead ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <CheckCheck className="h-3 w-3 opacity-50" />
                                  )
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Input de Mensagem */}
              <div className="p-3 border-t border-border/50 bg-background/50">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite uma mensagem..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="pr-12 border-primary/30 focus:border-primary focus:ring-[#04CDD4]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Selecione uma conversa</h3>
                <p className="text-muted-foreground">Escolha um chat para começar a conversar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
