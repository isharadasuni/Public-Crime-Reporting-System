import React from 'react';
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Widget from "../../components/widget/Widget"
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Tab from "../../components/crimeDatatable/Tab";
import "./home.scss";

const Home = () => {


    return (
        <div className="home">
            <Sidebar /> 
            <div className="homeContainer">
                <Navbar />
                <div className="widgets">
                    <Widget type="rejected" />
                    <Widget type="accepted" />
                    <Widget type="pending" />
                    <Widget type="users" />
                </div>
                <div className="charts">
                    <Featured />
                    <Chart title={"Crime Categories Analysis"} aspect={2 / 1} />
                </div>
                <div className="listContainer">
                    <div className="listTitle">Latest Reports</div>
                    <Tab />
                </div>

            </div>
        </div>
    )
}
export default Home;