import { TSkillLevel } from "../../models";
import ProgressBar from "../Styled/ProgressBar";

type Props = {
  skill: string;
  level: TSkillLevel;
};

const Skill = ({ skill, level }: Props) => {
  return (
    <div className="flex flex-col w-full space-y-2">
      <h6>{skill}</h6>
      <ProgressBar progress={level} />
    </div>
  );
};

export default Skill;
