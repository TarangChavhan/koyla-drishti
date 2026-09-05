export interface GovernmentNotice {
  id: string;
  refNo: string;
  date: string;
  authority: string;
  authorityShort: 'DGMS' | 'MoC' | 'CMPDI' | 'MoEFCC';
  title: string;
  description: string;
  category: 'Safety' | 'Technical' | 'Gazette' | 'Environmental' | 'Administrative';
  urgency: 'Immediate' | 'Mandatory' | 'Advisory' | 'Compliance Required';
  fileSize: string;
  signatory: string;
  effectiveDate: string;
  actReference: string;
  targetCollieries: string;
}

export const GOVERNMENT_NOTICES: GovernmentNotice[] = [
  {
    id: 'NOT-2026-001',
    refNo: 'DGMS (Tech) Cir. 04/2026',
    date: '15 Feb 2026',
    authority: 'Directorate General of Mines Safety (DGMS), Dhanbad',
    authorityShort: 'DGMS',
    title: 'Mandatory Real-Time IoT Ingress for Opencast Dust & Blast Vibration Monitoring',
    description: 'All Category A opencast coal mines producing over 2.0 MTPA must establish real-time continuous ambient PM10 air particulate telemetry and seismograph blast PPV sensors directly integrated with Koyla Drishti gateway.',
    category: 'Technical',
    urgency: 'Mandatory',
    fileSize: '2.4 MB',
    signatory: 'Chief Inspector of Mines, DGMS HQ Dhanbad',
    effectiveDate: '01 March 2026',
    actReference: 'Regulation 110 of Coal Mines Regulations (CMR) 2017',
    targetCollieries: 'Category A & B Opencast Collieries (All PSUs & Private Leases)'
  },
  {
    id: 'NOT-2026-002',
    refNo: 'DGMS (Safety) Cir. 02/2026',
    date: '28 Jan 2026',
    authority: 'Directorate General of Mines Safety (DGMS), Dhanbad',
    authorityShort: 'DGMS',
    title: 'Standard Operating Procedures for Overburden Dump Slope Stability during Monsoon Pre-Check',
    description: 'Statutory guidelines prescribing bi-weekly ground radar interferometry (InSAR) slope displacement surveys and automated piezometer pore pressure reporting for dumps exceeding 60 meters height.',
    category: 'Safety',
    urgency: 'Immediate',
    fileSize: '3.1 MB',
    signatory: 'Deputy Director General of Mines Safety (Civil & Geotech)',
    effectiveDate: '15 Feb 2026',
    actReference: 'Regulation 106 & 108 of CMR 2017',
    targetCollieries: 'All Mechanized Opencast Coal Mines with High OB Dumps'
  },
  {
    id: 'NOT-2026-003',
    refNo: 'MoC Gaz. Notif. 11/2026',
    date: '10 Jan 2026',
    authority: 'Ministry of Coal, Government of India, New Delhi',
    authorityShort: 'MoC',
    title: 'Digitization of Mining Lease Boundary Demarcation via DGPS and Satellite Telemetry',
    description: 'Statutory mandate requiring permanent georeferenced DGPS boundary pillars and quarterly Sentinel satellite overlay to eradicate unauthorized excavation outside designated concession zones.',
    category: 'Gazette',
    urgency: 'Mandatory',
    fileSize: '1.9 MB',
    signatory: 'Joint Secretary (Coal Governance), Ministry of Coal',
    effectiveDate: '01 Feb 2026',
    actReference: 'Mines and Minerals (Development and Regulation) Amendment Act',
    targetCollieries: 'All Operational and Allocated Commercial Coal Blocks'
  },
  {
    id: 'NOT-2026-004',
    refNo: 'DGMS (Health) Cir. 01/2026',
    date: '02 Jan 2026',
    authority: 'Directorate General of Mines Safety (DGMS), Dhanbad',
    authorityShort: 'DGMS',
    title: 'Comprehensive Occupational Health Surveillance & Coal Workers Pneumoconiosis (CWP) Protocol',
    description: 'Mandatory digital submission of periodic medical examinations (PME), airborne respirable quartz concentrations, and chest radiograph logs through the statutory Koyla Drishti Health Register.',
    category: 'Safety',
    urgency: 'Compliance Required',
    fileSize: '2.8 MB',
    signatory: 'Director of Mines Safety (Occupational Health)',
    effectiveDate: '15 Jan 2026',
    actReference: 'Mines Rules 1955 (Rule 29B - 29F)',
    targetCollieries: 'All Underground and Opencast Coal Mines'
  },
  {
    id: 'NOT-2026-005',
    refNo: 'CMPDI / GIS-REG / 2025 / 44',
    date: '18 Dec 2025',
    authority: 'Central Mine Planning and Design Institute (CMPDI), Ranchi',
    authorityShort: 'CMPDI',
    title: 'Integration of Drone-based Photogrammetry volumetric calculations with Koyla Drishti GIS Servers',
    description: 'Standardization of 3D mesh format, ortho-mosaic resolutions (minimum 5 cm/pixel), and digital surface models (DSM) for annual physical coal stock verification and void audit.',
    category: 'Technical',
    urgency: 'Mandatory',
    fileSize: '4.2 MB',
    signatory: 'General Manager (Geomatics & Remote Sensing), CMPDI',
    effectiveDate: '01 Jan 2026',
    actReference: 'National Coal Inventory Audit Directives 2025',
    targetCollieries: 'Coal India Ltd (CIL) Subsidiaries & SCCL Mines'
  },
  {
    id: 'NOT-2026-006',
    refNo: 'MoEFCC / MINE-ENV / 2025 / 19',
    date: '05 Dec 2025',
    authority: 'Ministry of Environment, Forest and Climate Change, New Delhi',
    authorityShort: 'MoEFCC',
    title: 'Zero Liquid Discharge (ZLD) Compliance for Coal Washery Tailings and Acid Mine Drainage (AMD)',
    description: 'Directives enforcing online chemical oxygen demand (COD), pH, and suspended solids water quality loggers at effluent treatment plants with continuous data sharing to State Pollution Control Boards.',
    category: 'Environmental',
    urgency: 'Mandatory',
    fileSize: '3.6 MB',
    signatory: 'Scientist G / Advisor (Mining Division), MoEFCC',
    effectiveDate: '01 Jan 2026',
    actReference: 'Environment (Protection) Act, 1986 & Water Act 1974',
    targetCollieries: 'All Coal Washeries & Wet Processing Mineral Plants'
  },
  {
    id: 'NOT-2026-007',
    refNo: 'DGMS (Mech) Cir. 03/2025',
    date: '20 Nov 2025',
    authority: 'Directorate General of Mines Safety (DGMS), Dhanbad',
    authorityShort: 'DGMS',
    title: 'Proximity Warning System & Anti-Collision Radar Mandate for Heavy Earth Moving Machinery (HEMM)',
    description: 'Statutory installation of audio-visual proximity detection devices and blind-spot cameras on all rear dumpers, front-end wheel loaders, and hydraulic crawler excavators.',
    category: 'Safety',
    urgency: 'Immediate',
    fileSize: '2.1 MB',
    signatory: 'Director of Mines Safety (Mechanical), DGMS HQ',
    effectiveDate: '01 Dec 2025',
    actReference: 'Regulation 181 of CMR 2017',
    targetCollieries: 'All Opencast Mines Operating Heavy Dumpers >35T'
  },
  {
    id: 'NOT-2026-008',
    refNo: 'MoC / COAL-DIGI / 2025 / 09',
    date: '12 Nov 2025',
    authority: 'Ministry of Coal, Government of India, New Delhi',
    authorityShort: 'MoC',
    title: 'Standardization of Digital Weighbridge Telemetry & RFID Truck Tracking Dispatch System',
    description: 'Guidelines to eliminate commercial coal transit pilferage via encrypted digital weight bridge records, CCTV automatic number plate recognition (ANPR), and integrated GPS e-way bill validation.',
    category: 'Administrative',
    urgency: 'Compliance Required',
    fileSize: '1.7 MB',
    signatory: 'Director (Movement & Logistics), Ministry of Coal',
    effectiveDate: '01 Dec 2025',
    actReference: 'Colliery Control Rules 2004 (Amended 2021)',
    targetCollieries: 'All Commercial Rail Sidings & Road Dispatch Weighbridges'
  },
  {
    id: 'NOT-2026-009',
    refNo: 'DGMS (Underground) Cir. 05/2025',
    date: '28 Oct 2025',
    authority: 'Directorate General of Mines Safety (DGMS), Dhanbad',
    authorityShort: 'DGMS',
    title: 'Tele-monitoring of Inflammable Gas (CH4) and Carbon Monoxide (CO) in Degree II & III Underground Mines',
    description: 'Statutory installation of continuous infrared optical methanometers and catalytic bead gas transducers linked to automatic electrical power trip interlocks in underground workings.',
    category: 'Safety',
    urgency: 'Immediate',
    fileSize: '3.4 MB',
    signatory: 'Director of Mines Safety (UG Mining & Ventilation)',
    effectiveDate: '15 Nov 2025',
    actReference: 'Regulation 153 & 154 of CMR 2017',
    targetCollieries: 'All Underground Gassy Coal Seams (Degree II & III)'
  },
  {
    id: 'NOT-2026-010',
    refNo: 'MoC / GREEN-MINE / 2025 / 02',
    date: '15 Oct 2025',
    authority: 'Ministry of Coal, Government of India, New Delhi',
    authorityShort: 'MoC',
    title: 'National Green Mining Star Rating Framework and Concurrent Eco-Restoration Audit',
    description: 'Annual verification criteria for topsoil preservation, native tree afforestation density, rainwater harvesting void lakes, and solar farm development on reclaimed overburden backfills.',
    category: 'Environmental',
    urgency: 'Advisory',
    fileSize: '5.1 MB',
    signatory: 'Economic Advisor (Sustainable Development Cell), MoC',
    effectiveDate: '01 Nov 2025',
    actReference: 'National Green Coal Charter 2025',
    targetCollieries: 'All Operating Collieries seeking 5-Star ESG Rating'
  }
];
