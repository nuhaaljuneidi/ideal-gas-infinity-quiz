function A(symbol,value,unit,tolerancePercent){ return {symbol,value,unit,tolerancePercent}; }

// Each case supplies a gas, a unit system, and two states (T1, T2 in K for
// SI cases, in °R for English cases). Students compute Δh and Δu by two
// methods, in kJ/kg (SI) or Btu/lb (English):
//   - constant specific heats, evaluated at Tavg = (T1+T2)/2 from Table
//     A-20 / A-20E (interpolated when Tavg falls between tabulated rows).
//     IMPORTANT for English cases: A-20E is tabulated against Temp in °F,
//     not °R, so Tavg must be converted (Tavg°F = Tavg°R − 459.67) before
//     the A-20E lookup; the SI tables have no such mismatch since A-20 and
//     A-22/A-23 both use K directly.
//   - variable specific heats, read directly from Table A-22/A-22E (air)
//     or Table A-23/A-23E molar data divided by the Table A-1/A-1E molar
//     mass (other gases)
//
// All "find" values below are independently verified against
// Thermodynamics Tables.pdf using standalone Node verification scripts
// (not shipped with the quiz) that re-derive each answer from transcribed
// table rows, including every A-20/A-20E interpolation and the English
// cases' °R→°F conversion. This file is a static answer bank: the quiz
// never reads the source PDF itself.
function dh(v,unit){ return A(`Δh — constant specific heats (Tavg, Table A-20${unit==='Btu/lb'?'E':''})`, v, unit, 1); }
function du(v,unit){ return A(`Δu — constant specific heats (Tavg, Table A-20${unit==='Btu/lb'?'E':''})`, v, unit, 1); }
function dhv(v,unit,table){ return A(`Δh — variable specific heats (Table ${table})`, v, unit, 1); }
function duv(v,unit,table){ return A(`Δu — variable specific heats (Table ${table})`, v, unit, 1); }

const SI="kJ/kg", EN="Btu/lb";

const IDEALGAS_CASES = [
  // ---- SI cases (T in K), 1-20 ----
  { id: 1,  gas: "Air", units:"si", T1: 300, T2: 450, find: [dh(151.58,SI), du(108.53,SI), dhv(151.61,SI,"A-22"), duv(108.55,SI,"A-22")] },
  { id: 2,  gas: "Air", units:"si", T1: 350, T2: 600, find: [dh(256.13,SI), du(184.38,SI), dhv(256.53,SI,"A-22"), duv(184.76,SI,"A-22")] },
  { id: 3,  gas: "Air", units:"si", T1: 550, T2: 850, find: [dh(322.50,SI), du(236.40,SI), dhv(311.34,SI,"A-22"), duv(228.09,SI,"A-22")] },
  { id: 4,  gas: "Air", units:"si", T1: 330, T2: 590, find: [dh(265.67,SI), du(191.05,SI), dhv(266.18,SI,"A-22"), duv(191.54,SI,"A-22")] },

  { id: 5,  gas: "N2",  units:"si", T1: 300, T2: 500, find: [dh(208.80,SI), du(149.40,SI), dhv(209.14,SI,"A-23"), duv(149.73,SI,"A-23")] },
  { id: 6,  gas: "N2",  units:"si", T1: 310, T2: 540, find: [dh(240.70,SI), du(172.39,SI), dhv(241.06,SI,"A-23"), duv(172.80,SI,"A-23")] },
  { id: 7,  gas: "N2",  units:"si", T1: 380, T2: 670, find: [dh(307.55,SI), du(221.42,SI), dhv(308.10,SI,"A-23"), duv(222.03,SI,"A-23")] },
  { id: 8,  gas: "N2",  units:"si", T1: 470, T2: 780, find: [dh(334.96,SI), du(242.89,SI), dhv(335.31,SI,"A-23"), duv(243.23,SI,"A-23")] },

  { id: 9,  gas: "O2",  units:"si", T1: 350, T2: 550, find: [dh(191.20,SI), du(139.20,SI), dhv(191.41,SI,"A-23"), duv(139.44,SI,"A-23")] },
  { id: 10, gas: "O2",  units:"si", T1: 330, T2: 480, find: [dh(141.37,SI), du(102.38,SI), dhv(141.59,SI,"A-23"), duv(102.59,SI,"A-23")] },
  { id: 11, gas: "O2",  units:"si", T1: 420, T2: 730, find: [dh(308.60,SI), du(228.01,SI), dhv(308.22,SI,"A-23"), duv(227.66,SI,"A-23")] },
  { id: 12, gas: "O2",  units:"si", T1: 520, T2: 830, find: [dh(317.44,SI), du(236.99,SI), dhv(316.94,SI,"A-23"), duv(236.44,SI,"A-23")] },

  { id: 13, gas: "CO2", units:"si", T1: 400, T2: 600, find: [dh(202.80,SI), du(165.00,SI), dhv(202.41,SI,"A-23"), duv(164.62,SI,"A-23")] },
  { id: 14, gas: "CO2", units:"si", T1: 300, T2: 470, find: [dh(157.39,SI), du(125.26,SI), dhv(157.24,SI,"A-23"), duv(125.09,SI,"A-23")] },
  { id: 15, gas: "CO2", units:"si", T1: 390, T2: 660, find: [dh(278.10,SI), du(227.07,SI), dhv(277.21,SI,"A-23"), duv(226.18,SI,"A-23")] },
  { id: 16, gas: "CO2", units:"si", T1: 480, T2: 800, find: [dh(350.91,SI), du(290.43,SI), dhv(349.65,SI,"A-23"), duv(289.18,SI,"A-23")] },

  { id: 17, gas: "CO",  units:"si", T1: 350, T2: 550, find: [dh(210.80,SI), du(151.40,SI), dhv(211.21,SI,"A-23"), duv(151.84,SI,"A-23")] },
  { id: 18, gas: "CO",  units:"si", T1: 310, T2: 540, find: [dh(241.62,SI), du(173.42,SI), dhv(242.16,SI,"A-23"), duv(173.87,SI,"A-23")] },
  { id: 19, gas: "CO",  units:"si", T1: 420, T2: 730, find: [dh(335.11,SI), du(243.04,SI), dhv(335.45,SI,"A-23"), duv(243.41,SI,"A-23")] },
  { id: 20, gas: "CO",  units:"si", T1: 520, T2: 830, find: [dh(343.02,SI), du(250.95,SI), dhv(342.95,SI,"A-23"), duv(250.91,SI,"A-23")] },

  // ---- English cases (T in °R), 21-40 ----
  { id: 21, gas: "Air", units:"english", T1: 540, T2: 800,  find: [dh(62.71,EN), du(45.01,EN), dhv(62.75,EN,"A-22E"), duv(44.93,EN,"A-22E")] },
  { id: 22, gas: "Air", units:"english", T1: 600, T2: 900,  find: [dh(72.84,EN), du(52.17,EN), dhv(72.79,EN,"A-22E"), duv(52.23,EN,"A-22E")] },
  { id: 23, gas: "Air", units:"english", T1: 460, T2: 700,  find: [dh(57.65,EN), du(41.33,EN), dhv(57.66,EN,"A-22E"), duv(41.22,EN,"A-22E")] },
  { id: 24, gas: "Air", units:"english", T1: 700, T2: 1000, find: [dh(73.44,EN), du(52.74,EN), dhv(73.42,EN,"A-22E"), duv(52.85,EN,"A-22E")] },

  { id: 25, gas: "N2",  units:"english", T1: 520, T2: 700,  find: [dh(44.73,EN), du(32.04,EN), dhv(44.76,EN,"A-23E"), duv(32.00,EN,"A-23E")] },
  { id: 26, gas: "N2",  units:"english", T1: 540, T2: 800,  find: [dh(64.77,EN), du(46.31,EN), dhv(64.77,EN,"A-23E"), duv(46.31,EN,"A-23E")] },
  { id: 27, gas: "N2",  units:"english", T1: 600, T2: 900,  find: [dh(74.97,EN), du(53.67,EN), dhv(74.98,EN,"A-23E"), duv(53.71,EN,"A-23E")] },
  { id: 28, gas: "N2",  units:"english", T1: 700, T2: 1000, find: [dh(75.27,EN), du(53.97,EN), dhv(75.44,EN,"A-23E"), duv(54.17,EN,"A-23E")] },

  { id: 29, gas: "O2",  units:"english", T1: 500, T2: 680,  find: [dh(39.76,EN), du(28.60,EN), dhv(39.69,EN,"A-23E"), duv(28.52,EN,"A-23E")] },
  { id: 30, gas: "O2",  units:"english", T1: 560, T2: 820,  find: [dh(58.22,EN), du(42.10,EN), dhv(58.17,EN,"A-23E"), duv(42.04,EN,"A-23E")] },
  { id: 31, gas: "O2",  units:"english", T1: 620, T2: 920,  find: [dh(67.92,EN), du(49.32,EN), dhv(68.03,EN,"A-23E"), duv(49.42,EN,"A-23E")] },
  { id: 32, gas: "O2",  units:"english", T1: 680, T2: 1020, find: [dh(78.07,EN), du(56.99,EN), dhv(78.21,EN,"A-23E"), duv(57.11,EN,"A-23E")] },

  { id: 33, gas: "CO2", units:"english", T1: 480, T2: 660,  find: [dh(37.12,EN), du(29.02,EN), dhv(37.05,EN,"A-23E"), duv(28.93,EN,"A-23E")] },
  { id: 34, gas: "CO2", units:"english", T1: 520, T2: 780,  find: [dh(56.12,EN), du(44.42,EN), dhv(56.10,EN,"A-23E"), duv(44.36,EN,"A-23E")] },
  { id: 35, gas: "CO2", units:"english", T1: 600, T2: 880,  find: [dh(63.46,EN), du(50.86,EN), dhv(63.27,EN,"A-23E"), duv(50.63,EN,"A-23E")] },
  { id: 36, gas: "CO2", units:"english", T1: 660, T2: 1000, find: [dh(80.25,EN), du(64.71,EN), dhv(79.91,EN,"A-23E"), duv(64.57,EN,"A-23E")] },

  { id: 37, gas: "CO",  units:"english", T1: 520, T2: 700,  find: [dh(44.82,EN), du(32.13,EN), dhv(44.80,EN,"A-23E"), duv(32.03,EN,"A-23E")] },
  { id: 38, gas: "CO",  units:"english", T1: 560, T2: 820,  find: [dh(64.90,EN), du(46.62,EN), dhv(64.97,EN,"A-23E"), duv(46.54,EN,"A-23E")] },
  { id: 39, gas: "CO",  units:"english", T1: 620, T2: 920,  find: [dh(75.36,EN), du(54.06,EN), dhv(75.39,EN,"A-23E"), duv(54.13,EN,"A-23E")] },
  { id: 40, gas: "CO",  units:"english", T1: 700, T2: 1020, find: [dh(80.96,EN), du(58.24,EN), dhv(81.06,EN,"A-23E"), duv(58.37,EN,"A-23E")] },
];
