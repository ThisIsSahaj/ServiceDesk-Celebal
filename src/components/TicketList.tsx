import { Rocket, CheckCircle2, Clock, TicketMinus, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";
// import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useNavigate } from 'react-router-dom';


interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  status: "online" | "busy" | "offline";
}

interface Milestone {
  title: string;
  dueDate: string;
  completed: boolean;
}

interface TicketListProps {
  projectName?: string;
  description?: string;
  teamMembers?: TeamMember[];
  milestones?: Milestone[];
  filteredTickets?: any[];
}

export default function TicketList({
  filteredTickets,
  projectName = "Your Tickets",
  description = "Track and manage all your support tickets efficiently.",
}: TicketListProps) {

  const navigate = useNavigate();


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-400 text-green-800';
      case 'medium': return 'bg-yellow-400 text-yellow-800';
      case 'high': return 'bg-orange-400 text-orange-800';
      case 'urgent': return 'bg-red-400 text-red-800';
      default: return 'bg-gray-400 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <TrendingUp className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle  className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-[#121214] backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/30 rounded-3xl p-6 shadow-md dark:shadow-zinc-900 transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TicketMinus className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{projectName}</h2>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm text-right">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
        
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">Tickets</h3>
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <div key={index} 
               onClick={() => navigate(`/ticket/${ticket.id}`)}
              className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer">
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full mt-1",
                    getStatusColor(ticket.status)
                  )}
                >
                  {getStatusIcon(ticket.status)}
                </div>
                <div className="flex w-full justify-between items-center">
                  <p className="text-md font-medium text-zinc-900 dark:text-white">{ticket.title}</p>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
