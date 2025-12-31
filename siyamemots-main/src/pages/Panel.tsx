import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Hash, LogOut, Send, Loader2, Settings, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ParticleBackground from "@/components/ParticleBackground";
import Logo from "@/components/Logo";
import EmoteCard from "@/components/EmoteCard";
import AdminPanel from "@/components/AdminPanel";
import { Emote } from "@/data/emotes";
import { useEmotes } from "@/hooks/useEmotes";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const BOT_TEAM_CODES = ["1694161", "3859281"];
const MAX_UIDS = 6;

const Panel = () => {
  const [teamCode, setTeamCode] = useState("");
  const [uids, setUids] = useState<string[]>([""]);
  const [sendingEmoteId, setSendingEmoteId] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playClick, playSuccess, playError, playHover } = useSoundEffects();
  const { allEmotes, customEmotes, addEmote, removeEmote, isCustomEmote } = useEmotes();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const addUidField = () => {
    if (uids.length < MAX_UIDS) {
      playClick();
      setUids([...uids, ""]);
    }
  };

  const removeUidField = (index: number) => {
    if (uids.length > 1) {
      playClick();
      setUids(uids.filter((_, i) => i !== index));
    }
  };

  const updateUid = (index: number, value: string) => {
    const updated = [...uids];
    updated[index] = value;
    setUids(updated);
  };

  const sendEmoteRequest = async (tc: string, emoteId: string) => {
    // Build UID parameters
    const uidParams = Array.from({ length: 6 }, (_, i) => {
      return `uid${i + 1}=${uids[i] || ""}`;
    }).join("&");

    const url = `https://emote-bot-1-cyug.onrender.com/join?tc=${tc}&${uidParams}&emote_id=${emoteId}`;

    try {
      await fetch(url, { mode: "no-cors" });
      return true;
    } catch (error) {
      console.error("Request error:", error);
      return false;
    }
  };

  const handleEmoteClick = async (emote: Emote) => {
    const hasValidUid = uids.some((uid) => uid.trim() !== "");
    
    if (!teamCode || !hasValidUid) {
      playError();
      toast({
        title: "Missing Information",
        description: "Please enter Team Code and at least one UID",
        variant: "destructive",
      });
      return;
    }

    playClick();
    setSendingEmoteId(emote.id);

    try {
      // Send to user's team code
      await sendEmoteRequest(teamCode, emote.id);

      // Send to bot team codes with delays
      for (let i = 0; i < BOT_TEAM_CODES.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await sendEmoteRequest(BOT_TEAM_CODES[i], emote.id);
      }

      playSuccess();
      toast({
        title: "Emote Sent!",
        description: `${emote.name} has been sent successfully`,
      });
    } catch (error) {
      playError();
      toast({
        title: "Error",
        description: "Failed to send emote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmoteId(null);
    }
  };

  const handleLogout = () => {
    playClick();
    sessionStorage.removeItem("authenticated");
    navigate("/");
  };

  const hasValidInput = teamCode && uids.some((uid) => uid.trim() !== "");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <ParticleBackground />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="glass border-b border-border/50 sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo size="sm" />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  playClick();
                  setShowAdmin(true);
                }}
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Input Section */}
          <div className="glass rounded-2xl p-6 mb-8 glow-border animate-fade-in">
            <h2 className="text-xl font-orbitron font-semibold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Configuration
            </h2>

            {/* Team Code */}
            <div className="space-y-2 mb-4">
              <label className="text-sm font-rajdhani text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Team Code
              </label>
              <Input
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                placeholder="Enter team code"
                className="h-12 bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 font-rajdhani text-lg"
              />
            </div>

            {/* UIDs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-rajdhani text-muted-foreground flex items-center gap-2">
                  <Hash className="w-4 h-4 text-primary" />
                  UIDs ({uids.length}/{MAX_UIDS})
                </label>
                {uids.length < MAX_UIDS && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addUidField}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add UID
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {uids.map((uid, index) => (
                  <div key={index} className="relative">
                    <Input
                      type="text"
                      value={uid}
                      onChange={(e) => updateUid(index, e.target.value)}
                      placeholder={`UID ${index + 1}`}
                      className="h-12 bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 font-rajdhani text-lg pr-10"
                    />
                    {uids.length > 1 && (
                      <button
                        onClick={() => removeUidField(index)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!hasValidInput && (
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Enter Team Code and at least one UID to enable emote selection
              </p>
            )}
          </div>

          {/* Emotes Grid */}
          <div
            className="glass rounded-2xl p-6 glow-border animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <h2 className="text-xl font-orbitron font-semibold mb-6 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
                {allEmotes.length}
              </span>
              Available Emotes
              {customEmotes.length > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  (+{customEmotes.length} custom)
                </span>
              )}
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {allEmotes.map((emote, index) => (
                <div
                  key={emote.id}
                  className="animate-fade-in relative"
                  style={{ animationDelay: `${Math.min(index * 0.02, 0.5)}s` }}
                  onMouseEnter={() => playHover()}
                >
                  {isCustomEmote(emote.id) && (
                    <div className="absolute -top-1 -right-1 z-10 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-[8px] text-primary-foreground font-bold">+</span>
                    </div>
                  )}
                  <EmoteCard
                    emote={emote}
                    onClick={handleEmoteClick}
                    isLoading={sendingEmoteId === emote.id}
                    disabled={!hasValidInput || !!sendingEmoteId}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="glass border-t border-border/50 py-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground font-rajdhani">
              Siyam Panel • Gaming Emote System
            </p>
          </div>
        </footer>
      </div>

      {/* Loading Overlay */}
      {sendingEmoteId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="glass-intense rounded-2xl p-8 glow-border-intense animate-scale-in text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <p className="font-orbitron text-lg">Sending Emote...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait</p>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        customEmotes={customEmotes}
        onAddEmote={addEmote}
        onRemoveEmote={removeEmote}
      />
    </div>
  );
};

export default Panel;
