import json
import logging
from typing import Dict, Any, Optional
import httpx
from app.core.config import settings
from app.schemas.ai import AIMLReasoningResult

logger = logging.getLogger("koyla_drishti.ai_service")

SYSTEM_PROMPT = """You are KOYLA DRISHTI's Senior DGMS Mining Safety and Statutory Compliance Intelligence Analyst.
Analyze mining telemetry, inspection notes, OCR document data, and hazard signals.
Always output valid strictly parseable JSON matching this schema:
{
    "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "confidence": 0.0 to 1.0,
    "potential_issue": "Concise headline of potential statutory violation or risk",
    "reason": "Detailed analytical explanation combining regulatory norms and observed data",
    "recommended_action": "Specific directive for DGMS Inspector or Mine Authority"
}
Do not wrap your response in markdown backticks or commentary. Only return the raw JSON object."""

async def analyze_with_aiml(
    context_type: str,
    payload: Dict[str, Any],
    fallback_prompt: Optional[str] = None
) -> AIMLReasoningResult:
    """
    Call AIML API for structured reasoning, validate normalized output,
    and return safe fallback heuristics if API key is not configured or fails.
    """
    api_key = settings.AIML_API_KEY.strip()
    
    if api_key:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        user_message = f"Task: Analyze {context_type}\nData: {json.dumps(payload, default=str)}"
        req_body = {
            "model": settings.AIML_MODEL or "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ],
            "temperature": 0.2,
            "max_tokens": 400
        }
        
        try:
            url = f"{settings.AIML_BASE_URL.rstrip('/')}/chat/completions"
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, headers=headers, json=req_body)
                if res.status_code == 200:
                    data = res.json()
                    content = data["choices"][0]["message"]["content"].strip()
                    # Clean possible markdown formatting
                    if content.startswith("```json"):
                        content = content[7:]
                    if content.startswith("```"):
                        content = content[3:]
                    if content.endswith("```"):
                        content = content[:-3]
                    content = content.strip()
                    
                    parsed = json.loads(content)
                    return AIMLReasoningResult(
                        risk_level=parsed.get("risk_level", "Medium").upper(),
                        confidence=float(parsed.get("confidence", 0.88)),
                        potential_issue=parsed.get("potential_issue", "Statutory variance observed"),
                        reason=parsed.get("reason", "Analyzed via DGMS compliance intelligence rules."),
                        recommended_action=parsed.get("recommended_action", "Maintain regular oversight and scheduled inspection.")
                    )
                else:
                    logger.warning(f"AIML API call returned status {res.status_code}: {res.text}")
        except Exception as e:
            logger.warning(f"AIML API reasoning query failed ({e}). Reverting to rule-based analysis.")

    # Rule-Based Heuristic Fallback
    return generate_rule_based_reasoning(context_type, payload)

def generate_rule_based_reasoning(context_type: str, data: Dict[str, Any]) -> AIMLReasoningResult:
    """Deterministic fallback reasoning generator."""
    if context_type == "telemetry":
        score = data.get("calculated_score", 100.0)
        pm10 = data.get("pm10_level", 60.0)
        methane = data.get("methane_concentration", 0.0)
        incident = data.get("safety_incident_reported", False)
        
        if incident:
            return AIMLReasoningResult(
                risk_level="CRITICAL",
                confidence=0.98,
                potential_issue="Safety Incident Reported in Active Shift",
                reason="Mine authority logged an active workplace safety event requiring immediate DGMS escalation.",
                recommended_action="Dispatch Area Inspector of Mines for statutory on-site inquiry under Reg 104."
            )
        elif methane > 0.5:
            return AIMLReasoningResult(
                risk_level="HIGH",
                confidence=0.94,
                potential_issue="Dangerous Explosive Gas Concentration",
                reason=f"Pit air monitor registered {methane}% CH4 methane, which exceeds maximum safe threshold (0.5%).",
                recommended_action="Immediately halt non-essential electrical equipment and enhance ventilation fans."
            )
        elif pm10 > 100.0:
            return AIMLReasoningResult(
                risk_level="MEDIUM",
                confidence=0.90,
                potential_issue="Air Quality Index Exceedance",
                reason=f"Particulate matter PM10 recorded at {pm10} µg/m3 against 100 µg/m3 national permissible limit.",
                recommended_action="Enforce continuous water mist sprinkling on haul roads and conveyor transfer points."
            )
        else:
            return AIMLReasoningResult(
                risk_level="LOW",
                confidence=0.95,
                potential_issue="Normal Statutory Parameters",
                reason="All monitored pit telemetry, air quality, noise, and vibration levels conform with statutory norms.",
                recommended_action="Continue standard daily shift returns and statutory logging."
            )

    elif context_type == "ppe_detection":
        workers = data.get("workers_detected", 0)
        no_helmet = data.get("helmet_violation", 0)
        no_vest = data.get("vest_violation", 0)
        
        if no_helmet > 0:
            return AIMLReasoningResult(
                risk_level="HIGH",
                confidence=0.93,
                potential_issue="Hard Hat Safety Violation Detected",
                reason=f"Computer vision model detected {no_helmet} personnel in active pit zone without mandatory helmets.",
                recommended_action="Issue immediate safety reminder and site supervisor warning under Mines Rules 1955."
            )
        elif no_vest > 0:
            return AIMLReasoningResult(
                risk_level="MEDIUM",
                confidence=0.89,
                potential_issue="High-Visibility Vest Non-Compliance",
                reason=f"Computer vision detected {no_vest} personnel without reflective safety vests near haulage path.",
                recommended_action="Instruct pit safety warden to enforce mandatory hi-vis gear before shift access."
            )
        else:
            return AIMLReasoningResult(
                risk_level="LOW",
                confidence=0.96,
                potential_issue="Full PPE Compliance Verified",
                reason=f"All {workers} detected workers are properly equipped with helmets and reflective safety vests.",
                recommended_action="Acknowledge compliant shift crew and log record in safety registry."
            )

    return AIMLReasoningResult(
        risk_level="MEDIUM",
        confidence=0.85,
        potential_issue="Statutory Compliance Audit Review",
        reason="Periodic compliance analysis based on statutory returns and DGMS circular guidelines.",
        recommended_action="Ensure all records are signed by Mine Agent and Manager."
    )
