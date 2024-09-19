import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

type Props = {};

export default function TicketSearchField({}: Props) {
  return (
    <div className="flex items-center m-2 gap-2">
      <Input type="email" placeholder="Search all tickets..." />
      <Button type="submit">Search</Button>
    </div>
  );
}
