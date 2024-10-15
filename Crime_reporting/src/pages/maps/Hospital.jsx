/* global google */
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./policeStation.scss";
import HospitalLocationDataService from "../../services/hospital.services";
import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Link } from "react-router-dom";
import React  from 'react';
import fehMarker from "../../image/hLocation.png";


const Hospital = () => {

    const [map, setMap] = useState(null);
    const [hospitalLocations, setHospitalLocations] = useState([]);



    
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

            // Fetch hospital locations

            HospitalLocationDataService.getAllLocation()
            .then((locations) => {
                const locationsData = locations.docs.map((doc) => ({
                    id: doc.id, 
                    latitude: parseFloat(doc.data().latitude),
                    longitude: parseFloat(doc.data().longitude),
                    Hospital_Name: doc.data().Hospital_Name, 
                    Contact: doc.data().Contact, 
                    address: doc.data().address,
                }));
                setHospitalLocations(locationsData);

                locationsData.forEach((location) => {
                    if (!isNaN(location.latitude) && !isNaN(location.longitude)) {
                        const marker = new google.maps.Marker({
                            position: { lat: location.latitude, lng: location.longitude },
                            map: mapInstance,
                            title: "Hospital Location",
                            icon: {
                                url: fehMarker,
                                scaledSize: new google.maps.Size(45, 40),
                            },
                        });

                        // Info window content
                        const infoWindowContent = `<div>
                        <h3> ${location.Hospital_Name || 'N/A'}</h3>
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



    return(
       
        <div className="policeMap">
            <Sidebar />

            <div className="policeMapContainer">
                <Navbar />

                <div className="addNew">

                    <div>Hospital Location</div>

                    <Link to="addHospital" style={{ textDecoration: "none" }} className="link">
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
export default Hospital;