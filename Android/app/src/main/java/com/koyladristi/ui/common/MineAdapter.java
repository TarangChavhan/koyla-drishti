package com.koyladristi.ui.common;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.chip.Chip;
import com.koyladristi.R;
import com.koyladristi.data.local.CachedMine;

import java.util.ArrayList;
import java.util.List;

public class MineAdapter extends RecyclerView.Adapter<MineAdapter.MineViewHolder> {

    private List<CachedMine> mines = new ArrayList<>();

    public void setMines(List<CachedMine> mines) {
        this.mines = mines;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public MineViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_mine, parent, false);
        return new MineViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MineViewHolder holder, int position) {
        CachedMine mine = mines.get(position);
        holder.tvMineName.setText(mine.name);
        holder.tvMineLocation.setText(mine.location);
        holder.tvRiskScore.setText("Risk: " + mine.riskScore);
        holder.chipComplianceStatus.setText(mine.complianceStatus);
    }

    @Override
    public int getItemCount() {
        return mines.size();
    }

    static class MineViewHolder extends RecyclerView.ViewHolder {
        TextView tvMineName;
        TextView tvMineLocation;
        TextView tvRiskScore;
        Chip chipComplianceStatus;

        public MineViewHolder(@NonNull View itemView) {
            super(itemView);
            tvMineName = itemView.findViewById(R.id.tv_mine_name);
            tvMineLocation = itemView.findViewById(R.id.tv_mine_location);
            tvRiskScore = itemView.findViewById(R.id.tv_risk_score);
            chipComplianceStatus = itemView.findViewById(R.id.chip_compliance_status);
        }
    }
}
