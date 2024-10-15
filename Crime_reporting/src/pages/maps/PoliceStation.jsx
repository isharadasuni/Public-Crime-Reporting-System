/* global google */
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./policeStation.scss";
import React from 'react';
import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Link } from "react-router-dom";
import PoliceLocationDataService from "../../services/policeStation.services";
import fehMarker from "../../image/pLocation.png";


const PoliceStation = () => {

    const [map, setMap] = useState(null);
    const [policeLocations, setPoliceLocations] = useState([]);



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

            // Fetch police station locations

            PoliceLocationDataService.getAllLocation()
            .then((locations) => {
                const locationsData = locations.docs.map((doc) => ({
                    id: doc.id, 
                    latitude: parseFloat(doc.data().latitude),
                    longitude: parseFloat(doc.data().longitude),
                    department_Name: doc.data().depatment_Name, 
                    Contact: doc.data().Contact, 
                    address: doc.data().address,
                }));
                setPoliceLocations(locationsData);

                locationsData.forEach((location) => {
                    if (!isNaN(location.latitude) && !isNaN(location.longitude)) {
                        const marker = new google.maps.Marker({
                            position: { lat: location.latitude, lng: location.longitude },
                            map: mapInstance,
                            title: "Police Station Location",
                            icon: {
                                url: fehMarker,
                                scaledSize: new google.maps.Size(70, 35),
                            },
                        });

                        // Info window content
                        const infoWindowContent = `<div>
                        <h3> ${location.department_Name || 'N/A'}</h3>
                        <p>Contact Number: ${location.Contact || 'N/A'}</p>
                        
                    </div>`;

                        const infoWindow = new google.maps.InfoWindow({
                            content: infoWindowContent,
                        });

                        // Event listener for marker click
                        marker.addListener("click", () => {
                            infoWindow.open(mapInstance, marker);
                        });
                    } else {
                        console.warn('Invalid latitude or longitude:', location);
                    }
                });
            })
            .catch((error) => {
                console.error('Error fetching police station locations: ', error);
            });
    }).catch((error) => {
        console.error('Error loading map: ', error);
    });
}, []);


    return (


        <div className="policeMap">
            <Sidebar />

            <div className="policeMapContainer">
                <Navbar />

                <div className="addNew">

                    <div>Police Station Location</div>

                    <Link to="addPoliceStation" style={{ textDecoration: "none" }} className="link">
                        Add New
                    </Link>

                </div>



                <div className="container">

                    <div className="map"></div>



                </div>
            </div>
        </div>
    )
}
export default PoliceStation;