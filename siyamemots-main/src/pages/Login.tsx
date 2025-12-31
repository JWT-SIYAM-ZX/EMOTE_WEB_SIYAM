import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ParticleBackground from "@/components/ParticleBackground";
import Logo from "@/components/Logo";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { getPanelPassword } from "@/components/AdminPanel";

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playClick, playSuccess, playError, playLogin } = useSoundEffects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (password === getPanelPassword()) {
      playLogin();
      toast({
        title: "Access Granted",
        description: "Welcome to Siyam Panel",
      });
      sessionStorage.setItem("authenticated", "true");
      navigate("/panel");
    } else {
      playError();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast({
        title: "Access Denied",
        description: "Invalid password. Try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Radial glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <ParticleBackground />

      <div 
        className={`relative z-10 w-full max-w-md animate-fade-in ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
        style={{
          animation: shake ? "shake 0.5s ease-in-out" : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
        `}</style>

        <div className="glass-intense rounded-2xl p-8 glow-border">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-rajdhani text-muted-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Enter Access Code
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 bg-muted/50 border-border/50 focus:border-primary focus:ring-primary/20 pr-12 font-rajdhani text-lg tracking-wider"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full h-12 btn-neon text-lg font-orbitron font-semibold tracking-wider"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Access Panel
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground font-rajdhani">
              Secure gaming emote panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
