package com.example.crimereporter;


        import static androidx.constraintlayout.helper.widget.MotionEffect.TAG;

        import androidx.appcompat.app.AppCompatActivity;

        import android.content.Intent;
        import android.content.pm.PackageManager;
        import android.net.Uri;
        import android.os.Bundle;
        import androidx.core.app.ActivityCompat;

        import android.location.Location;
        import android.util.Log;

        import com.google.android.gms.location.FusedLocationProviderClient;
        import com.google.android.gms.location.LocationServices;
        import com.google.android.gms.maps.CameraUpdateFactory;
        import com.google.android.gms.maps.GoogleMap;
        import com.google.android.gms.maps.MapView;
        import com.google.android.gms.maps.OnMapReadyCallback;
        import com.google.android.gms.maps.model.LatLng;
        import com.google.android.gms.maps.model.MarkerOptions;
        import com.google.android.gms.tasks.OnSuccessListener;
        import com.google.firebase.firestore.DocumentSnapshot;
        import com.google.firebase.firestore.FirebaseFirestore;

public class EmergencyClActivity extends AppCompatActivity  implements OnMapReadyCallback {

    private GoogleMap googleMap;
    private MapView mapView;
    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_emergency_cl);

        // Initialize Firestore
        db = FirebaseFirestore.getInstance();

        mapView = findViewById(R.id.mapView2);
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


        db.collection("policeStationLocation").get()
                .addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        for (DocumentSnapshot document : task.getResult()) {
                            String latitudeStr = document.getString("latitude");
                            String longitudeStr = document.getString("longitude");
                            Double latitude = null;
                            Double longitude = null;
                            if (latitudeStr != null && longitudeStr != null) {
                                try {
                                    latitude = Double.parseDouble(latitudeStr);
                                    longitude = Double.parseDouble(longitudeStr);
                                } catch (NumberFormatException e) {
                                    // Handle parsing errors
                                  
                                }
                            }
                            String departmentName = document.getString("depatment_Name");
                            String contactNumber = document.getString("Contact");
                            if (latitude != null && longitude != null && departmentName != null) {
                                LatLng location = new LatLng(latitude, longitude);
                                MarkerOptions markerOptions = new MarkerOptions().position(location).title(departmentName);
                                if (contactNumber != null) {
                                    markerOptions.snippet("Contact: " + contactNumber);
                                }
                                googleMap.addMarker(markerOptions); }
                        }
                    } else {
                        // Handle error 
                        Log.e(TAG, "Error getting documents: ", task.getException());
                    }
                });



        // Add marker click listener
        this.googleMap.setOnMarkerClickListener(marker -> {
            // Get the phone number from the marker's snippet
            String snippet = marker.getSnippet();
            if (snippet != null && snippet.startsWith("Contact: ")) {
                String phoneNumber = snippet.substring("Contact: ".length());
                // Call method to dial the number
                dialPhoneNumber(phoneNumber);
            }
            return false;
        });
    }




    private void dialPhoneNumber(String phoneNumber) {
        Intent intent = new Intent(Intent.ACTION_DIAL);
        intent.setData(Uri.parse("tel:" + phoneNumber));
        startActivity(intent);
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
                        // Got last known location
                        if (location != null) {
                            LatLng currentLocation = new LatLng(location.getLatitude(), location.getLongitude());
                            googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(currentLocation, 15));
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
}