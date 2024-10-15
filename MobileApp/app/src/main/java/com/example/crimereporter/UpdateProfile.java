package com.example.crimereporter;

import static androidx.constraintlayout.helper.widget.MotionEffect.TAG;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.EmailAuthProvider;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.HashMap;
import java.util.Map;

public class UpdateProfile extends AppCompatActivity {

    private EditText proNameUpdate,proAddresUpdate,proPhone,currentPass,newPassword,reNewPassword;

    private Button btnSubmit,btnReset;
    private FirebaseUser currentUser;

    private FirebaseFirestore db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_profile);

        // Initialize Firestore
        db = FirebaseFirestore.getInstance();
        currentUser = FirebaseAuth.getInstance().getCurrentUser();

        // Get references to EditText fields and Button
        proNameUpdate = findViewById(R.id.proNameUpdate);
        proAddresUpdate = findViewById(R.id.proAddresUpdate);
        proPhone = findViewById(R.id.proPhone);
        currentPass = findViewById(R.id.currentPass);
        newPassword = findViewById(R.id.newPassword);
        reNewPassword = findViewById(R.id.reNewPassword);
        btnSubmit = findViewById(R.id.btnSubmit1);
        btnReset = findViewById(R.id.btnSubmit2);


        // Set OnClickListener for the submit button
        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Get the text from EditText fields
                String newName = proNameUpdate.getText().toString();
                String newAddress = proAddresUpdate.getText().toString();
                String newPhone = proPhone.getText().toString();

                // Update Firestore document
                updateFirestoreDocument(newName, newAddress, newPhone);
            }
        });


        // Set OnClickListener for the reset button
        btnReset.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                resetPassword();
            }
        });
    }


    private void resetPassword() {
        String currentPassword = currentPass.getText().toString();
        String newPasswordValue = newPassword.getText().toString();
        String reEnteredPassword = reNewPassword.getText().toString();

        // Check if fields are empty
        if (TextUtils.isEmpty(currentPassword) || TextUtils.isEmpty(newPasswordValue) || TextUtils.isEmpty(reEnteredPassword)) {
            Toast.makeText(UpdateProfile.this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        // Check if new password matches re-entered password
        if (!newPasswordValue.equals(reEnteredPassword)) {
            Toast.makeText(UpdateProfile.this, "New password does not match the re-entered password", Toast.LENGTH_SHORT).show();
            return;
        }

        // Re-authenticate user
        if (currentUser != null) {
            // Get current user's email
            String email = currentUser.getEmail();

            if (email != null) {
                AuthCredential credential = EmailAuthProvider.getCredential(email, currentPassword);
                currentUser.reauthenticate(credential)
                        .addOnSuccessListener(new OnSuccessListener<Void>() {
                            @Override
                            public void onSuccess(Void aVoid) {
                                // Password re-authenticated, now update the password
                                currentUser.updatePassword(newPasswordValue)
                                        .addOnSuccessListener(new OnSuccessListener<Void>() {
                                            @Override
                                            public void onSuccess(Void aVoid) {
                                                Toast.makeText(UpdateProfile.this, "Password updated successfully",
                                                        Toast.LENGTH_SHORT).show();
                                            }
                                        })
                                        .addOnFailureListener(new OnFailureListener() {
                                            @Override
                                            public void onFailure(@NonNull Exception e) {
                                                Toast.makeText(UpdateProfile.this, "Error updating password: "
                                                        + e.getMessage(), Toast.LENGTH_SHORT).show();
                                            }
                                        });
                            }
                        })
                        .addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Toast.makeText(UpdateProfile.this, "Error re-authenticating user: "
                                        + e.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        });
            }
        }
    }

  //update data on firestore
    private void updateFirestoreDocument(String newName, String newAddress, String newPhone) {
        if (currentUser != null) {
            String email = currentUser.getEmail();
            if (email != null && !email.isEmpty()) {
                db.collection("mobile_users")
                        .whereEqualTo("email", email)
                        .get()
                        .addOnSuccessListener(new OnSuccessListener<QuerySnapshot>() {
                            @Override
                            public void onSuccess(QuerySnapshot queryDocumentSnapshots) {
                                if (!queryDocumentSnapshots.isEmpty()) {
                                    DocumentSnapshot document = queryDocumentSnapshots.getDocuments().get(0);
                                    String documentId = document.getId();

                                    Map<String, Object> updates = new HashMap<>();
                                    if (newName != null && !newName.isEmpty()) {
                                        updates.put("name", newName);
                                    }
                                    if (newAddress != null && !newAddress.isEmpty()) {
                                        updates.put("address", newAddress);
                                    }
                                    if (newPhone != null && !newPhone.isEmpty()) {
                                        updates.put("phone", newPhone);
                                    }

                                    if (!updates.isEmpty()) {
                                        db.collection("mobile_users").document(documentId)
                                                .update(updates)
                                                .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                    @Override
                                                    public void onSuccess(Void aVoid) {
                                                        Toast.makeText(UpdateProfile.this, "Profile updated successfully",
                                                                Toast.LENGTH_SHORT).show();
                                                    }
                                                })
                                                .addOnFailureListener(new OnFailureListener() {
                                                    @Override
                                                    public void onFailure(@NonNull Exception e) {
                                                        Toast.makeText(UpdateProfile.this, "Error updating profile: "
                                                                + e.getMessage(), Toast.LENGTH_SHORT).show();
                                                        Log.e(TAG, "Error updating profile", e);
                                                    }
                                                });
                                    } else {
                                        Toast.makeText(UpdateProfile.this, "No changes to update", Toast.LENGTH_SHORT).show();
                                    }
                                } else {
                                    Toast.makeText(UpdateProfile.this, "User document does not exist", Toast.LENGTH_SHORT).show();
                                }
                            }
                        })
                        .addOnFailureListener(new OnFailureListener() {
                            @Override
                            public void onFailure(@NonNull Exception e) {
                                Toast.makeText(UpdateProfile.this, "Error querying document: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                                Log.e(TAG, "Error querying document", e);
                            }
                        });
            } else {
                Toast.makeText(UpdateProfile.this, "User email is not available", Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(UpdateProfile.this, "User is not authenticated", Toast.LENGTH_SHORT).show();
        }
    }
}