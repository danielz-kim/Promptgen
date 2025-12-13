import React, { useState, useRef } from 'react';
import { 
  Role, 
  Seniority, 
  CompanyType, 
  Industry, 
  ProductSurface, 
  FocusArea,
  ProjectScope,
  ScenarioConfig 
} from './types';
import { 
  ROLES, 
  SENIORITIES, 
  COMPANY_TYPES, 
  INDUSTRIES, 
  SURFACES,
  FOCUS_AREAS,
  SCOPES
} from './constants';
import { generateScenario } from './services/geminiService';
import { Select } from './components/ui/Select';
import { Button } from './components/ui/Button';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ManagerChat } from './components/ManagerChat';

// Declare html2pdf for TypeScript since it's loaded via CDN
declare global {
  interface Window {
    html2pdf: any;
  }
}

const App: React.FC = () => {
  const [config, setConfig] = useState<ScenarioConfig>({
    role: '',
    seniority: '',
    companyType: '',
    industry: '',
    surface: '',
    focusArea: '',
    projectScope: '',
    includeConstraints: true,
  });

  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isFormValid = config.role && config.seniority && config.companyType && config.industry && config.surface && config.focusArea && config.projectScope;

  const handleGenerate = async () => {
    if (!isFormValid) return;
    
    setLoading(true);
    setError(null);
    setGeneratedContent(null);
    setIsExpanded(false);
    try {
      const result = await generateScenario(config);
      setGeneratedContent(result);
    } catch (err: any) {
      if (err.message === 'MISSING_API_KEY') {
        setError('MISSING_API_KEY');
      } else {
        setError('Failed to generate scenario. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert('Scenario copied to clipboard!');
    }
  };

  const handleDownloadPDF = () => {
    if (!contentRef.current || !window.html2pdf) {
      alert('PDF generation not ready. Please try again.');
      return;
    }

    const element = contentRef.current;
    
    // Clone to prepare for PDF generation
    const clone = element.cloneNode(true) as HTMLElement;
    const header = clone.querySelector('.pdf-exclude');
    if (header) {
      header.remove();
    }
    
    // Style for PDF (Clean white paper look)
    clone.style.padding = '40px';
    clone.style.backgroundColor = 'white';
    clone.style.fontFamily = 'Merriweather, serif';
    
    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right
      filename:     `promptgen-${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    window.html2pdf().set(opt).from(clone).save();
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-900 selection:bg-stone-200 selection:text-stone-900">
      
      {/* Header - Hide when expanded to focus on content */}
      {!isExpanded && (
        <header className="sticky top-0 z-30 w-full border-b border-stone-200 bg-[#FDFCF8]/95 backdrop-blur-sm">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 font-serif italic">PromptGen</h1>
            </div>
            <div className="text-[10px] font-serif italic text-stone-500 tracking-wide">
               Est. 2025
            </div>
          </div>
        </header>
      )}

      <main className={`container mx-auto px-6 ${isExpanded ? 'py-6 max-w-4xl' : 'py-8 max-w-6xl'} transition-all duration-300`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Configuration - Hidden when expanded */}
          <div className={`space-y-6 ${isExpanded ? 'hidden' : 'md:col-span-5'}`}>
            <div className="p-0">
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 font-sans">Configuration</h2>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-7">
                <Select
                  label="Role"
                  options={ROLES}
                  value={config.role}
                  onChange={(e) => setConfig({ ...config, role: e.target.value as Role })}
                  placeholder="e.g. Product Designer"
                />
                
                <Select
                  label="Seniority"
                  options={SENIORITIES}
                  value={config.seniority}
                  onChange={(e) => setConfig({ ...config, seniority: e.target.value as Seniority })}
                  placeholder="e.g. Senior"
                />

                <Select
                  label="Industry"
                  options={INDUSTRIES}
                  value={config.industry}
                  onChange={(e) => setConfig({ ...config, industry: e.target.value as Industry })}
                  placeholder="e.g. Fintech"
                />

                <Select
                  label="Company Type"
                  options={COMPANY_TYPES}
                  value={config.companyType}
                  onChange={(e) => setConfig({ ...config, companyType: e.target.value as CompanyType })}
                  placeholder="e.g. Growth-stage"
                />

                <Select
                  label="Surface"
                  options={SURFACES}
                  value={config.surface}
                  onChange={(e) => setConfig({ ...config, surface: e.target.value as ProductSurface })}
                  placeholder="e.g. Consumer App"
                />

                <Select
                  label="Focus Area"
                  options={FOCUS_AREAS}
                  value={config.focusArea}
                  onChange={(e) => setConfig({ ...config, focusArea: e.target.value as FocusArea })}
                  placeholder="e.g. New Feature"
                />

                <Select
                  label="Project Scope"
                  options={SCOPES}
                  value={config.projectScope}
                  onChange={(e) => setConfig({ ...config, projectScope: e.target.value as ProjectScope })}
                  placeholder="e.g. Take-home"
                  containerClassName="col-span-2"
                />

                <div className="col-span-2 pt-4 border-t border-stone-200 mt-2">
                   <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center mt-0.5">
                        <input 
                          type="checkbox" 
                          className="peer h-3.5 w-3.5 rounded-sm border-stone-400 text-stone-800 focus:ring-stone-500 cursor-pointer"
                          checked={config.includeConstraints}
                          onChange={(e) => setConfig({ ...config, includeConstraints: e.target.checked })}
                        />
                      </div>
                      <div>
                        <span className="text-sm font-serif font-medium text-stone-800 group-hover:text-stone-600 transition-colors block">
                          Add Heavy Constraints
                        </span>
                        <span className="text-[10px] text-stone-500 leading-tight block mt-0.5">
                          Simulates tight budgets, legacy tech, or regulatory blockers.
                        </span>
                      </div>
                   </label>
                </div>
              </div>

              <div className="mt-8">
                <Button 
                  onClick={handleGenerate} 
                  isLoading={loading} 
                  disabled={!isFormValid}
                  className="w-full"
                >
                  Generate Brief
                </Button>
              </div>
            </div>
            
            <div className="bg-stone-100 p-4 rounded-sm text-[11px] font-serif text-stone-600 leading-relaxed border border-stone-200 italic">
              "The most realistic practice environment for product thinkers. Generates problems used by top-tier tech companies."
            </div>
          </div>

          {/* Right Column: Output - Full width when expanded */}
          <div className={`${isExpanded ? 'md:col-span-12' : 'md:col-span-7'} min-h-[500px] transition-all duration-300`}>
             {error === 'MISSING_API_KEY' ? (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-8 shadow-sm">
                <h3 className="font-serif font-bold text-lg mb-2">Setup Required</h3>
                <p className="text-sm font-serif mb-4 leading-relaxed">
                  The API key is missing. Since this is hosted, the site owner needs to configure the environment variables.
                </p>
              </div>
             ) : error ? (
              <div className="bg-red-50 border border-red-100 text-red-900 p-6 mb-8 text-sm font-serif">
                {error}
              </div>
            ) : null}

            {!generatedContent && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border border-stone-200 bg-white shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]">
                <div className="w-10 h-10 border border-stone-300 rounded-full flex items-center justify-center mb-5 text-stone-300">
                  <span className="font-serif italic text-xl">i</span>
                </div>
                <h3 className="text-lg font-serif font-medium text-stone-800 mb-2">Awaiting Configuration</h3>
                <p className="text-sm text-stone-500 font-serif italic max-w-xs leading-relaxed">
                  Select your parameters on the left to generate a bespoke product scenario.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-6 p-12 bg-white border border-stone-100 shadow-sm animate-pulse">
                 <div className="h-8 bg-stone-100 w-3/4 mb-8"></div>
                 <div className="h-3 bg-stone-100 w-full mb-2"></div>
                 <div className="h-3 bg-stone-100 w-full mb-2"></div>
                 <div className="h-3 bg-stone-100 w-2/3 mb-6"></div>
                 <div className="h-3 bg-stone-100 w-full mb-2"></div>
                 <div className="h-3 bg-stone-100 w-5/6 mb-2"></div>
              </div>
            )}

            {generatedContent && !loading && (
              <div ref={contentRef} className="bg-white border border-stone-200 shadow-[8px_8px_0px_0px_rgba(231,229,228,0.5)] transition-all">
                {/* Header / Controls */}
                <div className="pdf-exclude border-b border-stone-100 px-6 py-3 flex flex-wrap justify-between items-center bg-[#FDFCF8] gap-4 sticky top-0 z-10">
                  <div className="flex gap-2 items-center">
                     <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">{config.industry}</span>
                     <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">•</span>
                     <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400">{config.seniority}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    
                    {/* Expand/Collapse Button */}
                    <Button 
                      variant="icon" 
                      onClick={() => setIsExpanded(!isExpanded)} 
                      title={isExpanded ? "Collapse View" : "Expand View"}
                    >
                       {isExpanded ? (
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                       ) : (
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                       )}
                    </Button>

                    {/* Download PDF Button */}
                    <Button 
                      variant="icon" 
                      onClick={handleDownloadPDF}
                      title="Download PDF"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </Button>

                    {/* Copy Button */}
                    <Button 
                      variant="icon" 
                      onClick={handleCopy}
                      title="Copy to Clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </Button>

                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <MarkdownRenderer content={generatedContent} />
                </div>
              </div>
            )}
          </div>
        </div>
        {generatedContent && (
          <ManagerChat config={config} scenarioText={generatedContent} />
        )}
      </main>
    </div>
  );
};

export default App;