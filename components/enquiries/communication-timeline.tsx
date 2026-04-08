import type { CommunicationEntry } from "@/types/enquiry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CommunicationTimeline({
  items,
}: {
  items: CommunicationEntry[];
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Communication History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No communication history yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-slate-900">
                  {item.authorName} ({item.authorRole})
                </p>
                {item.isInternal ? (
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                    INTERNAL
                  </span>
                ) : (
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    PUBLIC
                  </span>
                )}
              </div>
              <p className="mt-2 text-slate-600">{item.message}</p>
              <p className="mt-2 text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}