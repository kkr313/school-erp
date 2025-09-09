import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Chip,
    CircularProgress,
    Typography,
    Autocomplete,
    TextField,
    FormControl,
    Checkbox,
    Popper,
    Paper,
} from '@mui/material';
import { IoMdArrowDropdown, IoMdCheckmarkCircle } from 'react-icons/io';
import { useTheme } from '../../context/ThemeContext';

const hardcodedOneTimeFees = {
    1: [
        { feeHeadName: 'Admission Fee', monthName: 'April', fees: 2000 },
        { feeHeadName: 'Admission Fee', monthName: 'May', fees: 2000 },
        { feeHeadName: 'Annual Charge', monthName: 'April', fees: 1500 },
        { feeHeadName: 'Exam Fee', monthName: 'June', fees: 500 },
    ],
    2: [
        { feeHeadName: 'Admission Fee', monthName: 'April', fees: 2500 },
        { feeHeadName: 'Maintenance Fee', monthName: 'May', fees: 800 },
        { feeHeadName: 'Annual Charge', monthName: 'April', fees: 1800 },
    ],
    3: [
        { feeHeadName: 'Admission Fee', monthName: 'April', fees: 2500 },
        { feeHeadName: 'Maintenance Fee', monthName: 'April', fees: 800 },
        { feeHeadName: 'Maintenance Fee', monthName: 'May', fees: 800 },
        { feeHeadName: 'Maintenance Fee', monthName: 'June', fees: 800 },
        { feeHeadName: 'Annual Charge', monthName: 'April', fees: 1800 },
        { feeHeadName: 'Annual Charge', monthName: 'May', fees: 1800 },
        { feeHeadName: 'Annual Charge', monthName: 'July', fees: 1800 },
    ],
};

// Custom Popper component to keep the popup positioned relative to the chip dropdown button
const CustomPopper = (props) => {
    return <Popper {...props} style={{ zIndex: 1300 }} placement="bottom-start" />;
};

const OneTimeFees = ({ classId, onFeeChange }) => {
    const { theme, fontColor } = useTheme();
    const [feesData, setFeesData] = useState([]);
    const [groupedFees, setGroupedFees] = useState({});
    const [selectedMonths, setSelectedMonths] = useState({});
    const [openDropdown, setOpenDropdown] = useState(null);
    const containerRefs = useRef({}); // for chips and dropdown container
    const popperRefs = useRef({}); // for Autocomplete popup paper refs

    useEffect(() => {
        if (classId) {
            loadFeesForClass(classId);
        }
    }, [classId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!openDropdown) return;

            const container = containerRefs.current[openDropdown];
            const popper = popperRefs.current[openDropdown];

            // If click is inside either container or popup, do nothing
            if (
                (container && container.contains(event.target)) ||
                (popper && popper.contains(event.target))
            ) {
                return;
            }

            // Else click outside, close dropdown
            setOpenDropdown(null);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const loadFeesForClass = (classId) => {
        setLoading(true);
        setTimeout(() => {
            const data = hardcodedOneTimeFees[classId] || [];

            const grouped = {};
            data.forEach((item) => {
                if (!grouped[item.feeHeadName]) grouped[item.feeHeadName] = [];
                grouped[item.feeHeadName].push({
                    label: `${item.monthName} (₹${Number(item.fees).toFixed(2)})`,
                    value: item.monthName,
                });
            });

            setFeesData(data);
            setGroupedFees(grouped);
            setSelectedMonths({});
            setOpenDropdown(null);
            setLoading(false);
        }, 500);
    };

    const [loading, setLoading] = useState(false);

    const handleMonthChange = (feeHead, newValue) => {
        setSelectedMonths((prev) => ({
            ...prev,
            [feeHead]: newValue,
        }));
    };

    const handleSelectAll = (feeHead) => {
        const options = groupedFees[feeHead] || [];
        setSelectedMonths((prev) => ({
            ...prev,
            [feeHead]: options,
        }));
    };

    const handleClearAll = (feeHead) => {
        setSelectedMonths((prev) => ({
            ...prev,
            [feeHead]: [],
        }));
    };

    const toggleDropdown = (feeHead) => {
        setOpenDropdown((prev) => (prev === feeHead ? null : feeHead));
    };

    const handleChipClick = (feeHead) => {
        const isAllSelected =
            (selectedMonths[feeHead] || []).length === (groupedFees[feeHead] || []).length;
        isAllSelected ? handleClearAll(feeHead) : handleSelectAll(feeHead);
    };

    useEffect(() => {
        if (onFeeChange) {
            const selectedFeeList = [];

            Object.entries(selectedMonths).forEach(([feeHead, months]) => {
                months.forEach((month) => {
                    const match = feesData.find(
                        (f) => f.feeHeadName === feeHead && f.monthName === month.value
                    );
                    if (match) {
                        selectedFeeList.push({
                            feeHeadName: match.feeHeadName,
                            monthName: match.monthName,
                            amount: match.fees,
                        });
                    }
                });
            });

            onFeeChange(selectedFeeList);
        }
    }, [selectedMonths, feesData]);

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

    return (
        <Box sx={{ maxWidth: '100%', mx: 'auto', p: 2 }}>
            {loading ? (
                <CircularProgress sx={{ mt: 3 }} />
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {Object.keys(groupedFees).map((feeHead) => {
                        const selected = selectedMonths[feeHead] || [];
                        const allSelected = selected.length === groupedFees[feeHead].length;

                        return (
                            <Box
                                key={feeHead}
                                sx={{ width: 200, flexShrink: 0, position: 'relative' }}
                                ref={(el) => (containerRefs.current[feeHead] = el)}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <Chip
                                        icon={
                                            allSelected ? (
                                                <IoMdCheckmarkCircle color="white" fontSize={20} />
                                            ) : null
                                        }
                                        label={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mx: 'auto',
                                                    fontWeight: 500,
                                                    textAlign: 'center',
                                                    width: '100%',
                                                    color: selected.length > 0 ? 'white' : 'black',
                                                }}
                                            >
                                                {`${feeHead} ${selected.length ? `[${selected.length}]` : ''}`}
                                            </Typography>
                                        }
                                        onClick={() => handleChipClick(feeHead)}
                                        sx={{
                                            cursor: 'pointer',
                                            width: '100%',
                                            pr: 3,
                                            borderRadius: 10,
                                            backgroundColor: selected.length > 0 ? 'primary.main' : '#eee',
                                            '&:hover': {
                                                backgroundColor: selected.length > 0 ? 'primary.dark' : '#ddd',
                                            },
                                        }}
                                    />

                                    <Box
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(feeHead);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            right: 10,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            zIndex: 2,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <IoMdArrowDropdown
                                            fontSize={20}
                                            style={{ color: selected.length > 0 ? 'white' : 'black' }}
                                        />
                                    </Box>
                                </Box>

                                {openDropdown === feeHead && (
                                    <FormControl fullWidth sx={{ mt: 1, position: 'relative', zIndex: 1300 }}>
                                        <Autocomplete
                                            multiple
                                            options={groupedFees[feeHead] || []}
                                            value={selected}
                                            onChange={(_, value) => handleMonthChange(feeHead, value)}
                                            disableCloseOnSelect
                                            size="small"
                                            open
                                            disableClearable
                                            PopperComponent={(popperProps) => (
                                                <Popper
                                                    {...popperProps}
                                                    style={{ zIndex: 1300 }}
                                                    placement="bottom-start"
                                                    modifiers={[
                                                        {
                                                            name: 'preventOverflow',
                                                            options: {
                                                                boundary: 'viewport',
                                                            },
                                                        },
                                                    ]}
                                                    ref={(el) => (popperRefs.current[feeHead] = el)}
                                                />
                                            )}
                                            getOptionLabel={(option) => option.label}
                                            renderOption={(props, option, { selected }) => (
                                                <li {...props}>
                                                    <Checkbox checked={selected} sx={{ mr: 1 }} />
                                                    {option.label}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select months"
                                                    variant="outlined"
                                                    sx={textFieldStyles}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        style: { height: 40, color: theme },
                                                    }}
                                                />
                                            )}
                                            renderTags={() => null}
                                            ListboxProps={{ style: { maxHeight: 200 } }}
                                            sx={{ width: '100%' }}
                                        />
                                    </FormControl>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            )}
        </Box>
    );
};

export default OneTimeFees;
