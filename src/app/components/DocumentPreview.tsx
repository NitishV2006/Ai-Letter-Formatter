import { Download, Copy, FilePen, FileText, Save, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';

interface DocumentPreviewProps {
  content: string | null;
  isGenerating: boolean;
  onContentChange?: (newContent: string) => void;
}

export function DocumentPreview({ content, isGenerating, onContentChange }: DocumentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (content) {
      setEditedContent(content);
    }
  }, [content]);

  const handleDownloadPDF = () => {
    if (!content) return;
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Document</title>
            <style>
              @page {
                size: A4;
                margin: 2cm;
              }
              body {
                font-family: 'Times New Roman', Times, serif;
                font-size: 12pt;
                line-height: 1.6;
                color: #000;
                max-width: 21cm;
                margin: 0 auto;
                padding: 2cm;
              }
              pre {
                white-space: pre-wrap;
                font-family: 'Times New Roman', Times, serif;
              }
            </style>
          </head>
          <body>
            <pre>${editedContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        toast.success('PDF print dialog opened');
      }, 250);
    }
  };

  const handleDownloadWord = () => {
    if (!content) return;
    
    // Create a Word-compatible document
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Document</title>
        <style>
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.6;
          }
          pre {
            white-space: pre-wrap;
            font-family: 'Times New Roman', Times, serif;
          }
        </style>
      </head>
      <body>
    `;
    
    const footer = '</body></html>';
    const sourceHTML = header + `<pre>${editedContent}</pre>` + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Word document downloaded successfully');
  };

  const handleCopy = () => {
    if (editedContent) {
      navigator.clipboard.writeText(editedContent);
      toast.success('Letter copied to clipboard');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast.info('Edit mode enabled - click to edit document');
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerText;
      setEditedContent(newContent);
      if (onContentChange) {
        onContentChange(newContent);
      }
      toast.success('Changes saved successfully');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (content) {
      setEditedContent(content);
    }
    toast.info('Edit cancelled');
  };

  return (
    <div className="flex-1 bg-[#F8FAFC] p-6 flex flex-col">
      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Document Preview {isEditing && <span className="text-[#2563EB]">(Editing)</span>}
        </h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
                className="gap-2 rounded-xl"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8]"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                disabled={!content}
                className="gap-2 rounded-xl"
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadWord}
                disabled={!content}
                className="gap-2 rounded-xl"
              >
                <FileText className="w-4 h-4" />
                Word
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                disabled={!content}
                className="gap-2 rounded-xl"
              >
                <FilePen className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!content}
                className="gap-2 rounded-xl"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </>
          )}
        </div>
      </div>

      {/* A4 Paper Preview */}
      <div className="flex-1 flex items-start justify-center overflow-auto py-6">
        <div
          className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-[210mm] min-h-[297mm]"
          style={{
            aspectRatio: '210 / 297',
            boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 20px 40px -10px rgb(0 0 0 / 0.15)'
          }}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Generating your letter...</p>
              </div>
            </div>
          ) : content ? (
            <div className="prose prose-sm max-w-none">
              <pre 
                ref={contentEditableRef}
                contentEditable={isEditing}
                suppressContentEditableWarning
                className={`whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800 outline-none ${
                  isEditing ? 'bg-blue-50 p-2 rounded border-2 border-[#2563EB] cursor-text' : ''
                }`}
                style={{ minHeight: isEditing ? '500px' : 'auto' }}
              >
                {editedContent}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">No Document Yet</h4>
                <p className="text-sm text-gray-500">
                  Select a template, add your details, and click "Generate Letter with AI" to see your
                  professionally formatted document here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}