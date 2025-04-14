import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const IncidentStats = ({ stats }) => {
  if (!stats) return null;

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

export default IncidentStats;