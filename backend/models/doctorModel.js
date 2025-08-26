import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
   weeklyAvailability: {
  type: Map,
  of: [
    {
      start: { type: String, required: true }, // "10:00"
      end: { type: String, required: true }     // "11:00"
    }
  ],
  default: {}
},
weeklyAvailability: {
  type: Map,
  of: [
    {
      start: { type: String, required: true }, 
      end: { type: String, required: true }     
    }
  ],
  default: {}
},
comments: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    star: { type: Number, required: true, min: 1, max: 5 }, 
    createdAt: { type: Date, default: Date.now }
  }
]





}, { minimize: false })

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;