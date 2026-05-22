import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./Input";
import Button from "./Button";

import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router";

const addApplicationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  status: z.enum(["APPLIED", "INTERVIEW", "REJECTED", "OFFER"]),
  appliedAt: z.date().optional(),
  notes: z.string().optional(),
  link: z.string().url("Invalid URL").optional(),
});

export type AddApplicationValues = z.infer<typeof addApplicationSchema>;

const AddApplicationForm = () => {
 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
 } = useForm<AddApplicationValues>({
    resolver: zodResolver(addApplicationSchema),
    defaultValues: {
        title: "",
        company: "",
        status: "",
        appliedAt: new Date(),
        notes: "",
        link: "",
    }
 }) 


 return (
    <form className="flex flex-col gap-4" onSubmit={()=>{}}>

        <Input
            id="title"
            {...register("title")}
            label="JOB TITLE"
            placeholder="Software Engineer"
            error={errors.title?.message}
        />  
        <Input 
            id="company"
            {...register("company")}
            label="COMPANY"
            placeholder="Google"
            error={errors.company?.message}
        />
        <label htmlFor="status" className="text-label-md text-on-surface">
          STATUS
        </label>
        <select 
            id="status"
            {...register("status")}
            name="status"
            required
            className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant transition-colors outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2"
        >
            <option value="">Select Status</option>
            <option value="APPLIED">APPLIED</option>
            <option value="INTERVIEW">INTERVIEW</option>
            <option value="REJECTED">REJECTED</option>
            <option value="OFFER">OFFER</option>
        </select>
        {errors.status && <p className="text-label-md text-error">{errors.status.message}</p>}
        <Input
            id="appliedAt"
            {...register("appliedAt")}
            label="APPLIED AT"
            type="date"
            placeholder="APPLIED AT"
            error={errors.appliedAt?.message}
        />
        <Input
            id="notes"
            {...register("notes")}
            label="NOTES"
            placeholder="NOTES"
            error={errors.notes?.message}
        />
        <Input
            id="link"
            {...register("link")}
            label="LINK"
            placeholder="LINK"
            error={errors.link?.message}
        />
        <Button
            type="submit"
            disabled={isSubmitting}
        >
            Add Application
        </Button>
        
 </form>

 )
    
}

export default AddApplicationForm
