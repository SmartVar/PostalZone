interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface GetTagDepartmentalbldgsParams
  extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface CreateTicketParams {
  division: string;
  po: string;
  tkttitle: string;
  tktdescription: string;
  tktstatus: string;
  tktpriority: string;
}

interface CreateDepartmentalbldgParams {
  division: string;
  po: string;
  classes: string;
  location: string;
  purchase_year: string;
  soa: string;
  paq: string;
  area: string;
  builtup_area: string;
  open_space: string;
  floors: string;
  value: string;
  exp_year: string;
  expenditure: string;
  mut_doc: string;
  mut_state: string;
  fund_type: string;
  fund_amount: string;
  cases: string;
  case_description: string;
  brief_history: string;
  tags: string[];
}

interface EditTicketParams extends CreateTicketParams {
  ticketId: string;
}

interface EditDepartmentalbldgParams extends CreateDepartmentalbldgParams {
  departmentalbldgId: string;
}

interface GetTicketParams {
  ticketId: string;
}

interface GetDepartmentalbldgParams {
  departmentalbldgId: string;
}

interface IncrementViewsParams {
  questionId: string;
}

interface CreateAnswerParams {
  content: string;
  questionId: string;
}

interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}

interface UpdateVoteCountParams extends CreateVoteParams {
  change: 1 | -1;
}

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}

interface CollectionBaseParams {
  questionId: string;
}

interface GetUserParams {
  userId: string;
}

interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "query | filter | sort"> {
  userId: string;
}

interface GetUserAnswersParams extends PaginatedSearchParams {
  userId: string;
}

interface GetUserTagsParams {
  userId: string;
}

interface DeleteQuestionParams {
  questionId: string;
}

interface DeleteTicketParams {
  ticketId: string;
}

interface DeleteDepartmentalbldgParams {
  departmentalbldgId: string;
}

interface DeleteAnswerParams {
  answerId: string;
}

interface CreateInteractionParams {
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  actionId: string;
  authorId: string;
  actionTarget: "question" | "answer" | "ticket" | "departmentalbldg";
}

interface UpdateReputationParams {
  interaction: IInteractionDoc;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}

interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}

interface JobFilterParams {
  query: string;
  page: string;
}

interface UpdateUserParams {
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  password?: string;
}

interface GlobalSearchParams {
  query: string;
  type: string | null;
}
