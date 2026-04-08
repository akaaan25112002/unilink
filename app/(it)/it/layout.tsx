import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "IT_SUPPORT") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <AppSidebar role={user.role} />
        <div className="min-w-0 flex-1">
          <Topbar user={user} />
          <main className="page-shell px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}