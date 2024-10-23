
import { Terran } from './terran.ts';
import { SuperTerran } from './superTerran.ts';
import { MiniNeptunian } from './miniNeptunian.ts';
import { IceGiant } from './iceGiant.ts';
import { GasGiant } from './gasGiant.ts';



export type PlanetConstructor = typeof Terran | typeof SuperTerran | typeof MiniNeptunian | typeof IceGiant | typeof GasGiant;

