package com.example.crimereporter;

import static androidx.constraintlayout.helper.widget.MotionEffect.TAG;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;

import android.location.Location;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class PoliceLocationActivity extends AppCompatActivity implements OnMapReadyCallback {

    private GoogleMap googleMap;
    private MapView mapView;
    private FirebaseFirestore db;
    private Location currentLocation;
    private List<PoliceStation> policeStations;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_police_location);

        // Initialize Firestore
        db = FirebaseFirestore.getInstance();

        mapView = findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);
        mapView.getMapAsync(this);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        this.googleMap = googleMap;
        // Enable the user location layer if permission has been granted.
        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            // Request the missing permissions.
            ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.ACCESS_FINE_LOCATION,
                    android.Manifest.permission.ACCESS_COARSE_LOCATION}, 123);
            return;
        }
        this.googleMap.setMyLocationEnabled(true);
        // Zoom to the user's current location if available.
        zoomToCurrentLocation();

        // Fetch police station locations
        db.collection("policeStationLocation").get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        policeStations = new ArrayList<>();
                        for (DocumentSnapshot document : task.getResult()) {
                            String latitudeStr = document.getString("latitude");
                            String longitudeStr = document.getString("longitude");
                            String departmentName = document.getString("depatment_Name");
                            String contactNumber = document.getString("Contact");
                            if (latitudeStr != null && longitudeStr != null && departmentName != null) {
                                try {
                                    double latitude = Double.parseDouble(latitudeStr);
                                    double longitude = Double.parseDouble(longitudeStr);
                                    LatLng location = new LatLng(latitude, longitude);
                                    PoliceStation policeStation = new PoliceStation(location, departmentName, contactNumber);
                                    policeStations.add(policeStation);
                                } catch (NumberFormatException e) {
                                    // Handle parsing errors gracefully
                                    Log.e(TAG, "Error parsing latitude or longitude: " + e.getMessage());
                                }
                            }
                        }



                       
						
						// Check if the current location is available
                        if (currentLocation != null) {
							 // Sort the list of police stations based on their distance from the current location
                            Collections.sort(policeStations, new Comparator<PoliceStation>() {
                                @Override
								   public int compare(PoliceStation p1, PoliceStation p2) {
                                    float[] results1 = new float[1];
                                    float[] results2 = new float[1];
									
									// Calculate distance between current location and police station p1
                                    Location.distanceBetween(currentLocation.getLatitude(), currentLocation.getLongitude(),
                                            p1.getLocation().latitude, p1.getLocation().longitude, results1);
											
											// Calculate distance between current location and police station p2
                                    Location.distanceBetween(currentLocation.getLatitude(), currentLocation.getLongitude(),
                                            p2.getLocation().latitude, p2.getLocation().longitude, results2);
                                     
									 // Compare distances and return the result
									return Float.compare(results1[0], results2[0]);
                                }
                            });




                            // Display the 5 nearest police stations
                            int count = 0;
							// Iterate through police stations
                            for (PoliceStation station : policeStations) {
                                // Get station location
								LatLng location = station.getLocation();
								// Create marker options
                                MarkerOptions markerOptions = new MarkerOptions().position(location).title(station.getDepartmentName());
                                // Check if contact number exists
								if (station.getContactNumber() != null) {
									// Add contact number as snippet
                                    markerOptions.snippet("Contact: " + station.getContactNumber());
                                }
								
								// Add marker to map
                                googleMap.addMarker(markerOptions).setTag(station);
                                count++;
								// Check if 5 stations displayed
                                if (count >= 5) {
                                    break;
                                }
                            }



                            // Set marker click listener
                            googleMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
                                @Override
                                public boolean onMarkerClick(Marker marker) {
                                    PoliceStation selectedStation = (PoliceStation) marker.getTag();
                                    if (selectedStation != null) {
                                        // Show a toast indicating the selected police station
                                        Toast.makeText(PoliceLocationActivity.this, "Selected police station: "
                                                + selectedStation.getDepartmentName(), Toast.LENGTH_SHORT).show();

                                        // Pass the selected location data back to CrimeReportActivity
                                        Intent resultIntent = new Intent();

                                        resultIntent.putExtra("latitude", currentLocation.getLatitude());
                                        resultIntent.putExtra("longitude", currentLocation.getLongitude());
                                        resultIntent.putExtra("departmentName", selectedStation.getDepartmentName());
                                        setResult(RESULT_OK, resultIntent);
                                        finish(); // Finish the activity
                                    }
                                    return false;
                                }
                            });
                        }
                    } else {
                        // Handle error gracefully
                        Log.e(TAG, "Error getting documents: ", task.getException());
                    }
                });

        // Handle map clicks
        googleMap.setOnMapClickListener(new GoogleMap.OnMapClickListener() {
            @Override
            public void onMapClick(LatLng latLng) {
                Intent resultIntent = new Intent();
                resultIntent.putExtra("latitude", currentLocation.getLatitude());
                resultIntent.putExtra("longitude", currentLocation.getLongitude());
                String departmentName = "depatment_Name";
                resultIntent.putExtra("departmentName", departmentName);
                setResult(RESULT_OK, resultIntent);
                finish();
            }
        });
    }


    private void zoomToCurrentLocation() {
        FusedLocationProviderClient fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        if (ActivityCompat.checkSelfPermission(this, android.Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this,
                android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        fusedLocationClient.getLastLocation()
                .addOnSuccessListener(this, new OnSuccessListener<Location>() {
                    @Override
                    public void onSuccess(Location location) {
                        // Got last known location. In some rare situations, this can be null.
                        if (location != null) {
                            currentLocation = location;
                            LatLng currentLatLng = new LatLng(location.getLatitude(), location.getLongitude());
                            googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 15));
                        }
                    }
                });
    }

    @Override
    protected void onResume() {
        super.onResume();
        mapView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mapView.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mapView.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    private class PoliceStation {
        private LatLng location;
        private String departmentName;
        private String contactNumber;

        public PoliceStation(LatLng location, String departmentName, String contactNumber) {
            this.location = location;
            this.departmentName = departmentName;
            this.contactNumber = contactNumber;
        }

        public LatLng getLocation() {
            return location;
        }

        public String getDepartmentName() {
            return departmentName;
        }

        public String getContactNumber() {
            return contactNumber;
        }
    }
}
