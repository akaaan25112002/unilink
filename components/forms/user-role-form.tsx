"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateUserProfile } from "@/features/users/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AppRole =
  | "STUDENT"
  | "ADMIN_OFFICER"
  | "SUPPORT_OFFICER"
  | "MANAGER"
  | "IT_SUPPORT";

type UserRoleFormProps = {
  userId: string;
  defaultFullName: string;
  defaultRole: AppRole;
};

export function UserRoleForm({
  userId,
  defaultFullName,
  defaultRole,
}: UserRoleFormProps) {
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState(defaultFullName);
  const [role, setRole] = useState<AppRole>(defaultRole);

  const handleSave = () => {
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    startTransition(() => {
      void (async () => {
        const result = await updateUserProfile({
          userId,
          fullName: fullName.trim(),
          role,
        });

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
      })();
    });
  };

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 p-4">
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as AppRole)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">STUDENT</SelectItem>
            <SelectItem value="ADMIN_OFFICER">ADMIN OFFICER</SelectItem>
            <SelectItem value="SUPPORT_OFFICER">SUPPORT OFFICER</SelectItem>
            <SelectItem value="MANAGER">MANAGER</SelectItem>
            <SelectItem value="IT_SUPPORT">IT SUPPORT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}