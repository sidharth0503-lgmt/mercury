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
  const userRole = sessionStorage.getItem("role");
  const userName = sessionStorage.getItem("userName");
  const [selectedUsername, setSelectedUsername] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const query = `query Docs {
          listEmployees {
            docs {
              id
              employee {
                id
                userName
              }
              Department
              Allowances
              Basicsalary
              createdOn
              updatedOn
            }
          }
        }`;

        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.errors) {
          console.error("GraphQL Errors:", data.errors);
          setError("Error fetching employees.");
        } else {
          const fetchedEmployees = data.data.listEmployees.docs;
          setEmployees(fetchedEmployees);
          if (userRole === "USER") {
            setSelectedUsername(userName);
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError("An error occurred while fetching employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [userName, userRole]);

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
              Allowances: Number(editedEmployee.Allowances),
              Basicsalary: Number(editedEmployee.Basicsalary),
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
          Allowances: Number(editedEmployee.Allowances),
          Basicsalary: Number(editedEmployee.Basicsalary),
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
      `Are you sure you want to delete the employee with username "${employeeToRemove.employee ? employeeToRemove.employee.userName : "N/A"}"?`
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

  const filteredEmployees = userRole === "USER" 
    ? employees.filter(emp => emp.employee?.userName === selectedUsername)
    : selectedUsername
    ? employees.filter(emp => emp.employee?.userName === selectedUsername)
    : employees;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center md:text-3xl">Employee List</h2>
      {loading ? (
        <div className="text-center text-lg font-semibold">Fetching employees...</div>
      ) : error ? (
        <div className="text-center text-lg font-semibold text-red-500">{error}</div>
      ) : (
        <div>
          {(userRole === "ADMIN" || userRole === "USER") && (
            <div className="mb-4 ">
              <label className="mr-2">Filter by Username:</label>
              <select
                value={selectedUsername}
                onChange={(e) => setSelectedUsername(e.target.value)}
                className="border rounded px-2"
                disabled={userRole === "USER"} // Disable dropdown for users
              >
                {userRole === "USER" ? (
                  <option value={userName}>{userName}</option>
                ) : (
                  <>
                    <option value="">All</option>
                    {[...new Set(employees.map(emp => emp.employee?.userName))].map((username, index) => (
                      <option key={index} value={username}>{username}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          )}

          {/* Desktop view */}
          <div className="hidden md:block">
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
                {filteredEmployees.map((emp, index) => (
                  <tr key={emp.id} className="border-2">
                    <td className="px-4 py-2 border-2 text-center">{emp.employee ? emp.employee.userName : "N/A"}</td>
                    <td className="px-4 py-2 border-2 text-center">{emp.Department}</td>
                    <td className="px-4 py-2 border-2 text-center">{emp.Allowances}</td>
                    <td className="px-4 py-2 border-2 text-center">{emp.Basicsalary}</td>
                    <td className="px-4 py-2 border-2 text-center">{new Date(emp.createdOn).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border-2 text-center">{new Date(emp.updatedOn).toLocaleDateString()}</td>
                    <td className="px-4 py-2 flex justify-center">
                      <button onClick={() => handleEdit(index)} className="text-xl text-blue-500 hover:text-blue-700 mr-6">
                        <RiEdit2Fill />
                      </button>
                      <button onClick={() => handleRemove(index)} className="text-xl text-red-500 hover:text-red-700">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile view */}
          <div className="flex justify-center md:hidden">
            <div className="flex flex-col items-center">
              {filteredEmployees.map((emp, index) => {
                const originalIndex = index; // Using index directly since we're in a filtered context

                return (
                  <div key={emp.id} className="border border-gray-300 p-2 mb-2 rounded-lg w-full max-w-sm">
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="font-bold">Username:</td>
                          <td className="pl-2">
                            {editIndex === originalIndex ? (
                              <input
                                type="text"
                                name="username"
                                value={emp.employee ? emp.employee.userName : ""}
                                readOnly
                                className="mobile-edit border rounded px-1"
                              />
                            ) : (
                              <span className="text-lg">{emp.employee ? emp.employee.userName : "N/A"}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Department:</td>
                          <td className="pl-2">
                            {editIndex === originalIndex ? (
                              <input
                                type="text"
                                name="department"
                                value={editedEmployee.Department}
                                onChange={handleChange}
                                className="mobile-edit border rounded px-1"
                              />
                            ) : (
                              <span className="text-lg">{emp.Department}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Allowances:</td>
                          <td className="pl-2">
                            {editIndex === originalIndex ? (
                              <input
                                type="text"
                                name="allowances"
                                value={editedEmployee.Allowances}
                                onChange={handleChange}
                                className="mobile-edit border rounded px-1"
                              />
                            ) : (
                              <span className="text-lg">{emp.Allowances}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Basic Salary:</td>
                          <td className="pl-2">
                            {editIndex === originalIndex ? (
                              <input
                                type="text"
                                name="salary"
                                value={editedEmployee.Basicsalary}
                                onChange={handleChange}
                                className="mobile-edit border rounded px-1"
                              />
                            ) : (
                              <span className="text-lg">{emp.Basicsalary}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Created On:</td>
                          <td className="pl-2">
                            <span className="text-lg">{new Date(emp.createdOn).toLocaleDateString()}</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold">Updated On:</td>
                          <td className="pl-2">
                            <span className="text-lg">{new Date(emp.updatedOn).toLocaleDateString()}</span>
                          </td>
                        </tr>
                        {userRole === "ADMIN" && (
                          <tr>
                            <td colSpan="2">
                              <div className="flex justify-around">
                                {editIndex === originalIndex ? (
                                  <FaSave
                                    onClick={handleSave}
                                    className="icons text-green-500 cursor-pointer"
                                  />
                                ) : (
                                  <>
                                    <RiEdit2Fill
                                      onClick={() => handleEdit(originalIndex)}
                                      className="icons text-blue-500 cursor-pointer"
                                    />
                                    <MdDelete
                                      onClick={() => handleRemove(originalIndex)}
                                      className="icons text-red-500 cursor-pointer"
                                    />
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

