

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  department: string;
  jobTitle: string;
  status: string;
};

// 🔁 Switch flag later
const USE_API = false;

// Mock DB (temporary)
let mockEmployees: Employee[] = [];

export const employeeService = {
  async list(): Promise<Employee[]> {
    if (USE_API) {
      // return fetch("/api/v1/employees").then(r => r.json());
    }
    return Promise.resolve(mockEmployees);
  },

  async create(payload: any): Promise<Employee> {
    if (USE_API) {
      // return fetch("/api/v1/employees", {...});
    }

    const newEmployee: Employee = {
      id: "EMP-" + Date.now(),
      firstName: payload.FirstName,
      lastName: payload.LastName,
      department: payload.Department,
      jobTitle: payload.JobTitle,
      status: payload.EmploymentStatus,
    };

    mockEmployees = [newEmployee, ...mockEmployees];
    return Promise.resolve(newEmployee);
  },
};
