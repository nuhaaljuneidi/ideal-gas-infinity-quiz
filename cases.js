function A(symbol,value,unit,tolerancePercent){ return {symbol,value,unit,tolerancePercent}; }

// Each case supplies a gas and two states (T1, T2 in K). Students compute
// Δh and Δu by two methods, in kJ/kg:
//   - constant specific heats, evaluated at Tavg = (T1+T2)/2 from Table A-20
//     (interpolated when Tavg falls between tabulated rows)
//   - variable specific heats, read directly from Table A-22 (air) or
//     Table A-23 molar data divided by the Table A-1 molar mass (other gases)
//
// All "find" values below are independently verified against
// Thermodynamics Tables.pdf (A-1, A-20, A-22, A-23) using a standalone
// Node verification script (not shipped with the quiz) that re-derives
// each answer from transcribed table rows, including every A-20
// interpolation. This file is a static answer bank: the quiz never reads
// the source PDF itself.
function dh(v){ return A("Δh — constant specific heats (Tavg, Table A-20)", v, "kJ/kg", 1); }
function du(v){ return A("Δu — constant specific heats (Tavg, Table A-20)", v, "kJ/kg", 1); }
function dhv(v,table){ return A(`Δh — variable specific heats (Table ${table})`, v, "kJ/kg", 1); }
function duv(v,table){ return A(`Δu — variable specific heats (Table ${table})`, v, "kJ/kg", 1); }

const IDEALGAS_CASES = [
  { id: 1,  gas: "Air", T1: 300, T2: 450, find: [dh(151.58), du(108.53), dhv(151.61,"A-22"), duv(108.55,"A-22")] },
  { id: 2,  gas: "Air", T1: 350, T2: 600, find: [dh(256.13), du(184.38), dhv(256.53,"A-22"), duv(184.76,"A-22")] },
  { id: 3,  gas: "Air", T1: 550, T2: 850, find: [dh(322.50), du(236.40), dhv(311.34,"A-22"), duv(228.09,"A-22")] },
  { id: 4,  gas: "Air", T1: 330, T2: 590, find: [dh(265.67), du(191.05), dhv(266.18,"A-22"), duv(191.54,"A-22")] },

  { id: 5,  gas: "N2",  T1: 300, T2: 500, find: [dh(208.80), du(149.40), dhv(209.14,"A-23"), duv(149.73,"A-23")] },
  { id: 6,  gas: "N2",  T1: 310, T2: 540, find: [dh(240.70), du(172.39), dhv(241.06,"A-23"), duv(172.80,"A-23")] },
  { id: 7,  gas: "N2",  T1: 380, T2: 670, find: [dh(307.55), du(221.42), dhv(308.10,"A-23"), duv(222.03,"A-23")] },
  { id: 8,  gas: "N2",  T1: 470, T2: 780, find: [dh(334.96), du(242.89), dhv(335.31,"A-23"), duv(243.23,"A-23")] },

  { id: 9,  gas: "O2",  T1: 350, T2: 550, find: [dh(191.20), du(139.20), dhv(191.41,"A-23"), duv(139.44,"A-23")] },
  { id: 10, gas: "O2",  T1: 330, T2: 480, find: [dh(141.37), du(102.38), dhv(141.59,"A-23"), duv(102.59,"A-23")] },
  { id: 11, gas: "O2",  T1: 420, T2: 730, find: [dh(308.60), du(228.01), dhv(308.22,"A-23"), duv(227.66,"A-23")] },
  { id: 12, gas: "O2",  T1: 520, T2: 830, find: [dh(317.44), du(236.99), dhv(316.94,"A-23"), duv(236.44,"A-23")] },

  { id: 13, gas: "CO2", T1: 400, T2: 600, find: [dh(202.80), du(165.00), dhv(202.41,"A-23"), duv(164.62,"A-23")] },
  { id: 14, gas: "CO2", T1: 300, T2: 470, find: [dh(157.39), du(125.26), dhv(157.24,"A-23"), duv(125.09,"A-23")] },
  { id: 15, gas: "CO2", T1: 390, T2: 660, find: [dh(278.10), du(227.07), dhv(277.21,"A-23"), duv(226.18,"A-23")] },
  { id: 16, gas: "CO2", T1: 480, T2: 800, find: [dh(350.91), du(290.43), dhv(349.65,"A-23"), duv(289.18,"A-23")] },

  { id: 17, gas: "CO",  T1: 350, T2: 550, find: [dh(210.80), du(151.40), dhv(211.21,"A-23"), duv(151.84,"A-23")] },
  { id: 18, gas: "CO",  T1: 310, T2: 540, find: [dh(241.62), du(173.42), dhv(242.16,"A-23"), duv(173.87,"A-23")] },
  { id: 19, gas: "CO",  T1: 420, T2: 730, find: [dh(335.11), du(243.04), dhv(335.45,"A-23"), duv(243.41,"A-23")] },
  { id: 20, gas: "CO",  T1: 520, T2: 830, find: [dh(343.02), du(250.95), dhv(342.95,"A-23"), duv(250.91,"A-23")] },
];
