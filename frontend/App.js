import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Output from './components/Output';
import AIChat from './components/AIChat';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('print("Hello, world!")');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('main.py');
  const [files, setFiles] = useState(['main.py']);
  const [selectedPanel, setSelectedPanel] = useState('editor'); // editor, output, ai

  const executeCode = async () => {
    try {
      const res = await axios.post('http://localhost:8000/execute', { code, filename: activeTab });
      setOutput(res.data.output + (res.data.error ? `\n${res.data.error}` : ''));
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8000/files').then(res => {
      setFiles(res.data.files);
    });
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '10px', background: '#222', color: 'white' }}>
        <h1>Python Editor (Replit-like)</h1>
        <button onClick={executeCode}>Run Code</button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#333', padding: '5px' }}>
        {files.map(file => (
          <div
            key={file}
            onClick={() => setActiveTab(file)}
            style={{
              padding: '5px 10px',
              cursor: 'pointer',
              background: activeTab === file ? '#444' : '#555',
              marginRight: '5px',
              borderRadius: '3px'
            }}
          >
            {file}
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Panel - File Explorer */}
        <div style={{ width: '200px', background: '#1e1e1e', color: 'white', padding: '10px' }}>
          <h3>Files</h3>
          <ul>
            {files.map(file => (
              <li key={file} onClick={() => setActiveTab(file)} style={{ cursor: 'pointer' }}>
                {file}
              </li>
            ))}
          </ul>
        </div>

        {/* Center Panel - Editor/Output/AI */}
        <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', marginBottom: '5px' }}>
            <button onClick={() => setSelectedPanel('editor')} style={{ marginRight: '5px' }}>Editor</button>
            <button onClick={() => setSelectedPanel('output')} style={{ marginRight: '5px' }}>Output</button>
            <button onClick={() => setSelectedPanel('ai')}>AI</button>
          </div>
          <div style={{ flex: 1 }}>
            {selectedPanel === 'editor' && <Editor value={code} onChange={setCode} />}
            {selectedPanel === 'output' && <Output output={output} />}
            {selectedPanel === 'ai' && <AIChat />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
