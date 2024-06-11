import React from "react";
 
const TabContent = ({id, activeTab, children}) => {
console.log(children)
 return (
   activeTab === id ? 
   <div className="">
     { children }
   </div>
   : null
 );
};
 
export default TabContent;
