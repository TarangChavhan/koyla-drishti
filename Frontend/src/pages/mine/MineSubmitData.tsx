import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { FileUpload } from '../../components/common/FileUpload';
import { Send, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react';

export const MineSubmitData: React.FC = () => {
  const { showToast } = useToast();
  const [productionTonnage, setProductionTonnage] = useState('14,250');
  const [pm10Level, setPm10Level] = useState('68');
  const [ambientNoiseDb, setAmbientNoiseDb] = useState('72');
  const [methaneConcentration, setMethaneConcentration] = useState('0.18');
  const [blastVibrationMms, setBlastVibrationMms] = useState('3.4');
  const [waterDischargePh, setWaterDischargePh] = useState('7.2');
  const [safetyIncidentReported, setSafetyIncidentReported] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Daily statutory telemetry and production parameters submitted to Ministry of Coal', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Daily Statutory Telemetry & Environmental Reporting
        </h1>
        <p className="text-xs text-[#728594]">
          Submit daily shift parameters, continuous ambient air monitoring, vibration logs, and pit telemetry.
        </p>
      </div>

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
                type="text"
                required
                value={pm10Level}
                onChange={(e) => setPm10Level(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Ambient Noise Level (dB)</label>
              <input
                type="text"
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
                type="text"
                required
                value={methaneConcentration}
                onChange={(e) => setMethaneConcentration(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Peak Particle Velocity PPV (mm/s)</label>
              <input
                type="text"
                required
                value={blastVibrationMms}
                onChange={(e) => setBlastVibrationMms(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Effluent Discharge pH</label>
              <input
                type="text"
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
            onFileSelect={() => showToast('Sensor telemetry file attached', 'info')}
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-[#e2e9ee]">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white shadow-md flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-4 h-4" />
            Submit Shift Return to Central Repository
          </button>
        </div>
      </form>
    </div>
  );
};
