import { AxiosError } from "axios";
import { deleteCookie } from "cookies-next";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "react-toastify";
import axios from "./axios";
import Constants from "./constants";
import Routes from "./routes";

export default async function logout(router: AppRouterInstance) {
  try {
    const data = (await axios.post("/auth/logout")).data;

    if (data.success) {
      deleteCookie(Constants.userKey);
      toast.success("You have been logged out!");
      router.push(`${Routes.auth}?page=login`);
    }
  } catch (error) {
    toast.error(
      ((
        (error as AxiosError).response?.data as
          | Record<string, unknown>
          | undefined
      )?.message ?? "Something went wrong.") as string
    );
  }
}
