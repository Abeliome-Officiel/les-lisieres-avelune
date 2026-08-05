export interface WaveState {
	pressure: number;
	structure: number;
	charge: number;
	capturableMatter: number;
}

export interface WaveVariation {
	minimumPercent: number;
	maximumPercent: number;
}

export interface WaveForecastUncertainty {
	tMinus3Percent: number;
	tMinus2Percent: number;
	tMinus1Percent: number;
}

export interface WaveConfiguration {
	nominal: WaveState;
	variation: WaveVariation;
	forecast: WaveForecastUncertainty;
}

export interface WaveForecastState {
	uncertaintyPercent: number;
	estimatedWave: WaveState;
}

export interface WaveForecasts {
	tMinus3: WaveForecastState;
	tMinus2: WaveForecastState;
	tMinus1: WaveForecastState;
}
