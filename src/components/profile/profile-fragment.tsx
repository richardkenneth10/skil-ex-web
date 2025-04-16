import { IMiniSkill } from "@/app/interfaces/skill/skill";
import { IUser } from "@/app/interfaces/user/user";
import Constants from "@/utils/constants";
import axios from "@/utils/server-axios";
import ClientCookie from "../(main)/client-cookie";
import ClientProfileFragment from "./client-profile-fragment";

export type ProfileResData = IUser & {
  skillsWanted: { skill: IMiniSkill }[];
  skillsOffered: { skill: IMiniSkill }[];
};

export default async function ProfileFragment() {
  const res = await axios.get("/auth/profile");
  const user: ProfileResData = res.data;

  return (
    <>
      <ClientCookie
        tokensJSONString={res.config.headers[Constants.authTokensHeaderKey]}
      />
      <ClientProfileFragment user={user} />
    </>
  );
}
