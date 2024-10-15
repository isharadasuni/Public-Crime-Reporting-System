package com.example.crimereporter;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

public class ProfileActivity extends AppCompatActivity {

    private TextView proName, proAddres, proEmail, proNIC, proPhone, topic;
    private FirebaseFirestore db;
    private FirebaseUser currentUser;

    private Button btnUpdate;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // Initialize Firestore and get current user
        db = FirebaseFirestore.getInstance();
        currentUser = FirebaseAuth.getInstance().getCurrentUser();

        // Initialize fields
        proName = findViewById(R.id.proName);
        proAddres = findViewById(R.id.proAddres);
        proEmail = findViewById(R.id.proEmail);
        proNIC = findViewById(R.id.proNIC);
        proPhone = findViewById(R.id.proPhone);
        topic = findViewById(R.id.textView23);
        btnUpdate = findViewById(R.id.btnUpdate);

        btnUpdate.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){

                openUpdate();
            }
        });

        if (currentUser != null) {
            // Get user email
            String email = currentUser.getEmail();

            // Query Firestore to get user data based on email
            db.collection("mobile_users")
                    .whereEqualTo("email", email)
                    .get()
                    .addOnCompleteListener(task -> {
                        if (task.isSuccessful()) {
                            for (DocumentSnapshot document : task.getResult()) {
                                // Data exists, retrieve and set to TextViews
                                String name = document.getString("name");
                                String address = document.getString("address");
                                String nic = document.getString("nic");
                                String phone = document.getString("phone");

                                topic.setText(name);
                                proName.setText(name);
                                proAddres.setText(address);
                                proEmail.setText(email);
                                proNIC.setText(nic);
                                proPhone.setText(phone);
                            }
                        } else {
                            // Task failed with an exception
                            // Handle the failure
                            Exception exception = task.getException();
                            proName.setText("Error: " + exception.getMessage());
                        }
                    });
        }



    }


    public void openUpdate(){
        Intent intent = new Intent(this, UpdateProfile.class);
        startActivity(intent);
    }
}