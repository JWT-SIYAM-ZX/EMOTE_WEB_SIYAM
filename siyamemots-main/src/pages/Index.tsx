import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (isAuthenticated) {
      navigate("/panel");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default Index;
