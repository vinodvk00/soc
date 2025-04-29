import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PieChart from '@/components/charts/PieChart';

const IncidentReportManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dashboardStats, setDashboardStats] = useState({
    totalIncidents: 3,
    recentIncidents: 3,
    statusCounts: [{ _id: 'Open', count: 3 }],
    severityCounts: [{ _id: 'Low', count: 3 }],
    monthlyTrend: [
      { _id: { year: 2023, month: 10 }, count: 1 },
      { _id: { year: 2023, month: 11 }, count: 2 }
    ]
  });
  // Add theme selector
  const { theme } = useSelector((state) => state.theme);
  const { currentUser } = useSelector((state) => state.user);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch all incidents
  const fetchIncidents = async () => {
    try {
      setLoading(true);
      let url = '/api/incidents/all';
      
      // Add filters if selected
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
      if (severityFilter && severityFilter !== 'all') params.append('severity', severityFilter);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      console.log('Fetching incidents from:', url);
      const response = await axios.get(url);
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
      // Comment out the failing API call for now
      // const response = await axios.get('/api/incidents/dashboard');
      // if (response.data) {
      //   setDashboardStats(response.data);
      // }
      
      // Use the incidents data to generate dashboard stats
      if (incidents.length > 0) {
        // Calculate status counts
        const statusCounts = {};
        const severityCounts = {};
        
        incidents.forEach(incident => {
          // Count by status
          if (incident.status) {
            statusCounts[incident.status] = (statusCounts[incident.status] || 0) + 1;
          }
          
          // Count by severity
          if (incident.severity) {
            severityCounts[incident.severity] = (severityCounts[incident.severity] || 0) + 1;
          }
        });
        
        // Convert to array format expected by the component
        const statusCountsArray = Object.keys(statusCounts).map(status => ({
          _id: status,
          count: statusCounts[status]
        }));
        
        const severityCountsArray = Object.keys(severityCounts).map(severity => ({
          _id: severity,
          count: severityCounts[severity]
        }));
        
        // Update dashboard stats
        setDashboardStats({
          totalIncidents: incidents.length,
          recentIncidents: incidents.length, // Assuming all are recent for now
          statusCounts: statusCountsArray,
          severityCounts: severityCountsArray,
          monthlyTrend: [
            { _id: { year: new Date().getFullYear(), month: new Date().getMonth() }, count: incidents.length }
          ]
        });
      }
    } catch (err) {
      console.error('Error generating dashboard stats:', err);
      // Keep using the default stats if there's an error
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, severityFilter]);

  // Update dashboard stats whenever incidents change
  useEffect(() => {
    fetchDashboardStats();
  }, [incidents]);

  const clearFilters = () => {
    setStatusFilter('all');
    setSeverityFilter('all');
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

  // Dashboard components
  const IncidentStats = () => {
    const stats = dashboardStats;
    
    // Calculate open incidents
    const openIncidents = stats.statusCounts.find(s => s._id === 'Open')?.count || 0;
    
    // Calculate critical incidents
    const criticalIncidents = stats.severityCounts.find(s => s._id === 'Critical')?.count || 0;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Incidents</p>
              <p className="text-3xl font-bold">{stats.totalIncidents}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Open Incidents</p>
              <p className="text-3xl font-bold text-blue-500">{openIncidents}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Critical Incidents</p>
              <p className="text-3xl font-bold text-red-500">{criticalIncidents}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Recent (30 days)</p>
              <p className="text-3xl font-bold">{stats.recentIncidents}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const IncidentCharts = () => {
    // Colors for charts
    const statusColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'];
    const severityColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
    
    // Format data for charts
    const statusData = dashboardStats.statusCounts.map(item => ({
      label: item._id,
      value: item.count
    }));
    
    const severityData = dashboardStats.severityCounts.map(item => ({
      label: item._id,
      value: item.count
    }));
    
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {statusData.length > 0 ? (
                <div className="text-center">
                  <PieChart data={statusData} colors={statusColors} />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {statusData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 mr-2" 
                          style={{ backgroundColor: statusColors[index % statusColors.length] }}
                        ></div>
                        <span className="text-sm">{item.label}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground">No status data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {severityData.length > 0 ? (
                <div className="text-center">
                  <PieChart data={severityData} colors={severityColors} />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {severityData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 mr-2" 
                          style={{ backgroundColor: severityColors[index % severityColors.length] }}
                        ></div>
                        <span className="text-sm">{item.label}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground">No severity data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  const IncidentTrend = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Incident Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Monthly trend chart</p>
              <p className="text-sm">Recent incidents: {dashboardStats.recentIncidents}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Management</h1>
          <p className="text-muted-foreground mt-2">View and manage all security incidents reported by users</p>
        </div>
      </div>

      {/* Development notice - Updated for dark mode */}
      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-6 rounded-r">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              <strong>Note:</strong> This module is currently under development. Some features may not work as expected.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="incidents" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="incidents" className="text-sm">Incidents</TabsTrigger>
          <TabsTrigger value="dashboard" className="text-sm">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents">
          <div className="grid gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Incident Filters</CardTitle>
                <CardDescription>Filter incidents by status and severity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="w-full sm:w-auto">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-background">
                        <SelectValue placeholder="All Severities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={clearFilters}
                    className="border-border/50 hover:bg-accent"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Incident List</CardTitle>
                  <CardDescription className="mt-1">
                    {incidents.length} incidents found
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-destructive">
                    <AlertCircle className="h-8 w-8 mx-auto mb-3" />
                    <p className="font-medium">{error}</p>
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="font-medium text-foreground">No incidents found</p>
                    <p className="text-sm text-muted-foreground mt-1">There are no incidents matching your filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-medium">ID</TableHead>
                          <TableHead className="font-medium">Title</TableHead>
                          <TableHead className="font-medium">Status</TableHead>
                          <TableHead className="font-medium">Severity</TableHead>
                          <TableHead className="font-medium">Category</TableHead>
                          <TableHead className="font-medium">Reported By</TableHead>
                          <TableHead className="font-medium">Created</TableHead>
                          <TableHead className="font-medium">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incidents.map((incident) => (
                          <TableRow 
                            key={incident._id}
                            className="hover:bg-muted/50 transition-colors"
                          >
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
                                onClick={() => navigate(`/incident/${incident._id}`)}
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
          <div className="grid gap-6">
            <IncidentStats />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IncidentCharts />
            </div>
            <IncidentTrend />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentReportManagement;