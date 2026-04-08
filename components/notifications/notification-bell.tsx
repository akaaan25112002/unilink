"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import type { AppNotification } from "@/features/notifications/types";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/features/notifications/actions";
import { useNotifications } from "@/hooks/use-notifications";
import type { UserRole } from "@/lib/auth/roles";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NotificationBellProps = {
  initialItems: AppNotification[];
  role: UserRole;
};

function getNotificationHref(item: AppNotification, role: UserRole) {
  if (!item.relatedEnquiryId) return "#";

  switch (role) {
    case "STUDENT":
      return `/student/enquiries/${item.relatedEnquiryId}`;
    case "ADMIN_OFFICER":
      return `/admin/enquiries/${item.relatedEnquiryId}`;
    case "SUPPORT_OFFICER":
      return `/officer/enquiries/${item.relatedEnquiryId}`;
    case "MANAGER":
      return `/manager/escalations/${item.relatedEnquiryId}`;
    case "IT_SUPPORT":
      return "#";
    default:
      return "#";
  }
}

export function NotificationBell({
  initialItems,
  role,
}: NotificationBellProps) {
  const [isPending, startTransition] = useTransition();
  const { items, unreadCount, markOneLocally, markAllLocally } =
    useNotifications(initialItems);

  const handleMarkOne = (notificationId: string) => {
    startTransition(() => {
      void (async () => {
        const result = await markNotificationRead(notificationId);

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        markOneLocally(notificationId);
      })();
    });
  };

  const handleMarkAll = () => {
    startTransition(() => {
      void (async () => {
        const result = await markAllNotificationsRead();

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        markAllLocally();
        toast.success(result.message);
      })();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative rounded-xl border border-zinc-200 bg-white p-2 transition hover:bg-zinc-50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 text-zinc-800" />

          {unreadCount > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c7372f] px-1 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[360px] rounded-2xl border border-zinc-200 bg-white p-0 shadow-xl"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold text-zinc-900">Notifications</p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs text-zinc-600 hover:text-[#c7372f]"
            disabled={isPending || items.length === 0}
            onClick={handleMarkAll}
          >
            Mark all read
          </Button>
        </div>

        <DropdownMenuSeparator />

        {items.length === 0 ? (
          <div className="p-4 text-sm text-zinc-500">
            No notifications yet.
          </div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto p-2">
            {items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                className="block cursor-default rounded-xl p-0 focus:bg-transparent"
              >
                <div
                  className={`mb-2 w-full rounded-xl border p-3 ${
                    item.isRead
                      ? "border-zinc-200 bg-white"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-zinc-900">
                        {item.title}
                      </p>

                      {item.body ? (
                        <p className="mt-1 text-xs text-zinc-600">
                          {item.body}
                        </p>
                      ) : null}

                      <p className="mt-2 text-[11px] text-zinc-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!item.isRead ? (
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#c7372f]" />
                    ) : null}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {item.relatedEnquiryId ? (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 border-zinc-200 hover:border-[#c7372f] hover:text-[#c7372f]"
                      >
                        <Link href={getNotificationHref(item, role)}>
                          Open
                        </Link>
                      </Button>
                    ) : null}

                    {!item.isRead ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 text-zinc-600 hover:text-[#c7372f]"
                        disabled={isPending}
                        onClick={() => handleMarkOne(item.id)}
                      >
                        Mark read
                      </Button>
                    ) : null}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}