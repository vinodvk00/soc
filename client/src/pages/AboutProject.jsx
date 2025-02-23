import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Security Operations Center Platform</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            An advanced security analysis platform integrating VirusTotal API, static analysis, 
            and incident management capabilities.
          </p>
        </div>

        <Separator />

        {/* Project Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Project Structure Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Backend Structure (api/)</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-600">Controllers/</h4>
                    <ul className="ml-4 space-y-2 text-gray-600">
                      <li>• auth.controller.js - Authentication logic</li>
                      <li>• user.controller.js - User management operations</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600">Models/</h4>
                    <ul className="ml-4 space-y-2 text-gray-600">
                      <li>• user.model.js - MongoDB user schema</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600">Routes/</h4>
                    <ul className="ml-4 space-y-2 text-gray-600">
                      <li>• auth.route.js - Authentication endpoints</li>
                      <li>• user.route.js - User management endpoints</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-600">Utils/</h4>
                    <ul className="ml-4 space-y-2 text-gray-600">
                      <li>• error.js - Error handling utilities</li>
                      <li>• upload.js - File upload configurations</li>
                      <li>• verifyUser.js - Authentication middleware</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Frontend Structure (client/)</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-600">Components/</h4>
                    <ul className="ml-4 space-y-2 text-gray-600">
                      <li>• OAuth.jsx - Social authentication</li>
                      <li>• Navbar.jsx - Navigation component</li>
                      <li>• UI Components (shadcn/ui integration)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600">Pages/</h4>
                    <ul className="ml-4 space-y-2 text-gray-600">
                      <li>• Database Management</li>
                      <li>• File Upload & Analysis</li>
                      <li>• Incident Report Management</li>
                      <li>• User Management</li>
                      <li>• Authentication Pages</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600">Redux/</h4>
                    <ul className="ml-4 space-y-2 text-gray-600">
                      <li>• store.js - Redux configuration</li>
                      <li>• theme/ - Theme management</li>
                      <li>• user/ - User state management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Tabs defaultValue="backend" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="backend">Backend Features</TabsTrigger>
            <TabsTrigger value="frontend">Frontend Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="backend" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Backend Capabilities</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                    <div>
                      <strong>Express.js Server</strong>
                      <p>RESTful API architecture with structured routes and controllers</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                    <div>
                      <strong>MongoDB Integration</strong>
                      <p>Robust data management with Mongoose ODM</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                    <div>
                      <strong>File Analysis System</strong>
                      <p>Integration with VirusTotal API for malware detection</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="frontend" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Frontend Features</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2" />
                    <div>
                      <strong>Modern Tech Stack</strong>
                      <p>React with Vite, Redux Toolkit, and Tailwind CSS</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2" />
                    <div>
                      <strong>Component Library</strong>
                      <p>Comprehensive UI components using shadcn/ui</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2" />
                    <div>
                      <strong>State Management</strong>
                      <p>Centralized state with Redux and theme management</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle>Project Innovation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              This Security Operations Center platform stands out through its comprehensive approach
              to security analysis and incident management. The project's architecture enables:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                <span>Advanced file analysis with VirusTotal integration</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                <span>Scalable and maintainable codebase with clear separation of concerns</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                <span>Modern user interface with responsive design</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2" />
                <span>Extensible architecture for future security tool integrations</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;