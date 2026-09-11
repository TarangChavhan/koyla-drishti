package com.koyladristi.ui.inspector;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import com.koyladristi.R;
import com.koyladristi.ui.common.CameraActivity;

public class InspectorDashboardActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_inspector_dashboard);
        
        Button btnStartInspection = findViewById(R.id.btn_start_inspection);
        btnStartInspection.setOnClickListener(v -> {
            startActivity(new Intent(this, CameraActivity.class));
        });
    }
}
