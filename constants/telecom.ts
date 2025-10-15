// src/constants/telecom.ts

export const VENDORS = [
  'A10 Networks', 'ACTI', 'ADVA', 'AKCP', 'APC', 'B+W', 'Cataleya', 'CBNL',
  'CHLORIDE', 'CISCO', 'Dahua', 'Dell', 'Eaton', 'EfficientIP', 'Emerson',
  'EMIRCOM', 'F5', 'GE', 'Granding', 'Hikvision', 'HUAWEI', 'iDirect',
  'Infinite', 'Infoblox', 'Lenvica', 'Liebert', 'NEC', 'Netaxis', 'Noction',
  'NOKIA', 'NTI', 'Oracle', 'Radius', 'REVO', 'Rittal', 'Sandvine',
  'SUPREMA', 'Utimaco', 'Vecta Star', 'VEM', 'VERTIV', 'VIAVI', 'WireFilter'
].sort();

export const TECHNOLOGIES = [
  '5G', '4G/LTE', 'MPLS', 'GPON', 'SDH', 'DWDM', 'Microwave', 'VoIP',
  'SD-WAN', 'VSAT', 'IGW', 'Monitoring', 'Security', 'Power', 'CCTV',
  'Access Control'
].sort();

export const DEVICE_TYPES = [
  'Router', 'Switch', 'Core Switch', 'Access Switch', 'Load Balancer',
  'VPN Concentrator', 'OLT', 'GPON', 'SDH Node', 'DWDM', 'Microwave P2P',
  'Microwave P2MP', 'VSAT Controller', 'BRAS', 'SBC', 'Voice Platform',
  '5G Core VNF', '5G Core Infra', '5G Access', 'Firewall', 'IGW Platform',
  'DNS Server', 'Proxy Server', 'NCE Campus', 'NCE Home', 'UPS', 'Rectifier',
  'AC Unit', 'Monitoring System', 'Environment Monitor', 'DVR', 'NVR',
  'Access System', 'Security Camera', 'Outdoor Cabinet', 'Shelter', 'IDRAC'
].sort();

export const EQUIPMENT_ROLES = [
  'PE Router (Provider Edge)', 'P Router (Provider)', 'Core Router',
  'MPLS Router', 'BRAS', 'Access OLT (GPON)', 'Access Switch', 'CPE',
  'SDH Node', 'SDH Multiplexer', 'DWDM Terminal', 'Microwave Link',
  'SBC (Session Border Controller)', 'Voice Gateway', 'Softswitch',
  '5G gNB', '5G Core AMF', '5G Core SMF', '5G Core UPF', 'Internet Gateway',
  'Firewall', 'Load Balancer', 'DNS Server', 'Proxy Server',
  'VPN Concentrator', 'Network Management System', 'Element Management System',
  'Monitoring System', 'Power Supply', 'Cooling System',
  'Environmental Monitor', 'Physical Security'
].sort();

export const DOMAINS = [
  'Core', 'Access', 'Transport', 'Transmission', 'Edge', 'Aggregation',
  'Distribution', 'Voice', '5G', 'Security', 'Management', 'Support',
  'Infrastructure'
].sort();

export const SUB_DOMAINS = [
  'IP/MPLS', 'Packet Core', 'IMS', 'GPON', 'FTTX', 'Fixed Access',
  'Mobile Access', '5G RAN', '4G RAN', 'SDH', 'DWDM', 'OTN', 'Microwave',
  'VSAT', 'VoIP', 'SIP', 'PSTN', '5G Core', '5G Transport',
  'Internet Gateway', 'SD-WAN', 'Firewall', 'DNS', 'Proxy', 'NMS', 'EMS',
  'OSS', 'BSS', 'Monitoring', 'Power', 'Cooling', 'CCTV', 'Access Control'
].sort();

export const STATUS_OPTIONS = [
  'Active', 'Inactive', 'Maintenance', 'Planned', 'Decommissioned'
];

export const REGIONS_13 = [
  'Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 'Tabuk',
  'Qassim', 'Hail', 'Northern Borders', 'Jazan', 'Najran', 'Al-Baha', 'Al-Jouf'
].sort();

export const REGIONS_5 = [
  'Central', 'Western', 'Eastern', 'Southern', 'Northern'
];