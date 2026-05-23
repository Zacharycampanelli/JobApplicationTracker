import Button from "./Button";
import Input from "./Input";
import Link from "../../assets/images/link.svg?react";
import  Select from "./Select";
import { useAuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
        <form className="flex flex-col gap-4" onSubmit={() => { }}>
            <Input
                id="company"
                {...register("company")}
                label="COMPANY NAME"
                placeholder="e.g. Google"
                error={errors.company?.message}
            />

            <Input
                id="title"
                {...register("title")}
                label="JOB TITLE"
                placeholder="e.g. Software Engineer"
                error={errors.title?.message}
            />
        
           <Select 
                id="status"
                {...register("status")}
                name="status"
                required
                placeholder="Select Status"
                options={[
                    { value: "APPLIED", label: "APPLIED" },
                    { value: "INTERVIEW", label: "INTERVIEW" },
                    { value: "REJECTED", label: "REJECTED" },
                    { value: "OFFER", label: "OFFER" },
                ]}
                error={errors.status?.message}
           >

           </Select>
            <Input
                id="appliedAt"
                {...register("appliedAt")}
                label="APPLIED AT"
                type="date"
                placeholder="e.g. 2022-01-01"
                error={errors.appliedAt?.message}
            />
            <Input
                id="notes"
                {...register("notes")}
                label="NOTES"
                placeholder="Document interview highlights, referral contacts, or preparation notes..."
                error={errors.notes?.message}
            />
            <Input
                id="link"
                {...register("link")}
                label="JOB LINK/ URL"
                placeholder="LINK"
                error={errors.link?.message}
                startIcon={<Link />}
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
