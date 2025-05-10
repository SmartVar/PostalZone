import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/auth";
// import TicketForm from "@/components/forms/DepartmentalbldgForm";
import DepartmentalbldgForm from "@/components/forms/DepartmentalbldgForm";

const CreateDepartmentalbldg = async () => {
  const session = await auth();

  if (!session) return redirect("/sign-in");

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Create DoP Bldg</h1>

      <div className="mt-9">
        <DepartmentalbldgForm />
      </div>
    </>
  );
};

export default CreateDepartmentalbldg;
