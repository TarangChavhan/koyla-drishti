package com.koyladristi.data.local;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.annotation.NonNull;

@Entity(tableName = "cached_mines")
public class CachedMine {

    @PrimaryKey
    @NonNull
    public String id;

    public String name;
    public String location;
    public String authority;
    public int riskScore;
    public String complianceStatus;

    public CachedMine(@NonNull String id, String name, String location, String authority, int riskScore, String complianceStatus) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.authority = authority;
        this.riskScore = riskScore;
        this.complianceStatus = complianceStatus;
    }
}
