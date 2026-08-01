import React from 'react';

interface MobileGridProps {
  children: React.ReactNode;
  columns?: number;
}

export const MobileGrid: React.FC<MobileGridProps> = ({ children, columns = 2 }) => {
  // Use Tailwind grid columns dynamically based on the prop
  // Fallback to 2 columns if an unsupported value is passed
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] || 'grid-cols-2';

  return (
    <div className={`grid ${gridColsClass} gap-4 p-4 w-full max-w-2xl mx-auto`}>
      {children}
    </div>
  );
};
