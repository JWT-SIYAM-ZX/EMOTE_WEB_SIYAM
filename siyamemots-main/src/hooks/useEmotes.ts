import { useState, useEffect } from "react";
import { Emote, emotes as defaultEmotes } from "@/data/emotes";

const STORAGE_KEY = "siyam_panel_custom_emotes";

export const useEmotes = () => {
  const [customEmotes, setCustomEmotes] = useState<Emote[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCustomEmotes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse custom emotes");
      }
    }
  }, []);

  const allEmotes = [...defaultEmotes, ...customEmotes];

  const addEmote = (emote: Emote) => {
    const updated = [...customEmotes, emote];
    setCustomEmotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const removeEmote = (emoteId: string) => {
    const updated = customEmotes.filter((e) => e.id !== emoteId);
    setCustomEmotes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const isCustomEmote = (emoteId: string) => {
    return customEmotes.some((e) => e.id === emoteId);
  };

  return { allEmotes, customEmotes, addEmote, removeEmote, isCustomEmote };
};
