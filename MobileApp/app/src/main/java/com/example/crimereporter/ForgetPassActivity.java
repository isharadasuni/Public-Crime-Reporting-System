package com.example.crimereporter;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class ForgetPassActivity extends AppCompatActivity {

    private EditText forgetEmail;
    private Button btnSendNew;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forget_pass);

        forgetEmail = findViewById(R.id.forgetEmail);
        btnSendNew = findViewById(R.id.btnSendNew);


        btnSendNew.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = forgetEmail.getText().toString().trim();
                if (!email.isEmpty()) {
                    sendForgetPasswordEmail(email);
                } else {
                    Toast.makeText(ForgetPassActivity.this, "Please enter your email address",
                            Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

// using firebase authontication
    private void sendForgetPasswordEmail(String email) {
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();

        if (currentUser != null && currentUser.getEmail().equals(email)) {
            FirebaseAuth.getInstance().sendPasswordResetEmail(email)
                    .addOnCompleteListener(new OnCompleteListener<Void>() {
                        @Override
                        public void onComplete(@NonNull Task<Void> task) {
                            if (task.isSuccessful()) {
                                Toast.makeText(ForgetPassActivity.this, "Reset email sent successfully",
                                        Toast.LENGTH_SHORT).show();
                            } else {
                                Toast.makeText(ForgetPassActivity.this, "Failed to send reset email: "
                                        + task.getException().getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
        } else {
            Toast.makeText(ForgetPassActivity.this, "Please enter your current email address",
                    Toast.LENGTH_SHORT).show();
        }

    }
}