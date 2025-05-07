import { Layout } from "@/components/layout";
import { useGame } from "@/lib/gameContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calculateXpForLevel, getRankTitle } from "@/lib/utils";
import { Trophy, Award, Star, Flame, Calendar } from "lucide-react";

export default function Profile() {
  const { user, xpForNextLevel, xpPercentage } = useGame();
  
  if (!user) return null;
  
  // Calculate total XP needed to reach current level
  const totalXpEarned = user.xp;
  const prevLevelXp = calculateXpForLevel(user.level - 1);
  
  const achievements = [
    { title: "First Task", description: "Complete your first task", completed: true, icon: Star },
    { title: "Focus Master", description: "Complete 5 focus sessions", completed: user.level >= 2, icon: Trophy },
    { title: "Streak Keeper", description: "Maintain a 3-day streak", completed: user.streak >= 3, icon: Flame },
    { title: "Level 5 Hero", description: "Reach level 5", completed: user.level >= 5, icon: Award },
  ];
  
  return (
    <Layout>
      <div className="p-4">
        <Card className="mb-6 overflow-hidden border-0 shadow-lg">
          <div className="h-20 bg-gradient-to-r from-primary to-secondary" />
          <div className="px-4 pb-4 -mt-10">
            <div className="flex items-end mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-card bg-primary flex items-center justify-center text-white font-['Orbitron'] text-2xl font-bold">
                {user.level}
              </div>
              <div className="ml-4 pb-2">
                <h2 className="text-xl font-['Poppins'] font-bold">{user.username}</h2>
                <p className="text-sm text-muted-foreground">{getRankTitle(user.level)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level Progress</span>
                <span className="font-['Orbitron']">{user.xp % xpForNextLevel}/{xpForNextLevel} XP</span>
              </div>
              <Progress value={xpPercentage} className="h-2" />
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-normal flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-primary" />
                Level
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-['Orbitron'] font-bold">{user.level}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-normal flex items-center">
                <Flame className="h-4 w-4 mr-2 text-[#F59E0B]" />
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-['Orbitron'] font-bold">{user.streak} days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-normal flex items-center">
                <Star className="h-4 w-4 mr-2 text-[#10B981]" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-['Orbitron'] font-bold">{totalXpEarned}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-normal flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-secondary" />
                Next Level
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-['Orbitron'] font-bold">{xpForNextLevel - (user.xp % xpForNextLevel)} XP</p>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-xl font-['Poppins'] font-semibold mb-4">Achievements</h2>
        
        <div className="space-y-4">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card key={index} className={achievement.completed ? "border-primary" : "opacity-60"}>
                <CardContent className="p-4 flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${achievement.completed ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.completed && (
                    <Badge className="ml-auto bg-primary">Unlocked</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
