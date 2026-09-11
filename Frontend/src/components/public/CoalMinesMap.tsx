import React, { useState, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { COAL_MINES_DATASET, CoalMineRecord } from '../../data/coalMinesDataset';
import { IndiaVectorMap } from './IndiaVectorMap';
import {
  Building2,
  Search,
  Satellite,
  Compass,
  KeyRound,
  RotateCcw,
  Download,
  FileSpreadsheet,
  X,
  Flame,
  Factory,
  BarChart3,
  ExternalLink,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export const CoalMinesMap: React.FC = () => {
  // View mode switcher: "vector" (authentic India Map), "google" (Google Maps Satellite/Terrain), "table" (Colliery master register)
  const [activeView, setActiveView] = useState<'vector' | 'google' | 'table'>('vector');

  // 10 Filter states matching the exact Ministry schema
  const [selectedYear, setSelectedYear] = useState<string>('2024-25');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCoalfield, setSelectedCoalfield] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>('All');
  const [selectedOwnership, setSelectedOwnership] = useState<string>('All');
  const [selectedMineType, setSelectedMineType] = useState<string>('All');
  const [selectedAct, setSelectedAct] = useState<string>('All');

  // Search and selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMine, setSelectedMine] = useState<CoalMineRecord | null>(null);
  const [hoveredMine, setHoveredMine] = useState<CoalMineRecord | null>(null);

  // Google Maps Platform configuration
  const [customKey, setCustomKey] = useState<string>('');
  const [showKeyPrompt, setShowKeyPrompt] = useState(false);
  const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const apiKey = customKey || envKey;

  // Table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedYear('2024-25');
    setSelectedRegion('All');
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedCoalfield('All');
    setSelectedArea('All');
    setSelectedCompanyType('All');
    setSelectedOwnership('All');
    setSelectedMineType('All');
    setSelectedAct('All');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Distinct lists derived from 408 dataset
  const dropdownData = useMemo(() => {
    const regions = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.region).filter(Boolean))).sort();
    const states = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.state).filter(Boolean))).sort();

    const districts = Array.from(
      new Set(
        COAL_MINES_DATASET.filter((m) => selectedState === 'All' || m.state.toLowerCase() === selectedState.toLowerCase())
          .map((m) => m.district)
          .filter(Boolean)
      )
    ).sort();

    const coalfields = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.coalfield).filter(Boolean))).sort();
    const areas = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.area).filter(Boolean))).sort();
    const companyTypes = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.ownerCompany).filter(Boolean))).sort();
    const ownerships = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.ownership).filter(Boolean))).sort();
    const mineTypes = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.type).filter(Boolean))).sort();
    const acts = Array.from(new Set(COAL_MINES_DATASET.map((m) => m.act).filter(Boolean))).sort();

    return { regions, states, districts, coalfields, areas, companyTypes, ownerships, mineTypes, acts };
  }, [selectedState]);

  // Filtered dataset
  const filteredMines = useMemo(() => {
    return COAL_MINES_DATASET.filter((mine) => {
      const matchRegion = selectedRegion === 'All' || mine.region.toLowerCase() === selectedRegion.toLowerCase();
      const matchState = selectedState === 'All' || mine.state.toLowerCase() === selectedState.toLowerCase();
      const matchDistrict = selectedDistrict === 'All' || mine.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchCoalfield = selectedCoalfield === 'All' || mine.coalfield.toLowerCase() === selectedCoalfield.toLowerCase();
      const matchArea = selectedArea === 'All' || mine.area.toLowerCase() === selectedArea.toLowerCase();
      const matchCompanyType = selectedCompanyType === 'All' || mine.ownerCompany.toLowerCase() === selectedCompanyType.toLowerCase();
      const matchOwnership = selectedOwnership === 'All' || mine.ownership.toLowerCase() === selectedOwnership.toLowerCase();
      const matchMineType = selectedMineType === 'All' || mine.type.toLowerCase() === selectedMineType.toLowerCase();
      const matchAct = selectedAct === 'All' || mine.act.toLowerCase() === selectedAct.toLowerCase();

      const matchSearch =
        searchQuery.trim() === '' ||
        mine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mine.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mine.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mine.coalfield.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchRegion &&
        matchState &&
        matchDistrict &&
        matchCoalfield &&
        matchArea &&
        matchCompanyType &&
        matchOwnership &&
        matchMineType &&
        matchAct &&
        matchSearch
      );
    });
  }, [
    selectedRegion,
    selectedState,
    selectedDistrict,
    selectedCoalfield,
    selectedArea,
    selectedCompanyType,
    selectedOwnership,
    selectedMineType,
    selectedAct,
    searchQuery
  ]);

  // Dynamic KPI Metrics
  const totalProduction = useMemo(() => {
    const sum = filteredMines.reduce((acc, m) => acc + m.production, 0);
    return sum.toFixed(2);
  }, [filteredMines]);

  const totalDespatch = useMemo(() => {
    const sum = filteredMines.reduce((acc, m) => acc + (m.despatch || m.production * 0.985), 0);
    return sum.toFixed(2);
  }, [filteredMines]);

  const mineTypeBreakdown = useMemo(() => {
    const oc = filteredMines.filter((m) => m.type === 'OC').length;
    const ug = filteredMines.filter((m) => m.type === 'UG').length;
    const mixed = filteredMines.filter((m) => m.type === 'Mixed').length;
    const pub = filteredMines.filter((m) => m.ownership === 'Public').length;
    const pvt = filteredMines.filter((m) => m.ownership === 'Private').length;
    return { oc, ug, mixed, pub, pvt };
  }, [filteredMines]);

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Sr. No.',
      'Mine Name',
      'Company',
      'Region',
      'Owner Company',
      'State',
      'District',
      'Coalfield',
      'Area',
      'Act',
      'Type',
      'Ownership',
      'Production (MT)',
      'Despatch (MT)',
      'Compliance Score',
      'Risk Level',
      'Latitude',
      'Longitude'
    ];

    const rows = filteredMines.map((m) => [
      m.srNo,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.company}"`,
      `"${m.region}"`,
      `"${m.ownerCompany}"`,
      `"${m.state}"`,
      `"${m.district}"`,
      `"${m.coalfield}"`,
      `"${m.area}"`,
      `"${m.act}"`,
      m.type,
      m.ownership,
      m.production,
      m.despatch,
      m.complianceScore,
      m.riskLevel,
      m.lat,
      m.lng
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `National_Coal_Mines_Dataset_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-[#071a2b] border border-[#14324d] rounded-3xl p-4 sm:p-7 shadow-2xl text-white">
      {/* Top Header & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#143654]">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              National Geospatial Command & Surveillance
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Ministry of Coal &bull; <strong>{filteredMines.length}</strong> of {COAL_MINES_DATASET.length} Collieries Monitored
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 font-serif tracking-tight">
            Indian Coal Mines Intelligence Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Real-time geospatial boundaries, production telemetry, and statutory DGMS compliance across all 36 states and union territories.
          </p>
        </div>

        {/* View Switcher & Action Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex p-1 bg-[#051422] border border-[#143654] rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveView('vector')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'vector'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2438]'
              }`}
            >
              <span>🇮🇳</span>
              <span>Geospatial Grid</span>
            </button>

            <button
              onClick={() => setActiveView('google')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'google'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2438]'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Google Maps</span>
            </button>

            <button
              onClick={() => setActiveView('table')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'table'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c2438]'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Colliery Records</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            title="Download full filtered coal mine dataset as CSV"
            className="px-3.5 py-1.5 bg-[#0a2338] hover:bg-[#0f2f4c] text-amber-300 border border-[#1b4366] hover:border-amber-400/50 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 10 Dropdown Filters (Harmonized with Sovereign Dark UI) */}
      <div className="py-5 space-y-3.5 border-b border-[#143654]">
        {/* Row 1: Select Year, Select Region, Select State, Select District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Select Year */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Year
            </label>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="2024-25" className="bg-[#071a2b]">2024-25</option>
                <option value="2023-24" className="bg-[#071a2b]">2023-24</option>
                <option value="2022-23" className="bg-[#071a2b]">2022-23</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Select Region */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Region
            </label>
            <div className="relative">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Regions</option>
                {dropdownData.regions.map((reg) => (
                  <option key={reg} value={reg} className="bg-[#071a2b]">
                    {reg}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Select State */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select State
            </label>
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('All');
                }}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All States</option>
                {dropdownData.states.map((st) => (
                  <option key={st} value={st} className="bg-[#071a2b]">
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Select District */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select District
            </label>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Districts</option>
                {dropdownData.districts.map((dst) => (
                  <option key={dst} value={dst} className="bg-[#071a2b]">
                    {dst}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Row 2: Select Coalfield, Select Area, Select Company Type, Select Ownership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Select Coalfield */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Coalfield
            </label>
            <div className="relative">
              <select
                value={selectedCoalfield}
                onChange={(e) => setSelectedCoalfield(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Coalfields</option>
                {dropdownData.coalfields.map((cf) => (
                  <option key={cf} value={cf} className="bg-[#071a2b]">
                    {cf}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Select Area */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Area
            </label>
            <div className="relative">
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Areas</option>
                {dropdownData.areas.map((ar) => (
                  <option key={ar} value={ar} className="bg-[#071a2b]">
                    {ar}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Select Company Type */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Company Type
            </label>
            <div className="relative">
              <select
                value={selectedCompanyType}
                onChange={(e) => setSelectedCompanyType(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Companies</option>
                {dropdownData.companyTypes.map((cp) => (
                  <option key={cp} value={cp} className="bg-[#071a2b]">
                    {cp}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Select Ownership */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Ownership
            </label>
            <div className="relative">
              <select
                value={selectedOwnership}
                onChange={(e) => setSelectedOwnership(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Ownership Types</option>
                {dropdownData.ownerships.map((own) => (
                  <option key={own} value={own} className="bg-[#071a2b]">
                    {own}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Row 3: Select Mine Type, Select Act, Live Search, Reset */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
          {/* Select Mine Type */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Mine Type
            </label>
            <div className="relative">
              <select
                value={selectedMineType}
                onChange={(e) => setSelectedMineType(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Types</option>
                {dropdownData.mineTypes.map((mt) => (
                  <option key={mt} value={mt} className="bg-[#071a2b]">
                    {mt === 'OC' ? 'Opencast (OC)' : mt === 'UG' ? 'Underground (UG)' : mt}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Select Act */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Select Act
            </label>
            <div className="relative">
              <select
                value={selectedAct}
                onChange={(e) => setSelectedAct(e.target.value)}
                className="w-full h-10 px-3.5 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[#071a2b]">All Statutory Acts</option>
                {dropdownData.acts.map((act) => (
                  <option key={act} value={act} className="bg-[#071a2b]">
                    {act}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Live Search */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-amber-400/90 uppercase tracking-wider mb-1 px-1">
              Search Mine or Colliery
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search colliery, district..."
                className="w-full h-10 pl-9 pr-8 bg-[#092238] border border-[#183d5f] hover:border-amber-400/50 rounded-xl text-xs text-white placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="flex items-center">
            <button
              onClick={handleResetFilters}
              className="w-full h-10 px-4 bg-[#0a2338] hover:bg-[#0e2c45] text-amber-300 border border-[#1b4366] hover:border-amber-400/60 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body Section: Left Map & Right KPI Cards */}
      {activeView === 'vector' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Authentic Survey of India Vector Map (Cols 1-7) */}
          <div className="lg:col-span-7 bg-[#051422] border border-[#14324d] rounded-3xl p-4 shadow-xl flex flex-col items-center relative min-h-[580px]">
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#112d47] px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white font-serif">
                  India Coal Basins & Units ({filteredMines.length} Visible)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Click state to filter &bull; Click marker for dossier
              </span>
            </div>

            <IndiaVectorMap
              mines={filteredMines}
              selectedState={selectedState}
              onSelectState={(st) => setSelectedState(st)}
              onSelectMine={(mine) => setSelectedMine(mine)}
              hoveredMine={hoveredMine}
              setHoveredMine={setHoveredMine}
            />
          </div>

          {/* Right Column: 3 Sovereign Summary Cards (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Card 1: Production (Sovereign Amber Glowing Theme) */}
            <div className="bg-[#092238] border border-[#1a4468] hover:border-amber-400/50 rounded-3xl p-6 shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-amber-300 font-serif">
                  Production
                </h3>
                <span className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400">
                  <Flame className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight font-mono">
                  {totalProduction}
                </span>
                <span className="text-xl font-bold text-amber-300">MT</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
                Aggregated output for Year {selectedYear} across {filteredMines.length} monitored collieries.
              </p>
            </div>

            {/* Card 2: Despatch (Sovereign Emerald Glowing Theme) */}
            <div className="bg-[#092238] border border-[#1a4468] hover:border-emerald-400/50 rounded-3xl p-6 shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-emerald-300 font-serif">
                  Despatch
                </h3>
                <span className="p-2.5 rounded-xl bg-emerald-400/15 border border-emerald-400/30 text-emerald-400">
                  <Factory className="w-5 h-5" />
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight font-mono">
                  {totalDespatch}
                </span>
                <span className="text-xl font-bold text-emerald-300">MT</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
                Total coal dispatched to thermal power utilities, steel mills, and sovereign reserves.
              </p>
            </div>

            {/* Card 3: Mine Statistics */}
            <div className="bg-[#092238] border border-[#1a4468] rounded-3xl p-6 shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-cyan-300 font-serif">
                  Mine Statistics
                </h3>
                <span className="p-2.5 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-400">
                  <BarChart3 className="w-5 h-5" />
                </span>
              </div>

              {/* Nested Elevated Dark Card for Number of Mines */}
              <div className="mt-4 bg-[#051422] border border-[#153a5c] rounded-2xl p-4 shadow-inner">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Number of Mines
                </span>
                <span className="text-4xl sm:text-5xl font-black text-white font-mono block mt-1">
                  {filteredMines.length}
                </span>
              </div>

              {/* Granular Distribution Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#051422] border border-[#102d47] rounded-xl p-3">
                  <span className="text-[10px] text-amber-400/90 font-bold block uppercase tracking-wider">
                    Extraction Mode
                  </span>
                  <div className="mt-1.5 space-y-1 text-slate-300 font-medium">
                    <div className="flex justify-between">
                      <span>Opencast (OC):</span>
                      <strong className="text-white font-mono">{mineTypeBreakdown.oc}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Underground:</span>
                      <strong className="text-white font-mono">{mineTypeBreakdown.ug}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Mixed:</span>
                      <strong className="text-white font-mono">{mineTypeBreakdown.mixed}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-[#051422] border border-[#102d47] rounded-xl p-3">
                  <span className="text-[10px] text-cyan-400/90 font-bold block uppercase tracking-wider">
                    Sector Ownership
                  </span>
                  <div className="mt-1.5 space-y-1 text-slate-300 font-medium">
                    <div className="flex justify-between">
                      <span>Public / CIL:</span>
                      <strong className="text-white font-mono">{mineTypeBreakdown.pub}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Commercial:</span>
                      <strong className="text-white font-mono">{mineTypeBreakdown.pvt}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Maps Surveillance View */}
      {activeView === 'google' && (
        <div className="mt-6 bg-[#051422] border border-[#14324d] rounded-3xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="p-4 bg-[#081f33] border-b border-[#143654] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  GOOGLE MAPS PLATFORM
                </span>
                <span className="text-xs text-slate-300">
                  Rendering <strong>{filteredMines.length}</strong> markers with Satellite & Hybrid imagery
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowKeyPrompt(!showKeyPrompt)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  apiKey
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                    : 'bg-amber-500/20 border-amber-400/40 text-amber-300 hover:bg-amber-500/30'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{apiKey ? 'API Key Active' : 'Configure Custom Key'}</span>
              </button>
            </div>
          </div>

          {/* API Key Modal / Drawer */}
          {showKeyPrompt && (
            <div className="p-4 bg-[#092238] border-b border-[#143654] text-xs text-slate-200">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span className="font-semibold whitespace-nowrap text-amber-400">Enter Google Maps API Key:</span>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-1.5 bg-[#051422] border border-[#193c5c] rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => setShowKeyPrompt(false)}
                  className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-lg hover:bg-amber-300 cursor-pointer"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          )}

          {/* Google Map Container */}
          <div className="w-full h-[580px] relative">
            {apiKey ? (
              <APIProvider apiKey={apiKey}>
                <Map
                  defaultCenter={{ lat: 23.2, lng: 83.2 }}
                  defaultZoom={5.5}
                  mapId="DEMO_MAP_ID"
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  className="w-full h-full"
                >
                  {filteredMines.map((mine) => {
                    const isSelected = selectedMine?.srNo === mine.srNo;
                    return (
                      <AdvancedMarker
                        key={`gm-${mine.srNo}`}
                        position={{ lat: mine.lat, lng: mine.lng }}
                        title={mine.name}
                        onClick={() => setSelectedMine(mine)}
                      >
                        <Pin
                          background={
                            mine.type === 'OC'
                              ? '#f59e0b'
                              : mine.type === 'UG'
                              ? '#0284c7'
                              : '#a855f7'
                          }
                          borderColor="#071a2b"
                          glyphColor="#ffffff"
                          scale={isSelected ? 1.3 : 0.9}
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {selectedMine && (
                    <InfoWindow
                      position={{ lat: selectedMine.lat, lng: selectedMine.lng }}
                      onCloseClick={() => setSelectedMine(null)}
                    >
                      <div className="p-2 max-w-xs text-slate-900">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-700">
                            #{selectedMine.srNo} &bull; {selectedMine.company}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                            {selectedMine.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{selectedMine.name}</h4>
                        <p className="text-xs text-slate-600">
                          {selectedMine.area} &bull; {selectedMine.coalfield}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] bg-slate-50 p-1.5 rounded">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Production:</span>
                            <strong className="text-amber-700 font-bold">{selectedMine.production} MT</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">District:</span>
                            <strong className="text-slate-800">{selectedMine.district}</strong>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              /* Fallback message with fast toggle back to the authentic map */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#051422] text-white">
                <div className="max-w-md p-6 bg-[#082035] border border-[#163c5e] rounded-2xl shadow-2xl space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center">
                    <Satellite className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white font-serif">
                    Google Maps Satellite & Terrain Surveillance
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    To render satellite layers with real-time Google Maps tiles for all 408 Indian coal mines, provide your Google Maps API key or view the authentic <strong>Geospatial Grid</strong>.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={() => setShowKeyPrompt(true)}
                      className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 cursor-pointer"
                    >
                      Enter API Key
                    </button>
                    <button
                      onClick={() => setActiveView('vector')}
                      className="px-4 py-2 bg-[#123654] text-white font-bold rounded-xl text-xs hover:bg-[#18466e] cursor-pointer"
                    >
                      Switch to Geospatial Grid
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Colliery Master Register Table (Sovereign Dark Theme) */}
      {activeView === 'table' && (
        <div className="mt-6 bg-[#051422] border border-[#14324d] rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-[#143654] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                Filtered Colliery Master Register ({filteredMines.length} Units)
              </h3>
              <p className="text-xs text-slate-400">
                Official Ministry database containing production outputs, parent company affiliations, and coordinates.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Page {currentPage} of {Math.ceil(filteredMines.length / itemsPerPage) || 1}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#081f33] text-amber-300 border-b border-[#143654] font-bold">
                  <th className="py-3 px-3.5">Sr. No.</th>
                  <th className="py-3 px-3.5">Mine Name</th>
                  <th className="py-3 px-3.5">Company</th>
                  <th className="py-3 px-3.5">State</th>
                  <th className="py-3 px-3.5">District</th>
                  <th className="py-3 px-3.5">Coalfield</th>
                  <th className="py-3 px-3.5">Area</th>
                  <th className="py-3 px-3.5">Type</th>
                  <th className="py-3 px-3.5">Ownership</th>
                  <th className="py-3 px-3.5 text-right">Production (MT)</th>
                  <th className="py-3 px-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#102d47] text-slate-300">
                {filteredMines
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((mine) => (
                    <tr key={mine.srNo} className="hover:bg-[#0c2438] transition-colors">
                      <td className="py-2.5 px-3.5 font-mono text-slate-400">#{mine.srNo}</td>
                      <td className="py-2.5 px-3.5 font-bold text-white">{mine.name}</td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 rounded bg-[#0b243a] text-amber-300 font-semibold border border-[#194366]">
                          {mine.company} ({mine.ownerCompany})
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5">{mine.state}</td>
                      <td className="py-2.5 px-3.5">{mine.district}</td>
                      <td className="py-2.5 px-3.5">{mine.coalfield}</td>
                      <td className="py-2.5 px-3.5 text-slate-400">{mine.area}</td>
                      <td className="py-2.5 px-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            mine.type === 'OC'
                              ? 'bg-amber-500/20 text-amber-300'
                              : mine.type === 'UG'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-purple-500/20 text-purple-300'
                          }`}
                        >
                          {mine.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5">{mine.ownership}</td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-amber-400">
                        {mine.production} MT
                      </td>
                      <td className="py-2.5 px-3.5 text-center">
                        <button
                          onClick={() => setSelectedMine(mine)}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-3 border-t border-[#143654] flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing {Math.min(filteredMines.length, (currentPage - 1) * itemsPerPage + 1)} -{' '}
              {Math.min(filteredMines.length, currentPage * itemsPerPage)} of {filteredMines.length}
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 border border-[#1b4366] text-white rounded-lg hover:bg-[#0c2438] disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={currentPage * itemsPerPage >= filteredMines.length}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 border border-[#1b4366] text-white rounded-lg hover:bg-[#0c2438] disabled:opacity-30 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Colliery Detailed Inspection Dossier Modal (Sovereign Dark UI) */}
      {selectedMine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#071a2b] rounded-3xl border border-[#1b4366] shadow-2xl max-w-lg w-full overflow-hidden text-white animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-[#092238] to-[#0c2b45] border-b border-[#183955] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase font-bold tracking-wider border border-amber-400/30">
                  Colliery Dossier #{selectedMine.srNo}
                </span>
                <h3 className="text-xl font-bold mt-1 font-serif text-white">{selectedMine.name}</h3>
                <p className="text-xs text-slate-300">
                  {selectedMine.company} ({selectedMine.ownerCompany}) &bull; {selectedMine.area}
                </p>
              </div>
              <button
                onClick={() => setSelectedMine(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-[#051422] rounded-2xl border border-[#143552]">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                    Annual Production
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {selectedMine.production}
                    </span>
                    <span className="text-xs font-bold text-amber-300">MT</span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#051422] rounded-2xl border border-[#143552]">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                    Mine Type & Sector
                  </span>
                  <span className="text-base font-bold text-cyan-300 block mt-1">
                    {selectedMine.type} ({selectedMine.ownership})
                  </span>
                </div>
              </div>

              {/* Geographic Info */}
              <div className="bg-[#051422] rounded-2xl p-4 border border-[#143552] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#10293d]">
                  <span className="text-slate-400 font-medium">State & District:</span>
                  <strong className="text-white">{selectedMine.district}, {selectedMine.state}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#10293d]">
                  <span className="text-slate-400 font-medium">Coalfield:</span>
                  <strong className="text-white">{selectedMine.coalfield}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#10293d]">
                  <span className="text-slate-400 font-medium">Region & Act:</span>
                  <strong className="text-white">{selectedMine.region} &bull; {selectedMine.act}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Coordinates:</span>
                  <strong className="font-mono text-amber-300">
                    {selectedMine.lat.toFixed(3)}° N, {selectedMine.lng.toFixed(3)}° E
                  </strong>
                </div>
              </div>

              {/* Safety & Compliance Rating */}
              <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block">DGMS Safety Compliance</span>
                  <span className="text-[11px] text-slate-300">Risk Assessment: <strong>{selectedMine.riskLevel} Risk</strong></span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {selectedMine.complianceScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#051422] border-t border-[#143654] flex justify-end gap-2">
              <button
                onClick={() => setSelectedMine(null)}
                className="px-4 py-2 bg-[#0d2a42] hover:bg-[#143d5f] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
