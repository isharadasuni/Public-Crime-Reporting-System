/* global google */
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./generalReport.scss";
import React, { useEffect, useState } from "react";
import ManualReportDataService from "../../services/manualReport.services";
import MobileReportDataService from "../../services/mobileCrime.serivices";
import Chart from "../../components/chart/Chart";
import { Loader } from "@googlemaps/js-api-loader";
import { CircularProgressbar } from "react-circular-progressbar";
import Featured from "../../components/featured/Featured";
import CategoryDataService from "../../services/category.services";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



//manual crime report data full record view


const GeneralReports = () => {

    const [totalManualReport, setTotalManualRepor] = useState();
    const [totalMobileReport, setTotalMobileRepor] = useState();
    const [totalPendingManualReport, setTotalPendingManualRepor] = useState();
    const [totalPendingMobileReport, setTotalPendingMobileRepor] = useState();
    const [totalAcceptManualReport, setTotalAcceptManualRepor] = useState();
    const [totalAcceptMobileReport, setTotalAcceptMobileRepor] = useState();
    const [totalRejectManualReport, setTotalRejectManualRepor] = useState();
    const [totalRejectMobileReport, setTotalRejectMobileRepor] = useState();
    const [categoriesData, setCategoriesData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryReports, setCategoryReports] = useState({});
    const [aspect, setAspect] = useState(2 / 1);
  


    const calculation = async () => {

        try {

            //get total of manual report
            const manualReportSnapshot = await ManualReportDataService.getAllManualReport();
            const manualReportDocs = manualReportSnapshot.docs;
            const sumOfManualReports = manualReportDocs.length;
            setTotalManualRepor(sumOfManualReports);
            //get total of manual pending
            const pendingReports = manualReportDocs.filter((doc) => doc.data().Status === "Pending");
            const pending = pendingReports.length;
            setTotalPendingManualRepor(pending);
            //get total of manual accept
            const acceptReports = manualReportDocs.filter((doc) => doc.data().Status === "Accepted");
            const accept = acceptReports.length;
            setTotalAcceptManualRepor(accept);
            //get total of manual reject
            const rejectReports = manualReportDocs.filter((doc) => doc.data().Status === "Reject");
            const reject = rejectReports.length;
            setTotalRejectManualRepor(reject);





            //get total of mobile report
            const mobileReportSnapshot = await MobileReportDataService.getAllMobileReport();
            const mobileReportDocs = mobileReportSnapshot.docs;
            const sumOfMobileReports = mobileReportDocs.length;
            setTotalMobileRepor(sumOfMobileReports);
            //get total of mobile pending
            const pendingMobileReports = mobileReportDocs.filter((doc) => doc.data().Status === "Pending");
            const pendingMobile = pendingMobileReports.length;
            setTotalPendingMobileRepor(pendingMobile);
            //get total of mobile accepted 
            const acceptMobileReports = mobileReportDocs.filter((doc) => doc.data().Status === "Accepted");
            const acceptMobile = acceptMobileReports.length;
            setTotalAcceptMobileRepor(acceptMobile);
            //get total of mobile reject
            const rejectMobileReports = mobileReportDocs.filter((doc) => doc.data().Status === "Reject");
            const rejectMobile = rejectMobileReports.length;
            setTotalRejectMobileRepor(rejectMobile);


        }
        catch (error) {
            throw error;
        }

    }
    useEffect(() => {
        calculation();
    }, [])

    // total reports
  
    const totalPending = (totalPendingManualReport + totalPendingMobileReport) || 0;
    const totalAccept = (totalAcceptManualReport + totalAcceptMobileReport) || 0;
    const totalReject = (totalRejectManualReport + totalRejectMobileReport) || 0;
    const totalCrime = (totalPending + totalAccept + totalReject) || 0;
    // average 
    const averagePending = (((totalPendingManualReport + totalPendingMobileReport) / totalCrime) || 0).toFixed(2);;
    const averageAccept = (((totalAcceptManualReport + totalAcceptMobileReport) / totalCrime) || 0).toFixed(2);;
    const averageReject = (((totalRejectManualReport + totalRejectMobileReport) / totalCrime) || 0).toFixed(2);;

    // percentage
    const percentagePending = (((totalPendingManualReport + totalPendingMobileReport) / totalCrime) * 100 || 0).toFixed(2);
    const percentageAccept = (((totalAcceptManualReport + totalAcceptMobileReport) / totalCrime) * 100 || 0).toFixed(2);
    const percentageReject = (((totalRejectManualReport + totalRejectMobileReport) / totalCrime) * 100 || 0).toFixed(2);

    //success rate
    const successRate = ((totalAccept / (totalCrime - totalReject)) * 100 || 0).toFixed(2);



    //------------map location--------------------------------------------------------------------------------------------------------------------------

    const [map, setMap] = useState(null);
    const [policeLocations, setPoliceLocations] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyA5W8K4XEIl7tSWL2xsHe-PrOIbqkDuuYs",
            version: "weekly",
        });

        loader.load().then(() => {
            const mapInstance = new google.maps.Map(document.querySelector('.map'), {
                center: { lat: 7.8731, lng: 80.7718 },
                zoom: 8,
            });

            setMap(mapInstance);

            // Fetch crime locations
            MobileReportDataService.getAllMobileReport()
                .then((locations) => {
                    const locationsData = locations.docs.map((doc) => ({
                        id: doc.id,
                        latitude: parseFloat(doc.data().crimeLatitude),
                        longitude: parseFloat(doc.data().crimeLongitude),
                        category: doc.data().finalizedCategory,
                        status: doc.data().Status,
                    }));
                    setPoliceLocations(locationsData);
                });
        });
    }, []);

    useEffect(() => {
        if (map && policeLocations.length > 0) {
            // Clear existing markers
            markers.forEach((marker) => marker.setMap(null));

            const newMarkers = policeLocations
            .filter((location) => location.status !== "Reject" && (selectedCategory === "All" || location.category === selectedCategory))
            .map((location) => {
                    const marker = new google.maps.Marker({
                        position: { lat: location.latitude, lng: location.longitude },
                        map: map,
                    });
                    return marker;
                });

            setMarkers(newMarkers);
        }
    }, [map, policeLocations, selectedCategory]);


    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };


    //------------category comparison --------------------------------------------------------------------------------------------------------------


    useEffect(() => {
        const comparison = async () => {
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
                    const selectedCategoryMobile = mobileReport.docs.filter((doc) => doc.data().category === category.category);
                    const predictedCategoryMobile = mobileReport.docs.filter((doc) => doc.data().predictedCategory === category.category);
                    const finalizedCategoryMobile = mobileReport.docs.filter((doc) => doc.data().finalizedCategory === category.category);

                    // Filter manual reports by category
                    const selectedCategoryManual = manualReport.docs.filter((doc) => doc.data().selectCategory=== category.category);
                    const predictedCategoryManual = manualReport.docs.filter((doc) => doc.data().predictCategory === category.category);
                    const finalizedCategoryManual = manualReport.docs.filter((doc) => doc.data().finalizedCategory === category.category);

                    // Calculate total report count for the category
                    const totalSelectedCategory = selectedCategoryMobile.length + selectedCategoryManual.length;
                    const totalPredictedCategory = predictedCategoryMobile.length + predictedCategoryManual.length;
                    const totalFinalizedCategory = finalizedCategoryMobile.length + finalizedCategoryManual.length;
                    reportCounts[category.category] = {
                        selected: totalSelectedCategory,
                        predicted: totalPredictedCategory,
                        finalized: totalFinalizedCategory
                    };
                }));

                setCategoryReports(reportCounts);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        comparison();
    }, []);

    // Define chartData using categories and report counts
    const chartData = categories.map(category => ({
        category: category.category,
        selected: categoryReports[category.category]?.selected || 0,
        predicted: categoryReports[category.category]?.predicted || 0,
        finalized: categoryReports[category.category]?.finalized || 0
    }));



    return (


        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />


                <div className="backContainer">
                    <span>&nbsp;</span>



                    <div className="mainContainer">


                        {/* total of reports  */}
                        <div className="part1">
                            <div className="detailItem">
                                <div className="left">
                                    <span className="topic">TOTAL</span>
                                    <span>Complains</span>
                                    <span >Pending Complain</span>
                                    <span >Accepte Complain</span>
                                    <span>Reject Complain</span>



                                </div>

                                <div className="right">
                                    <span>&nbsp;</span>
                                    <span >{totalCrime}</span>
                                    <span >{totalPending}</span>
                                    <span>{totalAccept}</span>
                                    <span>{totalReject}</span>
                                </div>




                            </div>
                        </div>



                        <span>&nbsp;</span>
                        <span>&nbsp;</span>
                        <span>&nbsp;</span>



                        {/* average of reports */}
                        <div className="part1">
                            <div className="detailItem">
                                <div className="left">
                                    <span className="topic">AVERAGE</span>
                                    <span >Pending Complain</span>
                                    <span >Accepte Complain</span>
                                    <span>Reject Complain</span>
                                    <span>&nbsp;</span>
                                </div>


                                <div className="right">
                                    <span>&nbsp;</span>
                                    <span >{averagePending}</span>
                                    <span >{averageAccept}</span>
                                    <span>{averageReject}</span>
                                    <span>&nbsp;</span>
                                </div>

                            </div>
                        </div>


                        <span>&nbsp;</span>
                        <span>&nbsp;</span>
                        <span>&nbsp;</span>



                        {/* percentage of reports */}
                        <div className="part1">
                            <div className="detailItem">
                                <div className="left">
                                    <span className="topic">PERCENTAGE</span>
                                    <span >Pending Complain</span>
                                    <span >Accepte Complain</span>
                                    <span>Reject Complain</span>
                                    <span>&nbsp;</span>
                                </div>


                                <div className="right">
                                    <span>&nbsp;</span>
                                    <span >{percentagePending}%</span>
                                    <span>{percentageAccept}%</span>
                                    <span>{percentageReject}%</span>
                                    <span>&nbsp;</span>
                                </div>

                            </div>
                        </div>

                    </div>
                    <hr />




                    <div className="charts">
                        <Chart  title={"Complain Analysis Based on Categories"} aspect={2 / 1} />
                    </div>

                    <hr />


                    <div className="partFeature">

                       


                        <div className="feature">
                            <Featured />
                        </div>
                    </div>


                    <hr />

                <div className="comPart">
                        <div className="comChart">
                            <div className="title">Complain Comparison Table Based on the Categorries</div>
                            <ResponsiveContainer width="100%" aspect={aspect}>
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 20, 
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                    barCategoryGap={20} 
                                    barGap={10} 
                                >
                                    <XAxis
                                        dataKey="category"
                                        scale="point"
                                        padding={{ left: 50, right: 20 }}
                                        fontSize={10}
                                        domain={['dataMin - 1', 'dataMax + 1']}
                                      
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Bar dataKey="selected" fill=" rgba(6, 19, 117, 0.753)" name="Selected" />
                                    <Bar dataKey="predicted" fill="  rgba(117, 6, 117, 0.753)" name="Predicted" />
                                    <Bar dataKey="finalized" fill=" rgba(6, 95, 117, 0.753)" name="Finalized" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                </div>

                    <hr />

                    <div className="part2">

                    

                        <div className="container">
                            <span className="title">Crime Location Analysis</span>

                            <div >Select the Category :
                          <select value={selectedCategory} onChange={handleCategoryChange}>
                                <option>All</option>
                                <option>Robbery</option>
                                <option>Assault</option>
                                <option>Drug-related offenses</option>
                                <option>Fraud and financial crimes</option>
                                <option>Domestic violence</option>
                                <option>Cybercrimes</option>
                                <option>Vandalism</option>
                                <option>Sexual offenses</option>

                            </select>
                            </div>
                            <div className="map">

                            </div>



                        </div>



                    </div>

                    <span>&nbsp;</span>

                </div>


            </div>




        </div>

    );
}




export default GeneralReports;