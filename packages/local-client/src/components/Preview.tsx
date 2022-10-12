import { useRef, useEffect } from 'react';
import './Preview.css';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
<html>
<body>
  <div id="root"></div>
  <script>
    const handleError = (err) => {
        const root = document.querySelector('#root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime error</h4>' + err + '</div>';
        console.err(err);
    };

    window.addEventListener('error', (event) => {
      event.preventDefault();
      handleError(err);
    });

    window.addEventListener('message', (event) => {
      try{
        eval(event.data);
      }catch(err){
        handleError(err);
      }
    }, false);
  </script>
</body>
</html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="preview"
        srcDoc={html}
        sandbox="allow-scripts"
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
