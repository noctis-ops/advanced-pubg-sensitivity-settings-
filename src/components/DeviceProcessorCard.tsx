import { Cpu, Gauge, Thermometer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Device } from '../types';

export function DeviceProcessorCard({ device }: { device: Device }) {
  const { t, isRTL } = useApp();
  const processor = device.specs.processor;
  if (!processor) return null;

  const confidence = processor.dataConfidence === 'spec-sheet'
    ? (isRTL ? 'ورقة مواصفات' : 'Spec sheet')
    : processor.dataConfidence === 'community'
      ? (isRTL ? 'مصدر مجتمعي' : 'Community')
      : (isRTL ? 'نموذجي' : 'Modelled');
  const thermal = processor.thermalProfile === 'hot'
    ? (isRTL ? 'مرتفع' : 'Hot')
    : processor.thermalProfile === 'warm'
      ? (isRTL ? 'دافئ' : 'Warm')
      : processor.thermalProfile === 'balanced'
        ? (isRTL ? 'متوازن' : 'Balanced')
        : (isRTL ? 'بارد' : 'Cool');

  return (
    <div className="mt-3 rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] p-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-2">
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-cyan-300">{t.processor}</span>
        <span className="text-[10px] text-gray-600">{confidence}</span>
      </div>
      <p className="text-sm font-semibold text-white">{processor.model}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[10px]">
        <div><span className="text-gray-600 block">{t.gpu}</span><span className="text-gray-300">{processor.gpuModel}</span></div>
        <div><span className="text-gray-600 block">{t.processNode}</span><span className="text-gray-300">{processor.processNodeNm ? `${processor.processNodeNm}nm` : '—'}</span></div>
        <div><span className="text-gray-600 block">{t.sustainedFPS}</span><span className="text-gray-300 flex items-center gap-1"><Gauge className="w-3 h-3" />{processor.sustainedFPS}</span></div>
        <div><span className="text-gray-600 block">{t.thermalProfile}</span><span className="text-gray-300 flex items-center gap-1"><Thermometer className="w-3 h-3" />{thermal}</span></div>
      </div>
    </div>
  );
}
