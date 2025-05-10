"use server";

import mongoose, { Collection, FilterQuery, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { auth } from "@/auth";
// import { Answer, Collection, Interaction, Vote } from "@/database";
// import Departmentalbldg, {IDepartmentalbldgDoc } from "@/database/departmentalbldg.model";
import Departmentalbldg, {
  IDepartmentalbldgDoc,
} from "@/database/departmentalbldg.model";
// import TagQuestion from "@/database/tag-question.model";
import { ITagDoc } from "@/database/tag.model";
import action from "@/lib/handlers/action";
import handleError from "@/lib/handlers/error";
import {
  CreateDepartmentalbldgSchema,
  DeleteQuestionSchema,
  DeleteDepartmentalbldgSchema,
  EditDepartmentalbldgSchema,
  GetDepartmentalbldgSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
  DeleteTicketSchema,
  EditTicketSchema,
  GetTicketSchema,
} from "@/lib/validations";

import dbConnect from "../mongoose";
// import { createInteraction } from "./interaction.action";
import { cache } from "react";
import { TagQuestion } from "@/database";
import { Tag, Ticket, Vote } from "lucide-react";
import { createInteraction } from "./interaction.action";
import { ITicketDoc } from "@/database/ticket.model";

export async function createDepartmentalbldg(
  params: CreateDepartmentalbldgParams
): Promise<ActionResponse<Departmentalbldg>> {
  const validationResult = await action({
    params,
    schema: CreateDepartmentalbldgSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    division,
    po,
    classes,
    location,
    purchase_year,
    soa,
    paq,
    area,
    builtup_area,
    open_space,
    floors,
    value,
    exp_year,
    expenditure,
    mut_doc,
    mut_state,
    fund_type,
    fund_amount,
    cases,
    case_description,
    brief_history,
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [departmentalbldg] = await Departmentalbldg.create(
      [
        {
          division,
          po,
          class: classes,
          location,
          // eslint-disable-next-line camelcase
          purchase_year,
          soa,
          paq,
          area,
          builtup_area,
          open_space,
          floors,
          value,
          exp_year,
          expenditure,
          mut_doc,
          mut_state,
          fund_type,
          fund_amount,
          case: cases,
          case_description,
          brief_history,
          author: userId,
        },
      ],
      { session }
    );

    if (!departmentalbldg) throw new Error("Failed to create the record");

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagDepartmentalbldgDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { departmentalbldgs: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag._id);
      tagDepartmentalbldgDocuments.push({
        tag: existingTag._id,
        question: departmentalbldg._id,
      });
    }

    await TagQuestion.insertMany(tagDepartmentalbldgDocuments, { session });

    await Departmentalbldg.findByIdAndUpdate(
      departmentalbldg._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

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

    return {
      success: true,
      data: JSON.parse(JSON.stringify(departmentalbldg)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function editDepartmentalbldg(
  params: EditDepartmentalbldgParams
): Promise<ActionResponse<IDepartmentalbldgDoc>> {
  const validationResult = await action({
    params,
    schema: EditDepartmentalbldgSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    division,
    po,
    classes,
    location,
    // eslint-disable-next-line camelcase
    purchase_year,
    soa,
    paq,
    area,
    builtup_area,
    open_space,
    floors,
    value,
    exp_year,
    expenditure,
    mut_doc,
    mut_state,
    fund_type,
    fund_amount,
    cases,
    case_description,
    brief_history,
  } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const departmentalbldg =
      await Departmentalbldg.findById(departmentalbldgId).populate("tags");
    if (!departmentalbldg) throw new Error("DoP Bldg not found");

    if (departmentalbldg.author.toString() !== userId) {
      throw new Error("You are not authorized to edit record");
    }

    if (
      departmentalbldg.division !== division ||
      departmentalbldg.po !== po ||
      departmentalbldg.classes !== classes ||
      departmentalbldg.location !== location ||
      departmentalbldg.purchase_year !== purchase_year ||
      departmentalbldg.soa !== soa ||
      departmentalbldg.paq !== paq ||
      departmentalbldg.area !== area ||
      departmentalbldg.builtup_area !== builtup_area ||
      departmentalbldg.open_space !== open_space ||
      departmentalbldg.floors !== floors ||
      departmentalbldg.value !== value ||
      departmentalbldg.exp_year !== exp_year ||
      departmentalbldg.expenditure !== expenditure ||
      departmentalbldg.mut_doc !== mut_doc ||
      departmentalbldg.mut_state !== mut_state ||
      departmentalbldg.fund_amount !== fund_amount ||
      departmentalbldg.fund_type !== fund_type ||
      departmentalbldg.cases !== cases ||
      departmentalbldg.case_description !== case_description ||
      departmentalbldg.brief_history !== brief_history
    ) {
      departmentalbldg.division = division;
      departmentalbldg.po = po;
      departmentalbldg.classes = classes;
      departmentalbldg.location = location;
      departmentalbldg.purchase_year = purchase_year;
      departmentalbldg.soa = soa;
      departmentalbldg.paq = paq;
      departmentalbldg.area = area;
      departmentalbldg.builtup_area = builtup_area;
      departmentalbldg.open_space = open_space;
      departmentalbldg.floors = floors;
      departmentalbldg.value = value;
      departmentalbldg.exp_year = exp_year;
      departmentalbldg.expenditure !== expenditure;
      departmentalbldg.mut_doc = mut_doc;
      departmentalbldg.mut_state = mut_state;
      departmentalbldg.fund_amount = fund_amount;
      departmentalbldg.fund_type = fund_type;
      departmentalbldg.cases = cases;
      departmentalbldg.case_description = case_description;
      departmentalbldg.brief_history = brief_history;
      await departmentalbldg.save({ session });
    }

    // Save the updated record
    await departmentalbldg.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(departmentalbldg)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export const getDepartmentalbldg = cache(async function getDepartmentalbldg(
  params: GetDepartmentalbldgParams
): Promise<ActionResponse<Ticket>> {
  const validationResult = await action({
    params,
    schema: GetDepartmentalbldgSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { departmentalbldgId } = validationResult.params!;

  try {
    const departmentalbldg = await Departmentalbldg.findById(departmentalbldgId)
      .populate("tags", "_id name")
      .populate("author", "_id name image");

    if (!departmentalbldg) throw new Error("Record not found");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(departmentalbldg)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

export async function getDepartmentalbldgs(
  params: PaginatedSearchParams
): Promise<
  ActionResponse<{
    departmentalbldgs: Departmentalbldg[];
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

  const filterQuery: FilterQuery<typeof Departmentalbldg> = {};
  let sortCriteria = {};

  try {
    // Search
    if (query) {
      filterQuery.$or = [
        { division: { $regex: query, $options: "i" } },
        { po: { $regex: query, $options: "i" } },
        { class: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { purchase_year: { $regex: query, $options: "i" } },
        { soa: { $regex: query, $options: "i" } },
        { paq: { $regex: query, $options: "i" } },
        { area: { $regex: query, $options: "i" } },
        { builtup_area: { $regex: query, $options: "i" } },
        { open_space: { $regex: query, $options: "i" } },
        { floors: { $regex: query, $options: "i" } },
        { value: { $regex: query, $options: "i" } },
        { exp_year: { $regex: query, $options: "i" } },
        { expenditure: { $regex: query, $options: "i" } },
        { mut_doc: { $regex: query, $options: "i" } },
        { mut_state: { $regex: query, $options: "i" } },
        { fund_type: { $regex: query, $options: "i" } },
        { fund_amount: { $regex: query, $options: "i" } },
        { case: { $regex: query, $options: "i" } },
        { case_description: { $regex: query, $options: "i" } },
        { brief_description: { $regex: query, $options: "i" } },
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

    const totalDepartmentalbldgs =
      await Departmentalbldg.countDocuments(filterQuery);

    const departmentalbldgs = await Departmentalbldg.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalDepartmentalbldgs > skip + departmentalbldgs.length;

    return {
      success: true,
      data: {
        departmentalbldgs: JSON.parse(JSON.stringify(departmentalbldgs)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function deleteDepartmentalbldg(
  params: DeleteDepartmentalbldgParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteDepartmentalbldgSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { departmentalbldgId } = validationResult.params!;
  const { user } = validationResult.session!;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const departmentalbldg =
      await Departmentalbldg.findById(departmentalbldgId).session(session);
    if (!departmentalbldg) throw new Error("Record not found");

    if (departmentalbldg.author.toString() !== user?.id)
      throw new Error("You are not authorized to delete this record");

    // Delete related entries inside the transaction
    // await Collection.deleteMany({ ticket: ticketId }).session(session);
    await TagQuestion.deleteMany({ ticket: departmentalbldgId }).session(
      session
    );

    // For all tags of Question, find them and reduce their count
    if (departmentalbldg.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: departmentalbldg.tags } },
        { $inc: { departmentalbldgs: -1 } },
        { session }
      );
    }

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

    await Departmentalbldg.findByIdAndDelete(departmentalbldgId).session(
      session
    );

    // log the interaction
    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: departmentalbldgId,
        actionTarget: "departmentalbldg",
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
