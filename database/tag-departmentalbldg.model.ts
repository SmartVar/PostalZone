import { model, models, Schema, Types, Document } from "mongoose";

export interface ITagDepartmentalbldg {
  tag: Types.ObjectId;
  departmentalbldg: Types.ObjectId;
}

export interface ITagDepartmentalbldgDoc
  extends ITagDepartmentalbldg,
    Document {}
const TagDepartmentalbldgSchema = new Schema<ITagDepartmentalbldg>(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    departmentalbldg: {
      type: Schema.Types.ObjectId,
      ref: "Departmentalbldg",
      required: true,
    },
  },
  { timestamps: true }
);

const TagDepartmentalbldg =
  models?.TagDepartmentalbldg ||
  model<ITagDepartmentalbldg>("TagDepartmentalbldg", TagDepartmentalbldgSchema);

export default TagDepartmentalbldg;
