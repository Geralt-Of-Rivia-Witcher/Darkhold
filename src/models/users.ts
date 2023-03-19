import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    rsaPublicKey: {
      type: String,
      required: true,
    },
    rsaPrivateKey: {
      type: String,
      required: true,
    },
    encryptedMasterKey: {
      type: Buffer,
      required: true,
    },
    files: [
      {
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
