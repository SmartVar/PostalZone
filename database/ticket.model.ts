import { model, models, Schema, Types, Document } from "mongoose";

export interface ITicket {
  division: string;
  po: string;
  tkttitle: string;
  tktdescription: string;
  tktstatus: string;
  tktpriority: string;
  author: Types.ObjectId;
}

export interface ITicketDoc extends ITicket, Document {}
const TicketSchema = new Schema<ITicket>(
  {
    division: { type: String, required: true },
    po: { type: String, required: true },
    tkttitle: { type: String, required: true },
    tktdescription: { type: String, required: true },
    tktstatus: { type: String, required: true },
    tktpriority: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Ticket = models?.Ticket || model<ITicket>("Ticket", TicketSchema);

export default Ticket;
