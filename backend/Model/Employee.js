// models/Employee.js
class Employee {
  constructor(id, name, role, email, department) {
    this.id = id;           // ID của employee
    this.name = name;       // Tên employee
    this.role = role;       // Vai trò (Developer, Manager, ...)
    this.email = email;     // Email
    this.department = department; // Phòng ban
  }
}

module.exports = Employee;
