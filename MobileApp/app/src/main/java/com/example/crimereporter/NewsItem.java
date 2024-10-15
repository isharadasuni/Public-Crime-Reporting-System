package com.example.crimereporter;


import java.util.List;

public class NewsItem {

        private String title;
        private String description;
        private String createDate;

        private String Created_department;

        // References to images and videos
        private List<String> imageUploads;
        private String videoUpload;

        public NewsItem() {
            // Default constructor required for Firestore
        }

        public NewsItem(String title, String description,String createDate,  String Created_department,List<String> imageUploads, String videoUpload ) {
            this.title = title;
            this.description = description;
            this.createDate=createDate;
            this.Created_department = Created_department;
            this.imageUploads = imageUploads;
            this.videoUpload = videoUpload;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }



        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCreateDate(){
            return createDate;
        }

        public void setCreateDate(){
            this.createDate = createDate;
        }

        public String getCreated_department() {
            return Created_department;
        }

        public void setCreated_department(String Created_department) {
            this.Created_department = Created_department;
        }



    public List<String> getImageUploads() {
        return imageUploads;
    }

    public void setImageUploads(List<String> imageUploads) {
        this.imageUploads = imageUploads;
    }

    public String getVideoUpload() {
        return videoUpload;
    }

    public void setVideoUpload(String videoUpload) {
        this.videoUpload = videoUpload;
    }



    }
