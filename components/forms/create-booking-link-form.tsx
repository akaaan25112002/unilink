"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Copy, Link2 } from "lucide-react";

import { createBookingToken } from "@/features/appointments/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CreateBookingLinkFormProps = {
  enquiryId: string;
};

export function CreateBookingLinkForm({
  enquiryId,
}: CreateBookingLinkFormProps) {
  const [isPending, startTransition] = useTransition();
  const [bookingUrl, setBookingUrl] = useState("");

  const handleCreate = () => {
    startTransition(() => {
      void (async () => {
        const result = await createBookingToken(enquiryId);

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_APP_URL ?? "";

        const url = `${origin}/booking/${result.token}`;
        setBookingUrl(url);
        toast.success("Booking link created successfully.");
      })();
    });
  };

  const handleCopy = async () => {
    if (!bookingUrl) return;

    try {
      await navigator.clipboard.writeText(bookingUrl);
      toast.success("Booking link copied.");
    } catch {
      toast.error("Unable to copy booking link.");
    }
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Create Booking Link</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-slate-500">
          Generate a booking link after you have already created availability slots.
          The student must open this link and choose a slot before an actual appointment
          record is created.
        </p>

        <Button onClick={handleCreate} disabled={isPending} className="gap-2">
          <Link2 className="h-4 w-4" />
          {isPending ? "Creating..." : "Generate Booking Link"}
        </Button>

        {bookingUrl ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-sm font-medium text-slate-900">
              Booking URL
            </p>
            <p className="break-all text-sm text-slate-600">{bookingUrl}</p>

            <Button
              type="button"
              variant="outline"
              className="mt-3 gap-2"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}