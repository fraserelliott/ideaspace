import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UI } from "@/styles";
import { useToast } from "@fraserelliott/fe-components";
import { useEffect } from "react";

export default function LoginPage() {
  const { isOptimisticallyLoggedIn, loginAsync } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { addToastMessage } = useToast();

  useEffect(() => {
    if (isOptimisticallyLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isOptimisticallyLoggedIn, navigate]);

  const submitForm = async (data) => {
    await loginAsync(data.email, data.password);
  };

  const handleError = () => {
    addToastMessage("Email and password are required.", "error");
  };

  return (
    <div className={UI.Panel("panel-small")}>
      <form
        className={UI.Form()}
        onSubmit={handleSubmit(submitForm, handleError)}
      >
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className={UI.InputPrimary()}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
            className={UI.InputPrimary()}
          />
        </div>
        <input type="submit" value="Login" className={UI.BtnPrimary()} />
      </form>
    </div>
  );
}
