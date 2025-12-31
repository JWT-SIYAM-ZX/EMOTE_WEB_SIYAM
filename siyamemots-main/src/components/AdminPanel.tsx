import { useState, useEffect } from "react";
import { Plus, Trash2, X, Shield, Settings, Eye, EyeOff, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { Emote, getEmoteImageUrl } from "@/data/emotes";

// Password helpers
export const getAdminPassword = () => localStorage.getItem("siyam_admin_password") || "admin123";
export const getPanelPassword = () => localStorage.getItem("siyam_panel_password") || "siamxp";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  customEmotes: Emote[];
  onAddEmote: (emote: Emote) => void;
  onRemoveEmote: (emoteId: string) => void;
}

const AdminPanel = ({ isOpen, onClose, customEmotes, onAddEmote, onRemoveEmote }: AdminPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [newEmoteId, setNewEmoteId] = useState("");
  const [newEmoteName, setNewEmoteName] = useState("");
  const [previewLoaded, setPreviewLoaded] = useState(false);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [newAdminPass, setNewAdminPass] = useState("");
  const [newPanelPass, setNewPanelPass] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showPanelPass, setShowPanelPass] = useState(false);
  
  const { toast } = useToast();
  const { playClick, playSuccess, playError } = useSoundEffects();

  const handleLogin = () => {
    playClick();
    if (password === getAdminPassword()) {
      setIsAuthenticated(true);
      playSuccess();
      toast({ title: "Admin Access Granted" });
    } else {
      playError();
      toast({ title: "Wrong Password", variant: "destructive" });
    }
    setPassword("");
  };

  const handleAddEmote = () => {
    if (!newEmoteId.trim() || !newEmoteName.trim()) {
      playError();
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    playClick();
    onAddEmote({ id: newEmoteId.trim(), name: newEmoteName.trim() });
    playSuccess();
    toast({ title: "Emote Added!", description: newEmoteName });
    setNewEmoteId("");
    setNewEmoteName("");
    setPreviewLoaded(false);
  };

  const handleRemove = (emote: Emote) => {
    playClick();
    onRemoveEmote(emote.id);
    toast({ title: "Emote Removed", description: emote.name });
  };

  const handleSavePasswords = () => {
    playClick();
    let changed = false;
    
    if (newAdminPass.trim()) {
      localStorage.setItem("siyam_admin_password", newAdminPass.trim());
      changed = true;
    }
    if (newPanelPass.trim()) {
      localStorage.setItem("siyam_panel_password", newPanelPass.trim());
      changed = true;
    }
    
    if (changed) {
      playSuccess();
      toast({ title: "Passwords Updated!", description: "New passwords saved successfully" });
      setNewAdminPass("");
      setNewPanelPass("");
    } else {
      playError();
      toast({ title: "No changes", description: "Enter new password to save", variant: "destructive" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-intense rounded-2xl p-6 w-full max-w-lg glow-border-intense animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-orbitron font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Panel
          </h2>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  playClick();
                  setShowSettings(!showSettings);
                }}
                className={showSettings ? "text-primary" : ""}
              >
                <Settings className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Enter admin password to continue</p>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="h-12 bg-muted/50"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full btn-neon h-12">
              <Shield className="w-4 h-4 mr-2" />
              Access Admin
            </Button>
          </div>
        ) : showSettings ? (
          // Settings Panel
          <div className="space-y-6">
            <h3 className="font-orbitron text-sm text-primary flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Password Settings
            </h3>
            
            {/* Admin Password */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">New Admin Password</label>
              <div className="relative">
                <Input
                  type={showAdminPass ? "text" : "password"}
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="Enter new admin password"
                  className="h-10 bg-muted/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {/* Panel Password */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">New Panel (Login) Password</label>
              <div className="relative">
                <Input
                  type={showPanelPass ? "text" : "password"}
                  value={newPanelPass}
                  onChange={(e) => setNewPanelPass(e.target.value)}
                  placeholder="Enter new panel password"
                  className="h-10 bg-muted/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPanelPass(!showPanelPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPanelPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button onClick={handleSavePasswords} className="w-full btn-neon">
              <Save className="w-4 h-4 mr-2" />
              Save Passwords
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Leave empty to keep current password
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add New Emote */}
            <div className="space-y-4">
              <h3 className="font-orbitron text-sm text-primary">Add New Emote</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  value={newEmoteId}
                  onChange={(e) => {
                    setNewEmoteId(e.target.value);
                    setPreviewLoaded(false);
                  }}
                  placeholder="Emote ID"
                  className="h-10 bg-muted/50"
                />
                <Input
                  type="text"
                  value={newEmoteName}
                  onChange={(e) => setNewEmoteName(e.target.value)}
                  placeholder="Emote Name"
                  className="h-10 bg-muted/50"
                />
              </div>

              {newEmoteId && (
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                  <div className="w-16 h-16 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={getEmoteImageUrl(newEmoteId)}
                      alt="Preview"
                      className={`w-full h-full object-contain ${previewLoaded ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setPreviewLoaded(true)}
                      onError={() => setPreviewLoaded(false)}
                    />
                    {!previewLoaded && <span className="text-xs text-muted-foreground">Preview</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{newEmoteName || "Emote Name"}</p>
                    <p className="text-xs text-muted-foreground">ID: {newEmoteId}</p>
                  </div>
                </div>
              )}

              <Button onClick={handleAddEmote} className="w-full btn-neon">
                <Plus className="w-4 h-4 mr-2" />
                Add Emote
              </Button>
            </div>

            {/* Custom Emotes List */}
            {customEmotes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-orbitron text-sm text-primary">
                  Custom Emotes ({customEmotes.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                  {customEmotes.map((emote) => (
                    <div
                      key={emote.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={getEmoteImageUrl(emote.id)}
                          alt={emote.name}
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <p className="text-sm font-medium">{emote.name}</p>
                          <p className="text-xs text-muted-foreground">{emote.id}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(emote)}
                        className="text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
