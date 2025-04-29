import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileSearch, AlertTriangle, BarChart3, FileCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-background dark:bg-black">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-8">
          <Shield className="h-12 w-12 text-primary dark:text-primary-foreground mr-3" />
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">Cyber Guard</h1>
        </div>
        <p className="max-w-[700px] text-lg text-muted-foreground mb-8">
          Secure file analysis platform for detecting threats without executing potentially harmful files
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="dark:bg-primary-foreground dark:text-white">
            <Link to="/file-upload">Analyze File</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            asChild 
            className="dark:border-primary-foreground dark:text-white dark:hover:bg-primary-foreground dark:hover:text-primary"
          >
            <Link to="/demo">Enter Demo</Link>
          </Button>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="h-full dark:bg-muted">
            <CardHeader>
              <FileSearch className="h-8 w-8 text-primary dark:text-primary-foreground mb-2" />
              <CardTitle className="text-foreground">Static File Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analyze Windows executables, DLLs, and PDFs without execution to safely identify potential threats</p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Malware Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Leverage multiple scanning engines to detect known malware signatures and suspicious behaviors</p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Comprehensive Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Get detailed analysis reports with file metadata, threat detection results, and actionable insights</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-16 bg-muted dark:bg-muted/20 rounded-lg px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
        <div className="max-w-3xl mx-auto">
          <ol className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary dark:bg-primary-foreground text-primary-foreground dark:text-primary">1</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Upload Your File</h3>
                <p className="text-muted-foreground">Simply drag and drop or select any Windows executable, DLL, or PDF file that you want to analyze</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">2</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Automatic Analysis</h3>
                <p className="text-muted-foreground">Our system performs a static analysis using multiple security engines without executing the file</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">3</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Review Results</h3>
                <p className="text-muted-foreground">Examine the detailed report showing file information, detection results, and security recommendations</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">4</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Export Report</h3>
                <p className="text-muted-foreground">Download the complete analysis report in Excel format for documentation or further investigation</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Why Choose Cyber Guard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex gap-4">
            <FileCheck className="h-6 w-6 text-primary dark:text-primary-foreground flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Safe Analysis</h3>
              <p className="text-muted-foreground">Analyze suspicious files without risk of infection or compromise</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Multi-Engine Detection</h3>
              <p className="text-muted-foreground">Benefit from multiple security vendors for comprehensive threat detection</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Fast Results</h3>
              <p className="text-muted-foreground">Get analysis results within minutes without lengthy manual investigation</p>
            </div>
          </div>
          <div className="flex gap-4">
            <BarChart3 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Reporting</h3>
              <p className="text-muted-foreground">Export comprehensive reports for compliance, documentation, or further analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 text-center">
        <Card className="max-w-3xl mx-auto dark:bg-muted">
          <CardHeader>
            <CardTitle className="text-2xl text-foreground">Ready to analyze your first file?</CardTitle>
            <CardDescription className="text-muted-foreground">
              Start using Cyber Guard today and ensure your files are free from threats
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button 
              size="lg" 
              asChild 
              className="dark:bg-primary-foreground dark:text-white"
            >
              <Link to="/file-upload">Get Started Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;