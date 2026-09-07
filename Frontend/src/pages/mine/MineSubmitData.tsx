import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { complianceService, TelemetrySubmissionResponse } from '../../services/complianceService';
import { FileUpload } from '../../components/common/FileUpload';
import { Send, CheckCircle2, Sliders, AlertTriangle, Sparkles } from 'lucide-react';

export const MineSubmitData: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [productionTonnage, setProductionTonnage] = useState('14,250');
  const [pm10Level, setPm10Level] = useState('68');
  const [ambientNoiseDb, setAmbientNoiseDb] = useState('72');
  const [methaneConcentration, setMethaneConcentration] = useState('0.18');
  const [blastVibrationMms, setBlastVibrationMms] = useState('3.4');
  const [waterDischargePh, setWaterDischargePh] = useState('7.2');
  const [safetyIncidentReported, setSafetyIncidentReported] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<TelemetrySubmissionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await complianceService.submitTelemetry({
        mine_id: user?.mineId || 'KD-104',
        production_tonnage: productionTonnage,
        pm10_level: parseFloat(pm10Level) || 0,
        ambient_noise_db: parseFloat(ambientNoiseDb) || 0,
        methane_concentration: parseFloat(methaneConcentration) || 0,
        blast_vibration_mms: parseFloat(blastVibrationMms) || 0,
        water_discharge_ph: parseFloat(waterDischargePh) || 7.0,
        safety_incident_reported: safetyIncidentReported,
        notes,
        attachment_filename: selectedFile || undefined
      });

      setSubmissionResult(response);
      showToast(
        `Statutory shift return submitted successfully! Evaluated Score: ${response.calculated_score.toFixed(1)}% (${response.risk_level} Risk)`,
        'success'
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to submit telemetry return to central repository.', 'warn');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Daily Statutory Telemetry & Environmental Reporting
        </h1>
        <p className="text-xs text-[#728594]">
          Submit daily shift parameters, continuous ambient air monitoring, vibration logs, and pit telemetry to DGMS.
        </p>
      </div>

      {submissionResult && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d2639] to-[#071827] text-white border border-[#38bca8]/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#f4be51]" />
              <strong className="text-sm font-bold text-white">DGMS Neural Analysis Evaluated: {submissionResult.id}</strong>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
              submissionResult.risk_level === 'Low'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : submissionResult.risk_level === 'Medium'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {submissionResult.risk_level} Risk
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#98b8cc] text-[10px] block">Statutory Score</span>
              <strong className="text-lg font-black text-white">{submissionResult.calculated_score.toFixed(1)}%</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#98b8cc] text-[10px] block">Extraction Volume</span>
              <strong className="text-lg font-black text-white">{productionTonnage} T</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#98b8cc] text-[10px] block">Status</span>
              <strong className="text-lg font-black text-[#f4be51]">{submissionResult.status}</strong>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <span className="text-[#98b8cc] text-[10px] block">Verified Timestamp</span>
              <strong className="text-xs font-semibold text-[#d4e4ed] block mt-1">{submissionResult.created_at}</strong>
            </div>
          </div>
          {submissionResult.ai_analysis_summary && (
            <div className="text-xs bg-white/5 p-3 rounded-xl border border-white/10 text-[#d6e7f2]">
              <span className="font-bold text-[#f4be51] block mb-0.5">AI Risk Findings & Directives:</span>
              <p className="leading-relaxed">{submissionResult.ai_analysis_summary}</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#e2e9ee] rounded-2xl p-6 shadow-sm space-y-6 text-xs">
        {/* Production & Atmospheric */}
        <div>
          <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider mb-3">
            Production & Air Quality Readings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#516777] mb-1">Daily Coal Extraction (Tonnes)</label>
              <input
                type="text"
                required
                value={productionTonnage}
                onChange={(e) => setProductionTonnage(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Average PM10 Level (µg/m³)</label>
              <input
                type="number"
                step="0.1"
                required
                value={pm10Level}
                onChange={(e) => setPm10Level(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Ambient Noise Level (dB)</label>
              <input
                type="number"
                step="0.1"
                required
                value={ambientNoiseDb}
                onChange={(e) => setAmbientNoiseDb(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>
          </div>
        </div>

        {/* Gas & Geotechnical */}
        <div>
          <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider mb-3">
            Mine Gas & Blast Geotechnical Monitoring
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#516777] mb-1">Max Methane CH4 Conc (%)</label>
              <input
                type="number"
                step="0.01"
                required
                value={methaneConcentration}
                onChange={(e) => setMethaneConcentration(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Peak Particle Velocity PPV (mm/s)</label>
              <input
                type="number"
                step="0.1"
                required
                value={blastVibrationMms}
                onChange={(e) => setBlastVibrationMms(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Effluent Discharge pH</label>
              <input
                type="number"
                step="0.1"
                required
                value={waterDischargePh}
                onChange={(e) => setWaterDischargePh(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>
          </div>
        </div>

        {/* Safety checkbox */}
        <div className="p-3 bg-slate-50 border border-[#e2e9ee] rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={safetyIncidentReported}
              onChange={(e) => setSafetyIncidentReported(e.target.checked)}
              className="w-4 h-4 rounded text-[#df4d52] focus:ring-0"
            />
            <span className="font-bold text-[#152737]">
              Flag any Lost Time Injury (LTI), rockfall, or machinery stoppage during this shift
            </span>
          </label>
        </div>

        <div>
          <label className="block font-bold text-[#516777] mb-1">Shift In-charge Operational Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record mist cannon operations, slope monitoring prism checks, or emergency drill observations..."
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
          />
        </div>

        <div>
          <FileUpload
            label="Attach Telemetry Sensor CSV Export or Calibration Sheets"
            helperText="CSV, PDF, XLSX up to 10 MB"
            onFileSelect={(file) => {
              setSelectedFile(file.name);
              showToast(`Sensor telemetry file ${file.name} attached`, 'info');
            }}
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-[#e2e9ee]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Evaluating Telemetry with DGMS AI...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Shift Return to Central Repository
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
