import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    {/* <div className="myNav">
    <Link to="/">Home</Link>
    <Link to="/helloworld">Hello World</Link>
    </div> */}
   


   <div class="topnav">
   <Link class="active" to="/">Home</Link>
   <Link to="/helloworld">Hello World</Link>
  
   </div>
 
    
   
  </header>
);

export default Header;
