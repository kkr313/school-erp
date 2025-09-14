import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Autocomplete,
  TablePagination,
} from '@mui/material';
import ExpenseItems from '../ui/forms/dropdown/ExpenseItems';
import EmployeeList from '../ui/forms/dropdown/EmployeeList';
import { useTheme } from '../../context/ThemeContext';
import { ArrowDropDown, Clear, Print } from '@mui/icons-material';
import { getBaseUrlBySchoolCode } from '../../utils/schoolBaseUrls';
import FilledTextField from '../../utils/FilledTextField';
import FilledAutocomplete from '../../utils/FilledAutocomplete';
import CustomBreadcrumb from '../ui/navigation/CustomBreadcrumb';

const ExpenseReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [groupOptions, setGroupOptions] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({
    groupId: 0,
    groupName: 'Select All',
  });
  const [expenseItem, setExpenseItem] = useState({
    itemId: 0,
    itemName: 'Select All',
  });
  const [expenseBy, setExpenseBy] = useState({ id: 0, name: 'Select All' });
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({
    group: '',
    expenseItem: '',
    expenseBy: '',
  });

  const { theme, fontColor } = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const schoolCode = localStorage.getItem('schoolCode');
  const baseUrl = getBaseUrlBySchoolCode(schoolCode);

  if (!baseUrl) {
    console.error('Invalid or missing school code');
    return;
  }

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/Expense/GetItemExpenseList`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (!response.ok) throw new Error('Failed to fetch groups');
        const data = await response.json();

        const groups = Array.from(
          new Map(
            data.map(item => [
              item.groupId || item.itemGroupId || item.groupName,
              {
                groupId: item.groupId || item.itemGroupId || 0,
                groupName: item.groupName || 'Unknown',
              },
            ]),
          ).values(),
        );

        const selectAll = { groupId: 0, groupName: 'Select All' };
        setGroupOptions([selectAll, ...groups]);
        setSelectedGroup(selectAll);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };
    fetchGroups();
  }, [baseUrl]);

  const fetchExpenses = async () => {
    let hasError = false;
    const errors = { group: '', expenseItem: '', expenseBy: '' };

    // Validate dropdowns
    if (!selectedGroup || !selectedGroup.groupName) {
      errors.group = 'Please select a group name.';
      hasError = true;
    }
    if (!expenseItem || !expenseItem.itemName) {
      errors.expenseItem = 'Please select an expense item.';
      hasError = true;
    }
    if (!expenseBy || !expenseBy.name) {
      errors.expenseBy = 'Please select an employee (expense by).';
      hasError = true;
    }

    setValidationErrors(errors);

    if (hasError) return;

    // Validate dates
    if (!fromDate || !toDate) {
      setError('Please select both From and To dates.');
      return;
    }
    if (new Date(toDate) < new Date(fromDate)) {
      setError('To Date cannot be earlier than From Date.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (toDate > today || fromDate > today) {
      setError('Dates cannot be in the future.');
      return;
    }

    setError('');
    setHasSearched(true);

    const payload = {
      fromDate,
      toDate,
      itemGroupId: selectedGroup?.groupId || 0,
      itemId: expenseItem?.itemId || 0,
      expensesBy: expenseBy?.id || 0,
    };

    setLoading(true);
    setExpenses([]);
    try {
      const response = await fetch(`${baseUrl}/api/Expense/GetFilterExpenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setExpenses(data);
      setPage(0);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expense report.');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // ✅ 7 days before

    const formattedToday = today.toISOString().split('T')[0];
    const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];

    setFromDate(formattedSevenDaysAgo);
    setToDate(formattedToday);
    const defaultGroup = groupOptions.find(g => g.groupId === 0) || {
      groupId: 0,
      groupName: 'Select All',
    };
    setSelectedGroup(defaultGroup);
    setExpenseItem({ itemId: 0, itemName: 'Select All' });
    setExpenseBy({ id: 0, name: 'Select All' });
    setExpenses([]);
    setHasSearched(false);
    setValidationErrors({ group: '', expenseItem: '', expenseBy: '' });
  };

  const handlePrint = () => {
    if (!expenses.length) return;
    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Voucher No</th>
            <th>Voucher Date</th>
            <th>Expense Group</th>
            <th>Item</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Expense By</th>
          </tr>
        </thead>
        <tbody>
          ${expenses
            .map(
              exp => `
            <tr>
              <td>${exp.voucherNo}</td>
              <td>${exp.voucherDate}</td>
              <td>${exp.groupName || 'N/A'}</td>
              <td>${exp.itemName || 'N/A'}</td>
              <td>${exp.descriptions || 'N/A'}</td>
              <td>₹ ${exp.amount}</td>
              <td>${exp.expensesBy || 'N/A'}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    `;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write(`
      <html>
        <head>
          <title>Expense Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h2 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; font-size: 13px; text-align: left; }
            @media print { .MuiTablePagination-root { display: none; } }
          </style>
        </head>
        <body>
          <h2>Expense Report</h2>
          ${tableHTML}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: fontColor.paper },
      '&:hover fieldset': { borderColor: fontColor.paper },
      '&.Mui-focused fieldset': { borderColor: fontColor.paper },
    },
    '& .MuiInputLabel-root': { color: fontColor.paper },
    '& .MuiFormHelperText-root': { color: 'red' },
    input: { color: fontColor.paper },
  };

  useEffect(() => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7); // ✅ 7 days before

    const formattedToday = today.toISOString().split('T')[0];
    const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];

    setFromDate(formattedSevenDaysAgo); // ✅ Default: 7 days ago
    setToDate(formattedToday); // ✅ Default: Today
  }, []);

  const paginatedExpenses = expenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ px: { xs: 2, sm: 2 }, py: { xs: 1, sm: 0 } }}>
      <CustomBreadcrumb
        title='Expenses Report'
        links={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Expense', href: '/expense' },
        ]}
      />

      <Paper sx={{ p: 2, mb: 3, backgroundColor: theme.paperBg, mt: -1 }}>
        {/* <Typography
          variant="h4"
          align="center"
          sx={{
            fontWeight: 600,
            color: theme.formHeaderFontColor,
            fontFamily: theme.formHeaderFontFamily,
            mb: 3,
          }}
        >
          Expenses Report
        </Typography> */}

        <Box
          display='grid'
          gridTemplateColumns={{ md: '1fr 1fr', xs: '1fr' }}
          gap={2}
          alignItems='start'
        >
          <FilledTextField
            label='From Date'
            type='date'
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
            fullWidth
          />
          <FilledTextField
            label='To Date'
            type='date'
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: fromDate,
              max: new Date().toISOString().split('T')[0],
            }}
            fullWidth
          />
          <FilledAutocomplete
            value={selectedGroup}
            onChange={(e, newValue) => setSelectedGroup(newValue)}
            options={groupOptions}
            getOptionLabel={option => option?.groupName || ''}
            isOptionEqualToValue={(o, v) => o.groupId === v.groupId}
            label='Group Name'
            error={!!validationErrors.group}
            helperText={validationErrors.group}
            fullWidth
            popupIcon={<ArrowDropDown sx={{ color: fontColor.paper }} />}
            clearIcon={<Clear sx={{ color: fontColor.paper }} />}
          />
          <ExpenseItems
            value={expenseItem}
            onChange={setExpenseItem}
            error={!!validationErrors.expenseItem}
            helperText={validationErrors.expenseItem}
          />
          <EmployeeList
            value={expenseBy}
            onChange={setExpenseBy}
            error={!!validationErrors.expenseBy}
            helperText={validationErrors.expenseBy}
          />
        </Box>

        <Box mt={2} display='flex' gap={2}>
          <Button variant='contained' onClick={fetchExpenses}>
            Show
          </Button>
          <Button variant='outlined' onClick={resetFilters}>
            Reset
          </Button>
          {expenses.length > 0 && (
            <Button
              variant='contained'
              color='secondary'
              onClick={handlePrint}
              startIcon={<Print />}
            >
              Print
            </Button>
          )}
        </Box>
      </Paper>

      {error && (
        <Typography color='error' sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ backgroundColor: theme.paperBg }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>
                <strong>Voucher No</strong>
              </TableCell>
              <TableCell>
                <strong>Voucher Date</strong>
              </TableCell>
              <TableCell>
                <strong>Expense Group</strong>
              </TableCell>
              <TableCell>
                <strong>Item</strong>
              </TableCell>
              <TableCell>
                <strong>Description</strong>
              </TableCell>
              <TableCell sx={{ textAlign: 'right' }}>
                <strong>Amount</strong>
              </TableCell>
              <TableCell>
                <strong>Expense By</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : expenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align='center'
                  sx={{ color: fontColor.paper }}
                >
                  {hasSearched
                    ? 'No data found.'
                    : 'No data to display. Please click "Show" after selecting filters.'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((exp, idx) => (
                <TableRow key={page * rowsPerPage + idx}>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {exp.voucherNo}
                  </TableCell>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {exp.voucherDate}
                  </TableCell>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {exp.groupName || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {exp.itemName || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {exp.descriptions || 'N/A'}
                  </TableCell>
                  <TableCell
                    sx={{
                      color:
                        theme.paperBg === 'white' || theme.paperBg === '#ffffff'
                          ? 'red'
                          : fontColor.paper,
                      fontWeight: 'bold',
                      textAlign: 'right',
                    }}
                  >
                    ₹ {exp.amount}
                  </TableCell>
                  <TableCell sx={{ color: fontColor.paper }}>
                    {exp.expensesBy || 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {expenses.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component='div'
            count={expenses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: fontColor.paper,
              '& .MuiTablePagination-toolbar': { color: fontColor.paper },
              '& .MuiSelect-select': { color: fontColor.paper },
              '& .MuiSvgIcon-root': { color: fontColor.paper },
              '& .MuiTablePagination-displayedRows': { color: fontColor.paper },
            }}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default ExpenseReport;
