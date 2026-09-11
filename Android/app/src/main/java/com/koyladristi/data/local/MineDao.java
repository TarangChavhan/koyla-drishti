package com.koyladristi.data.local;

import androidx.lifecycle.LiveData;
import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;

@Dao
public interface MineDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertAll(List<CachedMine> mines);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(CachedMine mine);

    @Query("SELECT * FROM cached_mines")
    LiveData<List<CachedMine>> getAllMines();

    @Query("SELECT * FROM cached_mines WHERE id = :mineId LIMIT 1")
    LiveData<CachedMine> getMineById(String mineId);

    @Query("DELETE FROM cached_mines")
    void deleteAll();
}
