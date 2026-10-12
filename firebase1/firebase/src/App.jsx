

import { useState } from "react";
import { initializeApp } from "firebase/app";

// ========================================
// PART 1: FIREBASE CONFIGURATION
// ========================================

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9niefe9nPnhg-x0gUs22WMwB54vsKXCw",
  authDomain: "fire-e137f.firebaseapp.com",
  projectId: "fire-e137f",
  storageBucket: "fire-e137f.firebasestorage.app",
  messagingSenderId: "831032709361",
  appId: "1:831032709361:web:1df8fdb30062f38e9a9950",
  measurementId: "G-3RR6LT4SLZ"
};

const app = initializeApp(firebaseConfig);

// ========================================
// PART 2: FIREBASE AUTHENTICATION
// ========================================

const auth = getAuth(app);

// ========================================
// PART 3: FIRESTORE DATABASE
// ========================================

const db = getFirestore(app);

// ========================================
// PART 4: MAIN APPLICATION
// ========================================

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);

  // ======================================
  // PART 5: AUTHENTICATION - SIGN UP
  // ======================================

  async function signup() {
    try {
      await createUserWithEmailAndPassword(
        auth, email, password
      );
      setMessage("Account created!");
    } catch (e) {
      setMessage(e.message);
    }
  }

  // ======================================
  // PART 6: AUTHENTICATION - LOGIN
  // ======================================

  async function login() {
    try {
      await signInWithEmailAndPassword(
        auth, email, password
      );
      setMessage("Login successful!");
    } catch (e) {
      setMessage(e.message);
    }
  }

  // ======================================
  // PART 7: AUTHENTICATION - LOGOUT
  // ======================================

  async function logout() {
    try {
      await signOut(auth);
      setRecords([]);
      setMessage("Logged out!");
    } catch (e) {
      setMessage(e.message);
    }
  }

  // ======================================
  // PART 8: CRUD - CREATE
  // ======================================

  async function createRecord() {
    if (!auth.currentUser) {
      setMessage("Please log in first.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setMessage("Enter title and description.");
      return;
    }

    try {
      await addDoc(collection(db, "records"), {
        title: title.trim(),
        description: description.trim(),
        uid: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      });

      setTitle("");
      setDescription("");
      setMessage("Record created!");
      await readRecords();
    } catch (e) {
      setMessage("Create failed: " + e.message);
    }
  }

  // ======================================
  // PART 9: CRUD - READ
  // ======================================

  async function readRecords() {
    if (!auth.currentUser) {
      setMessage("Please log in first.");
      return;
    }

    try {
      const q = query(
        collection(db, "records"),
        where("uid", "==", auth.currentUser.uid)
      );

      const result = await getDocs(q);

      setRecords(
        result.docs.map(item => ({
          id: item.id,
          ...item.data()
        }))
      );

      setMessage("Records loaded!");
    } catch (e) {
      setMessage("Read failed: " + e.message);
    }
  }

  // ======================================
  // PART 10: CRUD - UPDATE
  // ======================================

  async function updateRecord() {
    if (!auth.currentUser || !editId) {
      setMessage("Select a record to update.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      setMessage("Enter title and description.");
      return;
    }

    try {
      const recordRef = doc(db, "records", editId);

      await updateDoc(recordRef, {
        title: title.trim(),
        description: description.trim()
      });

      setEditId(null);
      setTitle("");
      setDescription("");
      setMessage("Record updated!");
      await readRecords();
    } catch (e) {
      setMessage("Update failed: " + e.message);
    }
  }

  // ======================================
  // PART 11: CRUD - DELETE
  // Remove this function if Delete is
  // not required.
  // ======================================

  async function deleteRecord(id) {
    if (!auth.currentUser) {
      setMessage("Please log in first.");
      return;
    }

    try {
      await deleteDoc(doc(db, "records", id));
      setMessage("Record deleted!");
      await readRecords();
    } catch (e) {
      setMessage("Delete failed: " + e.message);
    }
  }

  // ======================================
  // PART 12: USER INTERFACE
  // ======================================

  return (
    <div>
      <h2>Firebase CRUD Application</h2>

      {/* AUTHENTICATION UI */}
      <h3>Authentication</h3>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={signup}>Sign Up</button>{" "}
      <button onClick={login}>Login</button>{" "}
      <button onClick={logout}>Logout</button>

      <hr />

      {/* FIRESTORE CRUD INPUT */}
      <h3>Firestore CRUD</h3>

      <input
        placeholder="Enter title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Enter description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <br /><br />

      {/* CREATE AND UPDATE BUTTONS */}
      {editId ? (
        <>
          <button onClick={updateRecord}>
            Update Record
          </button>{" "}
          <button onClick={() => {
            setEditId(null);
            setTitle("");
            setDescription("");
          }}>
            Cancel Edit
          </button>
        </>
      ) : (
        <button onClick={createRecord}>
          Create Record
        </button>
      )}

      {" "}

      {/* READ */}
      <button onClick={readRecords}>
        Read Records
      </button>

      <p>{message}</p>

      {/* DISPLAY RECORDS */}
      <h3>Stored Records</h3>

      {records.map(record => (
        <div
          key={record.id}
          style={{
            border: "1px solid gray",
            padding: 10,
            margin: 10
          }}
        >
          <h4>{record.title}</h4>
          <p>{record.description}</p>

          {/* LOAD RECORD INTO FORM FOR UPDATE */}
          <button onClick={() => {
            setEditId(record.id);
            setTitle(record.title);
            setDescription(record.description);
          }}>
            Edit
          </button>

          {/* PART 13: DELETE BUTTON
              Remove this button if Delete is not needed.
          */}
          <button onClick={() => deleteRecord(record.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
