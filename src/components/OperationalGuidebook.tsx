
import React, { useState } from 'react';
import { WORKFLOW_STEPS, RECOMMENDED_TOOLS, CHALLENGES_SOLUTIONS } from '../data/guide';
import { 
  Building2, 
  Settings, 
  Layers, 
  Map, 
  Printer, 
  ExternalLink, 
  FileCheck, 
  CheckSquare, 
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export default function OperationalGuidebook() {
  const [activeSegment, setActiveSegment] = useState<'workflow' | 'checklist' | 'software' | 'challenges'>('workflow');

  const [checkedList, setCheckedList] = useState<Record<string, boolean>>({
    'check-1': true,
    'check-2': true,
    'check-3': false,
    'check-4': false,
    'check-5': false,
    'check-6': false,
    'check-7': false,
    'check-8': false,
  });

  const toggleCheck = (id: string) => {
    setCheckedList(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const checklistItems = [
    {
      id: 'check-1',
      phase: 'PRE-LAUNCH',
      text: 'Finalize standard SKU coding syntax (e.g. DH-IDL-GAN-01) for all categories.'
    },
    {
      id: 'check-2',
      phase: 'PRE-LAUNCH',
      text: 'Print durable tags & custom barcode stickers using desktop label printers.'
    },
    {
      id: 'check-3',
      phase: 'PRE-LAUNCH',
      text: 'Set up physical Backroom Inward / Quarantine cages in the Bangalore store.'
    },
    {
      id: 'check-4',
      phase: 'POST-LAUNCH (Daily)',
      text: 'Cashier scans barcodes on checkout; verify no skip counter sales.'
    },
    {
      id: 'check-5',
      phase: 'POST-LAUNCH (Daily)',
      text: 'Inspect display shelves for tarnishing or dents; isolate damaged pieces.'
    },
    {
      id: 'check-6',
      phase: 'POST-LAUNCH (Weekly)',
      text: 'Perform physical cycle count for chosen fast-moving incense / dhoop categories.'
    },
    {
      id: 'check-7',
      phase: 'POST-LAUNCH (Weekly)',
      text: 'Reconcile digital ledger and post delta adjusting transactions.'
    },
    {
      id: 'check-8',
      phase: 'POST-LAUNCH (Monthly)',
      text: 'Dispatch quarantine damage pile back to Kumbakonam artisans for polishing and restoration.'
    }
  ];

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-amber-700 to-rose-800 p-6 md:p-8 rounded-3xl text-white shadow-md relative overflow-hidden">

        <div className="absolute right-0 top-0 w-80 h-80 bg-orange-300/10 rounded-full blur-3xl -z-10"></div>
        <div className="space-y-2 relative">
          <span className="text-[10px] font-mono font-bold tracking-widest bg-amber-600 px-2.5 py-1 rounded-full uppercase border border-amber-500">
            STRATEGY DECK
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight">
            Bangalore Retail Launch & Operating SOP Blueprint
          </h2>
          <p className="text-amber-100 max-w-3xl text-xs leading-relaxed font-sans">
            A comprehensive, practical operational framework for setting up physical stock controls in Divine Hindu's brand-new Bangalore store, tackling supplier delivery inconsistencies, artisan tracking, local returns, and festive sales rushes.
          </p>
        </div>
      </div>

      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveSegment('workflow')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
            activeSegment === 'workflow'
              ? 'border-amber-600 text-amber-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <Layers className="h-4 w-4" />
          Operating Workflow
        </button>

        <button
          onClick={() => setActiveSegment('checklist')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
            activeSegment === 'checklist'
              ? 'border-amber-600 text-amber-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          Step-by-Step Setup Checklist
        </button>

        <button
          onClick={() => setActiveSegment('software')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
            activeSegment === 'software'
              ? 'border-amber-600 text-amber-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <Settings className="h-4 w-4" />
          Recommended Software Suite
        </button>

        <button
          onClick={() => setActiveSegment('challenges')}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all ${
            activeSegment === 'challenges'
              ? 'border-amber-600 text-amber-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-700'
          }`}
        >
          <AlertOctagon className="h-4 w-4" />
          Challenges & Solutions SOPs
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-xs p-6">

        {activeSegment === 'workflow' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-[17px] font-bold text-stone-800">Bangalore Store Inventory Lifecycle Workflow</h3>
              <p className="text-stone-500 text-xs">Standard sequence of tracking items from the warehouse receipt to checkout or return dispatch</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {WORKFLOW_STEPS.map((wf, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-stone-100 hover:border-amber-200 bg-stone-50/50 hover:bg-amber-50/5/30 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="inline-block text-[10px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                      {wf.step}
                    </span>
                    <h4 className="font-serif font-bold text-stone-800 text-sm leading-tight border-b border-stone-100 pb-2">
                      {wf.title}
                    </h4>
                    <p className="text-stone-600 text-[11px] leading-relaxed">
                      {wf.description}
                    </p>
                  </div>

                  <div className="space-y-2 bg-white p-3 rounded-lg border border-stone-200/50 text-[10px]">
                    <p className="text-stone-500 font-sans leading-normal">
                      <strong className="text-stone-700">Team Responsible:</strong> {wf.responsible}
                    </p>
                    <p className="text-stone-500 font-sans leading-normal">
                      <strong className="text-stone-700">Timing Interval:</strong> {wf.timeframe}
                    </p>
                    <div className="pt-2 border-t border-stone-100 mt-1 space-y-1.5">
                      {wf.bulletPoints.map((bp, i) => (
                        <p key={i} className="text-stone-500 flex items-start gap-1 leading-relaxed">
                          <span className="text-amber-500 shrink-0 font-bold">&#8226;</span>
                          <span>{bp}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSegment === 'checklist' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-[17px] font-bold text-stone-800">Step-by-Step Store Launch Setup Checklist</h3>
              <p className="text-stone-500 text-xs">A comprehensive operational check deck. Check off tasks below as you implement them at the Bangalore location.</p>
            </div>

            <div className="bg-stone-50/60 rounded-xl border border-stone-200/50 overflow-hidden divide-y divide-stone-100">
              {checklistItems.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toggleCheck(item.id)}
                  className="p-4 flex gap-4 items-center justify-between cursor-pointer hover:bg-amber-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="shrink-0">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 focus:outline-hidden"
                        checked={checkedList[item.id] || false}
                        onChange={() => {}} 
                      />
                    </div>
                    <div className="space-y-0.5">
                      <span className={`block text-[9px] font-mono font-bold px-2 py-0.5 rounded-full max-w-fit uppercase ${
                        item.phase === 'PRE-LAUNCH' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {item.phase}
                      </span>
                      <p className={`text-stone-700 text-xs font-semibold ${
                        checkedList[item.id] ? 'line-through text-stone-400' : ''
                      }`}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 select-none">
                    {checkedList[item.id] ? 'Done' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-3">
              <Info className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-teal-900 block">Bangalore Live Audit Status</span>
                <p className="text-teal-700">
                  Checking items off directly feeds operational readiness audits. Keep physical and digital checks synchronized weekly to ensure 100% counts accuracy.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSegment === 'software' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-[17px] font-bold text-stone-800">Physical Store Software Suite & App stack</h3>
              <p className="text-stone-500 text-xs">The specific combination of software and offline logs recommended for a seamless Divine Hindu physical store checkout experience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RECOMMENDED_TOOLS.map((tool, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-3">
                  <div className="flex justify-between items-start border-b border-stone-100 pb-2">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-stone-900 text-sm">{tool.name}</h4>
                      <span className="text-[10px] text-stone-400 uppercase font-mono font-bold block">{tool.type}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-100 rounded-lg px-2 py-0.5">
                      Cost: {tool.costEstimate}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-stone-600 leading-relaxed font-sans">
                      <strong className="text-stone-800 font-medium">Core Operational Purpose:</strong> {tool.purpose}
                    </p>
                    <p className="text-stone-600 leading-relaxed font-sans bg-white p-2.5 rounded border border-stone-200/60 block">
                      <strong className="text-stone-800 font-medium text-[10px] uppercase font-mono block mb-1">Store Front Suitability Analysis:</strong>
                      {tool.suitability}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSegment === 'challenges' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-[17px] font-bold text-stone-800">Retail Challenges & Custom mitigation SOPs</h3>
              <p className="text-stone-500 text-xs">How Divine Hindu Bangalore store can tackle real-life retail realities in South India</p>
            </div>

            <div className="space-y-4">
              {CHALLENGES_SOLUTIONS.map((cs, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-rose-100 bg-rose-50/10 hover:bg-rose-50/20 transition-all space-y-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 px-2.5 bg-rose-100 text-rose-800 font-serif font-black rounded-lg text-xs self-start">
                      !
                    </div>
                    <div className="space-y-1 font-sans">
                      <h4 className="font-bold text-stone-900 text-sm">{cs.challenge}</h4>
                      <p className="text-rose-700 text-xs"><strong>Store Impact:</strong> {cs.impact}</p>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-100 text-stone-800 p-3 rounded-lg text-xs leading-relaxed font-sans">
                    <span className="text-amber-800 uppercase font-mono text-[9px] font-bold block mb-1"> Bangalore SOP Mitigation Solution:</span>
                    {cs.practicalSolution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-4 items-center justify-between text-xs">
        <div className="flex gap-2 items-center">
          <Printer className="h-4 w-4 text-stone-500 shrink-0" />
          <span className="text-stone-600 font-sans">
            Need a hardcopy copy for physical counter desks?
          </span>
        </div>
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-800 text-white font-bold hover:bg-stone-900 rounded-lg transition-colors"
        >
          Print/Save Blueprint SOP
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
}
