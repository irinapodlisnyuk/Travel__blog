//import { BASE_URL } from "@/api/config";

interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className }) => {
  return (
    <svg className={`inline-block fill-current ${className}`}>
      {/* <use xlinkHref={`${import.meta.env.BASE_URL}/images/sprite.svg#${name}`} /> */}
      <use xlinkHref={`/images/sprite.svg#${name}`} />
    </svg>
  );
};

export default Icon;
