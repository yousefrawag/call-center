const mongoose = require("mongoose");


const file = mongoose.Schema(
  {
    fileURL: String,
    fileID: String,
  },
  { _id: false }
);
const projectSchema = mongoose.Schema(
  {
    name:String,
    phone:String,
    scoundphone: String,
    stauts: { type: String },
    idNumber:String ,
    SiginNumber:String ,
    ExpiryDate:Date,
    ReleaseDate:Date,
    imagesURLs: [file],
    videosURLs: [file],
    docsURLs: [file],

    addedBy: { type: Number, ref: "users" },
 
  },

  {
    timestamps: true,
  }
);


module.exports = mongoose.model("projects", projectSchema);
