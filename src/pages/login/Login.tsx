import { useNavigate } from "react-router";

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/battlefield");
  };

  return <div onClick={() => handleClick()}>test</div>;
};
