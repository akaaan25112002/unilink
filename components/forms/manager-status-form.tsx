"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateEnquiryStatusAsManager } from "@/features/enquiries/manager-actions";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ManagerFormStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "ESCALATED"
  | "CLOSED";

type ManagerStatusFormProps = {
  enquiryId: string;
  defaultStatus?: ManagerFormStatus;
};

export function ManagerStatusForm({
  enquiryId,
  defaultStatus = "ESCALATED",
}: ManagerStatusFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ManagerFormStatus>(defaultStatus);
  const [publicMessage, setPublicMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const handleSave = () => {
    startTransition(() => {
      void (async () => {
        const result = await updateEnquiryStatusAsManager({
          enquiryId,
          newStatus: status,
          publicMessage,
          internalNote,
        });

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setPublicMessage("");
        setInternalNote("");
      })();
    });
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Manager Action</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as ManagerFormStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
              <SelectItem value="UNDER_REVIEW">UNDER REVIEW</SelectItem>
              <SelectItem value="ASSIGNED">ASSIGNED</SelectItem>
              <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
              <SelectItem value="RESOLVED">RESOLVED</SelectItem>
              <SelectItem value="ESCALATED">ESCALATED</SelectItem>
              <SelectItem value="CLOSED">CLOSED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager-public-message">Public Message</Label>
          <Textarea
            id="manager-public-message"
            rows={3}
            value={publicMessage}
            onChange={(e) => setPublicMessage(e.target.value)}
            placeholder="Optional message visible to the student"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager-internal-note">Manager Internal Note</Label>
          <Textarea
            id="manager-internal-note"
            rows={4}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Decision, recommendation, or internal management note"
          />
        </div>

        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Manager Action"}
        </Button>
      </CardContent>
    </Card>
  );
}