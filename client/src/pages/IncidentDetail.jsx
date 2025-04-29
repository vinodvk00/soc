import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle, FileText, MessageSquare, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const IncidentDetail = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch incident details
  // In the fetchIncident function
  const fetchIncident = async () => {
    try {
      setLoading(true);
      // For testing, let's log the incident ID
      console.log('Fetching incident with ID:', id);
      
      // If using a real API:
      const response = await axios.get(`/api/incidents/${id}`, { withCredentials: true });
      console.log('Incident data:', response.data);
      setIncident(response.data);
      
      // Initialize form values from incident data
      if (response.data) {
        setStatus(response.data.status || '');
        setSeverity(response.data.severity || '');
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching incident:', err);
      setError('Failed to load incident details. Please try again.');
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to load incident details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  // Add comment
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`/api/incidents/${id}/comment`, { text: comment }, { withCredentials: true });
      setComment('');
      fetchIncident(); // Refresh incident data
      toast({
        title: 'Comment Added',
        description: 'Your comment has been added to the incident.',
      });
    } catch (err) {
      console.error('Error adding comment:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to add comment',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update incident status
  const handleUpdateIncident = async () => {
    try {
      setSubmitting(true);
      console.log('Updating incident:', { id, status, severity });
      
      // Make the API call to update the incident
      await axios.put(`/api/incidents/${id}`, 
        { status, severity }, 
        { withCredentials: true }
      );
      
      // Refresh incident data
      fetchIncident();
      
      toast({
        title: 'Incident Updated',
        description: 'The incident has been updated successfully.',
      });
    } catch (err) {
      console.error('Error updating incident:', err);
      toast({
        title: 'Update Failed',
        description: err.response?.data?.message || 'Failed to update incident',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to get severity badge
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'Critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'High':
        return <Badge variant="destructive" className="bg-orange-500">High</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Medium</Badge>;
      case 'Low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Open</Badge>;
      case 'In Progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      case 'Resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Resolved</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 flex flex-col justify-center items-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Incident</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" onClick={fetchIncident}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="container mx-auto py-6 flex flex-col justify-center items-center min-h-[60vh]">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Incident Not Found</h2>
        <p className="text-muted-foreground">The requested incident could not be found.</p>
        <Button className="mt-4" onClick={() => navigate('/incident-management')}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {incident.incidentNumber || `Incident #${incident._id.substring(0, 8)}`}
          </h1>
          <p className="text-muted-foreground">{incident.title}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/incident-management')}>
            Back to List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="comments">
                Comments ({incident.comments?.length || 0})
              </TabsTrigger>
              {incident.metadata?.fileInfo && (
                <TabsTrigger value="file">File Analysis</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Incident Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap">{incident.description}</pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Communication history for this incident
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {incident.comments?.length > 0 ? (
                    <div className="space-y-4">
                      {incident.comments.map((comment, index) => (
                        <div key={index} className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">
                                {comment.createdBy?.username || 'Unknown User'}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                      <p>No comments yet</p>
                      <p className="text-sm">Be the first to add a comment to this incident.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Textarea
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[100px] mb-4"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!comment.trim() || submitting}
                    className="ml-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Add Comment'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {incident.metadata?.fileInfo && (
              // In the TabsContent for file analysis
              <TabsContent value="file">
                <Card>
                  <CardHeader>
                    <CardTitle>File Analysis</CardTitle>
                    <CardDescription>
                      Details from the malware scan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {incident.metadata?.fileInfo ? (
                        <>
                          <div>
                            <h3 className="text-lg font-medium mb-2">File Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium">File Name</p>
                                <p className="text-sm text-muted-foreground">
                                  {incident.metadata.fileInfo.fileName || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">File Size</p>
                                <p className="text-sm text-muted-foreground">
                                  {incident.metadata.fileInfo.fileSize || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">File Type</p>
                                <p className="text-sm text-muted-foreground">
                                  {incident.metadata.fileInfo.fileType || 'N/A'}
                                </p>
                              </div>
                              {incident.metadata.fileInfo.fileHash && (
                                <div>
                                  <p className="text-sm font-medium">SHA-256</p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {incident.metadata.fileInfo.fileHash.sha256 || 'N/A'}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                      
                          {incident.metadata.scanResults && (
                            <div>
                              <h3 className="text-lg font-medium mb-2">Scan Results</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Detection Rate</p>
                                  <p className="text-sm text-muted-foreground">
                                    {incident.metadata.scanResults.maliciousCount || 0} / {incident.metadata.scanResults.totalEngines || 0} 
                                    ({incident.metadata.scanResults.detectionRate || 0}%)
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Clean Engines</p>
                                  <p className="text-sm text-muted-foreground">
                                    {incident.metadata.scanResults.cleanEngines || 0}
                                  </p>
                                </div>
                              </div>

                              {incident.metadata.scanResults.detectedEngines?.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-md font-medium mb-2">Malicious Detections</h4>
                                  <div className="bg-muted p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {incident.metadata.scanResults.detectedEngines.map((engine, index) => (
                                        <div key={index} className="text-sm">
                                          <span className="font-medium">{engine.engine}:</span> {engine.verdict}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No file analysis data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Current Status</p>
                  <div>{getStatusBadge(incident.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Severity</p>
                  <div>{getSeverityBadge(incident.severity)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Category</p>
                  <p className="text-sm">{incident.category || 'Uncategorized'}</p>
                </div>
                {incident.source && (
                  <div>
                    <p className="text-sm font-medium mb-1">Source</p>
                    <p className="text-sm">{incident.source}</p>
                  </div>
                )}
                {incident.tags?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {incident.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {currentUser?.isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Update Incident</CardTitle>
                <CardDescription>
                  Change the status and severity of this incident
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleUpdateIncident} 
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Incident'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;