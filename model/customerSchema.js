const mongoose = require("mongoose");
const autoIncrement = require("mongoose-sequence")(mongoose);

const customerSchema = mongoose.Schema(
  {

    customer: {
         type: mongoose.Schema.Types.ObjectId,
         ref:"projects"

   
    },
    EstbilshSatuts: {
      type: String,
    enum:["APPROVED" , "REJECTED" , "NEUTRAL" , "NO_RESPONSE"]

    },
    contactDate: {
      type: Date,
    

    },
    contactStauts:{
type:String,
enum:["inprosess" , "contacted" , "nocontact"] ,
default:"nocontact"
    },
   
    notes: {
      type: String,
      trim:true

    },
   
    addedBy: { type: Number, ref: "users" },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("clients", customerSchema);
