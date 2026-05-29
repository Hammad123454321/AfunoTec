import React from "react";
import { User, Calendar, CheckCircle, XCircle, Star } from "lucide-react";

// Types
type ActivityType = "profile" | "booking" | "payment" | "cancel" | "review";

interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

interface ActivityGroup {
  date: string;
  activities: Activity[];
}

interface RecentActivityProps {
  title?: string;
  data: ActivityGroup[];
  isLoading?: boolean;
  className?: string;
}

// Utility
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Default icons based on activity type
const getDefaultIcon = (type: ActivityType) => {
  const iconMap: Record<ActivityType, { icon: React.ReactNode; bg: string }> = {
    profile: { icon: <User size={20} />, bg: "bg-orange-500" },
    booking: { icon: <Calendar size={20} />, bg: "bg-red-600" },
    payment: { icon: <CheckCircle size={20} />, bg: "bg-orange-500" },
    cancel: { icon: <XCircle size={20} />, bg: "bg-red-600" },
    review: { icon: <Star size={20} />, bg: "bg-orange-500" },
  };
  return iconMap[type] || iconMap.profile;
};

// Activity Item Component
const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const defaultIconConfig = getDefaultIcon(activity.type);
  const icon = activity.icon || defaultIconConfig.icon;
  const iconBg = activity.iconBg || defaultIconConfig.bg;

  return (
    <div className="flex gap-4 group">
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white",
          iconBg,
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 text-sm leading-relaxed group-hover:text-gray-900">
          {activity.message}
        </p>
        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

// Main Component
export function RecentActivity({
  title = "Recent Activity",
  data = [],
  isLoading = false,
  className = "",
}: RecentActivityProps) {
  if (isLoading) {
    return (
      <div
        className={cn("bg-white rounded-2xl shadow-sm border p-6", className)}
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={cn("bg-white rounded-2xl shadow-sm border p-6", className)}
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>
        <p className="text-center text-gray-500 py-8">No recent activity</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border p-6", className)}>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>

      <div className="space-y-8">
        {data.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="text-base font-semibold text-gray-700 mb-4">
              {group.date}
            </h3>
            <div className="space-y-5">
              {group.activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Example Usage
const ExampleUsage: React.FC = () => {
  const sampleData: ActivityGroup[] = [
    {
      date: "Today",
      activities: [
        {
          id: "1",
          type: "profile",
          message:
            "Alberto Cortez updated his profile and added a new payment method",
          time: "9:30 AM",
        },
        {
          id: "2",
          type: "booking",
          message:
            "Camelia Swan booked the Venice Dreams package for June 25, 2024.",
          time: "10:00 AM",
        },
        {
          id: "3",
          type: "payment",
          message:
            "Payment was processed for Ludwig Contessa's Alpine Escape package.",
          time: "11:15 AM",
        },
        {
          id: "4",
          type: "cancel",
          message: "Armina Raul Meyes canceled her Caribbean Cruise package.",
          time: "12:45 PM",
        },
        {
          id: "5",
          type: "review",
          message: "Lydia Billings submitted a review for her recent package.",
          time: "2:30 PM",
        },
      ],
    },
    {
      date: "Yesterday",
      activities: [
        {
          id: "6",
          type: "booking",
          message:
            "John Smith booked the Santorini Sunset package for July 15, 2024.",
          time: "3:20 PM",
        },
        {
          id: "7",
          type: "payment",
          message: "Payment confirmed for Sarah Johnson's Tokyo Adventure.",
          time: "5:45 PM",
        },
      ],
    },
  ];

  const [data, setData] = React.useState<ActivityGroup[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(sampleData);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <RecentActivity
          title="Recent Activity"
          data={data}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default ExampleUsage;
