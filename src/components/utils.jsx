

// Utility function to parse filesize string to number
const parseFileSize = (sizeStr) => {
    if (typeof sizeStr !== 'string') return 0;
    return parseInt(sizeStr.replace(/,/g, ''), 10) || 0;
  };
  
export {parseFileSize}
