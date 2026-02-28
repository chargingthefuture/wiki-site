import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { useState } from "react";

interface ChatBadgeProps {
  testId?: string;
}

const CHAT_EXPLANATION = "Community Support Chat Guidelines: This is a shared support channel exclusively for registered app users. Purpose: Ask and answer questions to help fellow community members. Key Rules: * Support-related questions only.*Respectful communication is mandatory. *Off-topic or inappropriate messages may result in permanent account ban. Important: This is a public chat visible to all members. For general social conversation, please use our Signal group, link found at https://sleek.bio/farah";

export function ChatBadge({ testId }: ChatBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
          aria-label="Learn more about the chat"
          data-testid={testId ? `${testId}-info` : "chat-badge-info"}
        >
          <Info className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[calc(100vw-2rem)] max-w-sm sm:w-80" 
        side="bottom" 
        align="start"
        sideOffset={8}
        collisionPadding={16}
      >
        <p className="text-sm leading-relaxed">{CHAT_EXPLANATION}</p>
      </PopoverContent>
    </Popover>
  );
}
