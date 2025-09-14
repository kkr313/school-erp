import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';

import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme } from '../../../context/ThemeContext';

// Split Components
import BasicStudentInfo from './BasicStudentInfo';
import PersonalInfo from './PersonalInfo';
import AddressContactInfo from './AddressContactInfo';
import AdditionalInfo from './AdditionalInfo';
import FeesSection from './FeesSection';
import AccordionSections from './AccordionSections';
import FormActions from './FormActions';

// Other imports
import { usePrompt } from '../../../hooks/usePrompt';
import { useBeforeUnload } from '../../../hooks/useBeforeUnload';
import AdmissionPrintView from '../../ui/print/AdmissionPrintView';
import CustomBreadcrumb from '../../ui/navigation/CustomBreadcrumb';

const Admission = () => {
  const { theme, fontColor } = useTheme();
  const muiTheme = useMuiTheme();

  const [formData, setFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);

  const [admissionNo, setAdmissionNo] = useState(12345);
  const [dateOfAdmission, setDateOfAdmission] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [address, setAddress] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [district, setDistrict] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [nationality, setNationality] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [schoolPeriod, setSchoolPeriod] = useState('');
  const [studentType, setStudentType] = useState('');
  const [studentStatus, setStudentStatus] = useState('');
  const [religion, setReligion] = useState('');
  const [category, setCategory] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  // Fees-related states
  const [monthlyFeeData, setMonthlyFeeData] = useState([]);
  const [oneTimeFeeData, setOneTimeFeeData] = useState([]);
  const [transportFeeData, setTransportFeeData] = useState([]);
  const [assignFees, setAssignFees] = useState(false);
  const [showMonthly, setShowMonthly] = useState(true);
  const [showOneTime, setShowOneTime] = useState(true);
  const [showTransport, setShowTransport] = useState(true);

  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showParentDetails, setShowParentDetails] = useState(false);

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: fontColor.paper },
    input: { color: fontColor.paper },
  };

  const isDirty = !!(
    dateOfAdmission ||
    rollNo ||
    studentName ||
    gender ||
    dob ||
    fatherName ||
    address ||
    selectedState ||
    district ||
    mobileNo ||
    nationality ||
    bloodGroup ||
    schoolPeriod ||
    studentType ||
    studentStatus ||
    religion ||
    category ||
    selectedClass ||
    selectedSection ||
    assignFees ||
    monthlyFeeData.length ||
    oneTimeFeeData.length ||
    transportFeeData.length ||
    showAdditionalDetails ||
    showParentDetails
  );

  const [printMode, setPrintMode] = useState(false);
  const printRef = useRef(null);

  usePrompt(
    'You have unsaved changes. Are you sure you want to leave this page?',
    isDirty,
  );

  useBeforeUnload(isDirty);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      // Validate required fields
      const requiredFields = [
        { value: studentName, name: 'Student Name' },
        { value: dateOfAdmission, name: 'Date of Admission' },
        { value: dob, name: 'Date of Birth' },
        { value: fatherName, name: "Father's Name" },
        { value: address, name: 'Address' },
        { value: mobileNo, name: 'Mobile No.' },
        { value: nationality, name: 'Nationality' },
      ];

      const emptyFields = requiredFields.filter(
        field => !field.value || field.value.trim() === '',
      );

      if (emptyFields.length > 0) {
        const fieldNames = emptyFields.map(field => field.name).join(', ');
        alert(`Please fill in the following required fields: ${fieldNames}`);
        return;
      }

      const data = {
        'Admission No': admissionNo,
        'Student Name': studentName,
        DOA: dateOfAdmission,
        Class: selectedClass?.label || '',
        Section: selectedSection || '',
        'Roll No': rollNo,
        Gender: gender,
        'Date of Birth': dob,
        "Father's Name": fatherName,
        Address: address,
        State: selectedState,
        District: district || '',
        'Mobile No': mobileNo,
        Nationality: nationality,
        'Blood Group': bloodGroup,
        'School Period': schoolPeriod,
        'Student Type': studentType,
        'Student Status': studentStatus,
        Religion: religion,
        Category: category,
        'Monthly Fees': monthlyFeeData,
        'One-Time Fees': oneTimeFeeData,
        'Transport Fees': transportFeeData,
      };

      setFormData(data);
      setModalOpen(true);
    },
    [
      admissionNo,
      studentName,
      dateOfAdmission,
      selectedClass,
      selectedSection,
      rollNo,
      gender,
      dob,
      fatherName,
      address,
      selectedState,
      district,
      mobileNo,
      nationality,
      bloodGroup,
      schoolPeriod,
      studentType,
      studentStatus,
      religion,
      category,
      monthlyFeeData,
      oneTimeFeeData,
      transportFeeData,
    ],
  );

  const resetForm = useCallback(() => {
    setAdmissionNo(prev => prev + 1);
    setDateOfAdmission('');
    setRollNo('');
    setStudentName('');
    setGender('');
    setDob('');
    setFatherName('');
    setAddress('');
    setSelectedState('');
    setDistrict('');
    setMobileNo('');
    setNationality('');
    setBloodGroup('');
    setSchoolPeriod('');
    setStudentType('');
    setStudentStatus('');
    setReligion('');
    setCategory('');
    setSelectedClass('');
    setSelectedSection('');
    setAssignFees(false);
    setMonthlyFeeData([]);
    setOneTimeFeeData([]);
    setTransportFeeData([]);
    setShowAdditionalDetails(false);
    setShowParentDetails(false);
    setShowMonthly(true);
    setShowOneTime(true);
    setShowTransport(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    resetForm();
  }, [resetForm]);

  const handlePrint = useCallback(() => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 300);
  }, []);

  // Memoized styles for better performance
  const containerSx = useMemo(
    () => ({
      width: '100%',
      maxWidth: { xs: '100%', sm: 900 },
      mx: 'auto',
      mt: { xs: 1, sm: 1 },
      mb: { xs: 3, sm: 4 },
      px: { xs: 2, sm: 3 },
      py: { xs: 2, sm: 2.5 },
      background: 'rgba(255,255,255,0.98)',
      borderRadius: 2,
      boxShadow: '0 4px 20px 0 rgba(31,38,135,0.08)',
      border: '1px solid rgba(226, 232, 240, 0.6)',
      transition: 'all 0.3s ease',
    }),
    [],
  );

  const formSx = useMemo(
    () => ({
      display: 'grid',
      gap: '0.8rem',
      width: '100%',
      gridTemplateColumns: '1fr',
      [muiTheme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
      },
      [muiTheme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.2rem',
      },
      '& > *': {
        gridColumn: 'span 1',
        width: '100%',
      },
      '& .span-2': {
        [muiTheme.breakpoints.up('sm')]: {
          gridColumn: 'span 2',
        },
      },
      '& .span-3': {
        [muiTheme.breakpoints.up('md')]: {
          gridColumn: 'span 3',
        },
      },
    }),
    [muiTheme],
  );

  return (
    <>
      {/* Breadcrumb section - visually separated, no background wrapper */}
      <Box sx={{ width: '100%', mb: 0, pb: 0 }}>
        <CustomBreadcrumb
          title='Student Admission'
          links={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Admission', href: '/admission' },
          ]}
          animated={true}
        />
      </Box>

      {/* Main module section - full width, premium design */}
      <Box
        sx={{
          width: '100%',
          px: { xs: 0, sm: 0 },
          pt: 0,
          mt: 0,
        }}
      >
        <Box sx={containerSx}>
          {/* <Typography
          variant="h4"
          align="center"
          mb={4}
          sx={{
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            fontWeight: 600,
          }}
        >
          Admission Form
        </Typography> */}

          <Box
            component='form'
            autoComplete='off'
            onSubmit={handleSubmit}
            sx={formSx}
          >
            {/* Basic Student Information */}
            <BasicStudentInfo
              admissionNo={admissionNo}
              dateOfAdmission={dateOfAdmission}
              setDateOfAdmission={setDateOfAdmission}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
              rollNo={rollNo}
              setRollNo={setRollNo}
              studentName={studentName}
              setStudentName={setStudentName}
            />

            {/* Personal Information */}
            <PersonalInfo
              gender={gender}
              setGender={setGender}
              dob={dob}
              setDob={setDob}
              fatherName={fatherName}
              setFatherName={setFatherName}
            />

            {/* Address & Contact Information */}
            <AddressContactInfo
              address={address}
              setAddress={setAddress}
              mobileNo={mobileNo}
              setMobileNo={setMobileNo}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              district={district}
              setDistrict={setDistrict}
              nationality={nationality}
              setNationality={setNationality}
            />

            {/* Additional Information */}
            <AdditionalInfo
              bloodGroup={bloodGroup}
              setBloodGroup={setBloodGroup}
              schoolPeriod={schoolPeriod}
              setSchoolPeriod={setSchoolPeriod}
              studentType={studentType}
              setStudentType={setStudentType}
              studentStatus={studentStatus}
              setStudentStatus={setStudentStatus}
              religion={religion}
              setReligion={setReligion}
              category={category}
              setCategory={setCategory}
            />

            {/* Fees Section */}
            <FeesSection
              selectedClass={selectedClass}
              showMonthly={showMonthly}
              setShowMonthly={setShowMonthly}
              showOneTime={showOneTime}
              setShowOneTime={setShowOneTime}
              showTransport={showTransport}
              setShowTransport={setShowTransport}
              setMonthlyFeeData={setMonthlyFeeData}
              setOneTimeFeeData={setOneTimeFeeData}
              setTransportFeeData={setTransportFeeData}
            />

            {/* Accordion Sections */}
            <AccordionSections formData={formData} setFormData={setFormData} />

            {/* Form Actions */}
            <FormActions
              onSubmit={handleSubmit}
              onReset={resetForm}
              theme={theme}
              fontColor={fontColor}
            />
          </Box>

          <Dialog
            open={modalOpen}
            onClose={handleCloseModal}
            maxWidth='sm'
            fullWidth
            PaperProps={{
              sx: {
                backgroundColor: theme.paperBg,
                color: fontColor.paper,
              },
            }}
          >
            {!printMode && (
              <DialogTitle sx={{ color: fontColor.paper }}>
                Submitted Admission Details
              </DialogTitle>
            )}

            <DialogContent
              dividers
              sx={{
                borderTop: `1px solid ${fontColor.paper}`,
                borderBottom: `1px solid ${fontColor.paper}`,
                px: 2,
              }}
            >
              {!printMode ? (
                <div ref={printRef}>
                  {Object.entries(formData).map(([label, value]) => {
                    const isFeeArray = [
                      'Monthly Fees',
                      'One-Time Fees',
                      'Transport Fees',
                    ].includes(label);
                    return (
                      <Typography
                        key={label}
                        gutterBottom
                        sx={{ color: fontColor.paper }}
                      >
                        <strong>{label}:</strong>{' '}
                        {Array.isArray(value) && isFeeArray ? (
                          value.length > 0 ? (
                            <ul
                              style={{ paddingLeft: '1rem', marginTop: '4px' }}
                            >
                              {value.map((item, index) => (
                                <li key={index}>
                                  {Object.values(item).join(', ')}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            '-'
                          )
                        ) : (
                          value || '-'
                        )}
                      </Typography>
                    );
                  })}
                </div>
              ) : (
                <div ref={printRef}>
                  <AdmissionPrintView data={formData} fontColor={fontColor} />
                </div>
              )}
            </DialogContent>

            <DialogActions sx={{ backgroundColor: theme.paperBg }}>
              <Button
                onClick={handlePrint}
                color='secondary'
                variant='outlined'
              >
                Print
              </Button>
              <Button
                onClick={handleCloseModal}
                color='primary'
                variant='contained'
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default Admission;
