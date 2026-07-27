import { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  AppState, 
  AppAction, 
  Device, 
  PlayerSettings,
  FPSOption,
  FingerCount,
  GripStyle,
  GyroscopeMode,
  PlayStyle,
  GeneratedSensitivity,
  AppStep
} from '../types';
import { Language, translations } from '../i18n/translations';

// Initial player settings
const initialPlayerSettings: PlayerSettings = {
  fingerCount: 4,
  gripStyle: 'claw',
  gyroscopeMode: 'always-on',
  playStyle: 'balanced',
  preferredFPS: 60
};

// Initial state
const initialState: AppState = {
  currentStep: 1,
  selectedDevice: null,
  playerSettings: initialPlayerSettings,
  generatedSensitivity: null,
  language: 'ar'
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_DEVICE':
      return { 
        ...state, 
        selectedDevice: action.payload,
        playerSettings: {
          ...state.playerSettings,
          preferredFPS: Math.min(state.playerSettings.preferredFPS, action.payload.specs.maxFPS) as FPSOption
        }
      };
    
    case 'SET_FPS':
      return { 
        ...state, 
        playerSettings: { ...state.playerSettings, preferredFPS: action.payload } 
      };
    
    case 'SET_FINGERS':
      // Auto-set grip style based on finger count
      let newGrip: GripStyle = state.playerSettings.gripStyle;
      if (action.payload === 2) newGrip = 'thumbs';
      else if (action.payload === 3) newGrip = 'three-finger';
      else if (action.payload === 4) newGrip = 'claw';
      else if (action.payload === 5) newGrip = 'five-claw';
      else if (action.payload === 6) newGrip = 'full-claw';
      
      return { 
        ...state, 
        playerSettings: { 
          ...state.playerSettings, 
          fingerCount: action.payload,
          gripStyle: newGrip
        } 
      };
    
    case 'SET_GRIP':
      return { 
        ...state, 
        playerSettings: { ...state.playerSettings, gripStyle: action.payload } 
      };
    
    case 'SET_GYROSCOPE':
      return { 
        ...state, 
        playerSettings: { ...state.playerSettings, gyroscopeMode: action.payload } 
      };
    
    case 'SET_PLAYSTYLE':
      return { 
        ...state, 
        playerSettings: { ...state.playerSettings, playStyle: action.payload } 
      };
    
    case 'SET_SENSITIVITY':
      return { ...state, generatedSensitivity: action.payload };
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'RESET':
      return { ...initialState, language: state.language };
    
    default:
      return state;
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  t: typeof translations.ar;
  isRTL: boolean;
  
  // Helper actions
  setStep: (step: AppStep) => void;
  setDevice: (device: Device) => void;
  setFPS: (fps: FPSOption) => void;
  setFingers: (fingers: FingerCount) => void;
  setGrip: (grip: GripStyle) => void;
  setGyroscope: (mode: GyroscopeMode) => void;
  setPlaystyle: (style: PlayStyle) => void;
  setSensitivity: (sens: GeneratedSensitivity) => void;
  setLanguage: (lang: Language) => void;
  reset: () => void;
  
  // Navigation helpers
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: () => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  const t = translations[state.language];
  const isRTL = state.language === 'ar';
  
  // Helper actions
  const setStep = (step: AppStep) => dispatch({ type: 'SET_STEP', payload: step });
  const setDevice = (device: Device) => dispatch({ type: 'SET_DEVICE', payload: device });
  const setFPS = (fps: FPSOption) => dispatch({ type: 'SET_FPS', payload: fps });
  const setFingers = (fingers: FingerCount) => dispatch({ type: 'SET_FINGERS', payload: fingers });
  const setGrip = (grip: GripStyle) => dispatch({ type: 'SET_GRIP', payload: grip });
  const setGyroscope = (mode: GyroscopeMode) => dispatch({ type: 'SET_GYROSCOPE', payload: mode });
  const setPlaystyle = (style: PlayStyle) => dispatch({ type: 'SET_PLAYSTYLE', payload: style });
  const setSensitivity = (sens: GeneratedSensitivity) => dispatch({ type: 'SET_SENSITIVITY', payload: sens });
  const setLanguage = (lang: Language) => dispatch({ type: 'SET_LANGUAGE', payload: lang });
  const reset = () => dispatch({ type: 'RESET' });
  
  // Navigation
  const nextStep = () => {
    if (state.currentStep === 5) {
      setStep('results');
    } else if (typeof state.currentStep === 'number') {
      setStep((state.currentStep + 1) as AppStep);
    }
  };
  
  const prevStep = () => {
    if (state.currentStep === 'results') {
      setStep(5);
    } else if (typeof state.currentStep === 'number' && state.currentStep > 1) {
      setStep((state.currentStep - 1) as AppStep);
    }
  };
  
  const canGoNext = () => {
    switch (state.currentStep) {
      case 1: return state.selectedDevice !== null;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };
  
  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      t,
      isRTL,
      setStep,
      setDevice,
      setFPS,
      setFingers,
      setGrip,
      setGyroscope,
      setPlaystyle,
      setSensitivity,
      setLanguage,
      reset,
      nextStep,
      prevStep,
      canGoNext
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
