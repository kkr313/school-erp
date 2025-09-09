// src/utils/schoolBaseUrls.jsx

export const schoolBaseUrls = {
  T36: "https://teo-vivekanadbihar.co.in",
  T37: "https://teo-vivekanadbihar.co.in/TEO-RISING-2025",
  T38: "https://teo-vivekanadbihar.co.in/vivekanand",
  T39: "https://teo-vivekanadbihar.co.in/TEO-MANAN-2025",
  T40: "https://teo-vivekanadbihar.co.in/TEO-SECURE-2025",
  T41: "https://teo-vivekanadbihar.co.in/TEO-RKMS-2025",
  T42: "https://teo-vivekanadbihar.co.in/TEO-NUTAN-2025",
  T44: "https://teo-vivekanadbihar.co.in/TEO-HOLYFAITH-2025",
  T45: "https://teo-vivekanadbihar.co.in/TEO-ARYAMISSION-2025",
  T46: "https://teo-vivekanadbihar.co.in/TEO-VIVEKANANDSENIOR-2025",
  T47: "https://teo-vivekanadbihar.co.in/TEO-ADARSHVIDYA-2025",
};

export const getBaseUrlBySchoolCode = (code) => {
  return schoolBaseUrls[code] || '';
};
