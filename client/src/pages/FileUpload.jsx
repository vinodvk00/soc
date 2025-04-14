import { useState } from "react";
import axios from "axios";
import { Upload, FileIcon, Loader2, Download, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import * as XLSX from 'xlsx';
import { useSelector } from "react-redux";
// Import toast components
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
// Import Dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // Add new state variables for incident creation
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [incidentNote, setIncidentNote] = useState('');
  const { currentUser } = useSelector(state => state.user);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to analyze.");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    // http://localhost:3000/upload
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setResult(response.data);
      setError("");
      
      // Check if the file is malicious and prompt for incident creation
      if (response.data.maliciousCount > 0) {
        setShowIncidentDialog(true);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || 
        "Error uploading file. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add new function to create an incident
  const handleCreateIncident = async () => {
    try {
      // Calculate detection rate
      const totalScans = result.antivirusResults.length;
      const detectionRate = Math.round((result.maliciousCount / totalScans) * 100);
      
      // Determine severity based on detection rate
      let severity = "Low";
      if (detectionRate >= 70) severity = "Critical";
      else if (detectionRate >= 40) severity = "High";
      else if (detectionRate >= 20) severity = "Medium";
      
      // Create a detailed description with all relevant information
      const detectedEngines = groupedResults.detected.map(r => `${r.engine}: ${r.verdict}`).join('\n- ');
      
      const detailedDescription = `
## File Analysis Report

### File Information
- **Name**: ${result.name}
- **Size**: ${result.size || 'Unknown'}
- **Type**: ${result.description || 'Unknown'}
- **SHA-256**: ${result.hash_sha256}
${result.hash_md5 ? `- **MD5**: ${result.hash_md5}` : ''}
${result.hash_sha1 ? `- **SHA-1**: ${result.hash_sha1}` : ''}

### Scan Results
- **Total Engines**: ${totalScans}
- **Malicious Detections**: ${result.maliciousCount} (${detectionRate}%)
- **Clean Results**: ${groupedResults.undetected.length}
- **Timeout Results**: ${groupedResults.timeout.length}
- **Unsupported Results**: ${groupedResults.unsupported.length}

### Detection Details
- ${detectedEngines || 'No malicious detections'}

### User Notes
${incidentNote.trim() || "No additional notes provided"}
      `.trim();
      
      const incidentData = {
        title: `Malicious File Detected: ${result.name}`,
        description: detailedDescription,
        severity,
        status: "Open", 
        category: "Malware",
        assignedTo: null, // Will be assigned by a manager later
        reportedBy: currentUser?._id,
        source: "File Upload",
        tags: ["malware", "file-analysis"],
        metadata: {
          fileInfo: {
            fileName: result.name,
            fileSize: result.size,
            fileType: result.description,
            fileHash: {
              sha256: result.hash_sha256,
              md5: result.hash_md5 || null,
              sha1: result.hash_sha1 || null
            }
          },
          scanResults: {
            maliciousCount: result.maliciousCount,
            totalEngines: totalScans,
            detectionRate,
            detectedEngines: groupedResults.detected.map(r => ({ 
              engine: r.engine, 
              verdict: r.verdict 
            })),
            cleanEngines: groupedResults.undetected.length,
            timeoutEngines: groupedResults.timeout.length,
            unsupportedEngines: groupedResults.unsupported.length
          },
          uploadTimestamp: new Date().toISOString(),
          uploadedBy: {
            id: currentUser?._id,
            name: currentUser?.username || "Unknown User",
            email: currentUser?.email || "Unknown Email"
          }
        }
      };
      
      console.log("Sending incident data:", incidentData);
      
      // Use the correct endpoint path that matches your backend route
      const response = await axios.post("/api/incidents/create", incidentData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }
      });
      
      console.log("Response:", response.data);
      
      toast({
        title: "Incident Created",
        description: `Incident #${response.data.incidentNumber || 'Unknown'} has been created and security team notified.`,
      });
    } catch (err) {
      console.error("Incident creation error:", err);
      
      // Better error handling
      let errorMessage = "Failed to create incident";
      
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        
        if (typeof err.response.data === 'object' && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMessage = "Authentication required. Please log in again.";
        } else if (err.response.status === 403) {
          errorMessage = "You don't have permission to create incidents.";
        } else if (err.response.status === 404) {
          errorMessage = "API endpoint not found. Check server configuration.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (err.request) {
        errorMessage = "No response from server. Check your network connection.";
      } else {
        errorMessage = err.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setShowIncidentDialog(false);
      setIncidentNote('');
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;

    // Create workbook and add worksheets
    const wb = XLSX.utils.book_new();
    
    // Summary worksheet
    const summaryData = [
      ["Cyber Guard - File Analysis Report"],
      ["Generated on", new Date().toLocaleString()],
      [""],
      ["File Information"],
      ["Name", result.name],
      ["SHA-256", result.hash_sha256],
      ["Size", result.size],
      ["Description", result.description],
      [""],
      ["Scan Summary"],
      ["Total Scans", result.antivirusResults.length],
      ["Malicious Detections", result.maliciousCount],
      ["Clean Results", result.antivirusResults.filter(r => r.verdict === "undetected").length],
      ["Timeout Results", result.antivirusResults.filter(r => r.verdict === "timeout").length],
      ["Unsupported Results", result.antivirusResults.filter(r => r.verdict === "type-unsupported").length],
    ];
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
    
    // Detailed results worksheet
    const detailedHeaders = ["Security Vendor", "Result"];
    const detailedData = [
      detailedHeaders,
      ...result.antivirusResults.map(res => [res.engine, res.verdict])
    ];
    
    const detailedWs = XLSX.utils.aoa_to_sheet(detailedData);
    XLSX.utils.book_append_sheet(wb, detailedWs, "Detailed Results");
    
    // Split by verdict worksheets
    const verdicts = ["detected", "undetected", "timeout", "type-unsupported"];
    
    verdicts.forEach(verdict => {
      const filteredResults = result.antivirusResults.filter(r => {
        if (verdict === "detected") {
          return r.verdict !== "undetected" && r.verdict !== "timeout" && r.verdict !== "type-unsupported";
        }
        return r.verdict === verdict;
      });
      
      if (filteredResults.length > 0) {
        const verdictData = [
          detailedHeaders,
          ...filteredResults.map(res => [res.engine, res.verdict])
        ];
        
        const verdictWs = XLSX.utils.aoa_to_sheet(verdictData);
        const sheetName = verdict === "detected" 
          ? "Malicious" 
          : verdict === "undetected" 
            ? "Clean" 
            : verdict === "timeout" 
              ? "Timeout" 
              : "Unsupported";
              
        XLSX.utils.book_append_sheet(wb, verdictWs, sheetName);
      }
    });
    
    // Generate the file name
    const fileName = `Cyber_Guard_Report_${result.name.replace(/\.[^/.]+$/, "")}_${new Date().toISOString().slice(0,10)}.xlsx`;
    
    // Write and download the file
    XLSX.writeFile(wb, fileName);
  };

  // Group AV results by verdict categories
  const groupedResults = result?.antivirusResults.reduce(
    (acc, curr) => {
      if (curr.verdict === "undetected") {
        acc.undetected.push(curr);
      } else if (curr.verdict === "timeout") {
        acc.timeout.push(curr);
      } else if (curr.verdict === "type-unsupported") {
        acc.unsupported.push(curr);
      } else {
        acc.detected.push(curr);
      }
      return acc;
    },
    { detected: [], undetected: [], timeout: [], unsupported: [] }
  );

  const getStatusBadge = () => {
    if (!result) return null;
    
    if (result.maliciousCount > 0) {
      return <Badge variant="destructive">Malicious</Badge>;
    } else if (groupedResults.timeout.length > 0) {
      return <Badge variant="warning">Incomplete Scan</Badge>;
    } else {
      return <Badge variant="success">Clean</Badge>;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileIcon className="h-6 w-6" />
            Cyber Guard File Analysis
          </CardTitle>
          <CardDescription>
            Upload Windows executables (DLLs, EXEs) or PDFs for static analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col space-y-4">
              <Label htmlFor="file-upload">Select File</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleUpload}
                  disabled={!file || isLoading}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
              
              {isLoading && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Uploading and analyzing file...
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {result && (
              <Card className="mt-6">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Analysis Results {getStatusBadge()}</CardTitle>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleDownloadReport}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Report
                      </Button>
                      {result && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowIncidentDialog(true)}
                          className="gap-2"
                        >
                          <AlertCircle className="h-4 w-4" />
                          Report Incident
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {/* File Information */}
                  <div className="grid gap-2">
                    <h4 className="font-medium">File Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">File Name</p>
                        <p className="text-sm text-muted-foreground">{result.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">File Size</p>
                        <p className="text-sm text-muted-foreground">
                          {result.size ? formatFileSize(parseFloat(result.size.replace(' KB', '')) * 1024) : 'Unknown'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">File Type</p>
                        <p className="text-sm text-muted-foreground">{result.description || 'Unknown'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">SHA-256</p>
                        <p className="text-sm text-muted-foreground truncate">{result.hash_sha256}</p>
                      </div>
                    </div>
                  </div>

                  {/* Scan Results */}
                  <Tabs defaultValue="summary">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="detected" disabled={groupedResults.detected.length === 0}>
                        Detected ({groupedResults.detected.length})
                      </TabsTrigger>
                      <TabsTrigger value="clean" disabled={groupedResults.undetected.length === 0}>
                        Clean ({groupedResults.undetected.length})
                      </TabsTrigger>
                      <TabsTrigger value="other" disabled={groupedResults.timeout.length + groupedResults.unsupported.length === 0}>
                        Other ({groupedResults.timeout.length + groupedResults.unsupported.length})
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="summary" className="mt-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Detection Summary</h4>
                              <div className="grid gap-1.5">
                                <div className="flex justify-between">
                                  <span className="text-sm">Malicious</span>
                                  <span className="text-sm font-medium">{groupedResults.detected.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Clean</span>
                                  <span className="text-sm font-medium">{groupedResults.undetected.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Timeout</span>
                                  <span className="text-sm font-medium">{groupedResults.timeout.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Unsupported</span>
                                  <span className="text-sm font-medium">{groupedResults.unsupported.length}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Verdict</h4>
                              <p className="text-sm">
                                {groupedResults.detected.length > 0
                                  ? `This file was flagged as malicious by ${groupedResults.detected.length} security vendors.`
                                  : "No security vendors flagged this file as malicious."}
                              </p>
                              {groupedResults.timeout.length > 0 && (
                                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                                  Note: {groupedResults.timeout.length} scanners timed out and couldn't provide a complete result.
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="detected" className="mt-4">
                      {groupedResults.detected.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Security Vendor</TableHead>
                              <TableHead>Result</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {groupedResults.detected.map((result, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{result.engine}</TableCell>
                                <TableCell className="text-red-600 dark:text-red-500">{result.verdict}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-muted-foreground">No malicious detections found</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="clean" className="mt-4">
                      {groupedResults.undetected.length > 0 ? (
                        <Accordion type="single" collapsible>
                          <AccordionItem value="clean-results">
                            <AccordionTrigger>
                              All Clean Results ({groupedResults.undetected.length})
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                                {groupedResults.undetected.map((result, index) => (
                                  <div key={index} className="text-sm text-muted-foreground">
                                    {result.engine}: {result.verdict}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-muted-foreground">No clean results available</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="other" className="mt-4">
                      {groupedResults.timeout.length + groupedResults.unsupported.length > 0 ? (
                        <div className="space-y-4">
                          {groupedResults.timeout.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Timeout ({groupedResults.timeout.length})</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {groupedResults.timeout.map((result, index) => (
                                  <div key={index} className="text-sm text-muted-foreground">
                                    {result.engine}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {groupedResults.unsupported.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Type Unsupported ({groupedResults.unsupported.length})</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {groupedResults.unsupported.map((result, index) => (
                                  <div key={index} className="text-sm text-muted-foreground">
                                    {result.engine}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center p-4">
                          <p className="text-muted-foreground">No other results available</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    
    {/* Move the incident dialog inside the main container */}
    <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Security Incident</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4">
            <p className="text-sm font-medium">
              This file was detected as malicious by {result?.maliciousCount} out of {result?.antivirusResults.length} security vendors.
            </p>
            <p className="text-sm mt-2">
              A security incident will be created to track this finding.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="incident-note">Additional Notes (Optional)</Label>
            <Textarea 
              id="incident-note" 
              placeholder="Add any additional context about this file..."
              value={incidentNote}
              onChange={(e) => setIncidentNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowIncidentDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateIncident}>
            Create Incident
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <Toaster />
    </>
  );
};

export default FileUpload;