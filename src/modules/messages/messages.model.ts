import { Document, Model, Schema, model } from "mongoose";

export interface IMessage extends Document {
  data: any; // Use `any` for data or specify a more precise type if possible
}

export interface IMessageModel extends Model<IMessage> {}

const messageSchema: Schema<IMessage> = new Schema<IMessage>(
  {
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = model<IMessage, IMessageModel>("Message", messageSchema);

export default Message;
