// import mercury from "@mercury-js/core";
// const { GraphQLError } = require("graphql");
// const jwt = require("jsonwebtoken");
// import dotenv from "dotenv";

// dotenv.config();

// const resolvers = {
//   Mutation: {
//     // Signup mutation
//     signUp: async (root, { signUpData }, ctx) => {
//       try {
//         const userSchema = mercury.db.User;
    
//         // Check for existing user
//         const existingUser = await userSchema.mongoModel.findOne({ email: signUpData.email });
        
//         if (existingUser) {
//           console.warn(`Signup attempted with existing email: ${signUpData.email}`);
//           throw new GraphQLError("User Already Exists"); 
//         }
    
//         // Create new user
//         const newUser = await userSchema.mongoModel.create({
//           userName: signUpData.userName,
//           email: signUpData.email,
//           password: signUpData.password, 
//           role: signUpData.role || "USER",
//         });
    
//         return {
//           id: newUser.id,
//           msg: "User Registered Successfully",
//           role: newUser.role,
//         };
//       } catch (error) {
//         console.error("Sign up error:", error);
//         throw new GraphQLError(error.message); 
//       }
//     },    
    
//     login: async (root, { email, password }) => {
//       try {
//         const userSchema = mercury.db.User;
//         const user = await userSchema.mongoModel.findOne({ email });

//         if (!user) {
//           throw new GraphQLError("Invalid email or password");
//         }

//         const isPasswordValid = await user.verifyPassword(password);
//         if (!isPasswordValid) {
//           throw new GraphQLError("Invalid email or password");
//         }

//         const token = jwt.sign(
//           { id: user.id, email: user.email, role: user.role },
//           process.env.JWT_SECRET || "vithi",  
//           { expiresIn: "30d" }
//         );

//         return {
//           msg: "User successfully logged in",
//           user: user.id,
//           userName: user.userName,  
//                     token: token,
//           role: user.role,
//         };
//       } catch (error) {
//         console.error("Login error:", error);
//         throw new GraphQLError(error.message);
//       }
//     },

    
    
//   },

 
// };

// module.exports = resolvers;

import mercury from "@mercury-js/core";
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Fakerator = require('fakerator')
import dotenv from "dotenv";

dotenv.config();

const resolvers = {
  Mutation: {
    // Signup mutation
    signUp: async (root, { signUpData }, ctx) => {
      try {
        const userSchema = mercury.db.User;

        // Check for existing user
        const existingUser = await userSchema.mongoModel.findOne({ email: signUpData.email });
        
        if (existingUser) {
          console.warn(`Signup attempted with existing email: ${signUpData.email}`);
          throw new GraphQLError("User Already Exists"); 
        }
const code=getServiceRequestNumber()
console.log(code,"kjhgvfc");

        // Create new user
        const newUser = await userSchema.mongoModel.create({
          userName: signUpData.userName,
          email: signUpData.email,
          password: signUpData.password, 
          role: signUpData.role || "USER",
          code:code
        });

        return {
          id: newUser.id,
          msg: "User Registered Successfully",
          role: newUser.role,
          code:code
                };
      } catch (error) {
        console.error("Sign up error:", error);
        throw new GraphQLError(error.message); 
      }
    },    
    
    // Login mutation
    login: async (root, { email, password }) => {
      try {
        const userSchema = mercury.db.User;
        const user = await userSchema.mongoModel.findOne({ email });

        if (!user) {
          throw new GraphQLError("Invalid email or password");
        }

        // Verify password
        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) {
          throw new GraphQLError("Invalid email or password");
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "vithi",  // Uses 'vithi' as the default secret if env variable is not set
          { expiresIn: "30d" }
        );

        // Return login response
        return {
          msg: "User successfully logged in",
          user: user.id,
          userName: user.userName,  
          token: token,
          role: user.role,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw new GraphQLError(error.message);
      }
    },
  },
};

const getRandomNumber = () => {
  const fakerator = Fakerator();
  const number = fakerator.random.number(11, 99);
  return "1" + number;
};

const getServiceRequestNumber = () => {
  return "V" + getRandomNumber();
};

module.exports.getRandomNumber = getRandomNumber;
module.exports.getServiceRequestNumber = getServiceRequestNumber;
module.exports = resolvers;
