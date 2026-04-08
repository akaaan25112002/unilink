import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/enquiries/status-badge";
import { PriorityBadge } from "@/components/enquiries/priority-badge";
import type { Enquiry } from "@/types/enquiry";

type Props = {
  items: Enquiry[];
  basePath: string;
};

export function EnquiryTable({ items, basePath }: Props) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link href={`${basePath}/${item.id}`} className="font-medium underline-offset-4 hover:underline">
                  {item.enquiryCode}
                </Link>
              </TableCell>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={item.priority} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}