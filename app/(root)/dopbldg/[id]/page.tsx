import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { Suspense } from "react";

// import AllAnswers from "@/components/answers/AllAnswers";
// import TagCard from "@/components/cards/TagCard";
// import { Preview } from "@/components/editor/Preview";
// import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
// import SaveQuestion from "@/components/questions/SaveQuestion";
import UserAvatar from "@/components/UserAvatar";
// import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
// import { getAnswers } from "@/lib/actions/answer.action";
// import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { getDepartmentalbldg } from "@/lib/actions/departmentalbldg.action";
// import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const { success, data: departmentalbldg } = await getDepartmentalbldg({
    departmentalbldgId: id,
  });

  if (!success || !departmentalbldg) {
    return {
      title: "Dop Bldg not found",
      description: "Dop Bldg does not exist.",
    };
  }

  return {
    title: departmentalbldg.division,
    description: departmentalbldg.case_description.slice(0, 100),
    twitter: {
      card: "summary_large_image",
      title: departmentalbldg.division,
      description: departmentalbldg.case_description.slice(0, 100),
    },
  };
}

const DepartmentalbldgDetails = async ({
  params,
  searchParams,
}: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;
  const { success, data: departmentalbldg } = await getDepartmentalbldg({
    departmentalbldgId: id,
  });

  //   after(async () => {
  //     await incrementViews({ questionId: id });
  //   });

  if (!success || !departmentalbldg) return redirect("/404");

  //   const {
  //     success: areAnswersLoaded,
  //     data: answersResult,
  //     error: answersError,
  //   } = await getAnswers({
  //     questionId: id,
  //     page: Number(page) || 1,
  //     pageSize: Number(pageSize) || 10,
  //     filter,
  //   });

  //   const hasVotedPromise = hasVoted({
  //     targetId: question._id,
  //     targetType: "question",
  //   });

  //   const hasSavedQuestionPromise = hasSavedQuestion({
  //     questionId: question._id,
  //   });

  const { author, createdAt, division, po, cases, case_description } =
    departmentalbldg;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            {/* <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl="/icons/message.svg"
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            /> */}
            <Link href={ROUTES.HOME}>
              <p className="paragraph-semibold text-dark300_light700">
                {division}
              </p>
            </Link>
          </div>

          {/* <div className="flex items-center justify-end gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="question"
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetId={question._id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>

            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense>
          </div> */}
        </div>
        <div>
          <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
            {po}
          </h2>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {case_description}
        </h2>
      </div>

      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="division"
          value={division}
          title=" division"
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="Post Office"
          value={po}
          title=" PO"
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={cases}
          title=" priority"
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={case_description}
          title=" status"
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      {/* <Preview content={content} /> */}
      {/* 
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>

      <section className="my-5">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answersResult?.isNext || false}
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>

      <section className="my-5">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section> */}
    </>
  );
};

export default DepartmentalbldgDetails;
