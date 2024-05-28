import React, { useState } from 'react';

interface Props {
    date: number;
}

export function Time({ date }: Props) {
  const [formattedDate, setFormattedDate] = useState(new Date(date));

  const formatDate = () => {
    return formattedDate.toLocaleDateString('es-es', {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div>
      <time dateTime={formattedDate.toISOString()} className='text-gray-400  p-4'>
        {formatDate()}
      </time>
    </div>
  );
}

