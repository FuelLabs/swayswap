import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export interface NavigateBackButtonProps {
  page?: string;
}

export function NavigateBackButton({ page }: NavigateBackButtonProps) {
  const navigate = useNavigate();
  const backPage = page || "../";

  return (
    <BsArrowLeft
      size={24}
      className="text-primary-400 mr-3 cursor-pointer"
      onClick={() => navigate(backPage)}
    />
  );
}
