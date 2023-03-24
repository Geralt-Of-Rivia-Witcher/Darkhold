import { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    encryptedMasterKey: {
      type: Buffer,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileKey: {
      type: String,
      required: true,
    },
    md5Hash: {
      type: String,
      required: true,
    },
    chunkSize: {
      type: Number,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const File = model("File", fileSchema);

export default File;
