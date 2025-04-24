type Props = {
  image: string;
  type: string;
  projectName: string;
  url: string;
};

const ProjectCard = ({ image, type, projectName, url }: Props) => {
  return (
    <div className="flex flex-col align-start space-y-4">
      <div className="bg-orange-200 w-76 h-90 rounded-lg p-8">
        <img
          src={image}
          alt={projectName}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h6 className="text-orange-400">{type}</h6>
        <a href={url} className="cursor-pointer font-bold">
          {projectName}
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
