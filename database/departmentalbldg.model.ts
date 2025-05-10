import { model, models, Schema, Types, Document } from "mongoose";

export interface IDepartmentalbldg {
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
  tags: Types.ObjectId[];
  author: Types.ObjectId;
  // createdOn: Date;
}

export interface IDepartmentalbldgDoc extends IDepartmentalbldg, Document {}
const DepartmentalbldgSchema = new Schema<IDepartmentalbldg>(
  {
    division: { type: String, required: true },
    po: { type: String, required: true },
    classes: { type: String, required: true },
    location: { type: String, required: true },
    purchase_year: { type: String },
    soa: { type: String },
    paq: { type: String },
    area: { type: String },
    builtup_area: { type: String },
    open_space: { type: String },
    floors: { type: String },
    exp_year: { type: String },
    expenditure: { type: String },
    value: { type: String },
    mut_doc: { type: String },
    mut_state: { type: String },
    fund_type: { type: String },
    fund_amount: { type: String },
    cases: { type: String },
    case_description: { type: String },
    brief_history: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // createdOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Departmentalbldg =
  models?.Departmentalbldg || model("Departmentalbldg", DepartmentalbldgSchema);

export default Departmentalbldg;
