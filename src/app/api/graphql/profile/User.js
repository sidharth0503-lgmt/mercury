import mercury from "@mercury-js/core";

// Define access rules for the user role
const userRules = [
  {
    modelName: "User",
    access: {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  },
  {
    modelName: "Employee",
    access: {
      create: true,
      update: false,
      delete: false,
      read: true,
    },
  },
];

// Create the user profile using the rules
export const userProfile = mercury.access.createProfile("USER", userRules);
