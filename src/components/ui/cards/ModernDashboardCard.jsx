import React, { useState } from 'react';
import { Paper, Typography, Box, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@mui/system';

// Custom animations
const shimmerAnimation = keyframes`
  0% {
    background-position: -200px 0;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    background-position: calc(200px + 100%) 0;
    opacity: 0;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateX(0px) translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateX(-1px) translateY(-2px) rotate(0.5deg);
  }
  50% {
    transform: translateX(0px) translateY(-3px) rotate(0deg);
  }
  75% {
    transform: translateX(1px) translateY(-2px) rotate(-0.5deg);
  }
`;

const ModernDashboardCard = ({
  label,
  icon,
  color,
  path,
  description,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardContent = (
    <Fade in={true} timeout={300 + index * 100}>
      <Paper
        elevation={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          position: 'relative',
          width: { xs: '45%', sm: '28%', md: '18%' },
          minWidth: { xs: 165, sm: 190 },
          height: { xs: 160, sm: 170 },
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%, 
            rgba(255, 255, 255, 0.85) 100%
          )`,
          backdropFilter: 'blur(20px)',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.8)          `,
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflow: 'hidden',
          zIndex: 1,

          // Hover effects
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            zIndex: 10,
            boxShadow: `
              0 20px 40px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.25),
              0 8px 16px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.98) 0%, 
              rgba(255, 255, 255, 0.92) 100%
            )`,
            borderColor: `${color}60`,
          }, // Shimmer overlay
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.5),
              transparent
            )`,
            backgroundSize: '200px 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '-200px 0',
            opacity: 0,
            transition: 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 1,
          },

          // Shimmer effect on hover
          '&:hover::before': {
            opacity: 0.8,
            animation: `${shimmerAnimation} 2.5s ease-in-out`,
          }, // Active state
          '&:active': {
            transform: 'translateY(-4px) scale(0.99)',
          },

          // Mobile touch states
          '@media (hover: none)': {
            '&:active': {
              transform: 'scale(0.95)',
              boxShadow: `0 4px 12px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`,
            },
          },
        }}
      >
        {' '}
        {/* Gradient orb background */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}20, transparent 70%)`,
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isHovered
              ? 'scale(1.8) translate(-10px, 10px)'
              : 'scale(1)',
            opacity: isHovered ? 0.7 : 0.3,
          }}
        />{' '}
        {/* Icon container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            border: `2px solid ${color}20`,
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            animation: isHovered
              ? `${floatAnimation} 8s ease-in-out infinite`
              : 'none',
            transform: isHovered ? 'scale(1.08)' : 'scale(1)',

            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -2,
              borderRadius: '50%',
              background: `conic-gradient(from 0deg, transparent, ${color}60, transparent)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)',
              zIndex: -1,
            },
          }}
        >
          {' '}
          <Box
            sx={{
              fontSize: { xs: 40, sm: 44 },
              color: color,
              transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isHovered
                ? 'scale(1.1) rotate(3deg)'
                : 'scale(1) rotate(0deg)',
              filter: isHovered
                ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
                : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            {icon}
          </Box>
        </Box>
        {/* Text content */}
        <Box sx={{ position: 'relative', zIndex: 2, px: 1 }}>
          {' '}
          <Typography
            variant='subtitle1'
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.9rem', sm: '1rem' },
              color: 'rgba(0, 0, 0, 0.87)',
              lineHeight: 1.3,
              mb: description ? 0.5 : 0,
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isHovered
                ? 'translateY(-1px) scale(1.01)'
                : 'translateY(0px) scale(1)',
              ...(isHovered && {
                background: `linear-gradient(135deg, ${color}, ${color}CC)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }),
            }}
          >
            {label}
          </Typography>{' '}
          {description && (
            <Typography
              variant='caption'
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                fontSize: '0.75rem',
                opacity: isHovered ? 1 : 0.7,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: isHovered
                  ? 'translateY(-1px) scale(1.01)'
                  : 'translateY(0px) scale(1)',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>{' '}
        {/* Ripple effect */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 4,
            background: `radial-gradient(circle at center, ${color}25, transparent 70%)`,
            opacity: isHovered ? 0.3 : 0,
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: isHovered ? 'scale(1.05)' : 'scale(0.98)',
            pointerEvents: 'none',
          }}
        />
      </Paper>
    </Fade>
  );
  return path ? (
    <Link
      to={path}
      style={{
        textDecoration: 'none',
        display: 'block',
        transition: 'all 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)',
      }}
    >
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default ModernDashboardCard;
