import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger" | "gradient" | "neon";
  animate?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = true,
  size = "md",
  variant = "default",
  animate = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.5)]";
      case "warning":
        return "bg-gradient-to-r from-amber-400 via-orange-500 to-orange-600 shadow-lg shadow-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.5)]";
      case "danger":
        return "bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.5)]";
      case "gradient":
        return "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 shadow-[0_0_25px_rgba(139,92,246,0.6)]";
      case "neon":
        return "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 shadow-lg shadow-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.7)]";
      default:
        return "bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 shadow-lg shadow-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.5)]";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-2";
      case "lg":
        return "h-5";
      default:
        return "h-3";
    }
  };

  const getTrackClasses = () => {
    return "bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 shadow-inner shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]";
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "relative overflow-hidden rounded-full border border-gray-200/50 dark:border-gray-600/50",
        getTrackClasses(),
        getSizeClasses()
      )}>
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent -translate-x-full animate-shimmer" />
        
        {/* Progress fill */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden",
            getVariantClasses(),
            animate && "animate-pulse-slow"
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/20 to-white/10 rounded-full" />
          
          {/* Animated highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer rounded-full" 
               style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
          
          {/* Enhanced glow border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/10 blur-sm" />
        </div>
        
        {size === "lg" && percentage > 15 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg">
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      
      {showLabel && size !== "lg" && (
        <div className="mt-2 flex justify-between text-xs">
          <span className="font-semibold text-black dark:text-gray-300">{percentage.toFixed(1)}%</span>
          <span className="font-medium text-black dark:text-gray-400">{value.toLocaleString()} / {max.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}