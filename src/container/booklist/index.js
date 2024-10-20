
"use client";

import React, { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import "../../../input.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedEmployee, setEditedEmployee] = useState({
    Department: "",
    Allowances: "",
    Basicsalary: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query Docs {
              listEmployees {
                docs {
                  id
                  employee {
                    id
                    userName
                  }
                  Department
                  payDate
                  Allowances
                  Basicsalary
                  createdOn
                  updatedOn
                }
              }
            }`,
          }),
        });

        const data = await response.json();

        if (data.errors) {
          console.error("GraphQL Errors:", data.errors);
          setError("Error fetching employees.");
        } else {
          setEmployees(data.data.listEmployees.docs);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError("An error occurred while fetching employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedEmployee({
      Department: employees[index].Department,
      Allowances: employees[index].Allowances,
      Basicsalary: employees[index].Basicsalary,
    });
  };

  const handleSave = async () => {
    const employeeToUpdate = employees[editIndex];

    try {
      const response = await fetch("http://localhost:3000/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `mutation UpdateEmployee($input: updateEmployeeInput!) {
            updateEmployee(input: $input) {
              Department
              Allowances
              Basicsalary
            }
          }`,
          variables: {
            input: {
              id: employeeToUpdate.id,
              Department: editedEmployee.Department,
              Allowances: Number(editedEmployee.Allowances),  // Convert to number
              Basicsalary: Number(editedEmployee.Basicsalary), // Convert to number
            },
          },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error("GraphQL Error:", data.errors);
        alert("Error updating employee.");
      } else {
        const updatedEmployees = [...employees];
        updatedEmployees[editIndex] = {
          ...employeeToUpdate,
          Department: editedEmployee.Department,
          Allowances: Number(editedEmployee.Allowances),  // Convert to number
          Basicsalary: Number(editedEmployee.Basicsalary), // Convert to number
        };
        setEmployees(updatedEmployees);
        setEditIndex(-1);
      }
    } catch (error) {
      console.error("Update Error:", error);
      alert("An error occurred while updating the employee.");
    }
  };

  const handleRemove = async (index) => {
    const employeeToRemove = employees[index];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the employee with username "${employeeToRemove.employee.userName}"?`
    );

    if (confirmDelete) {
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `mutation DeleteEmployee($deleteEmployeeId: ID!) {
              deleteEmployee(id: $deleteEmployeeId)
            }`,
            variables: {
              deleteEmployeeId: employeeToRemove.id,
            },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors);
          alert("Error deleting employee.");
        } else {
          const updatedEmployees = employees.filter((_, i) => i !== index);
          setEmployees(updatedEmployees);
        }
      } catch (error) {
        console.error("Delete Error:", error);
        alert("An error occurred while deleting the employee.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEmployee({ ...editedEmployee, [name]: value });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-3xl">Employee List</h2>
      {loading ? (
        <div className="text-center text-lg font-semibold">Fetching employees...</div>
      ) : error ? (
        <div className="text-center text-lg font-semibold text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 text-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Department</th>
                <th className="px-4 py-2 border">Allowances</th>
                <th className="px-4 py-2 border">Basic Salary</th>
                <th className="px-4 py-2 border">Created On</th>
                <th className="px-4 py-2 border">Updated On</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={emp.id} className="border-b border-gray-300">
                  <td className="px-4 py-2 border">{emp.employee ? emp.employee.userName : "N/A"}</td>
                  <td className="px-4 py-2 border">
                    {editIndex === index ? (
                      <input
                        type="text"
                        name="Department"
                        value={editedEmployee.Department}
                        onChange={handleChange}
                        className="w-full border rounded px-2"
                      />
                    ) : (
                      emp.Department
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {editIndex === index ? (
                      <input
                        type="number"
                        name="Allowances"
                        value={editedEmployee.Allowances}
                        onChange={handleChange}
                        className="w-full border rounded px-2"
                      />
                    ) : (
                      emp.Allowances
                    )}
                  </td>
                  <td className="px-4 py-2 border">
                    {editIndex === index ? (
                      <input
                        type="number"
                        name="Basicsalary"
                        value={editedEmployee.Basicsalary}
                        onChange={handleChange}
                        className="w-full border rounded px-2"
                      />
                    ) : (
                      emp.Basicsalary
                    )}
                  </td>
                  <td className="px-4 py-2 border">{new Date(emp.createdOn).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">{new Date(emp.updatedOn).toLocaleDateString()}</td>
                  <td className="px-4 py-2 border">
                    <div className="flex justify-around">
                      {editIndex === index ? (
                        <FaSave onClick={handleSave} className="text-green-500 cursor-pointer" />
                      ) : (
                        <>
                          <RiEdit2Fill
                            onClick={() => handleEdit(index)}
                            className="text-blue-500 cursor-pointer"
                          />
                          <MdDelete
                            onClick={() => handleRemove(index)}
                            className="text-red-500 cursor-pointer"
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
