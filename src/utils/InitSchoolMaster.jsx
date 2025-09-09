// InitSchoolMaster.jsx
import { useEffect } from 'react';
import { getBaseUrlBySchoolCode } from './schoolBaseUrls';

const InitSchoolMaster = () => {
  useEffect(() => {
    const schoolCode = localStorage.getItem('schoolCode');
    const existing = localStorage.getItem('schoolMaster');

    if (!schoolCode || existing) return; // already saved

    const fetchSchool = async () => {
      const baseUrl = getBaseUrlBySchoolCode(schoolCode);
      if (!baseUrl) return;

      try {
        const res = await fetch(`${baseUrl}/api/Schools/GetSchoolDetails`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await res.json();
        if (!data?.name) return;

        const schoolMaster = {
          name: data.name || "",
          slogan: data.slogan || "",
          address: data.address || "",
          country: data.country || "India",
          state: data.state || "",
          district: data.district || "",
          city: data.city || "",
          mobile: data.mobileNo || "",
          phone: data.phoneNo || "",
          contactPerson: data.contactPerson || "",
          email: data.email || "",
          website: data.website || "",
          uDise: data.uDiseNo || "",
          year: data.yearEstablishment || "",
          board: data.boardUniversity || "",
          affiliatedBy: data.aff || "",
          regNo: data.regNo || "",
          principal: data.principal || "",
          logo: ""
        };

        localStorage.setItem('schoolMaster', JSON.stringify(schoolMaster));
      } catch (err) {
        console.error('Failed to fetch school details', err);
      }
    };

    fetchSchool();
  }, []);

  return null;
};

export default InitSchoolMaster;
