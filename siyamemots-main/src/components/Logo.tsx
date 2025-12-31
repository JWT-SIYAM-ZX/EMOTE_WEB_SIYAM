import { Gamepad2 } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative float`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl blur-lg opacity-60 animate-glow-pulse" />
        <div className="relative w-full h-full bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center glow-border">
          <Gamepad2 className="w-1/2 h-1/2 text-primary-foreground" />
        </div>
      </div>
      {showText && (
        <h1 className={`${textSizes[size]} font-orbitron font-bold glow-text bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
          Siyam Panel
        </h1>
      )}
    </div>
  );
};

export default Logo;
