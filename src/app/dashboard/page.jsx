// 'use client '
// //import Navbar from "../../container/header/index";
// //import BookList from "../../container/booklist/index";
// //import Userlist  from "../../container/userlist/index"
// import Admin from "../../container/admin/index"
// import User from "../../container/user/index"
// const App = () => {
//   return (
//     <div>
      
      
//      <Admin/>
//      <User/>

//     </div>
//   );
// };

// export default App;

import Navbar from "../../container/header/index";
import BookList from "../../container/booklist/index";


const App = () => {
  return (
    <div>
      <Navbar/>
      <BookList/>
    </div>
  );
};

export default App;
