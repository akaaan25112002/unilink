"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Users,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

import type { UserRole } from "@/lib/auth/roles";
import { ROLE_HOME } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: Record<UserRole, NavItem[]> = {
  STUDENT: [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/enquiries", label: "My Enquiries", icon: FileText },
    { href: "/student/enquiries/new", label: "Submit Enquiry", icon: FileText },
    { href: "/student/appointments", label: "Appointments", icon: CalendarDays },
  ],
  ADMIN_OFFICER: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/enquiries", label: "Incoming Enquiries", icon: FileText },
  ],
  SUPPORT_OFFICER: [
    { href: "/officer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/officer/enquiries", label: "Assigned Cases", icon: FileText },
    { href: "/officer/appointments", label: "Appointments", icon: CalendarDays },
  ],
  MANAGER: [
    { href: "/manager", label: "Dashboard", icon: LayoutDashboard },
    { href: "/manager/escalations", label: "Escalations", icon: AlertTriangle },
    { href: "/manager/reports", label: "Reports", icon: BarChart3 },
  ],
  IT_SUPPORT: [
    { href: "/it", label: "Dashboard", icon: LayoutDashboard },
    { href: "/it/users", label: "Users", icon: Users },
  ],
};

type Props = {
  role: UserRole;
};

function prettyRole(role: UserRole) {
  return role.replaceAll("_", " ");
}

function isItemActive(pathname: string, itemHref: string) {
  return pathname === itemHref;
}

export function AppSidebar({ role }: Props) {
  const pathname = usePathname();
  const roleHome = ROLE_HOME[role];
  const items = NAV[role] ?? [];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-zinc-800 bg-[#121212] text-white lg:block">
      <div className="flex h-full flex-col p-5">
        <div className="mb-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#c7372f] via-[#a61e1e] to-[#151515] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <Link
            href={roleHome}
            className="inline-flex text-[2rem] font-bold tracking-tight text-white"
          >
            UniLink
          </Link>

          <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/75">
            {prettyRole(role)}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure workspace
          </div>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[#c7372f] text-white shadow-[0_10px_25px_rgba(199,55,47,0.28)]"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
                      active ? "scale-105" : "group-hover:scale-105"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </span>

                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 transition-all duration-200",
                    active
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[28px] border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-300 backdrop-blur-sm">
          <p className="font-semibold text-white">UniLink Portal</p>
          <p className="mt-2 leading-6 text-zinc-400">
            Manage enquiries, appointments, and support workflows in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}