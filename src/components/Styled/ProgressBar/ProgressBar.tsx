import clsx from "clsx";

type TProps = {
  progress: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

const ProgressBar = ({ progress }: TProps) => {
  const widthClass = clsx({
    "w-1/10": progress === 1,
    "w-2/10": progress === 2,
    "w-3/10": progress === 3,
    "w-4/10": progress === 4,
    "w-5/10": progress === 5,
    "w-6/10": progress === 6,
    "w-7/10": progress === 7,
    "w-8/10": progress === 8,
    "w-9/10": progress === 9,
    "w-full": progress === 10,
  });

  return (
    <div className="relative w-full flex items-center">
      <div className="absolute w-full border-4 rounded-lg border-zinc-300"></div>
      <div
        className={`absolute border-4 border-orange-400 ${widthClass}`}
      ></div>
      <div
        className={`absolute w-4 h-4 rounded-full bg-zinc-200 border-orange-500 border-2 shadow-2 `}
        style={{ left: `${(progress / 10) * 100 - 1}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
