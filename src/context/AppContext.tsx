import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import {
  AppState,
  AppAction,
  Device,
  PlayerSettings,
  FPSOption,
  FingerCount,
  FingerAssignment,
  GripStyle,
  GyroscopeMode,
  PlayStyle,
  GeneratedSensitivity,
  AppStep,
  FOVOption,
  FPPViewOption,
  SkillLevel,
  SensitivityExperiment,
  ReachCalibrationInput
} from '../types';
import { Language, translations } from '../i18n/translations';
import { clearProfileShareHash, readProfileFromLocation } from '../utils/profile-sharing';

// Initial player settings
const initialPlayerSettings: PlayerSettings = {
  fingerCount: 4,
  gripStyle: 'claw',
  gyroscopeMode: 'always-on',
  playStyle: 'balanced',
  skillLevel: 'advanced',
  preferredFPS: 60,
  fov: 90,
  fppView: 103
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
        generatedSensitivity: null,
        playerSettings: {
          ...state.playerSettings,
          preferredFPS: Math.min(state.playerSettings.preferredFPS, action.payload.specs.maxFPS) as FPSOption
        }
      };

    case 'SET_FPS':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, preferredFPS: action.payload }
      };

    case 'SET_FOV':
      return {
        ...state,
        currentStep: state.currentStep === 'results' ? 'results' : state.currentStep,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, fov: action.payload }
      };

    case 'SET_FPP_VIEW':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, fppView: action.payload }
      };

    case 'SET_SKILL_LEVEL':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, skillLevel: action.payload }
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
        generatedSensitivity: null,
        playerSettings: {
          ...state.playerSettings,
          fingerCount: action.payload,
          gripStyle: newGrip
        }
      };

    case 'SET_FINGER_ASSIGNMENT':
      return {
        ...state,
        playerSettings: { ...state.playerSettings, fingerAssignment: action.payload },
        generatedSensitivity: state.generatedSensitivity
          ? { ...state.generatedSensitivity, playerSettings: { ...state.generatedSensitivity.playerSettings, fingerAssignment: action.payload } }
          : null
      };

    case 'SET_GRIP':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, gripStyle: action.payload }
      };

    case 'SET_GYROSCOPE':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, gyroscopeMode: action.payload }
      };

    case 'SET_PLAYSTYLE':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, playStyle: action.payload }
      };

    case 'SET_SENSITIVITY_EXPERIMENTS':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, sensitivityExperiments: action.payload }
      };

    case 'SET_REACH_CALIBRATION':
      return {
        ...state,
        generatedSensitivity: null,
        playerSettings: { ...state.playerSettings, reachCalibration: action.payload }
      };

    case 'SET_SENSITIVITY':
      return {
        ...state,
        selectedDevice: action.payload.device,
        playerSettings: { ...initialPlayerSettings, ...action.payload.playerSettings },
        generatedSensitivity: action.payload
      };

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
  setFov: (fov: FOVOption) => void;
  setFppView: (view: FPPViewOption) => void;
  setSkillLevel: (level: SkillLevel) => void;
  setFingers: (fingers: FingerCount) => void;
  setFingerAssignment: (assignment: FingerAssignment) => void;
  setGrip: (grip: GripStyle) => void;
  setGyroscope: (mode: GyroscopeMode) => void;
  setPlaystyle: (style: PlayStyle) => void;
  setSensitivityExperiments: (experiments: SensitivityExperiment[]) => void;
  setReachCalibration: (calibration: ReachCalibrationInput[]) => void;
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

  useEffect(() => {
    const sharedProfile = readProfileFromLocation();
    if (!sharedProfile) return;
    dispatch({ type: 'SET_DEVICE', payload: sharedProfile.device });
    dispatch({ type: 'SET_SENSITIVITY', payload: sharedProfile });
    dispatch({ type: 'SET_STEP', payload: 'results' });
    clearProfileShareHash();
  }, []);

  const t = translations[state.language];
  const isRTL = state.language === 'ar';

  // Helper actions
  const setStep = (step: AppStep) => dispatch({ type: 'SET_STEP', payload: step });
  const setDevice = (device: Device) => dispatch({ type: 'SET_DEVICE', payload: device });
  const setFPS = (fps: FPSOption) => dispatch({ type: 'SET_FPS', payload: fps });
  const setFov = (fov: FOVOption) => dispatch({ type: 'SET_FOV', payload: fov });
  const setFppView = (view: FPPViewOption) => dispatch({ type: 'SET_FPP_VIEW', payload: view });
  const setSkillLevel = (level: SkillLevel) => dispatch({ type: 'SET_SKILL_LEVEL', payload: level });
  const setFingers = (fingers: FingerCount) => dispatch({ type: 'SET_FINGERS', payload: fingers });
  const setFingerAssignment = (assignment: FingerAssignment) => dispatch({ type: 'SET_FINGER_ASSIGNMENT', payload: assignment });
  const setGrip = (grip: GripStyle) => dispatch({ type: 'SET_GRIP', payload: grip });
  const setGyroscope = (mode: GyroscopeMode) => dispatch({ type: 'SET_GYROSCOPE', payload: mode });
  const setPlaystyle = (style: PlayStyle) => dispatch({ type: 'SET_PLAYSTYLE', payload: style });
  const setSensitivityExperiments = (experiments: SensitivityExperiment[]) => dispatch({ type: 'SET_SENSITIVITY_EXPERIMENTS', payload: experiments });
  const setReachCalibration = (calibration: ReachCalibrationInput[]) => dispatch({ type: 'SET_REACH_CALIBRATION', payload: calibration });
  const setSensitivity = (sens: GeneratedSensitivity) => dispatch({ type: 'SET_SENSITIVITY', payload: sens });
  const setLanguage = (lang: Language) => dispatch({ type: 'SET_LANGUAGE', payload: lang });
  const reset = () => dispatch({ type: 'RESET' });

  // Navigation
  const nextStep = () => {
    if (state.currentStep === 6) {
      setStep('results');
    } else if (typeof state.currentStep === 'number') {
      setStep((state.currentStep + 1) as AppStep);
    }
  };

  const prevStep = () => {
    if (state.currentStep === 'results') {
      setStep(6);
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
      case 6: return true;
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
      setFov,
      setFppView,
      setSkillLevel,
      setFingers,
      setFingerAssignment,
      setGrip,
      setGyroscope,
      setPlaystyle,
      setSensitivityExperiments,
      setReachCalibration,
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
