import { useTheme } from "@/lib/theme-provider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-9 h-9 relative overflow-hidden"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-full h-full">
        <motion.div
          initial={{ rotate: theme === 'dark' ? 0 : 45 }}
          animate={{ rotate: theme === 'dark' ? 45 : 0, opacity: theme === 'dark' ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="h-4 w-4" />
        </motion.div>
        
        <motion.div
          initial={{ rotate: theme === 'dark' ? -45 : 0 }}
          animate={{ rotate: theme === 'dark' ? 0 : -45, opacity: theme === 'dark' ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="h-4 w-4" />
        </motion.div>
      </div>
    </Button>
  );
}