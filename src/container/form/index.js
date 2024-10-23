

"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../input.css";

const initialValues = {
  employee: "",
  Department: "",
  Allowances: "",
  payDate: "",
  Basicsalary: "",
};

const FormTable = ({ onClose }) => {
  const [zoomClass, setZoomClass] = useState("scale-110 opacity-0");
  const [users, setUsers] = useState([]); // State to store users with id and userName

  // Fetch user ids and names from GraphQL when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
             query Docs {
                listUsers(limit: 50) {
                  docs {
                    userName
                    id
                  }
                }
              }
            `,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors[0].message);
          toast.error("Error fetching users: " + data.errors[0].message);
        } else {
          setUsers(data.data.listUsers.docs); // Set user data in state
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("An error occurred while fetching users.");
      }
    };

    fetchUsers();

    setTimeout(() => {
      setZoomClass(
        "scale-100 opacity-100 transition-transform transition-opacity duration-500"
      );
    }, 100);
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      employee: Yup.string().required("Employee is required"),
      Department: Yup.string().required("Department is required"),
      Allowances: Yup.number()
        .typeError("Allowances must be a valid number")
        .required("Allowances are required"),
      payDate: Yup.number()
        .typeError("Pay Date must be a valid number")
        .required("Pay Date is required"),
      Basicsalary: Yup.number()
        .typeError("Basic Salary must be a valid number")
        .required("Basic Salary is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://localhost:3000/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              mutation CreateEmployee($input: EmployeeInput!) {
                createEmployee(input: $input) {
                  employee {
                    userName
                    id
                  }
                  Department
                  Allowances
                  payDate
                  Basicsalary
                }
              }
            `,
            variables: {
              input: {
                employee: values.employee,  // This will now be the employee id
                Department: values.Department,
                Allowances: parseInt(values.Allowances),
                payDate: parseInt(values.payDate),
                Basicsalary: parseInt(values.Basicsalary),
              },
            },
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error("GraphQL Error:", data.errors[0].message);
          toast.error("Error adding employee: " + data.errors[0].message);
        } else {
          toast.success("Employee added successfully!");
          formik.resetForm();
        }
      } catch (error) {
        console.error("Error adding employee:", error);
        toast.error("An error occurred while adding the employee.");
      }
    },
  });

  return (
    <div
      className={`p-4 fixed top-0 left-0 w-full h-full flex items-center justify-center ${zoomClass}`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-sm">
        <button
          className="absolute top-2 right-2 text-red-500"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h1 className="form-heading">Employee Details Form</h1>
        <form
          onSubmit={formik.handleSubmit}
          autoComplete="off"
          className="space-y-4"
        >
          <div>
            <label className="form-label">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              name="employee"
              id="employee"
              onChange={formik.handleChange}
              value={formik.values.employee}  // This will store the selected employee id
              className={`input-field ${
                formik.touched.employee && formik.errors.employee
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
            >
              <option value="">Select Employee</option>
              {users
                .filter(user => user.userName)  // Only show users with valid userName
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.userName}  {/* Display the userName in the dropdown */}
                  </option>
                ))}
            </select>
            {formik.touched.employee && formik.errors.employee && (
              <div className="error-text">{formik.errors.employee}</div>
            )}
          </div>

          <div>
            <label className="form-label">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Department"
              id="Department"
              onChange={formik.handleChange}
              value={formik.values.Department}
              className={`input-field ${
                formik.touched.Department && formik.errors.Department
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Department"
            />
            {formik.touched.Department && formik.errors.Department && (
              <div className="error-text">{formik.errors.Department}</div>
            )}
          </div>

          <div>
            <label className="form-label">
              Allowances <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Allowances"
              id="Allowances"
              onChange={formik.handleChange}
              value={formik.values.Allowances}
              className={`input-field ${
                formik.touched.Allowances && formik.errors.Allowances
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Allowances"
            />
            {formik.touched.Allowances && formik.errors.Allowances && (
              <div className="error-text">{formik.errors.Allowances}</div>
            )}
          </div>

          <div>
            <label className="form-label">
              Pay Date <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="payDate"
              id="payDate"
              onChange={formik.handleChange}
              value={formik.values.payDate}
              className={`input-field ${
                formik.touched.payDate && formik.errors.payDate
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Pay Date"
            />
            {formik.touched.payDate && formik.errors.payDate && (
              <div className="error-text">{formik.errors.payDate}</div>
            )}
          </div>

          <div>
            <label className="form-label">
              Basic Salary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="Basicsalary"
              id="Basicsalary"
              onChange={formik.handleChange}
              value={formik.values.Basicsalary}
              className={`input-field ${
                formik.touched.Basicsalary && formik.errors.Basicsalary
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
              placeholder="Basic Salary"
            />
            {formik.touched.Basicsalary && formik.errors.Basicsalary && (
              <div className="error-text">{formik.errors.Basicsalary}</div>
            )}
          </div>

          <div className="flex justify-between gap-2">
            <button type="submit" className="table-button">
              Add Employee
            </button>
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="table-button"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl
      />
    </div>
  );
};

export default FormTable;
