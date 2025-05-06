import ProjectCard from "../ProjectCard";

const projects = [
  {
    image: "https://via.placeholder.com/150",
    type: "Web App",
    projectName: "Commerce",
    url: "https://example.com/commerce",
  },
  {
    image: "https://via.placeholder.com/150",
    type: "Web App",
    projectName: "Portfolio",
    url: "https://example.com/portfolio",
  },
  {
    image: "https://via.placeholder.com/150",
    type: "Web App",
    projectName: "Blog",
    url: "https://example.com/blog",
  },
];

const MyProjects = () => {
  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center space-y-8 w-full"
    >
      <h1 className="text-4xl font-bold ">My Projects</h1>
      <p>
        I have acquired a diverse set of skills in web development, including
        proficiency in HTML, CSS, JavaScript, and React. I am also familiar with
        various libraries and frameworks such as Tailwind CSS, Bootstrap, and
        Material UI. My experience extends to working with RESTful APIs and
        integrating third-party services. I am comfortable using version
        control.
      </p>
      <div className="flex flex-row flex-wrap justify-between space-x-8 w-full">
        {projects.map((project) => (
          <ProjectCard {...project} />
        ))}
      </div>
    </section>
  );
};

export default MyProjects;
