"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { assignEnquiry } from "@/features/enquiries/admin-actions";
import type { SupportOfficerOption } from "@/features/users/queries";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssignmentFormProps = {
  enquiryId: string;
  officers: SupportOfficerOption[];
  currentAssignedOfficerId?: string | null;
};

export function AssignmentForm({
  enquiryId,
  officers,
  currentAssignedOfficerId,
}: AssignmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [officerId, setOfficerId] = useState(currentAssignedOfficerId ?? "");
  const [note, setNote] = useState("");

  const handleAssign = () => {
    if (!officerId) {
      toast.error("Please select a support officer.");
      return;
    }

    startTransition(() => {
      void (async () => {
        const result = await assignEnquiry(enquiryId, officerId, note);

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setNote("");
      })();
    });
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Assign Support Officer</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Available Officer</Label>
          <Select value={officerId} onValueChange={setOfficerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select an officer" />
            </SelectTrigger>
            <SelectContent>
              {officers.length === 0 ? (
                <SelectItem value="__none" disabled>
                  No support officers available
                </SelectItem>
              ) : (
                officers.map((officer) => (
                  <SelectItem key={officer.id} value={officer.id}>
                    {officer.full_name ?? officer.id}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignment-note">Internal Assignment Note</Label>
          <Textarea
            id="assignment-note"
            rows={4}
            placeholder="Provide context for the assigned officer..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <Button
          onClick={handleAssign}
          disabled={isPending || officers.length === 0}
        >
          {isPending ? "Assigning..." : "Assign Case"}
        </Button>
      </CardContent>
    </Card>
  );
}