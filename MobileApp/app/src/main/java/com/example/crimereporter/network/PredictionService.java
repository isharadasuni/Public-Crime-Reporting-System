package com.example.crimereporter.network;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface PredictionService {
    @POST("/predict")
    Call<PredictionResponse> predict(@Body PredictionRequest request);



}