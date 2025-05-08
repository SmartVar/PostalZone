import { notFound, redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
import TicketForm from "@/components/forms/TicketForm";
import ROUTES from "@/constants/routes";
import { getTicket } from "@/lib/actions/ticket.action";

const EditTicket = async ({ params }: RouteParams) => {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: ticket, success } = await getTicket({ ticketId: id });
  if (!success) return notFound();

  if (ticket?.author._id.toString() !== session?.user?.id)
    redirect(ROUTES.TICKET(id));

  return (
    <main>
      <TicketForm ticket={ticket} isEdit />
    </main>
  );
};

export default EditTicket;
