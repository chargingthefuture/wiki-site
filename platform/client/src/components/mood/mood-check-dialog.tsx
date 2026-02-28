import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useClientId } from "@/hooks/useClientId";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface MoodCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMoodSubmitted?: (showSafetyMessage: boolean) => void;
}

const EMOJI_OPTIONS = [
  { value: 1, emoji: "😢", label: "Very Sad" },
  { value: 2, emoji: "😔", label: "Sad" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "🙂", label: "Happy" },
  { value: 5, emoji: "😊", label: "Very Happy" },
];

export function MoodCheckDialog({ open, onOpenChange, onMoodSubmitted }: MoodCheckDialogProps) {
  const clientId = useClientId();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const moodMutation = useMutation({
    mutationFn: async (moodValue: number) => {
      const response = await apiRequest("POST", "/api/mood/checks", {
        clientId,
        moodValue,
      });
      return response.json() as Promise<{ showSafetyMessage: boolean }>;
    },
    onSuccess: (data) => {
      toast({
        title: "Thank You",
        description: "Your response helps us provide better support.",
      });
      onMoodSubmitted?.(data.showSafetyMessage);
      setSelectedMood(null);
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: [`/api/mood/checks`] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit mood check",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (selectedMood) {
      moodMutation.mutate(selectedMood);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How are you feeling today?</DialogTitle>
          <DialogDescription>
            This is completely optional. Your response helps us understand how we can better support you, and your data is anonymous and never sold or shared.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {EMOJI_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedMood(option.value)}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${selectedMood === option.value 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"}
                  focus:outline-none focus:ring-2 focus:ring-primary
                `}
                aria-label={option.label}
                data-testid={`emoji-${option.value}`}
              >
                <span className="text-3xl" role="img" aria-label={option.label}>
                  {option.emoji}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Select an emoji to indicate how you're feeling today
          </p>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
            data-testid="button-not-now"
          >
            <X className="w-4 h-4 mr-2" />
            Not Now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood || moodMutation.isPending}
            className="w-full sm:w-auto"
            data-testid="button-submit-mood"
          >
            {moodMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
        <div className="pt-4 border-t text-xs text-muted-foreground">
          <p>💙 Your privacy is important to us. We only collect aggregate data, never personal information.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
