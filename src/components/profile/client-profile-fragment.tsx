"use client";

import { IMiniSkill } from "@/app/interfaces/skill/skill";
import { useUser } from "@/contexts/user-context";
import axios from "@/utils/axios";
import Constants from "@/utils/constants";
import { sleep } from "@/utils/dev";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import Avatar from "../(main)/avatar";
import Button from "../auth/button";
import FormField from "../auth/form-field";
import AddSkill from "./add-skill";
import { ProfileResData } from "./profile-fragment";

export type SkillsByCategory = {
  id: number;
  name: string;
  skills: Omit<IMiniSkill, "category">[];
};

export default function ClientProfileFragment({
  user,
}: {
  user: ProfileResData;
}) {
  const { setUser } = useUser();
  const [skillsByCategory, setSkillsByCategory] =
    useState<SkillsByCategory[]>();
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File>();

  const avatarChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const avatarFile = e.target.files?.item(0);
    if (avatarFile) {
      const twoMB = 2 * 1024 * 1024;
      if (avatarFile.size > twoMB) {
        toast.error("Image size should not be more than 2 MB");
        return;
      }
      setAvatarFile(avatarFile);
      setFormData((d) => ({
        ...d,
        avatarUrl: URL.createObjectURL(avatarFile),
      }));
    }
  };

  const fetchSkillsByCategoryHandler = async () => {
    const { data }: { data: { categories: SkillsByCategory[] } } =
      await axios.get("/skills");
    await sleep(2000);
    setSkillsByCategory(data.categories);
  };

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    email: user.email,
    skillIdsWanted: user.skillsWanted.map((s) => s.skill.id), // Start with user's current skills
    skillIdsOffered: user.skillsOffered.map((s) => s.skill.id), // Start with user's current skills
  });

  //todo: may need to check the reason why we need to disable to rules as it fails on build
  const handleNewOfferedSkillsChange = useCallback(
    (s: { skill: IMiniSkill }[]) => handleNewSkillsChange(s, "offered"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleNewWantedSkillsChange = useCallback(
    (s: { skill: IMiniSkill }[]) => handleNewSkillsChange(s, "wanted"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleNewSkillsChange = (
    s: { skill: IMiniSkill }[],
    type: "wanted" | "offered"
  ) => {
    switch (type) {
      case "wanted":
        setFormData((prev) => ({
          ...prev,
          skillIdsWanted: [
            ...user.skillsWanted.map((s) => s.skill.id),
            ...s.map((s) => s.skill.id),
          ],
        }));
        break;
      case "offered":
        setFormData((prev) => ({
          ...prev,
          skillIdsOffered: [
            ...user.skillsOffered.map((s) => s.skill.id),
            ...s.map((s) => s.skill.id),
          ],
        }));
        break;
    }
  };

  const handleChange = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const data={}
    const data = new FormData();
    for (const e of Object.entries(formData)) {
      if (e[1])
        data.set(e[0], typeof e[1] != "string" ? JSON.stringify(e[1]) : e[1]);
    }
    if (avatarFile) data.set("avatar", avatarFile);

    try {
      const res = await axios.patch("/auth/profile", data);
      await setCookie(Constants.userKey, JSON.stringify(res.data));
      setUser(res.data);

      toast.success("Profile updated");
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
    <div className="bg-white min-h-full p-4">
      <form className="mt-5 grid grid-cols-2 gap-4" onSubmit={submitHandler}>
        <div className="col-span-2 m-auto relative">
          <Avatar
            className="border-solid border-2 border-black/20 rounded-full "
            size="7rem"
            url={formData.avatarUrl}
          />
          <button type="button" onClick={() => avatarRef.current?.click()}>
            <FaRegEdit
              className="absolute top-1 right-1 h-5 w-5"
              color="#000000"
            />
            <input
              className="hidden"
              type="file"
              accept="image/jpeg,image/png"
              ref={avatarRef}
              onChange={avatarChangeHandler}
            />
          </button>
        </div>
        <h5 className="col-span-2 font-bold">General information</h5>
        <FormField
          label="First name"
          value={formData.firstName}
          onChange={(v) => handleChange("firstName", v)}
        />
        <FormField
          label="Last name"
          value={formData.lastName}
          onChange={(v) => handleChange("lastName", v)}
        />
        <FormField label="Email" value={formData.email} disabled />
        <div className="col-span-2">
          <label className="text-gray-800 block mb-1" htmlFor="bio">
            Bio
          </label>
          <textarea
            className="border-[#E8E8E8] border-[1px] rounded-md px-3 placeholder:text-[#1A4F6E] placeholder:opacity-40 focus:outline-[#E8E8E8] text-[#1A4F6E] font-bold w-full"
            rows={3}
            id="bio"
            name="bio"
            defaultValue={user.bio ?? undefined}
            onChange={(e) => handleChange("bio", e.target.value)}
          />
          <br />
          <br />
        </div>
        {/* <div className="bg-black/20 h-px"></div> */}
        <h5 className="col-span-2 font-bold">Your skills</h5>
        <div>
          <h6 className="italic font-bold text-sm">Skill(s) wanted</h6>
          {user.skillsWanted.map((s) => (
            <div
              className="text-sm"
              key={s.skill.id}
            >{`${s.skill.name}/${s.skill.category.name}`}</div>
          ))}
          <AddSkill
            skillsByCategory={{
              data: skillsByCategory,
              get: fetchSkillsByCategoryHandler,
            }}
            existing={user.skillsWanted}
            onChange={handleNewWantedSkillsChange}
          />
        </div>
        <div>
          <h6 className="italic font-bold text-sm">Skill(s) offered</h6>
          {user.skillsOffered.map((s) => (
            <div
              className="text-sm"
              key={s.skill.id}
            >{`${s.skill.name}/${s.skill.category.name}`}</div>
          ))}
          <AddSkill
            skillsByCategory={{
              data: skillsByCategory,
              get: fetchSkillsByCategoryHandler,
            }}
            existing={user.skillsOffered}
            onChange={handleNewOfferedSkillsChange}
          />
        </div>
        <Button text="Save" />
      </form>
    </div>
  );
}
