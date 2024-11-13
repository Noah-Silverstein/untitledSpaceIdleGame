/**
 * Represents a point in 3D space using polar (spherical) coordinates.
 *
 * @class PolarCoordinate
 * @param {number} radius - The radial distance from the origin, in Astronomical Units (AU).
 * @param {number} theta - The polar angle (θ) in radians, measured from the z-axis. 0-360
 * @param {number} phi - The azimuthal angle (φ) in radians, measured from the x-axis in the xy-plane. 0-180
 */

export class PolarCoordinate {
	public r: number;
	public t: number;
	public p: number;
	/**
	 * @class PolarCoordinate
	 * @param radius - The radial distance from the origin, in Astronomical Units (AU).
	 * @param theta - The polar angle (θ) in radians, measured from the z-axis. 0-180
	 * @param phi - The azimuthal angle (φ) in radians, measured from the x-axis in the xy-plane. 0-360
	 */
	constructor(radius:number, theta:number, phi:number){
		this.r = radius; //AU
		this.t = theta;
		this.p = phi;
	}
}