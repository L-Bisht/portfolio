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
      className="flex flex-row justify-between gap-x-12 w-full"
    >
      <div className="hidden md:flex">
        <div className="rounded-full border-4 border-orange-300 lg:w-96 lg:h-96 md:w-72 md:h-72 w-48 h-48 relative">
          <img src={luffy} alt="main image" />
        </div>
      </div>
      <div className="flex flex-col gap-y-4 md:w-1/2">
        <h1 className="text-3xl font-bold text-center md:text-justify">
          Skills
        </h1>
        <p className="text-center md:text-justify">
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
