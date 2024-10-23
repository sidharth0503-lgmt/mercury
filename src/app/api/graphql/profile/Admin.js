import mercury from "@mercury-js/core";

// Define access rules for the admin role
const adminRules = [
  {
    modelName: "User",
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  {
    modelName: "Employee",
    access: {
      create: true,
      update: true,
      delete: true,
      read: true,
    },
  },
];

// Create the admin profile using the rules
export const adminProfile = mercury.access.createProfile("ADMIN", adminRules);
