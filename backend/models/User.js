import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["prosumer", "consumer", "admin"],
      required: true,
    },
    phone: { type: String },
    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
    },
    // Prosumer-only fields
    solarPanel: {
      capacityKw: { type: Number, default: 0 },
      installedOn: { type: Date },
      panelModel: { type: String },
    },
    walletBalance: { type: Number, default: 0 },
    carbonCreditsTotal: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    kycDocumentUrl: { type: String },

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
