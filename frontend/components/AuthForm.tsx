"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/auth";
import { Logo } from "@/components/Logo";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3, "Name must be at least 3 characters") : z.string().optional(),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const formSchema = authFormSchema(type);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        await register(values.name || "", values.email, values.password);
        toast.success('Account created successfully! Please sign in.');
        router.push('/sign-in');
      } else {
        await login(values.email, values.password);
        toast.success("Signed in successfully!");
        router.push('/');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }
  
  const isSign = type === "sign-in";
  
  return (
    <div className="card-border lg:min-w-141.5">
      <div className="flex flex-col gap-6 card py-14 px-10 relative overflow-hidden group">
        {/* Decorative background element - Abstract Glow */}
        <div className="absolute top-0 right-0 p-10 opacity-20 pointer-events-none">
             <div className="w-32 h-32 bg-primary-200 rounded-full blur-[100px]" />
        </div>

        {/* Animated Flight Action */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            {/* Plane Taking Off */}
            <div className="absolute bottom-0 left-0 animate-takeoff">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-32 h-32 text-primary-200"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.258 50.55 50.55 0 00-2.658.813m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
            </div>
             {/* Floating ambient plane */}
             <div className="absolute top-10 right-10 animate-float-slow opacity-50">
                <div className="w-16 h-16 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-md" />
             </div>
        </div>

        <div className="flex flex-col gap-4 justify-center items-center z-10 transition-transform duration-700 hover:scale-[1.02]">
          <Logo size="xl" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Aero Prep</h2>
        </div>
        <h3 className="text-center text-light-400 font-medium z-10">Initialize your career flight plan</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSign && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter Your Password"
              type="password"
            />
            <Button className="btn w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : (isSign ? "Sign in" : "Create an Account")}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSign ? "No Account Yet?" : "Have an account already?"}
          <Link
            href={!isSign ? "/sign-in" : "/sign-up"}
            className="font-bold text-primary-200 ml-1 hover:text-primary-300 transition-colors"
          >
            {!isSign ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
