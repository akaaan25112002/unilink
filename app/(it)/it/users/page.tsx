import { PageHeader } from "@/components/layout/page-header";
import { getUsers } from "@/features/users/queries";
import { UserRoleForm } from "@/components/forms/user-role-form";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Administration"
        description="Manage user names and role assignments for the UniLink system."
      />

      {users.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500 shadow-sm">
          No users found.
        </div>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-4">
                <p className="font-medium text-slate-900">{user.fullName}</p>
                <p className="text-sm text-slate-500">{user.id}</p>
              </div>

              <UserRoleForm
                userId={user.id}
                defaultFullName={user.fullName}
                defaultRole={user.role}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}