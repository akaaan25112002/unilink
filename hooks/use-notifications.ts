"use client";

import { useEffect, useState } from "react";
import type { AppNotification } from "@/features/notifications/types";

export function useNotifications(initialItems: AppNotification[]) {
  const [items, setItems] = useState<AppNotification[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const unreadCount = items.filter((item) => !item.isRead).length;

  const markOneLocally = (notificationId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === notificationId ? { ...item, isRead: true } : item
      )
    );
  };

  const markAllLocally = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return {
    items,
    unreadCount,
    markOneLocally,
    markAllLocally,
  };
}