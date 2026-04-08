import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type TraceabilityItem = {
  id: string;
  eventType: string;
  note: string | null;
  createdAt: string;
  actorName?: string | null;
};

export function TraceabilityTimeline({
  items,
}: {
  items: TraceabilityItem[];
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Traceability</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">No traceability events found.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium text-slate-900">
                  {item.eventType.replaceAll("_", " ")}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.note ?? "No additional note"}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  {item.actorName ? `${item.actorName} • ` : ""}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}