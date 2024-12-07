import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { type OktoContextType, useOkto } from "okto-sdk-react";

const GoogleSignIn = () => {
  const okto = useOkto() as OktoContextType;
  const handleSuccess = (credentialResponse: any) => {
    try {
      console.log(credentialResponse, "login success");

      const { credential } = credentialResponse;
      if (!credential) {
        console.error("No credential returned");
        return;
      }

      console.log(jwtDecode(credential), "credential");

      console.log(jwtDecode(credential).sub, "sub");

      okto?.authenticateWithUserId(jwtDecode(credential).sub!, credential, (res: any, err: any) => {
        console.log(res, err);
        if (err) {
          console.error("Authentication failed:", err);
        } else {
          console.log("Authenticated successfully", res);
        }
      });
    } catch (error) {
      console.error("Error during authentication process:", error);
    }
  };

  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} useOneTap />
    </div>
  );
};

export default GoogleSignIn;
