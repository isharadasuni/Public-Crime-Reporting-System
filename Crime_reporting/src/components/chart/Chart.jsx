import "./chart.scss";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CategoryDataService from "../../services/category.services";
import MobileReportDataService from "../../services/mobileCrime.serivices";
import ManualReportDataService from "../../services/manualReport.services"; 

// Crime Categories Analysis chart 



const Chart = ({ aspect, title }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [categoryReports, setCategoryReports] = useState({}); 


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      // Fetch categories
      const categoryResponse = await CategoryDataService.getAllCategory();
      const categoryData = categoryResponse.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCategories(categoryData);


      // Fetch total report count for each category
      const reportCounts = {};
      await Promise.all(categoryData.map(async (category) => {
        const mobileReport = await MobileReportDataService.getAllMobileReport();
        const manualReport = await ManualReportDataService.getAllManualReport();

        
        // Filter mobile reports by category
        const catMobileReports = mobileReport.docs.filter((doc) => doc.data().finalizedCategory === category.category);
        
        // Filter manual reports by category
        const catManualReports = manualReport.docs.filter((doc) => doc.data().finalizedCategory === category.category);
        
        // Calculate total report count for the category
        const totalReports = catMobileReports.length + catManualReports.length;
        reportCounts[category.category] = totalReports;
      }));
      setCategoryReports(reportCounts);
      // Set loading to false once data is fetched
      setLoading(false); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Define chartData using categories and report counts
  const chartData = categories.map(category => ({
    name: category.category,
    Crime: categoryReports[category.category] || 0 
  }));


 // Custom YAxis tick formatter to display integers only
 const formatYAxisTick = (tick) => {
  return parseInt(tick);
};



  return (
    <div className="chart">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" aspect={aspect} >
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={30}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} fontSize={10} />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="Crime" fill="rgba(6, 19, 117, 0.651)" background={{ fill: '#eee' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
