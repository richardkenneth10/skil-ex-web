import axios from "@/utils/axios";
import Constants from "@/utils/constants";
import Routes from "@/utils/routes";
import { saveAuthTokens } from "@/utils/token";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { getCookies } from "cookies-next/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import Button from "./button";
import FormField from "./form-field";

export default function LoginForm() {
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
      const {
        data: { user, tokens },
      } = await axios.post("/auth/login", dataObj);

      console.log(getCookies({}));

      // const cookies=cookie()
      // cookies![0]

      await saveAuthTokens(tokens);
      await setCookie(Constants.userKey, JSON.stringify(user));
      toast.success("You are logged in!");
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
      <h1 className="font-bold my-3">Log In</h1>
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
        <button
          type="button"
          className="absolute right-2 top-0 bottom-0 m-auto"
          onClick={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <FaEye color="#1A4F6E" />
          ) : (
            <FaEyeSlash color="#1A4F6E" />
          )}
        </button>
      </div>
      <br />
      <Button text="Log in" />
      <br />
      <p>
        Don&apos;t have an account?{" "}
        <Link className="text-primary" href="?page=signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
