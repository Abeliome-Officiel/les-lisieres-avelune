export type AccessibilitySettings = {
  colorScheme: 'dark' | 'light';
  fontFamily: 'system' | 'readable' | 'serif' | 'monospace';
  fontScale: number;
  lineHeight: number;
  letterSpacingEm: number;
  wordSpacingEm: number;
  maxLineLengthCh: number;
  leftAligned: boolean;
  removeItalics: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  density: 'compact' | 'standard' | 'spacious';
  emphasizeActiveTask: boolean;
};

export type AccessibilityProfile = {
  id: 'dark' | 'light' | 'dys' | 'calm';
  name: string;
  description: string;
  settings: AccessibilitySettings;
};

export const accessibilityProfiles: AccessibilityProfile[] = [
  {
    id: 'dark',
    name: 'Sombre standard',
    description: 'Profil sombre actuel.',
    settings: {
      colorScheme: 'dark',
      fontFamily: 'system',
      fontScale: 1,
      lineHeight: 1.5,
      letterSpacingEm: 0,
      wordSpacingEm: 0,
      maxLineLengthCh: 78,
      leftAligned: true,
      removeItalics: false,
      highContrast: false,
      reducedMotion: false,
      density: 'standard',
      emphasizeActiveTask: true
    }
  },
  {
    id: 'light',
    name: 'Clair standard',
    description: 'Fond clair et contraste modéré.',
    settings: {
      colorScheme: 'light',
      fontFamily: 'system',
      fontScale: 1,
      lineHeight: 1.5,
      letterSpacingEm: 0,
      wordSpacingEm: 0,
      maxLineLengthCh: 78,
      leftAligned: true,
      removeItalics: false,
      highContrast: false,
      reducedMotion: false,
      density: 'standard',
      emphasizeActiveTask: true
    }
  },
  {
    id: 'dys',
    name: 'Lecture personnalisable',
    description:
      'Point de départ avec police lisible, espacement accru et lignes courtes.',
    settings: {
      colorScheme: 'light',
      fontFamily: 'readable',
      fontScale: 1.08,
      lineHeight: 1.75,
      letterSpacingEm: 0.025,
      wordSpacingEm: 0.08,
      maxLineLengthCh: 62,
      leftAligned: true,
      removeItalics: true,
      highContrast: false,
      reducedMotion: true,
      density: 'spacious',
      emphasizeActiveTask: true
    }
  },
  {
    id: 'calm',
    name: 'Faible stimulation',
    description:
      'Réduit les mouvements, les contrastes agressifs et la densité visuelle.',
    settings: {
      colorScheme: 'dark',
      fontFamily: 'system',
      fontScale: 1,
      lineHeight: 1.65,
      letterSpacingEm: 0.01,
      wordSpacingEm: 0.03,
      maxLineLengthCh: 70,
      leftAligned: true,
      removeItalics: true,
      highContrast: false,
      reducedMotion: true,
      density: 'spacious',
      emphasizeActiveTask: true
    }
  }
];

export const defaultAccessibilityProfile = 'dark';
