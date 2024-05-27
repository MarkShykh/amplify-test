import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const client = generateClient<Schema>();

type TClientInfo = {
  name: string;
  surname: string;
  dob: string;
  address: string;
  phone: string;
};

function PatientsPage() {
  const [patients, setPatients] = useState<Array<Schema["Patient"]["type"]>>(
    []
  );

  const [patientModalOpen, setPatientModalOpen] = useState<boolean>(false);

  const formik = useFormik<TClientInfo>({
    initialValues: {
      name: "",
      surname: "",
      dob: "",
      address: "",
      phone: "",
    },
    onSubmit: (form) => client.models.Patient.create(form),
  });

  useEffect(() => {
    client.models.Patient.observeQuery().subscribe({
      next: (data) => setPatients([...data.items]),
    });
  }, []);

  return (
    <div>
      <h1>Patients</h1>
      <button onClick={() => setPatientModalOpen(true)}>+ new</button>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
      <Modal
        isOpen={patientModalOpen}
        toggle={() => setPatientModalOpen(false)}
      >
        <ModalHeader>Add new patient</ModalHeader>
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">First Name</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <label htmlFor="surname">Last Name</label>
            <input
              id="surname"
              name="surname"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.surname}
            />
            <button type="submit">Submit</button>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default PatientsPage;
