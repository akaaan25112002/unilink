import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold">UniLink</h1>
      <p className="max-w-xl text-muted-foreground">
        A centralized student enquiry and appointment system for ABC University.
      </p>
      <Button asChild>
        <Link href="/login">Go to Login</Link>
      </Button>
    </main>
  );
}