import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="px-6 h-16 flex items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity" href="/">
          <Shield className="h-6 w-6 text-primary" />
          <span>ExpiryAlert</span>
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center relative overflow-hidden p-4">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] -z-10" />
        {children}
      </main>
    </div>
  );
}
