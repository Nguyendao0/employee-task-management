import Table from 'react-bootstrap/Table';
import {useEffect, useState} from 'react';
import {fetchAllEmployees} from '../Services/EmployeesService';

const Employee = (props) => {
    
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await fetchAllEmployees();
            console.log("Fetched employees:", data); // Log dữ liệu trả về
            setEmployees(data);
        } catch (error) {
            console.error("Error loading employees:", error);
        }
    };

    return (
        <div>
            <h2>Employee List</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Mail</th>
                        <th>Department</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.name}</td>
                            <td>{emp.role}</td>
                            <td>{emp.email}</td>
                            <td>{emp.department}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default Employee;