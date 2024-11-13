
import { Terran } from './terran.ts';
import { SuperTerran } from './superTerran.ts';
import { MiniNeptunian } from './miniNeptunian.ts';
import { IceGiant } from './iceGiant.ts';
import { GasGiant } from './gasGiant.ts';
import { SubTerran } from './subTerran.ts';



export type PlanetType = typeof SubTerran | typeof Terran | typeof SuperTerran | typeof MiniNeptunian | typeof IceGiant | typeof GasGiant;

