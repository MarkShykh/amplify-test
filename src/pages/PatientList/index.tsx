import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../../amplify/data/resource";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";

const client = generateClient<Schema>();

type TClientInfo = {
  name: string;
  surname: string;
  dob: string;
  address: string;
  phone: string;
};

type Patient = Schema["Patient"]["type"];

function PatientsPage() {
  const [patients, setPatients] = useState<Array<Schema["Patient"]["type"]>>(
    []
  );

  const [editPatientModal, setEditPatientModal] = useState<boolean>(false);
  const [patientModalOpen, setPatientModalOpen] = useState<boolean>(false);
  const initialPatient: Patient = {
    name: "",
    surname: "",
    dob: "",
    address: "",
    phone: "",
    id: "",
    createdAt: "",
    updatedAt: "",
  };
  const formik = useFormik<TClientInfo>({
    initialValues: {
      name: "",
      surname: "",
      dob: "",
      address: "",
      phone: "",
    },
    onSubmit: (form) => {
      client.models.Patient.create(form);
      setPatientModalOpen(false);
      formik.resetForm();
    },
  });
  const [editingPatient, setEditingPatient] = useState<Patient>(initialPatient);

  const onEditButton = (patient: Patient) => {
    setEditingPatient(patient);
    setEditPatientModal(true);
  };

  const onEditSubmit = () => {
    client.models.Patient.update(editingPatient);
    setEditPatientModal(false);
  };

  useEffect(() => {
    client.models.Patient.observeQuery().subscribe({
      next: (data) => setPatients([...data.items]),
    });
  }, []);

  return (
    <div>
      <h1>Patients</h1>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Date of birth</th>
            <th>Address</th>
            <th>Phone number</th>
            <th></th>
            <th>
              <Button onClick={() => setPatientModalOpen(true)} color="success">
                Add
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.id}>
              <th scope="row">{index + 1}</th>
              <td>{patient.name}</td>
              <td>{patient.surname}</td>
              <td>{patient.dob}</td>
              <td>{patient.address}</td>
              <td>{patient.phone}</td>
              <td>
                <Button color="primary" onClick={() => onEditButton(patient)}>
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  color="danger"
                  onClick={() =>
                    client.models.Patient.delete({ id: patient.id })
                  }
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        isOpen={patientModalOpen}
        toggle={() => setPatientModalOpen(false)}
      >
        <ModalHeader>Add new patient</ModalHeader>
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <Row>
              <label htmlFor="name">First Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Row>
            <Row>
              <label htmlFor="surname">Last Name</label>
              <Input
                id="surname"
                name="surname"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.surname}
              />
            </Row>
            <Row>
              <label htmlFor="dob">Date of birth</label>
              <Input
                id="dob"
                name="dob"
                type="date"
                onChange={formik.handleChange}
                value={formik.values.dob}
              />
            </Row>
            <Row>
              <label htmlFor="address">Address</label>
              <Input
                id="address"
                name="address"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.address}
              />
            </Row>
            <Row>
              <label htmlFor="surname">Phone number</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
            </Row>
            <Row>
              <Col>
                <Button type="submit" color="success">
                  Submit
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => setPatientModalOpen(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
      {editPatientModal && (
        <Modal
          isOpen={editPatientModal}
          toggle={() => setEditPatientModal(false)}
        >
          <ModalHeader>Edit Patient</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={editingPatient.name || ""}
                onChange={(e) =>
                  setEditingPatient((patient) => {
                    return { ...patient, name: e.target.value };
                  })
                }
              />
              <Label for="surname">Last Name</Label>
              <Input
                id="surname"
                name="surname"
                type="text"
                value={editingPatient.surname || ""}
                onChange={(e) =>
                  setEditingPatient((patient) => {
                    return { ...patient, surname: e.target.value };
                  })
                }
              />
              <Label for="dob">Date of birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={editingPatient.dob || ""}
                onChange={(e) =>
                  setEditingPatient((patient) => {
                    return { ...patient, dob: e.target.value };
                  })
                }
              />
              <Label for="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={editingPatient.address || ""}
                onChange={(e) =>
                  setEditingPatient((patient) => {
                    return { ...patient, address: e.target.value };
                  })
                }
              />
              <Label for="phone">Name</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                value={editingPatient.phone || ""}
                onChange={(e) =>
                  setEditingPatient((patient) => {
                    return { ...patient, phone: e.target.value };
                  })
                }
              />
            </FormGroup>
            <Row>
              <Col>
                <Button onClick={() => onEditSubmit()} color="success">
                  Submit
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() => setEditPatientModal(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      )}
    </div>
  );
}

export default PatientsPage;
