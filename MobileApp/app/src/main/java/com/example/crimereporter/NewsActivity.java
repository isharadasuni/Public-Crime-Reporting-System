package com.example.crimereporter;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.firestore.CollectionReference;
import com.google.firebase.firestore.DocumentChange;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.QuerySnapshot;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.RemoteMessage;

import java.util.ArrayList;
import java.util.List;

public class NewsActivity extends AppCompatActivity {

    private static final String TAG = "NewsActivity";



    private RecyclerView newsRecyclerView;
    private List<NewsItem> newsList;
    private NewsAdapter newsAdapter;
    private FirebaseFirestore firestore;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_news);
		
		// Initialize RecyclerView and related components
        newsRecyclerView = findViewById(R.id.recyclerView);
        newsList = new ArrayList<>();
        newsAdapter = new NewsAdapter(newsList);
		
		// Set up RecyclerView with a LinearLayoutManager and the adapter
        RecyclerView.LayoutManager layoutManager = new LinearLayoutManager(this);
        newsRecyclerView.setLayoutManager(layoutManager);
        newsRecyclerView.setAdapter(newsAdapter);

        firestore = FirebaseFirestore.getInstance();
		// Call the method to load news data
        loadNewsData();
    }


	// Method to load news data from Firestore
    private void loadNewsData() {
		 // Reference to the "news" collection in Firestore
        CollectionReference newsRef = firestore.collection("news");

		// Add a snapshot listener to listen for changes in the "news" collection
        newsRef.addSnapshotListener(new EventListener<QuerySnapshot>() {
            @Override
            public void onEvent(@NonNull QuerySnapshot queryDocumentSnapshots, @NonNull FirebaseFirestoreException e) {
                if (e != null) {
                    Log.w(TAG, "Listen failed.", e);
                    return;
                }
				// Iterate through all the changes in the document snapshot
                for (DocumentChange dc : queryDocumentSnapshots.getDocumentChanges()) {
                    switch (dc.getType()) {
                        case ADDED:
                            NewsItem newsItem = dc.getDocument().toObject(NewsItem.class);
                            newsList.add(newsItem);
                            newsAdapter.notifyDataSetChanged();
                            break;
                        case MODIFIED:
                            // Handle modified document
                            break;
                        case REMOVED:
                            // Handle removed document
                            break;
                    }
                }
            }
        });
    }
}


