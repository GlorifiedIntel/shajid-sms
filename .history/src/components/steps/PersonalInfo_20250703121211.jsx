// components/steps/PersonalInfo.jsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStep } from "@/context/FormContext";
import * as z from "zod";

// Zod validation schema
const schema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  gender: z.enum(["Male", "Female"], "Gender is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  address: z.string().min(5, "Contact address is required"),
  dob: z.string().min(1, "Date of birth is required"),
  parentName: z.string().min(3, "Parent/Guardian name is required"),
  parentAddress: z.string().min(5, "Parent's contact address is required"),
});

export default function PersonalInfo() {
  const { updateData, next } = useFormStep();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    updateData(data);
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
      <p className="text-gray-600 mb-6">Please fill in the required details below.</p>

      <input {...register("fullName")} placeholder="Full Names" className="form-input" />
      {errors.fullName && <p className="text-red-500 text-sm mb-2">{errors.fullName.message}</p>}

      <select {...register("gender")} className="form-input">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && <p className="text-red-500 text-sm mb-2">{errors.gender.message}</p>}

      <input {...register("email")} placeholder="Email Address" className="form-input" />
      {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

      <input {...register("phone")} placeholder="Phone Number" className="form-input" />
      {errors.phone && <p className="text-red-500 text-sm mb-2">{errors.phone.message}</p>}

      <input {...register("address")} placeholder="Contact Address" className="form-input" />
      {errors.address && <p className="text-red-500 text-sm mb-2">{errors.address.message}</p>}

      <input {...register("dob")} type="date" className="form-input" />
      {errors.dob && <p className="text-red-500 text-sm mb-2">{errors.dob.message}</p>}

      <input {...register("parentName")} placeholder="Parent/Guardian Name" className="form-input" />
      {errors.parentName && <p className="text-red-500 text-sm mb-2">{errors.parentName.message}</p>}

      <input {...register("parentAddress")} placeholder="Parent's Contact Address" className="form-input" />
      {errors.parentAddress && <p className="text-red-500 text-sm mb-2">{errors.parentAddress.message}</p>}

      <div className="mt-4">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md">
          Next
        </button>
      </div>
    </form>
  );
}