"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { submitFeedback } from "@/features/feedback/actions";
import {
  feedbackSchema,
  type FeedbackValues,
} from "@/features/feedback/schemas";

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

type FeedbackFormProps = {
  enquiryId: string;
};

export function FeedbackForm({ enquiryId }: FeedbackFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 5,
      satisfaction: "SATISFIED",
      comment: "",
    },
  });

  const onSubmit = (values: FeedbackValues) => {
    startTransition(() => {
      void (async () => {
        const result = await submitFeedback({
          enquiryId,
          rating: values.rating,
          satisfaction: values.satisfaction,
          comment: values.comment,
        });

        if (!result.ok) {
          toast.error(result.message);
          return;
        }

        toast.success("Feedback submitted successfully.");

        form.reset({
          rating: 5,
          satisfaction: "SATISFIED",
          comment: "",
        });
      })();
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border bg-card p-6"
    >
      <div className="space-y-2">
        <Label htmlFor="rating">Rating (1–5)</Label>
        <Input
          id="rating"
          type="number"
          min={1}
          max={5}
          {...form.register("rating", {
            valueAsNumber: true,
          })}
        />
        {form.formState.errors.rating ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.rating.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Satisfaction</Label>
        <Select
          value={form.watch("satisfaction")}
          onValueChange={(value: FeedbackValues["satisfaction"]) =>
            form.setValue("satisfaction", value, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select satisfaction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VERY_SATISFIED">Very Satisfied</SelectItem>
            <SelectItem value="SATISFIED">Satisfied</SelectItem>
            <SelectItem value="NEUTRAL">Neutral</SelectItem>
            <SelectItem value="DISSATISFIED">Dissatisfied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Comment</Label>
        <Textarea id="comment" rows={4} {...form.register("comment")} />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
}