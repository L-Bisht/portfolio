import Button from "../Styled/Button";
import luffy from "../../assets/luffy.png";

const About = () => {
  return (
    <section className="flex flex-row w-full space-x-12">
      <div className="flex flex-col space-y-4 w-1/2">
        <div>
          <h6 className="text-lg font-bold">Hi I am</h6>
          <h5 className="text-2xl font-bold text-orange-500">Lalit Bisht</h5>
        </div>
        <div>
          <h1 className="text-5xl font-bold">Frontend</h1>
          <h1 className="text-5xl font-bold pl-32">Developer</h1>
        </div>
        <p>
          I am a frontend developer with a passion for creating beautiful and
          functional user interfaces. I have experience in HTML, CSS,
          JavaScript, and React. I am always eager to learn new technologies and
          improve my skills.
        </p>
        <div className="w-1/4">
          <Button>Hire Me</Button>
        </div>
      </div>
      <div className="flex flex-center justify-center rounded-full border-4 border-orange-300 w-96 h-96">
        <img src={luffy} alt="main image" />
      </div>
    </section>
  );
};

export default About;
