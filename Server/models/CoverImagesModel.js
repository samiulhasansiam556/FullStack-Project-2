
// models/CoverImage.js
import mongoose from "mongoose";

const coverImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CoverImages = mongoose.model("CoverImage", coverImageSchema);
 
export default CoverImages