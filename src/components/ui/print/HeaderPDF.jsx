// src/components/config/HeaderPDF.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '../../../context/ThemeContext';
import PersonIcon from '@mui/icons-material/Person';

const HeaderPDF = ({ overrideStyle }) => {
  const [school, setSchool] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem('schoolMaster');
    if (saved) setSchool(JSON.parse(saved));
  }, []);

  if (!school) return null;

  const appliedStyle = {
    printHeaderFontColor:
      overrideStyle?.printHeaderFontColor || theme.printHeaderFontColor,
    printHeaderFontFamily:
      overrideStyle?.printHeaderFontFamily || theme.printHeaderFontFamily,
    printSubHeaderFontColor:
      overrideStyle?.printSubHeaderFontColor || theme.printSubHeaderFontColor,
    printSubHeaderFontFamily:
      overrideStyle?.printSubHeaderFontFamily || theme.printSubHeaderFontFamily,
    printHeaderStyle:
      overrideStyle?.printHeaderStyle || theme.printHeaderStyle || 'style1',
  };

  const renderLogo = (width = 100, height = 90) => (
    <Avatar
      src={school.logo || undefined}
      alt='School Logo'
      variant='square'
      sx={{
        width,
        height,
        mx: 'auto',
        mb: 1,
        bgcolor: !school.logo ? '#f5f5f5' : 'transparent',
        border: !school.logo ? '1px solid #ccc' : 'none',
      }}
    >
      {!school.logo && <PersonIcon sx={{ fontSize: 40, color: '#888' }} />}
    </Avatar>
  );

  const renderStyle1 = () => (
    <Box textAlign='center' mb={2} sx={{ borderBottom: '1px solid #d1d5dc' }}>
      {renderLogo()}
      <Typography
        variant='h5'
        fontWeight='bold'
        sx={{
          fontFamily: appliedStyle.printHeaderFontFamily,
          color: appliedStyle.printHeaderFontColor,
        }}
      >
        {school.name}
      </Typography>

      {school.slogan && (
        <Typography
          variant='subtitle2'
          fontStyle='italic'
          sx={{
            fontFamily: appliedStyle.printSubHeaderFontFamily,
            color: appliedStyle.printSubHeaderFontColor,
          }}
        >
          {school.slogan}
        </Typography>
      )}

      {school.address && (
        <Typography
          variant='body2'
          sx={{
            fontFamily: appliedStyle.printSubHeaderFontFamily,
            color: appliedStyle.printSubHeaderFontColor,
          }}
        >
          {school.address}
        </Typography>
      )}

      {school.uDise && (
        <Typography
          variant='body2'
          sx={{
            fontFamily: appliedStyle.printSubHeaderFontFamily,
            color: appliedStyle.printSubHeaderFontColor,
          }}
        >
          UDISE : {school.uDise}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        {school.email && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            Email : {school.email}
          </Typography>
        )}
        {school.mobile && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            Mobile : {school.mobile}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderStyle2 = () => (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      mb={2}
      borderBottom='1px solid #ccc'
    >
      {renderLogo()}
      <Box flex={1} textAlign='right' ml={2}>
        <Typography
          variant='h5'
          fontWeight='bold'
          sx={{
            fontFamily: appliedStyle.printHeaderFontFamily,
            color: appliedStyle.printHeaderFontColor,
          }}
        >
          {school.name}
        </Typography>
        {school.slogan && (
          <Typography
            variant='subtitle2'
            fontStyle='italic'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            {school.slogan}
          </Typography>
        )}
        {school.address && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            {school.address}
          </Typography>
        )}
        {school.uDise && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            UDISE : {school.uDise}
          </Typography>
        )}
        {school.email && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            Email : {school.email}
          </Typography>
        )}
        {school.mobile && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            Mobile : {school.mobile}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderStyle3 = () => (
    <Box
      mb={2}
      display='flex'
      justifyContent='space-between'
      alignItems='flex-start'
      sx={{ borderBottom: '1px dashed #999', px: 2 }}
    >
      <Box textAlign='left'>
        <Typography
          variant='h6'
          fontWeight='bold'
          sx={{
            fontFamily: appliedStyle.printHeaderFontFamily,
            color: appliedStyle.printHeaderFontColor,
          }}
        >
          {school.name}
        </Typography>

        {school.slogan && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            {school.slogan}
          </Typography>
        )}

        {school.address && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            {school.address}
          </Typography>
        )}

        {school.email && (
          <Typography variant='body2'>Email: {school.email}</Typography>
        )}
        {school.mobile && (
          <Typography variant='body2'>Mobile: {school.mobile}</Typography>
        )}
      </Box>

      <Box>{renderLogo()}</Box>
    </Box>
  );

  const renderStyle4 = () => (
    <Box
      display='flex'
      alignItems='center'
      mb={2}
      borderBottom='2px solid #000'
      pb={1}
    >
      {renderLogo()}
      <Box flex={1} textAlign='center'>
        <Typography
          variant='h4'
          fontWeight='bold'
          sx={{
            fontFamily: appliedStyle.printHeaderFontFamily,
            color: appliedStyle.printHeaderFontColor,
          }}
        >
          {school.name}
        </Typography>

        {school.slogan && (
          <Typography
            variant='body1'
            fontWeight='600'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            {school.slogan}
          </Typography>
        )}

        {school.address && (
          <Typography
            variant='body1'
            fontWeight='600'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            {school.address}
          </Typography>
        )}

        <Typography
          variant='body2'
          sx={{
            fontFamily: appliedStyle.printSubHeaderFontFamily,
            color: appliedStyle.printSubHeaderFontColor,
          }}
        >
          {school.email && (
            <>
              Email: <b>{school.email}</b>{' '}
            </>
          )}{' '}
          <br />
          {school.mobile && (
            <>
              Mobile: <b>{school.mobile}</b>{' '}
            </>
          )}{' '}
          <span>|</span>
          {school.website && (
            <>
              Website: <b>{school.website}</b>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );

  const renderStyle5 = () => (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      mb={2}
      borderBottom='1px solid #ccc'
    >
      {renderLogo(70, 60)}
      <Box flex={1} textAlign='right' ml={2}>
        <Typography
          variant='h5'
          fontSize={18}
          fontWeight='bold'
          sx={{
            fontFamily: appliedStyle.printHeaderFontFamily,
            color: appliedStyle.printHeaderFontColor,
          }}
        >
          {school.name}
        </Typography>
        {school.address && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            {school.address}
          </Typography>
        )}
        {school.mobile && (
          <Typography
            variant='body2'
            sx={{
              fontFamily: appliedStyle.printSubHeaderFontFamily,
              color: appliedStyle.printSubHeaderFontColor,
            }}
          >
            Mobile : {school.mobile}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const renderByStyle = () => {
    switch (appliedStyle.printHeaderStyle) {
      case 'style2':
        return renderStyle2();
      case 'style3':
        return renderStyle3();
      case 'style4':
        return renderStyle4();
      case 'style5':
        return renderStyle5();
      case 'style1':
      default:
        return renderStyle1();
    }
  };

  return renderByStyle();
};

export default HeaderPDF;
