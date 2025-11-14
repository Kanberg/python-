import React, { useState, useEffect } from 'react';

export default function({ output }) {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    // Если вывод содержит HTML, отображаем его
    if (output.includes('<html>') || output.includes('<body>')) {
      setSrcDoc(output);
    } else {
      setSrcDoc(`<pre>${output}</pre>`);
    }
  }, [output]);

  return (
    <iframe
      title="output"
      srcDoc={srcDoc}
      style={{ width: '100%', height: '100%', border: 'none' }}
      sandbox="allow-scripts"
    />
  );
}
