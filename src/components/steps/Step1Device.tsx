import { useState, useMemo } from 'react';
import { Search, Smartphone, Tablet, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useApp } from '../../context/AppContext';
import { allDevices, popularDevices, brandInfo, availableBrands } from '../../data/devices';
import { Device, DeviceBrand } from '../../types';

export function Step1Device() {
  const { state, t, isRTL, setDevice } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<DeviceBrand | 'all'>('all');
  
  // Filter devices
  const filteredDevices = useMemo(() => {
    let devices = selectedBrand === 'all' 
      ? allDevices 
      : allDevices.filter(d => d.brand === selectedBrand);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      devices = devices.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.nameAr.includes(query)
      );
    }
    
    return devices;
  }, [searchQuery, selectedBrand]);
  
  const displayDevices = searchQuery ? filteredDevices : (selectedBrand === 'all' ? popularDevices : filteredDevices.slice(0, 12));
  
  const handleSelect = (device: Device) => {
    setDevice(device);
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;
  
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t.step1Title}</h2>
        <p className="text-gray-400">{t.step1Subtitle}</p>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder={t.searchDevice}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25"
        />
      </div>
      
      {/* Brand filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedBrand('all')}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
            selectedBrand === 'all'
              ? 'bg-amber-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          )}
        >
          {t.popularDevices}
        </button>
        {availableBrands.map(brand => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
              selectedBrand === brand
                ? 'bg-amber-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            )}
          >
            <span>{brandInfo[brand].emoji}</span>
            <span>{brandInfo[brand].name}</span>
          </button>
        ))}
      </div>
      
      {/* Devices grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
        {displayDevices.map(device => {
          const isSelected = state.selectedDevice?.id === device.id;
          
          return (
            <button
              key={device.id}
              onClick={() => handleSelect(device)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl border text-right transition-all',
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20'
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20'
              )}
            >
              {/* Icon */}
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400'
              )}>
                {device.type === 'tablet' ? <Tablet className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={cn('font-semibold truncate', isSelected ? 'text-amber-400' : 'text-white')}>
                  {isRTL ? device.nameAr : device.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{device.specs.screenSize}"</span>
                  <span>•</span>
                  <span>{device.specs.maxFPS} FPS</span>
                  <span>•</span>
                  <span>⚡{device.specs.gyroscopeQuality}/10</span>
                </div>
              </div>
              
              {/* Check */}
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              {!isSelected && (
                <ChevronIcon className="w-4 h-4 text-gray-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selected device summary */}
      {state.selectedDevice && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-400 font-medium">{t.yourDevice}</p>
              <p className="text-white font-bold">{isRTL ? state.selectedDevice.nameAr : state.selectedDevice.name}</p>
            </div>
            <div className="text-left text-sm">
              <p className="text-gray-400">{t.maxFPS}: <span className="text-white font-bold">{state.selectedDevice.specs.maxFPS}</span></p>
              <p className="text-gray-400">{t.screenSize}: <span className="text-white font-bold">{state.selectedDevice.specs.screenSize}"</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
