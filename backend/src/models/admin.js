import { Schema, model } from "mongoose";

const adminSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    loginAttemps: {
      type: Date,
    },
    timeOut: {
      type: Boolean,
    }
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("Admin", adminSchema);
