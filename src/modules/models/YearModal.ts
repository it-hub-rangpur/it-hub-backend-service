import { Document, model, Model, Schema } from "mongoose";

export interface IYear extends Document {
  year: string;
}

const yearSchema: Schema<IYear> = new Schema<IYear>(
  {
    year: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Year: Model<IYear> = model<IYear>("Year", yearSchema);

export default Year;
