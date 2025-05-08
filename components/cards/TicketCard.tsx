import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

// import TagCard from "./TagCard";
import Metric from "../Metric";
import EditDeleteAction from "../user/EditDeleteAction";
import { Badge } from "../ui/badge";

interface Props {
  ticket: Ticket;
  showActionBtns?: boolean;
}

const TicketCard = ({
  ticket: {
    _id,
    division,
    po,
    tkttitle,
    tktdescription,
    tktpriority,
    tktstatus,
    author,
    createdAt,
  },
  showActionBtns = false,
}: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row">
        <div className="flex-1">
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>

          <Link href={ROUTES.TICKET(_id)}>
            <Badge className="subtle-medium background-light800_dark300 text-light400_light500 flex flex-row gap-2 rounded-md border-none px-4 py-2 uppercase">
              {/* <div className="flex-center space-x-2"> */}
              <span>{po}</span>
              {/* </div> */}
            </Badge>
            <h3 className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border">
              {po}
            </h3>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {tkttitle}
            </h3>
            <h3 className="sm:paragraph-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {tktdescription}
            </h3>
          </Link>
        </div>

        {showActionBtns && <EditDeleteAction type="Ticket" itemId={_id} />}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl="/icons/like.svg"
          alt={division}
          value={division}
          title={`• asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.HOME}
          textStyles="body-medium text-dark400_light700"
          isAuthor
          titleStyles="max-sm:hidden"
        />

        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="status"
            value={tktstatus}
            title=" Status"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="priority"
            value={tktpriority}
            title=" Priority"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
