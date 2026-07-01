import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Shield, LayoutDashboard, FileText, Settings, Bell, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Records", href: "/dashboard/records", icon: FileText },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6">
        <Link className="flex items-center gap-2 font-bold text-lg tracking-tight" href="/dashboard">
          <Shield className="h-6 w-6 text-primary" />
          <span>ExpiryAlert</span>
        </Link>
      </div>
      
      <div className="p-4">
        <Link href="/dashboard/records/new">
          <Button className="w-full justify-start gap-2 shadow-sm h-10" variant="default">
            <PlusCircle className="h-4 w-4" />
            New Record
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-4 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = item.href === '/dashboard' 
              ? pathname === '/dashboard' 
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 transition-all hover:text-primary",
                  isActive 
                    ? "bg-slate-100 dark:bg-slate-900 text-primary font-semibold" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
            {session?.user?.name ? session.user.name.substring(0, 2) : "U"}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium truncate">{session?.user?.name || "User"}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{session?.user?.email || ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
