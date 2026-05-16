"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const sidebarItems = [
  { href: "/home", icon: LayoutDashboardIcon, label: "Dashboard" },
  { href: "/social-share", icon: Share2Icon, label: "Social Share" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-background">
      <input
        id="sidebar-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={sidebarOpen}
        onChange={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-30 w-full glass-panel">
          <div className="navbar max-w-7xl mx-auto px-4 h-16">
            <div className="flex-none lg:hidden">
              <label
                htmlFor="sidebar-drawer"
                className="btn btn-square btn-ghost drawer-button"
              >
                <MenuIcon size={24} />
              </label>
            </div>
            <div className="flex-1">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                  <ImageIcon className="text-white" size={24} />
                </div>
                <span className="hidden sm:block text-xl font-black tracking-tight text-gradient">
                  MediaGrid
                </span>
              </Link>
            </div>
            <div className="flex-none flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-foreground/10">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold truncate max-w-[120px]">
                      {user.username || user.emailAddresses[0].emailAddress.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-foreground/50 uppercase tracking-wider">Pro Plan</p>
                  </div>
                  <div className="avatar ring-2 ring-primary/20 ring-offset-2 ring-offset-background rounded-full overflow-hidden">
                    <div className="w-9 h-9">
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="w-72 h-full glass-panel border-r-0 lg:border-r flex flex-col">
          <div className="p-6">
             <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                   <Sparkles className="text-primary" size={22} />
                </div>
                <span className="text-xl font-black tracking-tight text-gradient">MediaGrid</span>
             </div>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "hover:bg-foreground/5 text-foreground/70 hover:text-foreground"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-primary transition-colors"} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={16} />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-6 space-y-4">


            {user && (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                <LogOutIcon size={18} />
                <span className="font-semibold">Sign Out</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

