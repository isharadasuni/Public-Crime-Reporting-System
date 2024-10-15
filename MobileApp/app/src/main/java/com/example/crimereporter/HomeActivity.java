package com.example.crimereporter;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;

import androidx.appcompat.app.AppCompatActivity;
import com.google.firebase.auth.FirebaseAuth;

public class HomeActivity extends AppCompatActivity {


    private ImageView report, News,Profile,Location,history, Feedback,fire;
    private FirebaseAuth mAuth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        // Initialize buttons
        report = findViewById(R.id.button6);
        News = findViewById(R.id.newsBtn);
        Location = findViewById(R.id.policeLocation);
        Feedback = findViewById(R.id.button12);
        Profile = findViewById(R.id.profile);
        fire = findViewById(R.id.button11);
//        history = findViewById(R.id.history);

        // Set click listeners
        report.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                openReport();
            }
        });

        News.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){

                openNews();
            }
        });
        Location.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){

                openLocation();
            }
        });
        Feedback.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){

                openFeedBack();
            }
        });
        Profile.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){

                openProfile();
            }
        });

//        history.setOnClickListener(new View.OnClickListener(){
//            public void onClick(View v){
//
//                openHistory();
//            }
//        });


        fire.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                // Set OnClickListener for dial button
                dialNumber("110");
            }
        });

    }
    // Method to dial a number
    private void dialNumber(String phoneNumber) {
        Intent intent = new Intent(Intent.ACTION_DIAL);
        intent.setData(Uri.parse("tel:" + phoneNumber));
        startActivity(intent);
    }
    public void openProfile(){
        Intent intent = new Intent(this, ProfileActivity.class);
        startActivity(intent);
    }


//    public void openHistory(){
//        Intent intent = new Intent(this, History.class);
//        startActivity(intent);
//    }
    public void openReport(){
        Intent intent = new Intent(this,CrimeReport.class);
        startActivity(intent);
    }
    public void openNews(){
        Intent intent = new Intent(this,NewsActivity.class);
        startActivity(intent);
    }
    public void openLocation(){
        Intent intent = new Intent(this, EmergencyClActivity.class);
        startActivity(intent);
    }
    public void openFeedBack(){
        Intent intent = new Intent(this, FeedBackActivity.class);
        startActivity(intent);
    }
}