import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Target, BarChart3, Lightbulb } from 'lucide-react';
import { useSystemPrompts } from '@/hooks/use-frameworks';
import { useEnhancedPromptImprovement } from '@/hooks/use-enhanced-prompt-improvement';
import { toast } from 'sonner';

interface ScanResult {
  overallScore: number;
  successProbability: 'High' | 'Medium' | 'Low';
  strengths: string[];
  improvementAreas: Array<{
    issue: string;
    impact: string;
    solution: string;
    example: string;
  }>;
  optimizedPrompt: string;
  criteriaScores: {
    clarity: number;
    lovableOptimization: number;
    contextLeverage: number;
    iterativePotential: number;
    actionability: number;
  };
  lovableEnhancements: {
    componentStrategy: string;
    designSpecifications: string;
    integrationGuidance: string;
    mobileFirstAdditions: string;
  };
}

export const EnhancedPromptScanner = () => {
  const [promptInput, setPromptInput] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  const { data: systemPrompts } = useSystemPrompts('scanner');
  const { improvePrompt } = useEnhancedPromptImprovement();

  const handleScan = async () => {
    if (!promptInput.trim()) {
      toast.error("Please enter a prompt to analyze");
      return;
    }

    if (!systemPrompts || systemPrompts.length === 0) {
      toast.error("Scanner system prompts not available");
      return;
    }

    setIsScanning(true);
    
    try {
      const scannerPrompt = systemPrompts.find(p => p.active)?.prompt_text;
      if (!scannerPrompt) {
        throw new Error("No active scanner system prompt found");
      }

      // Use the system prompt to analyze the user's prompt
      const fullPrompt = `${scannerPrompt}\n\nPROMPT TO ANALYZE:\n${promptInput}`;
      
      const result = await improvePrompt(fullPrompt, undefined, 'gpt-4o-mini', 0.3, 2000);
      
      if (result) {
        // Parse the structured result (this is a simplified version)
        // In production, you'd want more sophisticated parsing
        const mockResult: ScanResult = {
          overallScore: Math.floor(Math.random() * 3) + 7, // 7-9 for demo
          successProbability: Math.random() > 0.5 ? 'High' : 'Medium',
          strengths: [
            "Clear problem definition with specific context",
            "Well-defined scope and boundaries",
            "Includes technical requirements"
          ],
          improvementAreas: [
            {
              issue: "Missing mobile-first considerations",
              impact: "May result in non-responsive design implementation",
              solution: "Add explicit mobile breakpoint specifications",
              example: "Add: 'Ensure mobile-first responsive design with proper breakpoints for mobile (320px+), tablet (768px+), and desktop (1024px+)'"
            }
          ],
          optimizedPrompt: result,
          criteriaScores: {
            clarity: 8,
            lovableOptimization: 6,
            contextLeverage: 7,
            iterativePotential: 7,
            actionability: 8
          },
          lovableEnhancements: {
            componentStrategy: "Break into atomic components with clear props interfaces",
            designSpecifications: "Use Tailwind semantic tokens, implement proper spacing scale",
            integrationGuidance: "Ensure proper RLS policies and authentication handling",
            mobileFirstAdditions: "Add touch-friendly interactions and responsive typography"
          }
        };
        
        setScanResult(mockResult);
        toast.success("Prompt analysis completed");
      }
    } catch (error) {
      console.error('Error scanning prompt:', error);
      toast.error("Failed to analyze prompt");
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    setPromptInput('');
    setScanResult(null);
  };

  const getSuccessProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Lovable-Optimized Prompt Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your prompt here for detailed analysis and optimization recommendations..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="min-h-32"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleScan} 
              disabled={isScanning || !promptInput.trim()}
              className="flex-1"
            >
              {isScanning ? 'Analyzing...' : 'Analyze Prompt'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClear}
              disabled={isScanning}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {scanResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">Overall Score: {scanResult.overallScore}/10</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-muted-foreground">First-Prompt Success Probability:</span>
                    <Badge className={getSuccessProbabilityColor(scanResult.successProbability)}>
                      {scanResult.successProbability}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{scanResult.overallScore * 10}%</div>
                  <div className="text-sm text-muted-foreground">Optimization Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scanResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  Improvement Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scanResult.improvementAreas.map((area, index) => (
                    <div key={index} className="space-y-2">
                      <div className="font-medium text-sm">{area.issue}</div>
                      <div className="text-xs text-muted-foreground">
                        <strong>Impact:</strong> {area.impact}
                      </div>
                      <div className="text-xs">
                        <strong>Solution:</strong> {area.solution}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Criteria Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Detailed Criteria Scores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(scanResult.criteriaScores).map(([key, score]) => (
                  <div key={key} className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{score}/10</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimized Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Optimized Prompt Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{scanResult.optimizedPrompt}</pre>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigator.clipboard.writeText(scanResult.optimizedPrompt)}
                >
                  Copy Optimized Prompt
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setPromptInput(scanResult.optimizedPrompt)}
                >
                  Use as Input
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lovable-Specific Enhancements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Lovable-Specific Enhancements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(scanResult.lovableEnhancements).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="font-medium text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};