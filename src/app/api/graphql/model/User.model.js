import mercury from "@mercury-js/core";


export const User = mercury.createModel("User", {
  userName: {
    type: "string",
   
  },
  role: {
    type: "enum", 
    enumType: "string",
    enum: ["USER", "ADMIN"],  
    default:"USER"
  },
  email: {
    type: "string",
    unique: true,  
  },
  password: {
    type: "string",  
    bcrypt: true, 
  },
  code:{
    type:"string"
  }
});

// Exporting the model for use in other parts of the appmo
