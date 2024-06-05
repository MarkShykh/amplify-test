import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";
import { Hub } from "aws-amplify/utils";
import { AuthSession, fetchAuthSession } from "aws-amplify/auth";
import PatientsPage from "./pages/PatientList";
import Login from "./pages/Login";

Amplify.configure(outputs);

export default function App() {
  let session: AuthSession = {};

  Hub.listen("auth", async ({ payload }) => {
    switch (payload.event) {
      case "signedIn":
        session = await fetchAuthSession();
        console.log(session);
        break;
    }
  });

  return (
    <>
      <Login />
      <PatientsPage token={session?.credentials?.accessKeyId || ""} />
    </>
  );
}
