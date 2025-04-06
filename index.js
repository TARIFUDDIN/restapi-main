import express from "express";
import { addEmployee, deleteEmployee, getEmployeeById, getEmployees, updateEmployee } from "./dbOperations.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.get('/', (req, res) => {
    res.send(getEmployees())
})

app.get('/:id', (req, res) => {
    let id = req.params.id
    let employee = getEmployeeById(parseInt(id))
    if (!employee) {
        res.status(404).send({
            message: "EMPLOYEE NOT FOUND"
        })
    } else {
        res.send(employee)
    }
})

app.post('/add', (req, res) => {
    const { name, email, position, salary } = req.body;
    if (!name || !email || !position || !salary) {
        res.status(400).send({
            message: "ALL FIELDS ARE REQUIRED"
        })
    } else {
        let newEmp = addEmployee({ name, email, position, salary })
        res.status(200).send(
            {
                message: "NEW EMPLOYEE ADDED",
                data: newEmp
            }
        )
    }
})

app.put('/update/:id', (req, res) => {
    const id = req.params.id
    const { name, email, position, salary } = req.body;
    if (!name && !email && !position && !salary) {
        res.status(400).send({
            message: "ATLEAST ONE FIELD IS REQUIRED"
        })
    } else {
        let updatedEmp = updateEmployee(parseInt(id), {
            ...(name && { name }),
            ...(email && { email }),
            ...(position && { position }),
            ...(salary && { salary })
        })
        if (!updatedEmp) res.status(404).send({
            message: "EMPLOYEE NOT FOUND"
        })
        else {
            res.status(200).send(
                {
                    message: "EMPLOYEE UPDATED",
                    data: updatedEmp
                }
            )
        }
    }
})

app.delete('/delete/:id',(req,res)=>{
    const id=req.params.id
    let isDeleted=deleteEmployee(parseInt(id))
    if (!isDeleted) res.status(404).send({
        message: "EMPLOYEE NOT FOUND"
    })
    else {
        res.status(200).send(
            {
                message: `EMPLOYEE DELETED WITH ID: ${id}`,
            }
        )
    }

})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})