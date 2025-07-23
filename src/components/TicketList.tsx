import { Rocket, CheckCircle2, Clock, TicketMinus, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";
// import Image from "next/image";
import { cn } from "@/lib/utils";

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
  teamMembers = [
    {
      name: "Alex",
      role: "Design Lead",
      avatar: "https://github.com/shadcn.png",
      status: "online",
    },
    {
      name: "Sarah",
      role: "Frontend Dev",
      avatar: "https://github.com/shadcn.png",
      status: "busy",
    },
    {
      name: "Mike",
      role: "Project Manager",
      avatar: "https://github.com/shadcn.png",
      status: "offline",
    },
  ],
  milestones = [
    { title: "UI Audit", dueDate: "Done", completed: true },
    { title: "Refactor Components", dueDate: "3d left", completed: false },
    { title: "Launch Prep", dueDate: "6d left", completed: false },
  ],
}: TicketListProps) {



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
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="w-full max-w-4xl mx-auto bg-white/60 dark:bg-zinc-900 backdrop-blur-md border border-zinc-200/30 dark:border-zinc-800/30 rounded-3xl p-6 shadow-md dark:shadow-zinc-900 transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TicketMinus className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{projectName}</h2>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm text-right">{description}</p>
      </div>

      {/* Body: Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10">
        
        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">Timeline</h3>
          <div className="space-y-4">
            {filteredTickets.map((ticket, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full mt-1",
                    getStatusColor(ticket.status)
                  )}
                >
                  {getStatusIcon(ticket.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{ticket.title}</p>
                  <div className={` ${getPriorityColor(ticket.priority)} flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5`}>
                    <Clock className="w-3 h-3" />
                    {ticket.priority.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        {/* <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">Team Members</h3>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-center gap-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-zinc-900",
                      member.status === "online" && "bg-emerald-500",
                      member.status === "busy" && "bg-amber-500",
                      member.status === "offline" && "bg-zinc-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{member.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        
      </div>
    </div>
  );
}
