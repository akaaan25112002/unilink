"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createEnquiry } from "@/features/enquiries/actions";
import {
  enquirySchema,
  type EnquiryValues,
} from "@/features/enquiries/schemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES: EnquiryValues["category"][] = [
  "ACADEMIC",
  "FINANCIAL",
  "WELFARE",
  "VISA",
  "GRADUATION",
  "OTHER",
];

export function EnquiryForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "OTHER",
    },
  });

  const onSubmit = (values: EnquiryValues) => {
    startTransition(() => {
      void (async () => {
        const result = await createEnquiry(values);

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        form.reset({
          subject: "",
          description: "",
          category: "OTHER",
        });
      })();
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border bg-card p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" {...form.register("subject")} />
        {form.formState.errors.subject ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={6} {...form.register("description")} />
        {form.formState.errors.description ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={form.watch("category")}
          onValueChange={(value: EnquiryValues["category"]) =>
            form.setValue("category", value, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.category ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.category.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Enquiry"}
      </Button>
    </form>
  );
}