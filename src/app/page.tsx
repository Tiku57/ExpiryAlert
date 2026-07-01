import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-6 lg:px-14 h-16 flex items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tighter" href="#">
          <Shield className="h-6 w-6 mr-2 text-primary" />
          <span>ExpiryAlert</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#trusted">
            Customers
          </Link>
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] -z-10" />
          
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
            <Badge variant="outline" className="px-3 py-1 rounded-full border-primary/30 text-primary bg-primary/10">
              Introducing ExpiryAlert 2.0
            </Badge>
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Track. <span className="text-primary">Alert.</span> Stay Ahead.
              </h1>
              <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400">
                The intelligent expiry management platform that prevents organizations from missing important dates. Vendor contracts, compliance certificates, and more.
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 font-medium">
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div id="trusted" className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-800 w-full max-w-3xl flex flex-col items-center opacity-70">
              <p className="text-sm font-medium mb-6 uppercase tracking-wider text-slate-500">Trusted by modern enterprises</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-80 grayscale">
                <span className="text-xl font-bold font-serif">Deloitte.</span>
                <span className="text-xl font-bold font-sans">EY</span>
                <span className="text-xl font-bold tracking-widest">KPMG</span>
                <span className="text-xl font-bold">pwc</span>
                <span className="text-xl font-bold italic">accenture</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything revolves around business visibility</h2>
                <p className="max-w-[900px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-400">
                  A manager should not have to search through spreadsheets to understand what needs attention.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 h-full">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">What is Active</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  Instantly see all valid documents, contracts, and certifications across your entire organization.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 p-6 bg-orange-50 dark:bg-orange-950/20 rounded-2xl border border-orange-200 dark:border-orange-900/50 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Bell className="h-32 w-32 text-orange-500" />
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center text-orange-600 dark:text-orange-400 relative z-10">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold relative z-10">Expiring Soon</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed relative z-10">
                  Get intelligent alerts 30, 14, and 7 days before critical records expire. Prevent operational delays.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 p-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50 h-full">
                <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-400">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Needs Action</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Immediately identify what has expired and who is responsible for renewing it. Reduce compliance risk.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Stop managing dates in Excel</h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
                  Join modern enterprises that use ExpiryAlert to track critical business records and automate renewals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="h-12 px-8 font-medium">
                    Create an account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 flex flex-col sm:flex-row items-center justify-center px-4 md:px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          © 2026 ExpiryAlert Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 mt-4 sm:mt-0">
          <Link className="text-xs hover:underline underline-offset-4 text-slate-500 dark:text-slate-400" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-slate-500 dark:text-slate-400" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
