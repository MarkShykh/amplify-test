import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource";
import { useState, useEffect } from "react";

const client = generateClient<Schema>();

function PatientsPage() {
  const [patients, setPatients] = useState<Array<Schema["Patient"]["type"]>>(
    []
  );

  useEffect(() => {
    client.models.Patient.observeQuery().subscribe({
      next: (data) => setPatients([...data.items]),
    });
  }, []);

  function createPatient() {
    client.models.Patient.create({ name: window.prompt("Patient name") });
  }

  return (
    <div>
      <h1>Patients</h1>
      <button onClick={createPatient}>+ new</button>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default PatientsPage;
