package com.example.crimereporter;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RatingBar;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class FeedBackActivity extends AppCompatActivity {

    private Button feedbackSend,feedbackCancel;
    private EditText feedbackEditText;
    private FirebaseFirestore db;

    private RatingBar ratingBar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feed_back);


        // Initialize Firestore
        db = FirebaseFirestore.getInstance();

        // Initialize fields
        feedbackSend = findViewById(R.id.feedbackSend);
        feedbackCancel = findViewById(R.id.feedbackCancel);
        feedbackEditText = findViewById(R.id.feedback);
        ratingBar = findViewById(R.id.ratingBar);

        // Set click listener for cancel button
        feedbackCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openHome();
            }
        });


        // Set click listener for send button
        feedbackSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Validate input field
                String feedbackText = feedbackEditText.getText().toString().trim();
                if (feedbackText.isEmpty()) {
                    // Show toast message indicating empty feedback
                    Toast.makeText(FeedBackActivity.this, "Please enter feedback", Toast.LENGTH_SHORT).show();
                    return; // Exit the method if feedback text is empty
                }

                // Send feedback if input field is not empty
                sendFeedback();
            }
        });




    }





    // Method to get current user's email
    private String getCurrentUserEmail() {
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
            return currentUser.getEmail();

    }


    // Function to send feedback data to Firestore
    private void sendFeedback() {
        String feedbackText = feedbackEditText.getText().toString().trim();
        float rating = ratingBar.getRating();

        String userEmail = getCurrentUserEmail();

        // Get formatted date and time
        String formattedDateTime = getCurrentDateTime();

        // Create a new feedback object
        Map<String, Object> feedback = new HashMap<>();
        feedback.put("feedbackText", feedbackText);
        feedback.put("userEmail", userEmail);
        feedback.put("dateTime", formattedDateTime);
        feedback.put("rating", rating);

        // Add the feedback to Firestore
        db.collection("feedback")
                .add(feedback)
                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                    @Override
                    public void onSuccess(DocumentReference documentReference) {
                        // Feedback sent successfully
                        // Show toast message
                        Toast.makeText(FeedBackActivity.this, "Feedback sent successfully",
                                Toast.LENGTH_SHORT).show();

                        // You can add further handling here if needed
                        openHome();
                    }
                })
                .addOnFailureListener(new OnFailureListener() {
                    @Override
                    public void onFailure(@NonNull Exception e) {
                        // Show toast message if sending feedback fails
                        Toast.makeText(FeedBackActivity.this, "Failed to send feedback. Please try again.",
                                Toast.LENGTH_SHORT).show();
                    }
                });
    }


    // Method to get current date and time in "yyyy-MM-dd HH:mm:ss" format
    private String getCurrentDateTime() {
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateTimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return dateTimeFormat.format(calendar.getTime());
    }


    //function to move home page
    public void openHome(){
        Intent intent = new Intent(this,HomeActivity.class);
        startActivity(intent);
    }



}