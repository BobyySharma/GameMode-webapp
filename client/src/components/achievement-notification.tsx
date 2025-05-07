import { cn } from "@/lib/utils";

interface AchievementNotificationProps {
  show: boolean;
  title?: string;
  description?: string;
}

export function AchievementNotification({ 
  show, 
  title = "Achievement Unlocked!", 
  description = "Completed your quest" 
}: AchievementNotificationProps) {
  if (!show) return null;
  
  return (
    <div className="fixed bottom-16 left-0 right-0 flex justify-center z-40">
      <div className="bg-accent text-white p-4 rounded-lg shadow-lg flex items-center">
        <div className="mr-3 bg-white rounded-full p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs opacity-90">{description}</p>
        </div>
      </div>
    </div>
  );
}
