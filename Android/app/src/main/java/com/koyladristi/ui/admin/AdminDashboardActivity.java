package com.koyladristi.ui.admin;

import android.os.Bundle;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.koyladristi.R;
import com.koyladristi.data.api.ApiClient;
import com.koyladristi.data.api.ApiService;
import com.koyladristi.data.local.CachedMine;
import com.koyladristi.ui.common.MineAdapter;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AdminDashboardActivity extends AppCompatActivity {

    private RecyclerView rvAdminDashboard;
    private MineAdapter mineAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_dashboard);

        rvAdminDashboard = findViewById(R.id.rv_admin_dashboard);
        rvAdminDashboard.setLayoutManager(new LinearLayoutManager(this));
        mineAdapter = new MineAdapter();
        rvAdminDashboard.setAdapter(mineAdapter);

        fetchMinesFromBackend();
    }

    private void fetchMinesFromBackend() {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        
        apiService.getMines().enqueue(new Callback<JsonObject>() {
            @Override
            public void onResponse(Call<JsonObject> call, Response<JsonObject> response) {
                if (response.isSuccessful() && response.body() != null) {
                    JsonObject body = response.body();
                    if (body.has("success") && body.get("success").getAsBoolean() && body.has("data")) {
                        JsonArray minesArray = body.getAsJsonArray("data");
                        List<CachedMine> mineList = new ArrayList<>();
                        
                        for (JsonElement element : minesArray) {
                            JsonObject mineObj = element.getAsJsonObject();
                            String id = mineObj.has("id") ? mineObj.get("id").getAsString() : "";
                            String name = mineObj.has("name") ? mineObj.get("name").getAsString() : "Unknown";
                            String location = mineObj.has("location") ? mineObj.get("location").getAsString() : "Unknown";
                            String authority = mineObj.has("authority") ? mineObj.get("authority").getAsString() : "Unknown";
                            int riskScore = mineObj.has("riskScore") ? mineObj.get("riskScore").getAsInt() : 0;
                            String status = mineObj.has("complianceStatus") ? mineObj.get("complianceStatus").getAsString() : "UNKNOWN";
                            
                            mineList.add(new CachedMine(id, name, location, authority, riskScore, status));
                        }
                        
                        mineAdapter.setMines(mineList);
                        // TODO: Also save to Room DB for offline mode
                    }
                } else {
                    Toast.makeText(AdminDashboardActivity.this, "Failed to load mines", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<JsonObject> call, Throwable t) {
                Toast.makeText(AdminDashboardActivity.this, "Network error fetching mines", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
