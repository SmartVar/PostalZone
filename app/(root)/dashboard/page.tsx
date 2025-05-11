import { auth } from "@/auth";
import { DopCharts } from "@/components/dashboard/DopCharts";
import Stats from "@/components/user/Stats";
import { getUser, getUserStats } from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import React from "react";

const Dashboard = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) notFound();

  const loggedInUser = await auth();
  const { success, data, error } = await getUser({
    userId: id,
  });

  if (!success)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="h1-bold text-dark100_light900">User not found</h1>
        <p className="paragraph-regular text-dark200_light800 max-w-md">
          {error?.message}
        </p>
      </div>
    );

  const { user } = data!;

  const { data: userStats } = await getUserStats({ userId: id });

  return (
    <>
      <Stats
        totalQuestions={userStats?.totalQuestions || 0}
        totalAnswers={userStats?.totalAnswers || 0}
        badges={userStats?.badges || { GOLD: 0, SILVER: 0, BRONZE: 0 }}
        reputationPoints={user.reputation || 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 2xls:grid-cols-4 gap-4">
        <div className="text-dark300_light700 border-spacing-1 m-2 p-4 rounded-lg ">
          <DopCharts />
        </div>
        <div className="text-dark300_light700 border-spacing-1 m-2 p-4 rounded-lg ">
          Test
        </div>
        <div className="text-dark300_light700 border-spacing-1 m-2 p-4 rounded-lg ">
          Test
        </div>
        <div className="text-dark300_light700 border-spacing-1 m-2 p-4 rounded-lg ">
          Test
        </div>
        <div className="text-dark300_light700 border-spacing-1 m-2 p-4 rounded-lg ">
          Test
        </div>
        <div className="text-dark300_light700 border-spacing-1 m-2 p-4 rounded-lg ">
          Test
        </div>
      </div>
    </>
  );
};

export default Dashboard;
