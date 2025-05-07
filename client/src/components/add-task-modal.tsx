import { useState } from "react";
import { useGame } from "@/lib/gameContext";
import { getTodayDateString } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formTaskSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addTask } = useGame();
  
  const form = useForm<z.infer<typeof formTaskSchema>>({
    resolver: zodResolver(formTaskSchema),
    defaultValues: {
      title: "",
      xp: 20,
      dueDate: getTodayDateString(),
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formTaskSchema>) => {
    await addTask(values.title, values.xp, values.dueDate);
    form.reset();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-['Poppins'] font-semibold">New Quest</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="What do you need to do?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="xp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>XP Reward</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        min={10} 
                        max={100} 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 font-['Orbitron']">XP</span>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary-dark"
              >
                Create Quest
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
