import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Folder, Link, BookOpen } from 'lucide-react';

const Resources = () => {
  const resources = [
    {
      title: "Project Test Files",
      description: "Access test files and upload folder with executable testing files",
      link: "https://drive.google.com/drive/folders/1ndfT7nUGimaSsviKcfQv3wl9I0MsfW_9?usp=sharing",
      icon: <Download className="w-6 h-6" />,
      type: "Drive Link"
    },
    {
      title: "Documentation",
      description: "Project documentation including setup guides and best practices",
      link: "/docs",
      icon: <FileText className="w-6 h-6" />,
      type: "Internal"
    },
    {
      title: "Source Code",
      description: "Project repository with complete source code",
      link: "/repository",
      icon: <Folder className="w-6 h-6" />,
      type: "Repository"
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Resources</h1>
        <p className="text-gray-600">Access all the resources you need for the project</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {resource.icon}
                </div>
                <span className="text-sm text-blue-600 font-medium px-3 py-1 bg-blue-50 rounded-full">
                  {resource.type}
                </span>
              </div>
              <CardTitle className="text-xl">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <Link className="w-4 h-4" />
                Access Resource
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Need More Resources?</h2>
            <p className="text-gray-600 mb-4">
              Check our documentation or contact the development team for additional resources and support.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Link className="w-4 h-4" />
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;