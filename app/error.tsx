"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <button className="rounded-md border px-4 py-2" onClick={reset}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}