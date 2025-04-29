import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import dashboard components
import IncidentStats from '@/components/dashboard/IncidentStats';
import IncidentCharts from '@/components/dashboard/IncidentCharts';
import IncidentTrend from '@/components/dashboard/IncidentTrend';

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { toast } = useToast();

  // Fetch all incidents
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      let url = '/api/incidents/all';
      
      // Add filters if selected
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (severityFilter) params.append('severity', severityFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Fetching incidents from:', url);
      const response = await axios.get(url, { withCredentials: true });
      console.log('Incidents response:', response.data);
      setIncidents(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching incidents:', err);
      setError('Failed to load incidents. Please try again.');
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to load incidents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/incidents/dashboard', { withCredentials: true });
      setDashboardStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  useEffect(() => {
    fetchIncidents();
    fetchDashboardStats();
  }, [statusFilter, severityFilter]);

  const clearFilters = () => {
    setStatusFilter('');
    setSeverityFilter('');
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Incident Management</h1>
      <p className="text-muted-foreground mb-6">View and manage all security incidents reported by users</p>

      <Tabs defaultValue="incidents">
        <TabsList className="mb-6">
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Incident Filters</CardTitle>
                <CardDescription>Filter incidents by status and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Statuses</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-auto">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="All Severities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Severities</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident List</CardTitle>
                <CardDescription>
                  {incidents.length} incidents found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>{error}</p>
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p>No incidents found</p>
                    <p className="text-sm">There are no incidents matching your filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Reported By</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incidents.map((incident) => (
                          <TableRow key={incident._id}>
                            <TableCell className="font-medium">
                              {incident.incidentNumber || incident._id.substring(0, 8)}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {incident.title}
                            </TableCell>
                            <TableCell>{getStatusBadge(incident.status)}</TableCell>
                            <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                            <TableCell>{incident.category || 'N/A'}</TableCell>
                            <TableCell>
                              {incident.reportedBy?.username || 'Unknown'}
                            </TableCell>
                            <TableCell>
                              {formatDate(incident.createdAt)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = `/incident/${incident._id}`}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          {dashboardStats ? (
            <div className="grid gap-6">
              <IncidentStats stats={dashboardStats} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <IncidentCharts stats={dashboardStats} />
              </div>
              <IncidentTrend data={dashboardStats.monthlyTrend} />
            </div>
          ) : (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentManagement;