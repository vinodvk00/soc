import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  FileText, 
  Database, 
  MoreVertical,
  UserPlus,
  Trash,
  Edit,
  Ban 
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingReports: 0,
    storageUsed: 0
  });

  useEffect(() => {
    if (!currentUser?.isAdmin) {
        setLoading(false);
        return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/all');
        const data = await res.json();
        setUsers(data);
        setStats({
          totalUsers: data.length,
          activeUsers: data.filter(user => user.lastActive > Date.now() - 86400000).length,
          pendingReports: Math.floor(Math.random() * 10), // Mock data
          storageUsed: Math.floor(Math.random() * 85) // Mock data
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, navigate]);

  const handleUserAction = async (userId, action) => {
    if (action === 'delete') {
      try {
        const res = await fetch(`/api/user/archive/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (res.ok) {
          // Update the UI to reflect the archived status
          setUsers(users.map(user => 
            user._id === userId ? { ...user, isArchived: true } : user
          ));
          // Show success message
          alert('User archived successfully');
        } else {
          console.error('Failed to archive user');
        }
      } catch (error) {
        console.error('Error archiving user:', error);
      }
    } else {
      // Handle other actions (edit, ban)
      console.log(`${action} user ${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Progress value={45} className="w-1/3" />
      </div>
    );
  }

  // Add access denied message for non-admin users
  if (!currentUser?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">This area is restricted to administrators only.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active in last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storageUsed}%</div>
            <Progress value={stats.storageUsed} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </div>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={user.profilePicture} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          {user.username}
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isAdmin ? 
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Admin</span>
                          : user.isArchived ?
                          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">Archived</span>
                          : 
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">User</span>
                        }
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user._id, 'edit')}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user._id, 'ban')}
                              className="flex items-center gap-2"
                            >
                              <Ban className="h-4 w-4" />
                              Ban
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleUserAction(user._id, 'delete')}
                              className="flex items-center gap-2 text-amber-600"
                            >
                              <Trash className="h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;