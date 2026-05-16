import Link from "next/link";
import { 
  Zap, 
  Video, 
  Image as ImageIcon, 
  Share2, 
  ArrowRight,
  Sparkles,
  Layers,
  Shield
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative px-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl -z-10 rounded-full" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -z-10 animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full -z-10 animate-pulse delay-1000" />

        <div className="max-w-5xl w-full text-center space-y-8 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium animate-bounce shadow-lg shadow-primary/5">
            <Sparkles size={16} />
            <span>AI-Powered Media Optimization</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Transform Your Media with <br />
            <span className="text-gradient">MediaGrid</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/60 leading-relaxed">
            The ultimate platform for video compression, social media cropping, 
            and intelligent asset management. Powered by Cloudinary's world-class engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/home" 
              className="group relative px-8 py-4 bg-primary text-white rounded-2xl font-semibold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Get Started Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            
            <Link 
              href="/social-share" 
              className="px-8 py-4 glass-panel rounded-2xl font-semibold hover:bg-white/5 transition-all flex items-center gap-2"
            >
              Explore Features
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 pb-32">
          <FeatureCard 
            icon={<Video className="text-blue-500" />}
            title="Video Compression"
            description="Intelligent AI compression that maintains quality while reducing file size by up to 80%."
          />
          <FeatureCard 
            icon={<Share2 className="text-purple-500" />}
            title="Social Cropping"
            description="Automatically adapt your videos for Instagram, TikTok, LinkedIn, and more with one click."
          />
          <FeatureCard 
            icon={<Zap className="text-amber-500" />}
            title="Lightning Fast"
            description="Real-time transformations and global delivery through Cloudinary's edge network."
          />
        </div>
      </main>

      {/* Footer Minimalist */}
      <footer className="py-12 border-t border-foreground/5 text-center">
        <p className="text-foreground/40 text-sm">
          &copy; {new Date().getFullYear()} MediaGrid. Built with AI & Cloudinary.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-8 rounded-3xl space-y-4 group">
      <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-foreground/60 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

