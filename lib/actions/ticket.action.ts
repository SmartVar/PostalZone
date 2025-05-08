"use server";

import mongoose, { Collection, FilterQuery, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { auth } from "@/auth";
// import { Answer, Collection, Interaction, Vote } from "@/database";
import Ticket, { ITicketDoc } from "@/database/ticket.model";
// import TagQuestion from "@/database/tag-question.model";
// import Tag, { ITagDoc } from "@/database/tag.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  CreateTicketSchema,
  DeleteQuestionSchema,
  DeleteTicketSchema,
  EditTicketSchema,
  GetTicketSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "@/lib/validations";

import dbConnect from "../mongoose";
// import { createInteraction } from "./interaction.action";
import { cache } from "react";
import { Question, TagQuestion, Answer } from "@/database";
import { Tag, Vote } from "lucide-react";
import { createInteraction } from "./interaction.action";

export async function createTicket(
  params: CreateTicketParams
): Promise<ActionResponse<Ticket>> {
  const validationResult = await action({
    params,
    schema: CreateTicketSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { division, po, tkttitle, tktdescription, tktpriority, tktstatus } =
    validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [ticket] = await Ticket.create(
      [
        {
          division,
          po,
          tkttitle,
          tktdescription,
          tktpriority,
          tktstatus,
          author: userId,
        },
      ],
      { session }
    );

    if (!ticket) throw new Error("Failed to create the ticket");

    // const tagIds: mongoose.Types.ObjectId[] = [];
    // const tagQuestionDocuments = [];

    // for (const tag of tags) {
    //   const existingTag = await Tag.findOneAndUpdate(
    //     { name: { $regex: new RegExp(`^${tag}$`, "i") } },
    //     { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
    //     { upsert: true, new: true, session }
    //   );

    //   tagIds.push(existingTag._id);
    //   tagQuestionDocuments.push({
    //     // tag: existingTag._id,
    //     question: question._id,
    //   });
    // }

    // await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // await Ticket.findByIdAndUpdate(
    //   question._id,
    //   { $push: { tags: { $each: tagIds } } },
    //   { session }
    // );

    // log the interaction
    // after(async () => {
    //   await createInteraction({
    //     action: "post",
    //     actionId: question._id.toString(),
    //     actionTarget: "question",
    //     authorId: userId as string,
    //   });
    // });

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(ticket)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editTicket(
  params: EditTicketParams
): Promise<ActionResponse<ITicketDoc>> {
  const validationResult = await action({
    params,
    schema: EditTicketSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    division,
    po,
    tkttitle,
    tktdescription,
    tktpriority,
    tktstatus,
    ticketId,
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new Error("Ticket not found");

    if (ticket.author.toString() !== userId) {
      throw new Error("You are not authorized to edit ticket");
    }

    if (
      ticket.division !== division ||
      ticket.po !== po ||
      ticket.tkttitle !== tkttitle ||
      ticket.tktdescription !== tktdescription ||
      ticket.tktpriority !== tktpriority ||
      ticket.tktstatus !== tktstatus
    ) {
      ticket.division = division;
      ticket.po = po;
      ticket.tkttitle = tkttitle;
      ticket.tktdescription = tktdescription;
      ticket.tktpriority = tktpriority;
      ticket.tktstatus = tktstatus;
      await ticket.save({ session });
    }

    // Save the updated question
    await ticket.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(ticket)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export const getTicket = cache(async function getTicket(
  params: GetTicketParams
): Promise<ActionResponse<Ticket>> {
  const validationResult = await action({
    params,
    schema: GetTicketSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { ticketId } = validationResult.params!;

  try {
    const ticket = await Ticket.findById(ticketId)
      //   .populate("tags", "_id name")
      .populate("author", "_id name image");

    if (!ticket) throw new Error("Ticket not found");

    return { success: true, data: JSON.parse(JSON.stringify(ticket)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

export async function getTickets(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    tickets: Ticket[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof Ticket> = {};
  let sortCriteria = {};

  try {
    // Search
    if (query) {
      filterQuery.$or = [
        { division: { $regex: query, $options: "i" } },
        { po: { $regex: query, $options: "i" } },
        { tkttitle: { $regex: query, $options: "i" } },
        { tktdescription: { $regex: query, $options: "i" } },
        { tktstatus: { $regex: query, $options: "i" } },
        { tktpriority: { $regex: query, $options: "i" } },
      ];
    }

    // Filters
    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        filterQuery.answers = 0;
        sortCriteria = { createdAt: -1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    const totalTickets = await Ticket.countDocuments(filterQuery);

    const tickets = await Ticket.find(filterQuery)
      // .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalTickets > skip + tickets.length;

    return {
      success: true,
      data: {
        tickets: JSON.parse(JSON.stringify(tickets)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteTicket(
  params: DeleteTicketParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteTicketSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { ticketId } = validationResult.params!;
  const { user } = validationResult.session!;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const ticket = await Ticket.findById(ticketId).session(session);
    if (!ticket) throw new Error("Ticket not found");

    if (ticket.author.toString() !== user?.id)
      throw new Error("You are not authorized to delete this ticket");

    // Delete related entries inside the transaction
    // await Collection.deleteMany({ ticket: ticketId }).session(session);
    // await TagQuestion.deleteMany({ ticket: questionId }).session(session);

    // For all tags of Question, find them and reduce their count
    // if (question.tags.length > 0) {
    //   await Tag.updateMany(
    //     { _id: { $in: question.tags } },
    //     { $inc: { questions: -1 } },
    //     { session }
    //   );
    // }

    // //  Remove all votes of the question
    // await Vote.deleteMany({
    //   actionId: questionId,
    //   actionType: "question",
    // }).session(session);

    // // Remove all answers and their votes of the question
    // const answers = await Answer.find({ question: questionId }).session(
    //   session
    // );

    // if (answers.length > 0) {
    //   await Answer.deleteMany({ question: questionId }).session(session);

    //   await Vote.deleteMany({
    //     actionId: { $in: answers.map((answer) => answer.id) },
    //     actionType: "answer",
    //   }).session(session);
    // }

    await Question.findByIdAndDelete(ticketId).session(session);

    // log the interaction
    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: ticketId,
        actionTarget: "ticket",
        authorId: user?.id as string,
      });
    });

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return handleError(error) as ErrorResponse;
  }
}
