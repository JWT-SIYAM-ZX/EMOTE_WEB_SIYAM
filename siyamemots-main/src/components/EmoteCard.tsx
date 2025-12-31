import { useState } from "react";
import { Emote, getEmoteImageUrl } from "@/data/emotes";
import { Loader2 } from "lucide-react";

interface EmoteCardProps {
  emote: Emote;
  onClick: (emote: Emote) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const EmoteCard = ({ emote, onClick, isLoading, disabled }: EmoteCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={() => onClick(emote)}
      disabled={disabled || isLoading}
      className="group relative glass rounded-xl p-3 card-glow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative aspect-square flex items-center justify-center mb-2 overflow-hidden rounded-lg bg-muted/30">
        {isLoading ? (
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        ) : (
          <>
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img
              src={getEmoteImageUrl(emote.id)}
              alt={emote.name}
              className={`w-full h-full object-contain transition-all duration-300 group-hover:scale-110 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
                {emote.id}
              </div>
            )}
          </>
        )}
      </div>
      
      <p className="text-sm font-rajdhani font-medium text-center text-foreground/90 group-hover:text-primary transition-colors truncate">
        {emote.name}
      </p>
      
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-3/4 transition-all duration-300 rounded-full" />
    </button>
  );
};

export default EmoteCard;
