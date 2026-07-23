import React from 'react';

interface BaraaLogoProps {
  variant?: 'badge' | 'icon' | 'transparent' | 'simple';
  className?: string;
  size?: number | string;
}

export default function BaraaLogo({
  variant = 'badge',
  className = '',
  size
}: BaraaLogoProps) {
  // Color palette constants matching the official uploaded logo
  const colors = {
    cream: '#FAF8F5',      // Soft off-white/cream background
    darkBlue: '#0F2247',   // Elegant deep blue for borders and text
    gold: '#DF9327',       // Warm yellow-orange/gold for the cloche
  };

  if (variant === 'icon') {
    // Just the gold cloche with fork & knife cutouts
    return (
      <svg
        viewBox="100 100 300 200"
        className={className}
        style={{ width: size, height: size }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {/* Knob on top */}
          <circle cx="250" cy="136" r="15" fill={colors.gold} />
          <path d="M 242,148 L 258,148 L 255,160 L 245,160 Z" fill={colors.gold} />
          
          {/* Dome */}
          <path d="M 144,256 A 106,106 0 0,1 356,256 Z" fill={colors.gold} />
          
          {/* Base plate */}
          <rect x="134" y="260" width="232" height="16" rx="8" fill={colors.gold} />

          {/* Fork Cutout (Transparent look using background cream color) */}
          {/* Fork Handle */}
          <rect x="225" y="218" width="6" height="50" rx="2" fill="#FAF8F5" className="fill-current-bg" />
          {/* Fork Head */}
          <path
            d="M 225,218 C 223,205 215,202 215,180 L 215,174 L 241,174 L 241,180 C 241,202 233,205 231,218 Z"
            fill="#FAF8F5"
            className="fill-current-bg"
          />
          {/* Fork Tines Slots (Overlay in gold to carve out tines) */}
          <rect x="220" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />
          <rect x="226.5" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />
          <rect x="233" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />

          {/* Knife Cutout */}
          {/* Knife Handle */}
          <rect x="269" y="218" width="6" height="50" rx="2" fill="#FAF8F5" className="fill-current-bg" />
          {/* Knife Blade */}
          <path
            d="M 269,218 L 275,218 L 275,174 C 275,174 260,180 260,198 C 260,208 266,212 269,218 Z"
            fill="#FAF8F5"
            className="fill-current-bg"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'transparent') {
    // Full logo contents (cloche + text) without the rounded square background & outer border
    return (
      <svg
        viewBox="100 100 300 300"
        className={className}
        style={{ width: size, height: size }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {/* Knob on top */}
          <circle cx="250" cy="136" r="15" fill={colors.gold} />
          <path d="M 242,148 L 258,148 L 255,160 L 245,160 Z" fill={colors.gold} />
          
          {/* Dome */}
          <path d="M 144,256 A 106,106 0 0,1 356,256 Z" fill={colors.gold} />
          
          {/* Base plate */}
          <rect x="134" y="260" width="232" height="16" rx="8" fill={colors.gold} />

          {/* Fork Cutout */}
          <rect x="225" y="218" width="6" height="50" rx="2" fill="#FAF8F5" className="fill-current-bg" />
          <path
            d="M 225,218 C 223,205 215,202 215,180 L 215,174 L 241,174 L 241,180 C 241,202 233,205 231,218 Z"
            fill="#FAF8F5"
            className="fill-current-bg"
          />
          <rect x="220" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />
          <rect x="226.5" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />
          <rect x="233" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />

          {/* Knife Cutout */}
          <rect x="269" y="218" width="6" height="50" rx="2" fill="#FAF8F5" className="fill-current-bg" />
          <path
            d="M 269,218 L 275,218 L 275,174 C 275,174 260,180 260,198 C 260,208 266,212 269,218 Z"
            fill="#FAF8F5"
            className="fill-current-bg"
          />

          {/* Logo Typography */}
          <text
            x="250"
            y="336"
            fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
            fontWeight="bold"
            fontSize="48"
            fill={colors.darkBlue}
            textAnchor="middle"
            letterSpacing="4"
          >
            BARAA
          </text>
          <text
            x="250"
            y="374"
            fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
            fontWeight="bold"
            fontSize="24"
            fill={colors.darkBlue}
            textAnchor="middle"
            letterSpacing="2"
          >
            RESTAURANT
          </text>
        </g>
      </svg>
    );
  }

  // DEFAULT: 'badge' variant (exact replication of the uploaded image)
  return (
    <svg
      viewBox="0 0 500 500"
      className={`select-none ${className}`}
      style={{ width: size, height: size }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Cream/Off-white Rounded Background Container */}
      <rect x="10" y="10" width="480" height="480" rx="95" fill={colors.cream} />
      
      {/* 2. Outer Thin Dark Blue Border */}
      <rect
        x="52"
        y="52"
        width="396"
        height="396"
        rx="76"
        fill="none"
        stroke={colors.darkBlue}
        strokeWidth="7"
      />

      {/* 3. Gold Food Dome (Cloche) with Handles */}
      {/* Knob */}
      <circle cx="250" cy="136" r="15" fill={colors.gold} />
      <path d="M 242,148 L 258,148 L 255,160 L 245,160 Z" fill={colors.gold} />
      
      {/* Dome Main Arc */}
      <path d="M 144,256 A 106,106 0 0,1 356,256 Z" fill={colors.gold} />
      
      {/* Dome Base Plate */}
      <rect x="134" y="260" width="232" height="16" rx="8" fill={colors.gold} />

      {/* 4. Cutouts (Carved Fork and Knife overlayed with Cream background color) */}
      {/* Fork Handle */}
      <rect x="225" y="218" width="6" height="50" rx="2" fill={colors.cream} />
      {/* Fork Head */}
      <path
        d="M 225,218 C 223,205 215,202 215,180 L 215,174 L 241,174 L 241,180 C 241,202 233,205 231,218 Z"
        fill={colors.cream}
      />
      {/* Fork Tine Slots */}
      <rect x="220" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />
      <rect x="226.5" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />
      <rect x="233" y="174" width="3.2" height="24" rx="1" fill={colors.gold} />

      {/* Knife Handle */}
      <rect x="269" y="218" width="6" height="50" rx="2" fill={colors.cream} />
      {/* Knife Blade */}
      <path
        d="M 269,218 L 275,218 L 275,174 C 275,174 260,180 260,198 C 260,208 266,212 269,218 Z"
        fill={colors.cream}
      />

      {/* 5. Elegant Serif Typography Below the Cloche */}
      <text
        x="250"
        y="336"
        fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
        fontWeight="bold"
        fontSize="50"
        fill={colors.darkBlue}
        textAnchor="middle"
        letterSpacing="4"
      >
        BARAA
      </text>
      <text
        x="250"
        y="376"
        fontFamily="'Playfair Display', 'Georgia', 'Times New Roman', serif"
        fontWeight="bold"
        fontSize="24"
        fill={colors.darkBlue}
        textAnchor="middle"
        letterSpacing="2.5"
      >
        RESTAURANT
      </text>
    </svg>
  );
}
