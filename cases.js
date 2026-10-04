function A(symbol,value,unit,tolerancePercent){ return {symbol,value,unit,tolerancePercent}; }

// Each case supplies a gas and two states (T1, T2 in K). Students compute
// Δh and Δu by two methods, in kJ/kg:
//   - constant specific heats, evaluated at Tavg = (T1+T2)/2 from Table A-20
//     (interpolated when Tavg falls between tabulated rows)
//   - variable specific heats, read directly from Table A-22 (air) or
//     Table A-23 molar data divided by the Table A-1 molar mass (other gases)
//
// All "find" values below are independently verified against
// Thermodynamics Tables.pdf (A-1, A-20, A-22, A-23) — see the worked
// derivation in the project notes. This file is a static answer bank: the
// quiz never reads the source PDF itself.
const IDEALGAS_CASES = [
  {
    id: 1,
    gas: "Air",
    T1: 300,
    T2: 450,
    find: [
      A("Δh — constant specific heats (Tavg, Table A-20)", 151.58, "kJ/kg", 1),
      A("Δu — constant specific heats (Tavg, Table A-20)", 108.53, "kJ/kg", 1),
      A("Δh — variable specific heats (Table A-22)", 151.61, "kJ/kg", 1),
      A("Δu — variable specific heats (Table A-22)", 108.55, "kJ/kg", 1)
    ]
  }
];
