import mercury from "@mercury-js/core"
export const Employee =mercury.createModel(
 "Employee",
 {
  employee:{
    type:"relationship",
    ref:"User",
  },
  Department:{
    type:"string",
  },
  Allowances:{
  type:"number",
  },
  payDate:{
    type:"number",
  }, 
  
Basicsalary:{
  type:"number",
}
 } 
)