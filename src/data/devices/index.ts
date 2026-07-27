import { Device, DeviceBrand } from '../../types';
import { iPhones } from './iphones';
import { iPads } from './ipads';
import { samsungDevices } from './samsung';
import { xiaomiDevices } from './xiaomi';
import { oneplusDevices } from './oneplus';
import { gamingDevices } from './gaming';

// Combine all devices
export const allDevices: Device[] = [
  ...iPhones,
  ...iPads,
  ...samsungDevices,
  ...xiaomiDevices,
  ...oneplusDevices,
  ...gamingDevices,
];

// Get popular devices (top 10)
export const popularDevices: Device[] = allDevices
  .filter(d => d.popularityRank !== undefined)
  .sort((a, b) => (a.popularityRank || 999) - (b.popularityRank || 999))
  .slice(0, 10);

// Get devices by brand
export function getDevicesByBrand(brand: DeviceBrand): Device[] {
  return allDevices.filter(d => d.brand === brand);
}

// Search devices
export function searchDevices(query: string): Device[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];
  
  return allDevices.filter(device => 
    device.name.toLowerCase().includes(lowerQuery) ||
    device.nameAr.includes(lowerQuery) ||
    device.brand.toLowerCase().includes(lowerQuery)
  );
}

// Get device by ID
export function getDeviceById(id: string): Device | undefined {
  return allDevices.find(d => d.id === id);
}

// Brand info for UI
export const brandInfo: Record<DeviceBrand, { name: string; nameAr: string; emoji: string }> = {
  apple: { name: 'Apple', nameAr: 'أبل', emoji: '🍎' },
  samsung: { name: 'Samsung', nameAr: 'سامسونج', emoji: '📱' },
  xiaomi: { name: 'Xiaomi', nameAr: 'شاومي', emoji: '📱' },
  oneplus: { name: 'OnePlus', nameAr: 'ون بلس', emoji: '📱' },
  oppo: { name: 'OPPO', nameAr: 'أوبو', emoji: '📱' },
  realme: { name: 'Realme', nameAr: 'ريلمي', emoji: '📱' },
  huawei: { name: 'Huawei', nameAr: 'هواوي', emoji: '📱' },
  honor: { name: 'Honor', nameAr: 'هونر', emoji: '📱' },
  poco: { name: 'POCO', nameAr: 'بوكو', emoji: '📱' },
  redmi: { name: 'Redmi', nameAr: 'ريدمي', emoji: '📱' },
  rog: { name: 'ROG Phone', nameAr: 'روج فون', emoji: '🎮' },
  redmagic: { name: 'Red Magic', nameAr: 'ريد ماجيك', emoji: '🎮' },
  blackshark: { name: 'Black Shark', nameAr: 'بلاك شارك', emoji: '🎮' },
  sony: { name: 'Sony', nameAr: 'سوني', emoji: '📱' },
  google: { name: 'Google Pixel', nameAr: 'جوجل بكسل', emoji: '📱' },
  zte: { name: 'ZTE', nameAr: 'زد تي إي', emoji: '📱' },
  lenovo: { name: 'Lenovo', nameAr: 'لينوفو', emoji: '📱' },
  iqoo: { name: 'iQOO', nameAr: 'آيكو', emoji: '📱' },
  other: { name: 'Other', nameAr: 'أخرى', emoji: '📱' }
};

// Available brands (that have devices)
export const availableBrands: DeviceBrand[] = ['apple', 'samsung', 'xiaomi', 'redmi', 'poco', 'oneplus', 'rog', 'redmagic', 'iqoo'];
