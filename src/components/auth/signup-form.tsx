import axios from "@/utils/axios";
import Constants from "@/utils/constants";
import Routes from "@/utils/routes";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import FormField from "./form-field";

export default function SignupForm() {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataObj = formData.entries().reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as Record<string, unknown>);

    try {
      const data = (await axios.post("/auth/register", dataObj)).data;

      await setCookie(Constants.userKey, JSON.stringify(data));
      toast.success("You are registered!");
      router.push(Routes.home);
    } catch (error) {
      toast.error(
        ((
          (error as AxiosError).response?.data as
            | Record<string, unknown>
            | undefined
        )?.message ?? "Something went wrong.") as string
      );
    }
  };

  return (
    <form
      className="m-auto text-center flex flex-col items-center"
      onSubmit={handleSubmit}
    >
      <Image
        className=""
        src="/icons/logo.png"
        alt="logo"
        height="50"
        width="50"
      />
      <h1 className="font-bold my-3">Sign up</h1>
      <div className="grid grid-cols-2 gap-2">
        <FormField
          name="firstName"
          placeholder="First name"
          width={"7.25rem"}
        />
        <FormField name="lastName" placeholder="Last name" width={"7.25rem"} />
      </div>
      <br />
      <FormField name="email" type="email" placeholder="Email" />
      <br />
      <div className="relative">
        <FormField
          name="password"
          type={isPasswordVisible ? "text" : "password"}
          placeholder="Password"
          minLength={4}
          addedClass="pr-8"
        />
        <button type="button" onClick={togglePasswordVisibility}>
          {isPasswordVisible ? (
            <FaEye
              className="absolute top-0 right-2 bottom-0 m-auto"
              color="#1A4F6E"
            />
          ) : (
            <FaEyeSlash
              className="absolute top-0 right-2 bottom-0 m-auto"
              color="#1A4F6E"
            />
          )}
        </button>
      </div>{" "}
      <br />
      <button
        type="submit"
        className={`bg-[#0086CA] text-white font-bold w-60 py-2 rounded-md`}
      >
        Sign up
      </button>
      <br />
      <p>
        Already have an account?{" "}
        <Link className="text-[#0086CA]" href="?page=login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
