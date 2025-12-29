import { useMemo } from 'react';
import { BarChart3, MessageSquare, ThumbsUp, ThumbsDown, Clock, FileText } from 'lucide-react';
import { Message, Agent } from '../types/Agent';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Progress } from '../../../ui/progress';

interface MessageStatsProps {
  messages: Message[];
  agent: Agent | null;
}

export function MessageStats({ messages, agent }: MessageStatsProps) {
  const stats = useMemo(() => {
    const total = messages.length;
    const userMessages = messages.filter(m => m.role === 'user').length;
    const assistantMessages = messages.filter(m => m.role === 'assistant').length;
    const likedMessages = messages.filter(m => m.rating === 'like').length;
    const dislikedMessages = messages.filter(m => m.rating === 'dislike').length;
    const messagesWithFiles = messages.filter(m => m.fileAttachment).length;
    
    const ratedMessages = likedMessages + dislikedMessages;
    const satisfactionRate = ratedMessages > 0 ? (likedMessages / ratedMessages) * 100 : 0;
    
    // Calculate average response time (mock data for demo)
    const avgResponseTime = 2.5; // seconds
    
    // Get conversation duration
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    const conversationDuration = firstMessage && lastMessage 
      ? Math.abs(lastMessage.timestamp.getTime() - firstMessage.timestamp.getTime()) / 1000 / 60 // minutes
      : 0;

    // Recent activity (last 10 messages)
    const recentMessages = messages.slice(-10);
    const recentSatisfaction = recentMessages.filter(m => m.rating === 'like').length / 
      Math.max(1, recentMessages.filter(m => m.rating).length) * 100;

    return {
      total,
      userMessages,
      assistantMessages,
      likedMessages,
      dislikedMessages,
      messagesWithFiles,
      satisfactionRate,
      avgResponseTime,
      conversationDuration,
      recentSatisfaction
    };
  }, [messages]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <BarChart3 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" aria-describedby="message-stats-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <BarChart3 size={20} />
            Chat Analytics
            {agent && (
              <Badge variant="secondary" className="ml-2">
                {agent.icon} {agent.name}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <p id="message-stats-description" className="sr-only">
          View detailed analytics and statistics for the current chat conversation.
        </p>
        
        {messages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p>No conversation data yet</p>
            <p className="text-sm">Start chatting to see analytics</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                    <MessageSquare size={14} />
                    Total Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {stats.userMessages} user • {stats.assistantMessages} assistant
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                    <ThumbsUp size={14} />
                    Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.satisfactionRate.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stats.likedMessages} likes • {stats.dislikedMessages} dislikes
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock size={14} />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatDuration(stats.conversationDuration)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ~{stats.avgResponseTime}s avg response
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText size={14} />
                    Files Shared
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.messagesWithFiles}</div>
                  <div className="text-xs text-muted-foreground">
                    {((stats.messagesWithFiles / Math.max(1, stats.total)) * 100).toFixed(1)}% of messages
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Metrics</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>User Engagement</span>
                    <span>{((stats.userMessages / Math.max(1, stats.total)) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.userMessages / Math.max(1, stats.total)) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Rate</span>
                    <span>{((stats.assistantMessages / Math.max(1, stats.userMessages)) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.assistantMessages / Math.max(1, stats.userMessages)) * 100} className="h-2" />
                </div>

                {stats.likedMessages + stats.dislikedMessages > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Recent Satisfaction</span>
                      <span>{stats.recentSatisfaction.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.recentSatisfaction} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Based on last 10 rated messages
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>File Attachment Usage</span>
                    <span>{((stats.messagesWithFiles / Math.max(1, stats.total)) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(stats.messagesWithFiles / Math.max(1, stats.total)) * 100} className="h-2" />
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Quick Insights</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Most active conversation period: {stats.conversationDuration > 60 ? 'Extended session' : 'Quick chat'}</li>
                <li>• File sharing: {stats.messagesWithFiles > 0 ? 'Active' : 'None'}</li>
                <li>• Feedback rate: {(((stats.likedMessages + stats.dislikedMessages) / Math.max(1, stats.total)) * 100).toFixed(1)}% of messages rated</li>
                {stats.satisfactionRate >= 80 && <li>• 🎉 High satisfaction rate!</li>}
                {stats.satisfactionRate < 50 && stats.likedMessages + stats.dislikedMessages > 2 && <li>• ⚠️ Consider reviewing responses</li>}
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}