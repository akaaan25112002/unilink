import type { AppUser } from "@/types/auth";
import { getInitials } from "@/lib/utils";
import { getNotifications } from "@/features/notifications/queries";

import { LogoutButton } from "@/components/layout/logout-button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

type Props = {
  user: AppUser;
};

function prettyRole(role: string) {
  return role.replaceAll("_", " ");
}

export async function Topbar({ user }: Props) {
  const notifications = await getNotifications();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <MobileSidebar role={user.role} />

          <div>
            <h1 className="text-lg font-semibold text-zinc-900">UniLink</h1>

            <p className="hidden text-sm text-zinc-500 sm:block">
              Student Enquiry and Appointment System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell initialItems={notifications} role={user.role} />

          <div className="hidden items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2 sm:flex shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-[#c7372f]">
              {getInitials(user.fullName)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {user.fullName}
              </p>

              <p className="truncate text-xs uppercase tracking-wide text-zinc-500">
                {prettyRole(user.role)}
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}