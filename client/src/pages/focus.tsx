import { useState } from "react";
import { Layout } from "@/components/layout";
import { FocusMode } from "@/components/focus-mode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Trophy, History } from "lucide-react";

export default function Focus() {
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  
  const focusSessions = [
    { title: "Standard Focus", xp: 50, duration: "25 min", icon: Clock },
    { title: "Deep Work", xp: 100, duration: "50 min", icon: Trophy },
    { title: "Quick Sprint", xp: 25, duration: "10 min", icon: History },
  ];

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-['Poppins'] font-bold mb-2">Focus Mode</h1>
        <p className="text-muted-foreground mb-6">Start a focus session to gain XP and boost your productivity.</p>
        
        <div className="grid gap-4">
          {focusSessions.map((session, index) => {
            const Icon = session.icon;
            return (
              <Card key={index} className="game-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-['Poppins']">{session.title}</CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>{session.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="bg-primary/20 dark:bg-primary-dark/30 rounded-full px-3 py-1">
                      <span className="text-xs font-['Orbitron'] text-primary-dark dark:text-primary-light">
                        +{session.xp} XP
                      </span>
                    </div>
                    <Button
                      onClick={() => setIsFocusModeOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary-dark"
                    >
                      Start Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-['Poppins'] font-semibold mb-4">Focus Tips</h2>
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-primary">•</div>
                  <span>Remove distractions before starting</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-primary">•</div>
                  <span>Take a short break between sessions</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-primary">•</div>
                  <span>Stay hydrated for optimal performance</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-1 text-primary">•</div>
                  <span>Complete 4 sessions to level up faster</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <FocusMode 
        isOpen={isFocusModeOpen} 
        onClose={() => setIsFocusModeOpen(false)} 
        initialTask={{ title: "Focus Session", xp: 50 }}
      />
    </Layout>
  );
}
