package com.koyladristi.data.api;

import com.google.gson.JsonObject;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import retrofit2.http.Multipart;
import retrofit2.http.Part;

public interface ApiService {

    // Authentication
    @POST("auth/login")
    Call<JsonObject> login(@Body JsonObject loginRequest);

    @GET("auth/me")
    Call<JsonObject> getProfile();

    // Mines
    @GET("mines")
    Call<JsonObject> getMines();

    @GET("mines/{id}")
    Call<JsonObject> getMineById(@Path("id") String mineId);

    // AI Alerts
    @GET("ai/alerts")
    Call<JsonObject> getAiAlerts();

    @PATCH("ai/alerts/{id}/verify")
    Call<JsonObject> verifyAiAlert(@Path("id") String alertId, @Body JsonObject verificationData);

    @PATCH("ai/alerts/{id}/reject")
    Call<JsonObject> rejectAiAlert(@Path("id") String alertId, @Body JsonObject rejectionData);

    // Evidence / Document Upload
    @Multipart
    @POST("documents/upload")
    Call<JsonObject> uploadDocument(
        @Part("description") RequestBody description,
        @Part MultipartBody.Part file
    );
    
    // Inspections
    @POST("inspections")
    Call<JsonObject> submitInspection(@Body JsonObject inspectionData);
}
