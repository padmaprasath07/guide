
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  const API = "http://localhost:3000/students";

  // READ
  function getStudents() {
    axios.get(API).then(res => setStudents(res.data));
  }

  useEffect(() => {
    getStudents();
  }, []);

  // CREATE
  function addStudent() {
    axios.post(API, { id: Number(id), name })
      .then(() => {
        getStudents();
        setId("");
        setName("");
      });
  }

  // UPDATE
  function updateStudent() {
    axios.put(API + "/" + id, { name })
      .then(() => {
        getStudents();
        setId("");
        setName("");
      });
  }

  // DELETE
  function deleteStudent(id) {
    axios.delete(API + "/" + id)
      .then(() => getStudents());
  }

  return (
    <div>
      <h1>Student Management</h1>

      <input
        placeholder="Student ID"
        value={id}
        onChange={e => setId(e.target.value)}
      />

      <input
        placeholder="Student Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button onClick={addStudent}>Add</button>
      <button onClick={updateStudent}>Update</button>

      <h2>Student List</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>
                <button onClick={() => {
                  setId(String(s.id));
                  setName(s.name);
                }}>
                  Edit
                </button>

                <button onClick={() => deleteStudent(s.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
