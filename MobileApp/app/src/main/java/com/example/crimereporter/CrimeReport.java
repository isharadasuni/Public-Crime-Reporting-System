package com.example.crimereporter;
import com.example.crimereporter.network.PredictionRequest;
import com.example.crimereporter.network.PredictionResponse;
import com.example.crimereporter.network.PredictionService;

import android.database.Cursor;
import android.provider.OpenableColumns;
import java.io.File;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;


import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;



public class CrimeReport extends AppCompatActivity {
    // Retrofit instance
    private PredictionService predictionService;

    // Variable to store the predicted category
    private String predictedCategory;
    private String finalizedCategory;
    private String nic;
    private Spinner spinnerDropdown;
    private EditText descriptionEditText, dateEditText;
    private Button attachmentButton, cancel, submitButton, nextButton;
    private FirebaseFirestore db;
    private FirebaseUser currentUser;
    private TextView attachmentUrlTextView, caseTextView, locationText, predict,crimeLocatioText;

    private ImageButton locationButton, crimeButton;
    private RadioGroup radioGroup;

    private FusedLocationProviderClient fusedLocationClient;

    // Constants for image and video selection
    private static final int REQUEST_IMAGE = 1;
    private static final int REQUEST_VIDEO = 2;

    // Define a constant for the request code
    private static final int REQUEST_CODE_LOCATION = 3;
    private static final int REQUEST_CODE_CRIME_LOCATION = 4;
    private double crimeLatitude;
    private double crimeLongitude;
    private String departmentName;

    private RadioButton radioButton1, radioButton2;

    private double latitude;
    private double longitude;

    // Variables to store selected image and video URIs
    private Uri selectedImageUri;
    private Uri selectedVideoUri;

    // Retrofit instance

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_crime_report);

        // Initialize fields
        spinnerDropdown = findViewById(R.id.spinner_dropdown);
        descriptionEditText = findViewById(R.id.editTextTextMultiLine);
        attachmentButton = findViewById(R.id.attachmentButton);
        attachmentUrlTextView = findViewById(R.id.attachmentUrlTextView);
        caseTextView = findViewById(R.id.caseTextView);
        cancel = findViewById(R.id.cancel);
        submitButton = findViewById(R.id.send);
        nextButton = findViewById(R.id.next);
        dateEditText = findViewById(R.id.date);
        locationButton = findViewById(R.id.locationButton);
        locationText = findViewById(R.id.locationText);
        db = FirebaseFirestore.getInstance();
        currentUser = FirebaseAuth.getInstance().getCurrentUser();
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        predict = findViewById(R.id.predict);
        radioButton1 = findViewById(R.id.radioButton1);
        radioButton2 = findViewById(R.id.radioButton2);
        radioGroup = findViewById(R.id.radioGroup);
        crimeButton = findViewById(R.id.crimeButton);
        crimeLocatioText = findViewById(R.id.crimeLocatioText);


        // hide the radio buttons layout
        radioGroup.setVisibility(View.GONE);

        // Hide the  button
        submitButton.setVisibility(View.GONE);
        cancel.setVisibility(View.GONE);

        // Fetch crime types from Firestore and populate the spinner
        fetchCrimeTypes();

        // Set current date and time to the date EditText
        setCurrentDateTime();

        //fetch user nic
        fetchUserNIC();

        // Set the date EditText as readonly
        dateEditText.setEnabled(false);


        // Generate a unique case number and set it to the caseTextView
        String caseNumber = generateCaseNumber();
        caseTextView.setText("Case: " + caseNumber);


        // Set click listener for attachment button to choose images or videos
        attachmentButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Open gallery to choose images or videos
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"image/*", "video/*"});
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                startActivityForResult(intent, REQUEST_IMAGE);
            }
        });




        // Set click listener for submit button to upload crime report
        submitButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Validate the input fields
                if (validateFields()) {
                    // Upload crime report to Firestore
                    uploadCrimeReport();
                } else {
                    // Show a toast message indicating that all fields are mandatory
                    Toast.makeText(CrimeReport.this, "All fields are mandatory",
                            Toast.LENGTH_SHORT).show();
                }
            }
        });

        // Set click listener for cancel button
        cancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openHome();
            }
        });


        // Set an onClickListener for the Button
        locationButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Start PoliceLocationActivity to select a location
                Intent intent = new Intent(CrimeReport.this, PoliceLocationActivity.class);
                startActivityForResult(intent, REQUEST_CODE_LOCATION);
            }

        });

        // Set an onClickListener for the Button
        crimeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Start crime Location to select a location
                Intent intent = new Intent(CrimeReport.this, CrimeLocation.class);
                startActivityForResult(intent, REQUEST_CODE_CRIME_LOCATION);
            }

        });





        // Inside CrimeReport activity
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://d9e2-2402-d000-8110-14ba-ccb6-9794-b327-941f.ngrok-free.app") //using ngrok urls
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Initialize PredictionService
        this.predictionService = retrofit.create(PredictionService.class);


        //get prediction
        nextButton.setOnClickListener(new View.OnClickListener() {



            @Override
            public void onClick(View v) {
                if (validateFields()) {
                    String category = spinnerDropdown.getSelectedItem().toString();
                    String description = descriptionEditText.getText().toString();



                    // Create a PredictionRequest object
                    PredictionRequest request = new PredictionRequest(description);


                    // Make the prediction request
                    Call<PredictionResponse> call = predictionService.predict(request);
                    call.enqueue(new Callback<PredictionResponse>() {
                        @Override
                        public void onResponse(Call<PredictionResponse> call, Response<PredictionResponse> response) {
                            if (response.isSuccessful()) {
                                // Handle successful prediction response

                                PredictionResponse predictionResponse = response.body();
                                submitButton.setVisibility(View.VISIBLE);
                                cancel.setVisibility(View.VISIBLE);
                                nextButton.setSystemUiVisibility(View.GONE);


                                if (predictionResponse != null) {
                                    String predictedCategory = predictionResponse.getPrediction();

                                    // Assign predicted category to the instance variable
                                    CrimeReport.this.predictedCategory = predictedCategory;





                                    if (!category.equals(predictedCategory)) {
                                        // Selected category and predicted category are not equal
                                        // Show radio button with the two values and handle submission accordingly
                                        showRadioButtons(category, predictedCategory);

                                        // Show the predicted category text
                                        predict.setText("Hmmm, after reviewing your description, it seems you select wrong category shall I suggest " +
                                                "choosing - CATEGORY ? : " + predictedCategory);

                                        // Set click listener for the radio buttons
                                        radioGroup.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                                            @Override
                                            public void onCheckedChanged(RadioGroup group, int checkedId) {
                                                if (checkedId == R.id.radioButton1) {
                                                    finalizedCategory = radioButton1.getText().toString();
                                                } else if (checkedId == R.id.radioButton2) {
                                                    finalizedCategory = radioButton2.getText().toString();
                                                }
                                                else if (!radioButton1.isChecked() && !radioButton2.isChecked()) {
                                                    finalizedCategory = category;
                                                }
                                            }
                                        });

                                    } else {

                                        nextButton.setVisibility(View.GONE);
                                    }
                                }
                            } else {
                                // Handle unsuccessful prediction response
                                // Show an error message
                                Toast.makeText(CrimeReport.this, "Prediction failed", Toast.LENGTH_SHORT).show();
                            }
                        }

                        @Override
                        public void onFailure(Call<PredictionResponse> call, Throwable t) {
                            // Handle prediction request failure
                            // Show an error message
                            Toast.makeText(CrimeReport.this, "Prediction request failed: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    });
                } else {
                    // Show a toast message indicating that all fields are mandatory
                    Toast.makeText(CrimeReport.this, "All fields are mandatory",
                            Toast.LENGTH_SHORT).show();
                }
            }
        });


    }


    private void fetchUserNIC() {
        String userEmail = currentUser.getEmail();
        if (userEmail != null) {
            db.collection("mobile_users")
                    .whereEqualTo("email", userEmail)
                    .get()
                    .addOnSuccessListener(queryDocumentSnapshots -> {
                        if (!queryDocumentSnapshots.isEmpty()) {
                            nic = queryDocumentSnapshots.getDocuments().get(0).getString("nic");
                        }
                    })
                    .addOnFailureListener(e -> {
                        // Handle failure, if any
                        Toast.makeText(CrimeReport.this, "Failed to fetch user NIC", Toast.LENGTH_SHORT).show();
                    });
        }
    }




    // Method to show the radio buttons with the selected and predicted categories
    private void showRadioButtons(String selectedCategory, String predictedCategory) {
        // Set the text for the radio buttons
        radioButton1.setText(selectedCategory);
        radioButton2.setText(predictedCategory);

        // Show the radio buttons layout
        radioGroup.setVisibility(View.VISIBLE);

        // Hide the "Next" button
        nextButton.setVisibility(View.GONE);
    }







    //function to move location page
    public void openLocation(){
        Intent intent = new Intent(this,PoliceLocationActivity.class);
        startActivity(intent);
    }




    //function to move home page
    public void openHome(){
        Intent intent = new Intent(this,HomeActivity.class);
        startActivity(intent);
    }




















    // Function to generate a unique case number
    private String generateCaseNumber() {
        long timestamp = System.currentTimeMillis();
        String randomChars = Long.toHexString(Double.doubleToLongBits(Math.random()));
        return "MOBILE-" + timestamp ;
    }

    // Method to fetch crime types from Firestore and populate spinner
    private void fetchCrimeTypes() {
        db.collection("category").get().addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
            @Override
            public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                List<String> crimeTypes = new ArrayList<>();
                for (int i = 0; i < queryDocumentSnapshots.size(); i++) {
                    String category = queryDocumentSnapshots.getDocuments().get(i).getString("category");
                    if (category != null) {
                        crimeTypes.add(category);
                    }
                }

                // Populate crime types into Spinner
                ArrayAdapter<String> adapter = new ArrayAdapter<>(CrimeReport.this,
                        android.R.layout.simple_spinner_dropdown_item, crimeTypes);
                spinnerDropdown.setAdapter(adapter);
            }
        });
    }





    // Method to handle result of choosing images or videos from the gallery
    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK && data != null) {
            Uri selectedUri = data.getData();
            if (selectedUri != null) {
                if (requestCode == REQUEST_IMAGE && isImageFile(selectedUri)) {
                    selectedImageUri = selectedUri;
                    displayAttachmentUrl(selectedImageUri);
                } else if (requestCode == REQUEST_VIDEO && isVideoFile(selectedUri)) {
                    selectedVideoUri = selectedUri;
                    displayAttachmentUrl(selectedVideoUri);
                } else {
                    Toast.makeText(this, "Please select a valid image or video file",
                            Toast.LENGTH_SHORT).show();
                }
            }
        }

        // Check if the result is from PoliceLocationActivity and if it's RESULT_OK
        if (requestCode == REQUEST_CODE_LOCATION && resultCode == RESULT_OK && data != null) {
            latitude = data.getDoubleExtra("latitude", 0.0);
            longitude = data.getDoubleExtra("longitude", 0.0);
            departmentName = data.getStringExtra("departmentName");
            locationText.setText( "Department: " + departmentName);
        }


        // Check if the result is from PoliceLocationActivity and if it's RESULT_OK
        if (requestCode == REQUEST_CODE_CRIME_LOCATION) {
            crimeLatitude = data.getDoubleExtra("CrimeLatitude", 0.0);
            crimeLongitude = data.getDoubleExtra("CrimeLongitude", 0.0);
            crimeLocatioText.setText("Crime Location: Lat " + crimeLatitude + ", Lng " + crimeLongitude);
        }
    }

    // Method to check if the selected URI points to an image file
    private boolean isImageFile(Uri uri) {
        String type = getContentResolver().getType(uri);
        return type != null && type.startsWith("image/");
    }

    // Method to check if the selected URI points to a video file
    private boolean isVideoFile(Uri uri) {
        String type = getContentResolver().getType(uri);
        return type != null && type.startsWith("video/");
    }

    // Method to display the attachment URL
    private void displayAttachmentUrl(Uri attachmentUri) {
        if (attachmentUri != null) {
            // Show the TextView to display the filenames
            attachmentUrlTextView.setVisibility(View.VISIBLE);

            // Get the filename from the Uri
            String fileName = getFileNameFromUri(attachmentUri);

            // Determine file type
            String fileType;
            if (isImageFile(attachmentUri)) {
                fileType = "Image";
            } else if (isVideoFile(attachmentUri)) {
                fileType = "Video";
            } else {
                fileType = "Unknown";
            }

            // Append the filename and file type to the TextView
            String currentText = attachmentUrlTextView.getText().toString();
            if (!currentText.isEmpty()) {
                currentText += "\n"; // Add a new line if TextView already contains text
            }
            attachmentUrlTextView.setText(currentText + "Selected " + fileType + ": " + fileName);
        }
    }



    // Method to get the filename from the Uri
    private String getFileNameFromUri(Uri uri) {
        String fileName = "";
        if (uri.getScheme().equals("content")) {
            Cursor cursor = getContentResolver().query(uri, null,
                    null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    // Check if the cursor contains the DISPLAY_NAME column
                    int displayNameIndex = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                    if (displayNameIndex != -1) {
                        // Retrieve the filename from the cursor
                        fileName = cursor.getString(displayNameIndex);
                    } else {
                        // Handle case where DISPLAY_NAME column is not found
                        fileName = "Unknown file";
                    }
                }
            } finally {
                if (cursor != null) {
                    cursor.close();
                }
            }
        } else if (uri.getScheme().equals("file")) {
            fileName = new File(uri.getPath()).getName();
        }
        return fileName;
    }





    // Method to validate input fields
    private boolean validateFields() {
        // Check if category, description are not empty
        String category = spinnerDropdown.getSelectedItem().toString();
        String description = descriptionEditText.getText().toString();
        String location = locationText.getText().toString();
        boolean attachmentSelected = selectedImageUri != null || selectedVideoUri != null;

        // Check if the description contains more than 10 words
        int wordCount = countWords(description);
        boolean descriptionValid = wordCount > 10;

        return !category.isEmpty() && !description.isEmpty() && !location.isEmpty() && attachmentSelected;

    }

    // Method to count the number of words in a string
    private int countWords(String text) {
        if (text == null || text.isEmpty()) {
            return 0;
        }

        String[] words = text.trim().split("\\s+");
        return words.length;
    }



    // Method to upload crime report to Firestore
    private void uploadCrimeReport( ) {
        String category = spinnerDropdown.getSelectedItem().toString();
        String description = descriptionEditText.getText().toString();
        String date = getCurrentDateTime();
        String caseNumber = generateCaseNumber();
        String email = currentUser.getEmail();


        Map<String, Object> report = new HashMap<>();
        report.put("caseNo", caseNumber);
        report.put("category", category);
        report.put("predictedCategory", predictedCategory);
        report.put("finalizedCategory", finalizedCategory != null ? finalizedCategory : category);
        report.put("description", description);
        report.put("date", date);
        report.put("reporter", email);
        report.put("latitude", latitude);
        report.put("longitude", longitude);
        report.put("crimeLongitude", crimeLongitude);
        report.put("crimeLatitude",crimeLatitude );
        report.put("nic", nic);

        if (departmentName != null) {
            report.put("departmentName", departmentName);

        }

        if (selectedImageUri != null) {
            uploadFile(selectedImageUri, "crimeImages", "image", imageUrl -> {
                report.put("image_url", imageUrl);
                uploadReportToFirestore(report);
            });
        } else if (selectedVideoUri != null) {
            uploadFile(selectedVideoUri, "crimeVideos", "video", videoUrl -> {
                report.put("video_url", videoUrl);
                uploadReportToFirestore(report);
            });
        } else {
            // If neither image nor video is selected, directly upload report to Firestore
            uploadReportToFirestore(report);
        }
    }


    // Method to upload file to Firebase Storage and retrieve download URL
    private void uploadFile(Uri fileUri, String folderName, String fileType, OnSuccessListener<String>
            onSuccessListener) {
        StorageReference storageRef = FirebaseStorage.getInstance().getReference();
        StorageReference fileRef = storageRef.child(folderName).child(fileUri.getLastPathSegment());

        fileRef.putFile(fileUri)
                .addOnSuccessListener(taskSnapshot -> {
                    fileRef.getDownloadUrl().addOnSuccessListener(uri -> {
                        onSuccessListener.onSuccess(uri.toString());
                    });
                })
                .addOnFailureListener(exception -> {
                    Toast.makeText(CrimeReport.this, "Failed to upload " + fileType,
                            Toast.LENGTH_SHORT).show();
                });
    }



    // Method to upload the report to Firestore
    private void uploadReportToFirestore(Map<String, Object> report) {
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        db.collection("crime_reports")
                .add(report)
                .addOnSuccessListener(documentReference -> {
                    Toast.makeText(CrimeReport.this, "Report submitted successfully",
                            Toast.LENGTH_SHORT).show();
                    descriptionEditText.setText("");
                    selectedImageUri = null;
                    selectedVideoUri = null;
                })
                .addOnFailureListener(e -> {
                    Toast.makeText(CrimeReport.this, "Failed to submit report",
                            Toast.LENGTH_SHORT).show();
                });
    }

    // Method to set current date and time
    private void setCurrentDateTime() {
        // Get current date and time
        String currentDateAndTime = getCurrentDateTime();
        // Set current date and time to the appropriate EditText
        EditText dateEditText = findViewById(R.id.date);
        dateEditText.setText(currentDateAndTime);
    }

    private String getCurrentDateTime() {
        // Get current date and time
        Calendar calendar = Calendar.getInstance();
        // Define format for date
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        // Format the date and return
        return dateFormat.format(calendar.getTime());
    }






}