
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let students = [
    { id: 1, name: "Prasath" },
    { id: 2, name: "Praveen" }
];

// CREATE
app.post("/students", (req, res) => {
    const student = req.body;
    students.push(student);
    res.json({ message: "Student added successfully", student });
});

// READ
app.get("/students", (req, res) => {
    res.json(students);
});

// UPDATE
app.put("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    student.name = req.body.name;
    res.json({ message: "Student updated successfully" });
});

// DELETE
app.delete("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const exists = students.some(s => s.id === id);

    if (!exists) {
        return res.status(404).json({ message: "Student not found" });
    }

    students = students.filter(s => s.id !== id);
    res.json({ message: "Student deleted successfully" });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
