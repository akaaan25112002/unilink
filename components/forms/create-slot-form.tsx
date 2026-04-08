"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { createAppointmentSlot } from "@/features/appointments/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateSlotForm() {
  const [isPending, startTransition] = useTransition();
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [location, setLocation] = useState("");
  const [meetingMode, setMeetingMode] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreate = () => {
    if (!startsAt || !endsAt) {
      toast.error("Please provide both start and end times.");
      return;
    }

    startTransition(() => {
      void (async () => {
        const result = await createAppointmentSlot({
          startsAt,
          endsAt,
          location,
          meetingMode,
          notes,
        });

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        setStartsAt("");
        setEndsAt("");
        setLocation("");
        setMeetingMode("");
        setNotes("");
      })();
    });
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Create Availability Slot</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="starts-at">Starts At</Label>
            <Input
              id="starts-at"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ends-at">Ends At</Label>
            <Input
              id="ends-at"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Student Support Office / Online"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meeting-mode">Meeting Mode</Label>
            <Input
              id="meeting-mode"
              placeholder="Online / In-person"
              value={meetingMode}
              onChange={(e) => setMeetingMode(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="slot-notes">Notes</Label>
          <Textarea
            id="slot-notes"
            rows={3}
            placeholder="Optional instructions for this slot"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleCreate} disabled={isPending}>
          {isPending ? "Creating..." : "Create Slot"}
        </Button>
      </CardContent>
    </Card>
  );
}