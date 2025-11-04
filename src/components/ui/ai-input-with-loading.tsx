"use client";

import { CornerRightUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";

interface AIInputWithLoadingProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  loadingDuration?: number;
  thinkingDuration?: number;
  onSubmit?: (value: string) => void | Promise<void>;
  className?: string;
  autoAnimate?: boolean;
  isLoading?: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export function AIInputWithLoading({
  id = "ai-input-with-loading",
  placeholder = "Ask me anything!",
  minHeight = 56,
  maxHeight = 200,
  loadingDuration = 3000,
  thinkingDuration = 1000,
  onSubmit,
  className,
  autoAnimate = false,
  isLoading: externalLoading,
  onLoadingChange
}: AIInputWithLoadingProps) {
  const [inputValue, setInputValue] = useState("");
  const [internalSubmitted, setInternalSubmitted] = useState(autoAnimate);
  const [isAnimating, setIsAnimating] = useState(autoAnimate);
  
  // Use external loading if provided, otherwise use internal state
  const submitted = externalLoading !== undefined ? externalLoading : internalSubmitted;
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const runAnimation = () => {
      if (!isAnimating) return;
      setInternalSubmitted(true);
      onLoadingChange?.(true);
      timeoutId = setTimeout(() => {
        setInternalSubmitted(false);
        onLoadingChange?.(false);
        timeoutId = setTimeout(runAnimation, thinkingDuration);
      }, loadingDuration);
    };

    if (isAnimating) {
      runAnimation();
    }

    return () => clearTimeout(timeoutId);
  }, [isAnimating, loadingDuration, thinkingDuration, onLoadingChange]);

  // Sync external loading state
  useEffect(() => {
    if (externalLoading !== undefined) {
      setInternalSubmitted(externalLoading);
    }
  }, [externalLoading]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || submitted) return;
    
    const trimmedValue = inputValue.trim();
    setInputValue("");
    adjustHeight(true);
    
    // Set loading state - let parent control when to reset
    setInternalSubmitted(true);
    onLoadingChange?.(true);
    
    try {
      await onSubmit?.(trimmedValue);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      // On error, still let parent control the loading state
    }
    // Note: Loading state is managed by parent via onLoadingChange
    // Parent should call setLoading(false) in the finally block of handleSend
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-start flex-col gap-2">
        <div className="relative max-w-xl w-full mx-auto">
          <Textarea
            id={id}
            placeholder={placeholder}
            className={cn(
              "max-w-xl bg-white dark:bg-gray-800 w-full rounded-3xl pl-6 pr-10 py-4",
              "placeholder:text-gray-400 dark:placeholder:text-gray-300",
              "border border-gray-200 dark:border-gray-600",
              "text-gray-900 dark:text-white resize-none text-wrap leading-[1.2]",
              "focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-400 focus:border-transparent",
              "shadow-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            style={{ minHeight: `${minHeight}px` }}
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={submitted}
          />
          <button
            onClick={handleSubmit}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 rounded-xl py-1 px-1 transition-all",
              submitted 
                ? "bg-none cursor-not-allowed" 
                : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            type="button"
            disabled={submitted}
          >
            {submitted ? (
              <div
                className="w-4 h-4 border-2 border-gray-900 dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin transition duration-700"
                style={{ animationDuration: "3s" }}
              />
            ) : (
              <CornerRightUp
                className={cn(
                  "w-4 h-4 transition-opacity text-gray-900 dark:text-white",
                  inputValue ? "opacity-100" : "opacity-30"
                )}
              />
            )}
          </button>
        </div>
        <p className="pl-4 h-4 text-xs mx-auto text-gray-600 dark:text-gray-200">
          {submitted ? "AI is thinking..." : "Ready to submit!"}
        </p>
      </div>
    </div>
  );
}
