import React, { forwardRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';

// Wrap ReactQuill and forward the ref directly to the DOM element
const ReactQuillWrapper = forwardRef<ReactQuill, ReactQuillProps>((props, ref) => {
  return <ReactQuill ref={ref} {...props} />;
});

export default ReactQuillWrapper;
