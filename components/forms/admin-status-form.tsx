"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateEnquiryStatusAsAdmin } from "@/features/enquiries/admin-actions";

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

type AdminFormStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "ESCALATED"
  | "CLOSED";

type AdminStatusFormProps = {
  enquiryId: string;
  defaultStatus?: AdminFormStatus;
};

export function AdminStatusForm({
  enquiryId,
  defaultStatus = "UNDER_REVIEW",
}: AdminStatusFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<AdminFormStatus>(defaultStatus);
  const [publicMessage, setPublicMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const handleSave = () => {
    startTransition(() => {
      void (async () => {
        const result = await updateEnquiryStatusAsAdmin({
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
        <CardTitle>Update Enquiry Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as AdminFormStatus)}>
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
          <Label htmlFor="public-message">Public Message</Label>
          <Textarea
            id="public-message"
            rows={3}
            value={publicMessage}
            onChange={(e) => setPublicMessage(e.target.value)}
            placeholder="Optional message visible to student"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="internal-note">Internal Note</Label>
          <Textarea
            id="internal-note"
            rows={3}
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Internal note for staff only"
          />
        </div>

        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Update"}
        </Button>
      </CardContent>
    </Card>
  );
}