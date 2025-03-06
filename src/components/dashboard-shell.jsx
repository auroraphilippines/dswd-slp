import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";

export function DashboardShell({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-64 flex-col bg-black text-white">
        <MainNav />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="sticky top-0 z-50 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">
                DSWD Sustainable Livelihood Program
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container grid gap-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
