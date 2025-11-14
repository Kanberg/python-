import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function({ value, onChange, language = 'python' }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      onMount={(editor) => {
        editorRef.current = editor;
      }}
    />
  );
}
