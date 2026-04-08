"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FileText, CalendarDays, Users, BarChart3, AlertTriangle } from "lucide-react";
import { useState } from "react";

import type { UserRole } from "@/lib/auth/roles";
import { ROLE_HOME } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

export function MobileSidebar({ role }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white p-5 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href={ROLE_HOME[role]}
                className="text-xl font-semibold"
                onClick={() => setOpen(false)}
              >
                UniLink
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-1">
              {NAV[role].map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}