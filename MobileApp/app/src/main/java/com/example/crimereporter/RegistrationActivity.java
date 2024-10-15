package com.example.crimereporter;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;

public class RegistrationActivity extends AppCompatActivity {

    private Button registration;
    private EditText nameEditText, nicEditText, addressEditText,
            phoneEditText, emailEditText, passwordEditText,
            confirmPasswordEditText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_registration);

        // Initialize EditText fields
        nameEditText = findViewById(R.id.editTextTextPersonName);
        nicEditText = findViewById(R.id.nic);
        addressEditText = findViewById(R.id.address);
        phoneEditText = findViewById(R.id.phone);
        emailEditText = findViewById(R.id.email);
        passwordEditText = findViewById(R.id.pass);
        confirmPasswordEditText = findViewById(R.id.confirm);

        registration = findViewById(R.id.button3);
        registration.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                registerUser();
            }
        });
    }

    private void registerUser() {
        String name = nameEditText.getText().toString().trim();
        String nic = nicEditText.getText().toString().trim();
        String address = addressEditText.getText().toString().trim();
        String phone = phoneEditText.getText().toString().trim();
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();
        String confirmPassword = confirmPasswordEditText.getText().toString().trim();

        // Check if any field is empty
        if (name.isEmpty() || nic.isEmpty() || address.isEmpty() || phone.isEmpty() ||
                email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
            Toast.makeText(RegistrationActivity.this, "All fields are mandatory",
                    Toast.LENGTH_SHORT).show();
            return;
        }

        // Validate email
        if (!isValidEmail(email)) {
            emailEditText.setError("Invalid email address");
            return;
        }

        // Validate phone number
        if (!isValidPhoneNumber(phone)) {
            phoneEditText.setError("Invalid phone number");
            return;
        }

        // Validate NIC number
        if (!isValidNIC(nic)) {
            nicEditText.setError("Invalid NIC number");
            return;
        }

        // Check if password and confirm password match
        if (!password.equals(confirmPassword)) {
            confirmPasswordEditText.setError("Passwords do not match");
            return;
        }

        // Proceed with user registration
        FirebaseAuth.getInstance().createUserWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // User registration successful
                            FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
                            if (user != null) {
                                // Add user information to Firestore
                                FirebaseFirestore db = FirebaseFirestore.getInstance();
                                String userId = user.getUid();

                                Map<String, Object> userMap = new HashMap<>();
                                userMap.put("name", name);
                                userMap.put("nic", nic);
                                userMap.put("address", address);
                                userMap.put("phone", phone);
                                userMap.put("email", email);

                                db.collection("mobile_users").document(userId).set(userMap)
                                        .addOnCompleteListener(new OnCompleteListener<Void>() {
                                            @Override
                                            public void onComplete(@NonNull Task<Void> task) {
                                                if (task.isSuccessful()) {
                                                    // User information added to Firestor
                                                    // Clear registration fields
                                                    clearFields();
                                                    Toast.makeText(RegistrationActivity.this, "Successfully Registered! ",
                                                            Toast.LENGTH_SHORT).show();

                                                } else {
                                                    Toast.makeText(RegistrationActivity.this, "Failed to add user information to Firestore: " +
                                                            task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                                                }
                                            }
                                        });
                            }
                        } else {
                            // Registration failed
                            Toast.makeText(RegistrationActivity.this, "Registration failed: "
                                    + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }

    // Email validation method
    private boolean isValidEmail(String email) {
        return android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches();
    }

    // Phone number validation method
    private boolean isValidPhoneNumber(String phone) {
        return phone.length() == 10 && phone.matches("[0-9]+");
    }

    // NIC number validation method
    private boolean isValidNIC(String nic) {
        return nic.matches("[0-9]{9}[VU]") || nic.matches("[0-9]{12}");
    }

    // Clear registration fields
    private void clearFields() {
        nameEditText.setText("");
        nicEditText.setText("");
        addressEditText.setText("");
        phoneEditText.setText("");
        emailEditText.setText("");
        passwordEditText.setText("");
        confirmPasswordEditText.setText("");
    }

    // Override onBackPressed to clear fields
    @Override
    public void onBackPressed() {
        clearFields();
        super.onBackPressed();
    }
}
