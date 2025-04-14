import React from 'react';

const PieChart = ({ data, colors }) => {
  // Simple pie chart implementation
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  
  return (
    <svg width="200" height="200" viewBox="0 0 100 100">
      <g transform="translate(50,50)">
        {data.map((item, i) => {
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          currentAngle = endAngle;
          
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          
          const x1 = Math.cos(startRad) * 40;
          const y1 = Math.sin(startRad) * 40;
          const x2 = Math.cos(endRad) * 40;
          const y2 = Math.sin(endRad) * 40;
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${x1} ${y1}`,
            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'L 0 0',
            'Z'
          ].join(' ');
          
          return (
            <path
              key={i}
              d={pathData}
              fill={colors[i % colors.length]}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default PieChart;