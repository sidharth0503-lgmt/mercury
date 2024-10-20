// 'use client';

// //app/login/page.jsx

// import LoginForm from '../../container/login';


// const login = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="p-6 bg-white shadow-lg rounded-lg w-full max-w-sm">
//         <h1 className="text-2xl font-bold mb-2 text-center">Login</h1> 
//         <LoginForm />
//       </div>
//     </div>
//   );
// };

// export default login;

'use client';
//app/login/page.jsx
import LoginForm from '../../container/login';
const login = () => {
  return (
    <div>
        <LoginForm />
    </div>
  );
};

export default login;
