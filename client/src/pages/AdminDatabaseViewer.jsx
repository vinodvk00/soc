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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from 'lucide-react';

const AdminDatabaseViewer = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.isAdmin) {
      setLoading(false);
      return;
    }

    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/admin/collections', {
          credentials: 'include'
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch collections');
        }
        
        const data = await res.json();
        setCollections(data);
        
        if (data.length > 0) {
          setSelectedCollection(data[0]);
          fetchDocuments(data[0]);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCollections();
  }, [currentUser, navigate]);

  const fetchDocuments = async (collectionName) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/collections/${collectionName}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch documents from ${collectionName}`);
      }
      
      const data = await res.json();
      setDocuments(data);
      setSelectedCollection(collectionName);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching documents from ${collectionName}:`, error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Progress value={45} className="w-1/3" />
      </div>
    );
  }

  // Access denied message for non-admin users
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

  // Helper function to render document fields recursively
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'string' || typeof value === 'number') return value;
    if (value instanceof Date) return value.toISOString();
    if (Array.isArray(value)) {
      return (
        <div className="max-h-40 overflow-y-auto">
          {value.map((item, i) => (
            <div key={i} className="mb-1 pl-2 border-l-2 border-gray-300">
              {renderValue(item)}
            </div>
          ))}
        </div>
      );
    }
    if (typeof value === 'object') {
      return (
        <div className="max-h-40 overflow-y-auto">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="mb-1">
              <span className="font-semibold">{key}: </span>
              {renderValue(val)}
            </div>
          ))}
        </div>
      );
    }
    return JSON.stringify(value);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Database Explorer</CardTitle>
          <Database className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">
            View all collections and documents in the database. This is for administrative purposes only.
          </CardDescription>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Collections</h3>
            <div className="flex flex-wrap gap-2">
              {collections.map(collection => (
                <Button 
                  key={collection}
                  variant={selectedCollection === collection ? "default" : "outline"}
                  onClick={() => fetchDocuments(collection)}
                >
                  {collection}
                </Button>
              ))}
            </div>
          </div>

          {selectedCollection && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Documents in {selectedCollection} ({documents.length})
              </h3>
              
              <div className="border rounded-md overflow-hidden">
                {documents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {Object.keys(documents[0]).map(key => (
                            <TableHead key={key}>{key}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc, index) => (
                          <TableRow key={index}>
                            {Object.entries(doc).map(([key, value]) => (
                              <TableCell key={key} className="max-w-xs truncate">
                                {renderValue(value)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No documents found in this collection
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDatabaseViewer;