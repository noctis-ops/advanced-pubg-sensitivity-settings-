import type { Device, ProcessorMetadata } from '../../types';

interface ProcessorRecord {
  model: string;
  gpuModel: string;
  vendor: ProcessorMetadata['vendor'];
  processNodeNm: number | null;
  dataConfidence: ProcessorMetadata['dataConfidence'];
  source: ProcessorMetadata['source'];
}

function record(
  model: string,
  gpuModel: string,
  vendor: ProcessorMetadata['vendor'],
  processNodeNm: number | null,
  dataConfidence: ProcessorMetadata['dataConfidence'] = 'spec-sheet',
  source: ProcessorMetadata['source'] = 'spec-sheet'
): ProcessorRecord {
  return { model, gpuModel, vendor, processNodeNm, dataConfidence, source };
}

function inferProcessor(device: Device): ProcessorRecord {
  const name = device.name.toLowerCase();

  if (device.brand === 'apple') {
    if (name.includes('iphone 16')) return record('Apple A18 Pro', 'Apple GPU (6-core)', 'Apple', 3);
    if (name.includes('iphone 15 pro')) return record('Apple A17 Pro', 'Apple GPU (6-core)', 'Apple', 3);
    if (name.includes('iphone 15')) return record('Apple A16 Bionic', 'Apple GPU (5-core)', 'Apple', 4);
    if (name.includes('iphone 14 pro')) return record('Apple A16 Bionic', 'Apple GPU (5-core)', 'Apple', 4);
    if (name.includes('iphone 14')) return record('Apple A15 Bionic', 'Apple GPU (5-core)', 'Apple', 5);
    if (name.includes('iphone 13') || name.includes('iphone se (3rd')) return record('Apple A15 Bionic', 'Apple GPU (4/5-core)', 'Apple', 5);
    if (name.includes('iphone 12')) return record('Apple A14 Bionic', 'Apple GPU (4-core)', 'Apple', 5);
    if (name.includes('iphone 11') || name.includes('iphone se (2nd')) return record('Apple A13 Bionic', 'Apple GPU (4-core)', 'Apple', 7);
    if (name.includes('iphone xr') || name.includes('iphone xs')) return record('Apple A12 Bionic', 'Apple GPU (4-core)', 'Apple', 7);
    if (name.includes('iphone x') || name.includes('iphone 8')) return record('Apple A11 Bionic', 'Apple GPU (3-core)', 'Apple', 10);
    if (name.includes('ipad pro') && name.includes('(m4')) return record('Apple M4', 'Apple GPU (10-core)', 'Apple', 3);
    if (name.includes('ipad pro') && name.includes('(m2')) return record('Apple M2', 'Apple GPU (10-core)', 'Apple', 5);
    if (name.includes('ipad pro') && name.includes('(m1')) return record('Apple M1', 'Apple GPU (8-core)', 'Apple', 5);
    if (name.includes('ipad pro')) return record('Apple A12Z Bionic', 'Apple GPU (8-core)', 'Apple', 7);
    if (name.includes('ipad air') && name.includes('m2')) return record('Apple M2', 'Apple GPU (9-core)', 'Apple', 5);
    if (name.includes('ipad air') && name.includes('m1')) return record('Apple M1', 'Apple GPU (8-core)', 'Apple', 5);
    if (name.includes('ipad air')) return record('Apple A14 Bionic', 'Apple GPU (4-core)', 'Apple', 5);
    if (name.includes('ipad mini 6')) return record('Apple A15 Bionic', 'Apple GPU (5-core)', 'Apple', 5);
    if (name.includes('ipad mini')) return record('Apple A12 Bionic', 'Apple GPU (4-core)', 'Apple', 7);
    if (name.includes('ipad 10')) return record('Apple A14 Bionic', 'Apple GPU (4-core)', 'Apple', 5);
    if (name.includes('ipad 9') || name.includes('ipad 8') || name.includes('ipad 7')) return record('Apple A12 Bionic', 'Apple GPU (4-core)', 'Apple', 7);
  }

  if (device.brand === 'samsung') {
    if (/s24|tab s9/.test(name)) return record('Snapdragon 8 Gen 3 for Galaxy / Exynos 2400', 'Adreno 750 / Xclipse 940', 'Qualcomm', 4, 'community', 'community');
    if (/s23|tab s8/.test(name)) return record('Snapdragon 8 Gen 2 for Galaxy', 'Adreno 740', 'Qualcomm', 4, 'community', 'community');
    if (/s22/.test(name)) return record('Snapdragon 8 Gen 1 / Exynos 2200', 'Adreno 730 / Xclipse 920', 'Qualcomm', 4, 'community', 'community');
    if (/s21/.test(name)) return record('Snapdragon 888 / Exynos 2100', 'Adreno 660 / Mali-G78', 'Qualcomm', 5, 'community', 'community');
    if (/a55/.test(name)) return record('Samsung Exynos 1480', 'Xclipse 530', 'Samsung', 4);
    if (/a54/.test(name)) return record('Samsung Exynos 1380', 'Mali-G68 MP5', 'Samsung', 5);
    if (/a53|m54/.test(name)) return record('Samsung Exynos 1380', 'Mali-G68 MP5', 'Samsung', 5);
    if (/a34/.test(name)) return record('MediaTek Dimensity 1080', 'Mali-G68 MC4', 'MediaTek', 6);
    if (/a25|m34/.test(name)) return record('Samsung Exynos 1280', 'Mali-G68', 'Samsung', 5);
    if (/a15/.test(name)) return record('MediaTek Helio G99 / Dimensity 6100+', 'Mali-G57 MC2', 'MediaTek', 6, 'community', 'community');
    if (/a14/.test(name)) return record('Exynos 850 / Dimensity 700', 'Mali-G52 / Mali-G57', 'Samsung', 8, 'community', 'community');
    if (/tab s7/.test(name)) return record('Snapdragon 750G', 'Adreno 619', 'Qualcomm', 8);
  }

  if (device.brand === 'xiaomi' || device.brand === 'redmi' || device.brand === 'poco') {
    if (/xiaomi 15/.test(name)) return record('Snapdragon 8 Elite', 'Adreno 830', 'Qualcomm', 3);
    if (/xiaomi 14/.test(name) && /t pro/.test(name)) return record('MediaTek Dimensity 9300+', 'Immortalis-G720', 'MediaTek', 4);
    if (/xiaomi 14t/.test(name)) return record('MediaTek Dimensity 8300 Ultra', 'Mali-G615', 'MediaTek', 4);
    if (/xiaomi 14/.test(name)) return record('Snapdragon 8 Gen 3', 'Adreno 750', 'Qualcomm', 4);
    if (/xiaomi 13t pro/.test(name)) return record('MediaTek Dimensity 9200+', 'Immortalis-G715', 'MediaTek', 4);
    if (/xiaomi 13t/.test(name)) return record('MediaTek Dimensity 8200 Ultra', 'Mali-G610', 'MediaTek', 4);
    if (/xiaomi 13/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/xiaomi 12t pro/.test(name)) return record('Snapdragon 8+ Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/xiaomi 12/.test(name)) return record('Snapdragon 8 Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/pad 7/.test(name)) return record('Snapdragon 8s Gen 3', 'Adreno 735', 'Qualcomm', 4);
    if (/pad 6 pro/.test(name)) return record('Snapdragon 8+ Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/pad 6/.test(name)) return record('Snapdragon 870', 'Adreno 650', 'Qualcomm', 7);
    if (/redmi k70 pro/.test(name)) return record('Snapdragon 8 Gen 3', 'Adreno 750', 'Qualcomm', 4);
    if (/redmi k70/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/k60 ultra/.test(name)) return record('MediaTek Dimensity 9200+', 'Immortalis-G715', 'MediaTek', 4);
    if (/note 13 pro\+/.test(name)) return record('MediaTek Dimensity 7200 Ultra', 'Mali-G610', 'MediaTek', 4);
    if (/note 13 pro/.test(name)) return record('Snapdragon 7s Gen 2', 'Adreno 710', 'Qualcomm', 4);
    if (/note 13/.test(name)) return record('MediaTek Dimensity 6080', 'Mali-G57 MC2', 'MediaTek', 6);
    if (/note 12 pro/.test(name)) return record('MediaTek Dimensity 1080', 'Mali-G68', 'MediaTek', 6);
    if (/poco f6 pro/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/poco f6/.test(name)) return record('Snapdragon 8s Gen 3', 'Adreno 735', 'Qualcomm', 4);
    if (/poco f5 pro/.test(name)) return record('Snapdragon 8+ Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/poco f5/.test(name)) return record('Snapdragon 7+ Gen 2', 'Adreno 725', 'Qualcomm', 4);
    if (/poco f3/.test(name)) return record('Snapdragon 870', 'Adreno 650', 'Qualcomm', 7);
    if (/poco x6 pro/.test(name)) return record('MediaTek Dimensity 8300 Ultra', 'Mali-G615', 'MediaTek', 4);
    if (/poco x6/.test(name)) return record('Snapdragon 7s Gen 2', 'Adreno 710', 'Qualcomm', 4);
    if (/poco x5 pro/.test(name)) return record('Snapdragon 778G', 'Adreno 642L', 'Qualcomm', 6);
    if (/poco x3 pro/.test(name)) return record('Snapdragon 860', 'Adreno 640', 'Qualcomm', 7);
    if (/poco x3/.test(name)) return record('Snapdragon 732G', 'Adreno 618', 'Qualcomm', 8);
  }

  if (device.brand === 'oneplus') {
    if (/oneplus 12/.test(name)) return record('Snapdragon 8 Gen 3', 'Adreno 750', 'Qualcomm', 4);
    if (/oneplus 11/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/10 pro/.test(name)) return record('Snapdragon 8 Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/10t/.test(name)) return record('Snapdragon 8+ Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/nord 4/.test(name)) return record('Snapdragon 7+ Gen 3', 'Adreno 732', 'Qualcomm', 4);
    if (/nord 3/.test(name)) return record('MediaTek Dimensity 9000', 'Mali-G710', 'MediaTek', 4);
    if (/ace 3/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/open/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/pad 2/.test(name)) return record('Snapdragon 8 Gen 3', 'Adreno 750', 'Qualcomm', 4);
    if (/pad/.test(name)) return record('MediaTek Dimensity 9000', 'Mali-G710', 'MediaTek', 4);
  }

  if (device.brand === 'rog' || device.brand === 'redmagic' || device.brand === 'blackshark' || device.brand === 'iqoo') {
    if (/rog phone 8|red magic 9|iqoo 12/.test(name)) return record('Snapdragon 8 Gen 3', 'Adreno 750', 'Qualcomm', 4);
    if (/rog phone 7|red magic 8s|iqoo 11/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/rog phone 6|black shark 5/.test(name)) return record('Snapdragon 8+ Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/red magic 8|black shark 4/.test(name)) return record('Snapdragon 8 Gen 2 / Snapdragon 888', 'Adreno 740 / Adreno 660', 'Qualcomm', 5, 'community', 'community');
  }

  if (device.brand === 'oppo' || device.brand === 'realme') {
    if (/find x7|gt 6|gt5 pro/.test(name)) return record('Snapdragon 8 Gen 3', 'Adreno 750', 'Qualcomm', 4);
    if (/find x6|gt neo 6|gt neo 5|gt 5/.test(name)) return record('Snapdragon 8+ Gen 2 / Snapdragon 8+ Gen 1', 'Adreno 740 / Adreno 730', 'Qualcomm', 4, 'community', 'community');
    if (/find x5|gt2 pro|gt 3|gt neo 3/.test(name)) return record('Snapdragon 8 Gen 1 / Snapdragon 8+ Gen 1', 'Adreno 730', 'Qualcomm', 4, 'community', 'community');
    if (/reno 12|reno 11|reno 10|k12|narzo 60/.test(name)) return record('MediaTek Dimensity 7300 / Snapdragon 7 Gen 3', 'Mali-G615 / Adreno 720', 'MediaTek', 4, 'community', 'community');
    if (/a98|a78|k10|f21|reno 8|reno 7|reno 6|realme 12|realme 11|realme 10|realme 9|realme 8/.test(name)) return record('Snapdragon 695 / Dimensity 7050', 'Adreno 619 / Mali-G68', 'Qualcomm', 6, 'community', 'community');
  }

  if (device.brand === 'huawei') {
    if (/mate 60/.test(name)) return record('Huawei Kirin 9000S', 'Maleoon 910', 'Huawei', 7, 'community', 'community');
    if (/p60/.test(name)) return record('Snapdragon 8+ Gen 1 4G', 'Adreno 730', 'Qualcomm', 4, 'community', 'community');
    if (/mate 50/.test(name)) return record('Snapdragon 8+ Gen 1 4G', 'Adreno 730', 'Qualcomm', 4, 'community', 'community');
    if (/p50/.test(name)) return record('Snapdragon 888 4G / Kirin 9000', 'Adreno 660 / Mali-G78', 'Qualcomm', 5, 'community', 'community');
    if (/nova 12/.test(name)) return record('Kirin 9000S', 'Maleoon 910', 'Huawei', 7, 'community', 'community');
    if (/nova 11/.test(name)) return record('Snapdragon 778G 4G', 'Adreno 642L', 'Qualcomm', 6, 'community', 'community');
    if (/mate 40/.test(name)) return record('Kirin 9000', 'Mali-G78', 'Huawei', 5);
    if (/p40/.test(name)) return record('Kirin 990', 'Mali-G76', 'Huawei', 7);
    if (/matepad/.test(name)) return record('Kirin 9000S', 'Maleoon 910', 'Huawei', 7, 'community', 'community');
  }

  if (device.brand === 'honor') {
    if (/magic6/.test(name)) return record('Snapdragon 8 Gen 3', 'Adreno 750', 'Qualcomm', 4);
    if (/magic5/.test(name)) return record('Snapdragon 8 Gen 2', 'Adreno 740', 'Qualcomm', 4);
    if (/magic4/.test(name)) return record('Snapdragon 8 Gen 1', 'Adreno 730', 'Qualcomm', 4);
    if (/200 pro|90 pro|90 |80 pro|x50 pro|70 |pad v8/.test(name)) return record('Snapdragon 8s Gen 3 / Snapdragon 7 Gen 1', 'Adreno 735 / Adreno 644', 'Qualcomm', 4, 'community', 'community');
  }

  const fallbackVendor: ProcessorMetadata['vendor'] = device.brand === 'apple'
    ? 'Apple'
    : ['samsung', 'huawei'].includes(device.brand) ? 'Samsung'
      : ['xiaomi', 'redmi', 'poco', 'oneplus', 'oppo', 'realme', 'rog', 'redmagic', 'blackshark', 'iqoo'].includes(device.brand) ? 'Qualcomm'
        : 'Other';
  const fallbackModel = `${fallbackVendor} ${device.specs.processorTier} mobile SoC (modelled)`;
  return record(fallbackModel, 'Integrated GPU (modelled)', fallbackVendor, null, 'modelled', 'modelled');
}

function thermalProfile(device: Device): ProcessorMetadata['thermalProfile'] {
  if (device.specs.maxFPS >= 120 && device.specs.processorTier === 'flagship') return 'warm';
  if (device.specs.processorTier === 'low' || device.specs.maxFPS <= 30) return 'hot';
  if (device.specs.maxFPS >= 90) return 'balanced';
  return 'cool';
}

export function enrichDeviceWithProcessor(device: Device): Device {
  const processor = inferProcessor(device);
  return {
    ...device,
    dataConfidence: device.dataConfidence ?? processor.dataConfidence,
    specs: {
      ...device.specs,
      processor: {
        ...processor,
        sustainedFPS: device.specs.maxFPS,
        thermalProfile: thermalProfile(device)
      }
    }
  };
}

export function enrichDevicesWithProcessors(devices: Device[]): Device[] {
  return devices.map(enrichDeviceWithProcessor);
}
