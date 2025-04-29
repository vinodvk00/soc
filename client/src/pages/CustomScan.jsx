import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const CustomScan = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    const allowedTypes = ['application/pdf', 'application/x-msdownload', 'application/x-msdos-program'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Error',
        description: 'Only PDF and executable files are allowed',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://pe-project.onrender.com/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);
      toast({
        title: 'Analysis Complete',
        description: 'File has been successfully analyzed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to analyze file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    
    const report = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-report-${analysisResult.filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskBadge = (riskLevel) => {
    const variants = {
      malicious: "destructive",
      suspicious: "warning",
      safe: "success"
    };
    
    return <Badge variant={variants[riskLevel] || "default"}>{riskLevel}</Badge>;
  };

  const renderPDFAnalysis = (analysis) => {
    return (
      <div className="space-y-4">
        <Alert variant={analysis.risk_level === 'malicious' ? 'destructive' : 
                       analysis.risk_level === 'suspicious' ? 'warning' : 'default'}>
          <AlertTitle className="flex items-center gap-2">
            Risk Level: {getRiskBadge(analysis.risk_level)}
          </AlertTitle>
          <AlertDescription>
            Threats Detected: {analysis.threats_detected}
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">PDF Properties</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Total Pages:</span> {analysis.total_pages}</p>
              <p><span className="font-medium">JavaScript:</span> {analysis.javascript ? '✓' : '✗'}</p>
              <p><span className="font-medium">OpenAction:</span> {analysis.openaction ? '✓' : '✗'}</p>
              <p><span className="font-medium">Launch Action:</span> {analysis.launch ? '✓' : '✗'}</p>
              <p><span className="font-medium">Embedded Files:</span> {analysis.embeddedfiles ? '✓' : '✗'}</p>
              <p><span className="font-medium">AcroForm:</span> {analysis.acroform ? '✓' : '✗'}</p>
            </div>
          </div>

          {analysis.suspicious_elements.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Suspicious Elements</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.suspicious_elements.map((element, index) => (
                  <li key={index} className="text-destructive">{element}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suspicious_actions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Suspicious Actions</h4>
              <ul className="list-disc list-inside space-y-1">
                {analysis.suspicious_actions.map((action, index) => (
                  <li key={index} className="text-destructive">{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEXEAnalysis = (analysis) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">File Header</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Machine:</span> {analysis["File Header"].Machine}</p>
              <p><span className="font-medium">Number of Sections:</span> {analysis["File Header"]["Number of Sections"]}</p>
              <p><span className="font-medium">Time Date Stamp:</span> {new Date(analysis["File Header"]["Time Date Stamp"] * 1000).toLocaleString()}</p>
              <p><span className="font-medium">Characteristics:</span> {analysis["File Header"].Characteristics}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Optional Header</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Entry Point:</span> {analysis["Optional Header"]["Address Of Entry Point"]}</p>
              <p><span className="font-medium">Image Base:</span> {analysis["Optional Header"]["Image Base"]}</p>
              <p><span className="font-medium">OS Version:</span> {analysis["Optional Header"]["Operating System Version"]}</p>
              <p><span className="font-medium">Subsystem:</span> {analysis["Optional Header"].Subsystem}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Sections</h4>
          <div className="grid grid-cols-1 gap-2">
            {analysis.Sections.map((section, index) => (
              <div key={index} className="p-2 border rounded">
                <p className="font-medium">{section.Name.split('\x00').join('')}</p>
                <div className="grid grid-cols-2 gap-x-4 text-sm">
                  <p>Virtual Size: {section["Virtual Size"]}</p>
                  <p>Raw Size: {section["Size of Raw Data"]}</p>
                  <p>Virtual Address: {section["Virtual Address"]}</p>
                  <p>Characteristics: {section.Characteristics}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Imported DLLs</h4>
          <div className="space-y-4">
            {analysis.Imports.map((dll, index) => (
              <div key={index} className="border rounded p-2">
                <p className="font-medium mb-2">{dll.DLL}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dll.Functions.map((func, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {func}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Custom File Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* File Input Section */}
            <div>
              <Label htmlFor="file-upload">Select a file (PDF or Executable)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.exe,.dll"
                  className="flex-1"
                />
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Analyzing...' : 'Analyze File'}
                </Button>
              </div>
            </div>

            {/* Analysis Results */}
            {analysisResult && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownloadReport}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {/* File Information */}
                  <div className="grid gap-2">
                    <h4 className="font-medium">File Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">File Name</p>
                        <p className="text-sm text-muted-foreground">{analysisResult.filename}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">File Size</p>
                        <p className="text-sm text-muted-foreground">
                          {(analysisResult.filesize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">SHA-256</p>
                        <p className="text-sm text-muted-foreground break-all">{analysisResult.sha256}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Analysis Time</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(analysisResult.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Results */}
                  {analysisResult.analysis ? (
                    analysisResult.filename.toLowerCase().endsWith('.pdf') ? 
                      renderPDFAnalysis(analysisResult.analysis) : 
                      renderEXEAnalysis(analysisResult.analysis)
                  ) : (
                    <Alert>
                      <AlertTitle>No Analysis Available</AlertTitle>
                      <AlertDescription>
                        The file analysis did not return any results.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomScan;