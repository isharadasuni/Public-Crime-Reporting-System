package com.example.crimereporter;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.squareup.picasso.Picasso;
import java.util.List;

public class NewsAdapter extends RecyclerView.Adapter<NewsAdapter.ViewHolder> {

    private List<NewsItem> newsList;
    private FirebaseStorage storage;


    // Constructor to initialize the adapter with a list of news items
    public NewsAdapter(List<NewsItem> newsList) {
        this.newsList = newsList;
        this.storage = FirebaseStorage.getInstance();
    }

    // This method is called when RecyclerView needs a new ViewHolder instance
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the layout for a single news item
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.news_item_layout, parent, false);
        // Create and return a new ViewHolder
        return new ViewHolder(view);
    }


    // This method is to display the data at the specified position
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        // Get the NewsItem object at the specified position
        NewsItem newsItem = newsList.get(position);

        // Set the title and content of the news item to the TextViews in the ViewHolder
        holder.titleTextView.setText(newsItem.getTitle());
        holder.contentTextView.setText(newsItem.getDescription());
        holder.Date.setText(newsItem.getCreateDate());
        holder.Department.setText(newsItem.getCreated_department());

// Load up to three images into ImageView using Picasso
        if (newsItem.getImageUploads() != null && !newsItem.getImageUploads().isEmpty()) {
            int numImagesToShow = Math.min(newsItem.getImageUploads().size(), 3); // Get the number of images to show (up to 3)
            for (int i = 0; i < numImagesToShow; i++) {
                String imageUrl = newsItem.getImageUploads().get(i); // Get the URL of the image at index i
                ImageView imageView = null;
                switch (i) {
                    case 0:
                        imageView = holder.imageView1;
                        break;
                    case 1:
                        imageView = holder.imageView2;
                        break;
                    case 2:
                        imageView = holder.imageView3;
                        break;
                }
                if (imageView != null) {
                    // Load image from URL into imageView
                    Picasso.get().load(imageUrl).into(imageView);
                    imageView.setVisibility(View.VISIBLE);
                }
            }
        } else {
            // If there are no images, hide all ImageViews
            holder.imageView1.setVisibility(View.GONE);
            holder.imageView2.setVisibility(View.GONE);
            holder.imageView3.setVisibility(View.GONE);
        }


        // Check if there is a video URL
        if (newsItem.getVideoUpload() != null && !newsItem.getVideoUpload().isEmpty()) {
            // If there's a video URL, show the VideoView
            holder.videoView.setVisibility(View.VISIBLE);
            // Load video from URL into VideoView
            holder.videoView.setVideoPath(newsItem.getVideoUpload());
            holder.videoView.start(); // Start playing the video
        } else {
            // If there's no video URL, hide the VideoView
            holder.videoView.setVisibility(View.GONE);
        }
    }

    // This method returns the total number of items in the data set held by the adapter
    @Override
    public int getItemCount() {
        return newsList.size();
    }

    // ViewHolder class to hold the views for each news item
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public TextView titleTextView;
        public TextView contentTextView;
        public TextView Date;

        public TextView Department;

        public ImageView imageView1;

        public ImageView imageView2;
        public ImageView imageView3;


        public VideoView videoView;


        // Constructor to initialize the views in the ViewHolder
        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.titleTextView);
            contentTextView = itemView.findViewById(R.id.contentTextView);
            Date = itemView.findViewById(R.id.newsDate);
            Department = itemView.findViewById(R.id.newsDepartment);
            imageView1 = itemView.findViewById(R.id.newsImageView1);
            imageView2 = itemView.findViewById(R.id.newsImageView2);
            imageView3 = itemView.findViewById(R.id.newsImageView3);
            videoView = itemView.findViewById(R.id.videoView);

        }
    }





    // Load bitmap image from Firebase Storage URL
    private void loadBitmapFromUrl(String imageUrl, final ImageView imageView) {
        StorageReference storageRef = storage.getReferenceFromUrl(imageUrl);
        final long ONE_MEGABYTE = 1024 * 1024;
        storageRef.getBytes(ONE_MEGABYTE).addOnSuccessListener(new OnSuccessListener<byte[]>() {
            @Override
            public void onSuccess(byte[] bytes) {
                Bitmap bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
                imageView.setImageBitmap(bitmap);
            }
        });
    }
}
