import { IMiniSkill } from "@/app/interfaces/skill/skill";
import { useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import SelectField from "../(main)/select-field";
import Spinner from "../room/spinner";
import { SkillsByCategory } from "./client-profile-fragment";

export default function AddSkill({
  skillsByCategory,
  existing,
  onChange,
}: {
  skillsByCategory: { data?: SkillsByCategory[]; get: () => Promise<void> };
  existing: {
    skill: IMiniSkill;
  }[];
  onChange: (
    s: {
      skill: IMiniSkill;
    }[]
  ) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [categoryIdSelected, setCategoryIdSelected] = useState("");
  const [skillIdSelected, setSkillIdSelected] = useState("");
  const [fetchingSkills, setFetchingSkills] = useState(false);

  const [addedSkills, setAddedSkills] = useState<{ skill: IMiniSkill }[]>([]);

  useEffect(() => {
    onChange(addedSkills);
  }, [addedSkills, onChange]);

  const getSkills = async () => {
    setFetchingSkills(true);
    await skillsByCategory.get();
    setFetchingSkills(false);
  };

  const addHandler = async () => {
    if (!skillsByCategory.data) await getSkills();
    setIsAdding(true);
  };

  const removeAdded = (id: number) => {
    setAddedSkills((s) => s.filter((s) => s.skill.id !== id));
  };

  const categoryChangeHandler = async (v: string) => {
    setCategoryIdSelected(v);
    setSkillIdSelected("");
  };
  const skillChangeHandler = async (v: string) => {
    setSkillIdSelected(v);
    const category = skillsByCategory.data?.find(
      (c) => c.id.toString() == categoryIdSelected
    );
    const skill = category?.skills.find((s) => s.id.toString() == v);

    console.log(skill, category);

    if (skill && category)
      setAddedSkills((s) => [
        ...s,
        {
          skill: {
            ...skill,
            category: { id: category.id, name: category.name },
          },
        },
      ]);

    setIsAdding(false);
    setCategoryIdSelected("");
    setSkillIdSelected("");
  };

  return (
    <div>
      {addedSkills &&
        addedSkills.map((s) => (
          <div className="text-sm flex items-center" key={s.skill.id}>
            <p>{`${s.skill.name}/${s.skill.category.name}`}</p>
            <button className="ml-2" onClick={() => removeAdded(s.skill.id)}>
              <FaMinusCircle />
            </button>
          </div>
        ))}
      {fetchingSkills ? (
        <Spinner />
      ) : isAdding ? (
        <>
          <SelectField
            name="categories"
            placeholder="Select Category"
            options={skillsByCategory.data!.map((c) => ({
              label: c.name,
              value: c.id.toString(),
            }))}
            value={categoryIdSelected}
            onChange={categoryChangeHandler}
          />
          {categoryIdSelected && (
            <div>
              <SelectField
                name="skills"
                placeholder="Select Skill"
                options={skillsByCategory
                  .data!.find((c) => c.id == parseInt(categoryIdSelected))!
                  .skills.map((s) => ({
                    label: s.name,
                    value: s.id.toString(),
                    disabled: !![...existing, ...addedSkills].find(
                      (e) => e.skill.id == s.id
                    ),
                  }))}
                value={skillIdSelected}
                onChange={skillChangeHandler}
              />
            </div>
          )}
        </>
      ) : (
        <button type="button" className="mt-2" onClick={addHandler}>
          <FaPlusCircle />
        </button>
      )}
      <br />
    </div>
  );
}
