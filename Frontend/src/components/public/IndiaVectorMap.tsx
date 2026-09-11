import React from 'react';
import { CoalMineRecord } from '../../data/coalMinesDataset';
import { INDIA_STATE_PATHS, projectCoord, INDIA_MAP_DIMENSIONS } from '../../data/indiaMapPaths';

interface IndiaVectorMapProps {
  mines: CoalMineRecord[];
  selectedState: string;
  onSelectState: (state: string) => void;
  onSelectMine: (mine: CoalMineRecord) => void;
  hoveredMine: CoalMineRecord | null;
  setHoveredMine: (mine: CoalMineRecord | null) => void;
}

export const IndiaVectorMap: React.FC<IndiaVectorMapProps> = ({
  mines,
  selectedState,
  onSelectState,
  onSelectMine,
  hoveredMine,
  setHoveredMine
}) => {
  // Aggregate mines per state
  const stateMineStats = React.useMemo(() => {
    const stats: Record<string, { count: number; production: number }> = {};
    mines.forEach((m) => {
      if (!stats[m.state]) {
        stats[m.state] = { count: 0, production: 0 };
      }
      stats[m.state].count += 1;
      stats[m.state].production += m.production;
    });
    return stats;
  }, [mines]);

  // Selected state stats
  const activeStats = selectedState !== 'All' ? stateMineStats[selectedState] : null;

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] flex items-center justify-center select-none overflow-hidden bg-[#051422] rounded-2xl border border-[#14324d]">
      {/* Subtle Coordinate Grid in Background */}
      <svg
        viewBox={`0 0 ${INDIA_MAP_DIMENSIONS.width} ${INDIA_MAP_DIMENSIONS.height}`}
        className="w-full h-full max-h-[600px] drop-shadow-2xl"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0e3557" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#051422" stopOpacity="0" />
          </radialGradient>

          {/* Marker Glow Filters */}
          <filter id="amberGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#f59e0b" floodOpacity="0.8" />
          </filter>
          <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* Ambient Map Glow */}
        <rect width="100%" height="100%" fill="url(#mapGlow)" />

        {/* Latitude and Longitude Reference Grid */}
        <g opacity="0.12">
          {[100, 200, 300, 400, 500, 600].map((x) => (
            <line key={`x-${x}`} x1={x} y1="30" x2={x} y2="690" stroke="#38bdf8" strokeDasharray="3 5" />
          ))}
          {[100, 200, 300, 400, 500, 600].map((y) => (
            <line key={`y-${y}`} x1="30" y1={y} x2="610" y2={y} stroke="#38bdf8" strokeDasharray="3 5" />
          ))}
        </g>

        {/* All Authentic Indian States from Survey of India GeoJSON */}
        <g>
          {INDIA_STATE_PATHS.map((state) => {
            const isSelected = selectedState.toLowerCase() === state.name.toLowerCase();
            const stats = stateMineStats[state.name];
            const hasMines = Boolean(stats && stats.count > 0);

            // Color coding states according to Coal Drishti dark sovereign palette
            let fillColor = '#0c2236'; // Default state color
            let strokeColor = '#183c5d'; // Default border color
            let strokeWidth = '1';

            if (hasMines) {
              fillColor = '#102e4a'; // Coal-bearing state
              strokeColor = '#245a87';
              strokeWidth = '1.2';
            }

            if (isSelected) {
              fillColor = '#194975'; // Active selected state
              strokeColor = '#fbbf24'; // Sovereign Amber border
              strokeWidth = '2.2';
            }

            return (
              <path
                key={state.name}
                d={state.d}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="transition-all duration-200 cursor-pointer hover:fill-[#1b4369] hover:stroke-cyan-400"
                onClick={() => {
                  onSelectState(isSelected ? 'All' : state.name);
                }}
              >
                <title>{`${state.name}: ${stats ? stats.count : 0} Monitored Collieries`}</title>
              </path>
            );
          })}
        </g>

        {/* State Mine Count Labels for Key Coal Regions */}
        <g className="pointer-events-none">
          {INDIA_STATE_PATHS.map((state) => {
            const stats = stateMineStats[state.name];
            if (!stats || stats.count === 0) return null;
            const isSelected = selectedState.toLowerCase() === state.name.toLowerCase();

            return (
              <g key={`badge-${state.name}`}>
                {/* Outer badge ring */}
                <circle
                  cx={state.cx}
                  cy={state.cy}
                  r="11"
                  fill={isSelected ? '#f59e0b' : '#071d31'}
                  stroke={isSelected ? '#ffffff' : '#38bdf8'}
                  strokeWidth="1.2"
                  opacity="0.95"
                />
                <text
                  x={state.cx}
                  y={state.cy + 3.8}
                  fontSize="9.5"
                  fill={isSelected ? '#051422' : '#ffffff'}
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {stats.count}
                </text>
              </g>
            );
          })}
        </g>

        {/* Individual Coal Mine Coordinates Plotted with Sub-Kilometer Precision */}
        <g>
          {mines.map((mine) => {
            const [cx, cy] = projectCoord(mine.lat, mine.lng);
            const isHovered = hoveredMine?.srNo === mine.srNo;
            const isHighProducer = mine.production >= 8.0;

            // Palette matching Koyla Drishti UI:
            // Opencast (OC): Amber-400 (#f59e0b)
            // Underground (UG): Cyan-400 (#38bdf8)
            // Mixed: Purple-400 (#c084fc)
            let markerColor = '#f59e0b';
            let glowFilter = 'url(#amberGlow)';

            if (mine.type === 'UG') {
              markerColor = '#38bdf8';
              glowFilter = 'url(#cyanGlow)';
            } else if (mine.type === 'Mixed') {
              markerColor = '#c084fc';
            }

            return (
              <g
                key={`mine-${mine.srNo}`}
                transform={`translate(${cx}, ${cy})`}
                className="cursor-pointer transition-transform duration-150 hover:scale-175"
                onClick={() => onSelectMine(mine)}
                onMouseEnter={() => setHoveredMine(mine)}
                onMouseLeave={() => setHoveredMine(null)}
              >
                {/* Pulsing ring on high production mines or hovered */}
                {(isHighProducer || isHovered) && (
                  <circle
                    r={isHovered ? 9 : 6}
                    fill={markerColor}
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}
                {/* Main Marker Dot */}
                <circle
                  r={isHovered ? 5 : isHighProducer ? 3.8 : 2.5}
                  fill={markerColor}
                  stroke="#071a2b"
                  strokeWidth="0.9"
                  filter={glowFilter}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Card in Sovereign Dark UI */}
      {hoveredMine && (
        <div className="absolute top-4 left-4 z-30 bg-[#071a2b]/95 backdrop-blur-md border border-[#1e466e] rounded-2xl p-3.5 shadow-2xl max-w-xs pointer-events-none text-white animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-[#143654] pb-1.5 mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              #{hoveredMine.srNo} &bull; {hoveredMine.company}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                hoveredMine.type === 'OC'
                  ? 'bg-amber-500/20 text-amber-300'
                  : hoveredMine.type === 'UG'
                  ? 'bg-cyan-500/20 text-cyan-300'
                  : 'bg-purple-500/20 text-purple-300'
              }`}
            >
              {hoveredMine.type} ({hoveredMine.ownership})
            </span>
          </div>

          <h4 className="font-bold text-sm text-white font-serif truncate">{hoveredMine.name}</h4>
          <p className="text-[11px] text-slate-300 truncate">
            {hoveredMine.area} Area &bull; {hoveredMine.coalfield}
          </p>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] bg-[#051422] p-2 rounded-xl border border-[#102a42]">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Production:</span>
              <strong className="text-amber-400 font-mono font-bold text-xs">{hoveredMine.production} MT</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">District:</span>
              <strong className="text-slate-200 truncate block">{hoveredMine.district}, {hoveredMine.state}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Selected State Mini Dossier Banner */}
      {selectedState !== 'All' && (
        <div className="absolute top-4 right-4 z-20 bg-[#071a2b]/90 backdrop-blur-md border border-amber-400/40 rounded-xl px-3 py-1.5 shadow-lg text-xs text-white flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>
            Filtered: <strong className="text-amber-300">{selectedState}</strong> (
            {activeStats?.count || 0} Collieries)
          </span>
          <button
            onClick={() => onSelectState('All')}
            className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer ml-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* Map Legend Overlay at Bottom Left (Sovereign Dark UI) */}
      <div className="absolute bottom-3 left-3 z-10 bg-[#071a2b]/90 backdrop-blur-md border border-[#183955] rounded-xl p-2 px-3 shadow-lg text-[11px] text-slate-300 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs shadow-amber-400" />
          <span className="text-amber-200 font-medium">Opencast (OC)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-400" />
          <span className="text-cyan-200 font-medium">Underground (UG)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-xs shadow-purple-400" />
          <span className="text-purple-200 font-medium">Mixed</span>
        </div>
      </div>
    </div>
  );
};
