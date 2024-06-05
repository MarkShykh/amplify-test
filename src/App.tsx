import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../amplify_outputs.json";
import { Hub } from "aws-amplify/utils";
import { fetchAuthSession } from "aws-amplify/auth";
import PatientsPage from "./pages/PatientList";

Amplify.configure(outputs);

export default function App() {
  let session = null;

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
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
      <PatientsPage />
    </>
  );
}
