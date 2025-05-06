import luffy from "../../assets/luffy.png";
import { TSkillLevel } from "../../models";
import Skill from "../Skill";

type TSkillsData = {
  skill: string;
  level: TSkillLevel;
};

const skillsData: TSkillsData[] = [
  { skill: "HTML", level: 9 },
  { skill: "CSS", level: 8 },
  { skill: "JavaScript", level: 9 },
  { skill: "React", level: 8 },
  { skill: "Tailwind CSS", level: 8 },
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-row justify-between flex-row space-x-12 w-full"
    >
      <div className="flex items-center ">
        <div className="rounded-full border-4 border-orange-300 md:w-96 md:h-96 sm:w-48 sm:h-48 relative">
          <img src={luffy} alt="main image" />
        </div>
      </div>
      <div className="flex flex-col space-y-4 w-1/2">
        <h1 className="text-3xl font-bold ">Skills</h1>
        <p>
          I have acquired a diverse set of skills in web development, including
          proficiency in HTML, CSS, JavaScript, and React. I am also familiar
          with various libraries and frameworks such as Tailwind CSS, Bootstrap,
          and Material UI. My experience extends to working with RESTful APIs
          and integrating third-party services. I am comfortable using version
          control.
        </p>
        {skillsData.map((item) => (
          <Skill key={item.skill} skill={item.skill} level={item.level} />
        ))}
      </div>
    </section>
  );
};

export default Skills;
