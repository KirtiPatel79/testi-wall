"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, HelpCircle } from "lucide-react";

const navItems = [
  { href: "/app/projects", icon: LayoutDashboard, label: "Projects" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row gap-2 p-4 md:flex-col md:gap-1 md:p-4">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isProjects = href === "/app/projects";
        const isActive = isProjects
          ? pathname === "/app/projects" || pathname.startsWith("/app/projects/")
          : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-sidebar-accent/20 text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        );
      })}
      <div className="mt-auto hidden pt-4 md:block">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
        >
          <HelpCircle size={18} />
          Back to Home
        </Link>
      </div>
    </nav>
  );
}
