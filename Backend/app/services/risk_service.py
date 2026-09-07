from typing import Dict, Any, Tuple

# Statutory Standard Thresholds (DGMS / CPCB Guidelines)
THRESHOLDS = {
    "PM10_MAX": 100.0,            # µg/m³ 24h standard
    "NOISE_MAX_DB": 85.0,         # dB shift exposure limit
    "METHANE_ALERT_PCT": 0.50,    # % volume explosive limit threshold
    "BLAST_VIBRATION_MAX": 5.0,   # mm/s PPV domestic structure safety
    "PPE_COMPLIANCE_MIN_PCT": 95.0, # Minimum percentage of workers with full PPE
    "INSPECTION_INTERVAL_DAYS": 30 # Statutory inspection interval
}

def evaluate_telemetry_compliance(
    pm10: float,
    noise_db: float,
    methane: float,
    vibration: float,
    water_ph: float,
    safety_incident: bool
) -> Tuple[float, str, str]:
    """
    Deterministic rule-based calculation for statutory telemetry.
    Returns: (calculated_score: float, risk_level: str, status: str)
    """
    score = 100.0
    penalties = []

    # 1. Safety Incident penalty
    if safety_incident:
        score -= 40.0
        penalties.append("Major Safety Incident Reported (-40%)")

    # 2. Particulate Matter PM10
    if pm10 > 150.0:
        score -= 25.0
        penalties.append(f"Critical PM10 particulate level {pm10} µg/m3 (-25%)")
    elif pm10 > THRESHOLDS["PM10_MAX"]:
        score -= 12.0
        penalties.append(f"Elevated PM10 dust level {pm10} µg/m3 (-12%)")

    # 3. Methane Concentration
    if methane > 0.8:
        score -= 30.0
        penalties.append(f"Dangerous methane level {methane}% (-30%)")
    elif methane > THRESHOLDS["METHANE_ALERT_PCT"]:
        score -= 15.0
        penalties.append(f"Elevated pit methane {methane}% (-15%)")

    # 4. Blast Vibration
    if vibration > 8.0:
        score -= 20.0
        penalties.append(f"Severe blast vibration {vibration} mm/s (-20%)")
    elif vibration > THRESHOLDS["BLAST_VIBRATION_MAX"]:
        score -= 10.0
        penalties.append(f"Blast vibration {vibration} mm/s exceeded standard (-10%)")

    # 5. Ambient Noise
    if noise_db > 95.0:
        score -= 15.0
        penalties.append(f"Excessive noise {noise_db} dB (-15%)")
    elif noise_db > THRESHOLDS["NOISE_MAX_DB"]:
        score -= 8.0
        penalties.append(f"Noise level {noise_db} dB exceeded 85 dB threshold (-8%)")

    # 6. Effluent pH
    if water_ph < 6.0 or water_ph > 9.0:
        score -= 10.0
        penalties.append(f"Pit water pH {water_ph} out of statutory range (6.5-8.5) (-10%)")

    final_score = max(0.0, min(100.0, score))

    # Derive Risk Level and Status
    if final_score >= 85.0:
        risk_level = "Low"
        status = "Compliant"
    elif final_score >= 70.0:
        risk_level = "Medium"
        status = "Under Review"
    elif final_score >= 50.0:
        risk_level = "High"
        status = "Non-Compliant"
    else:
        risk_level = "Critical"
        status = "Non-Compliant"

    return final_score, risk_level, status

def calculate_mine_composite_risk(
    compliance_score: float,
    active_violations: int,
    recent_alerts_count: int,
    has_critical_violation: bool = False
) -> str:
    """
    Explainable multi-factor risk categorization:
    Combines compliance score, violation backlog, and AI signals.
    """
    if has_critical_violation or compliance_score < 50.0 or active_violations >= 5:
        return "Critical"
    elif compliance_score < 75.0 or active_violations >= 3 or recent_alerts_count >= 3:
        return "High"
    elif compliance_score < 88.0 or active_violations >= 1:
        return "Medium"
    else:
        return "Low"

def evaluate_ppe_risk(workers: int, helmet_viol: int, vest_viol: int) -> Tuple[str, float]:
    """Calculate PPE risk category and compliance percentage."""
    if workers == 0:
        return "Low", 100.0
    
    total_violations = helmet_viol + vest_viol
    compliance_pct = max(0.0, 100.0 - ((total_violations / (workers * 2)) * 100.0))
    
    if helmet_viol >= 3 or compliance_pct < 60.0:
        risk = "Critical"
    elif helmet_viol >= 1 or vest_viol >= 2 or compliance_pct < 85.0:
        risk = "High"
    elif vest_viol >= 1 or compliance_pct < 95.0:
        risk = "Medium"
    else:
        risk = "Low"
        
    return risk, compliance_pct
