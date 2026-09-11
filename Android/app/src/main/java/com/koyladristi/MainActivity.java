package com.koyladristi;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

import com.koyladristi.ui.auth.LoginActivity;
import com.koyladristi.ui.admin.AdminDashboardActivity;
import com.koyladristi.ui.inspector.InspectorDashboardActivity;
import com.koyladristi.ui.mineauthority.MineAuthorityDashboardActivity;
import com.koyladristi.utils.TokenManager;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        TokenManager tokenManager = new TokenManager(this);

        if (tokenManager.isLoggedIn()) {
            String role = tokenManager.getRole();
            if ("ADMIN".equalsIgnoreCase(role)) {
                startActivity(new Intent(this, AdminDashboardActivity.class));
            } else if ("INSPECTOR".equalsIgnoreCase(role)) {
                startActivity(new Intent(this, InspectorDashboardActivity.class));
            } else if ("MINE_AUTHORITY".equalsIgnoreCase(role)) {
                startActivity(new Intent(this, MineAuthorityDashboardActivity.class));
            } else {
                startActivity(new Intent(this, LoginActivity.class));
            }
        } else {
            startActivity(new Intent(this, LoginActivity.class));
        }
        finish();
    }
}
