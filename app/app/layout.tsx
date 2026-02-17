import { requireUserId } from "@/lib/auth-helpers";
import { SidebarNav } from "@/components/sidebar-nav";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Record<string, string | string[]>>;
}) {
  await requireUserId();
  await params;

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full flex-col bg-background md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full border-b border-sidebar-border bg-sidebar md:w-64 md:border-b-0 md:border-r md:flex md:flex-col">
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage your testimonial walls and track your social proof performance.</p>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
