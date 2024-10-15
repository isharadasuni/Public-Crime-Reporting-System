import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/OfficerDatatable/Datatable";
import "./list.scss";
import React  from 'react';


const List = () => {
    return(
        <div className="list">
            <Sidebar/>
            <div className="listContainer">
                <Navbar/>
                
                {/* this data table for get police officer's details  */}
            
                <Datatable/>
            </div>
        </div>
    )
}
export default List;