// Factory to create appropriate Galaxy subclass instances
import { Galaxy } from './Galaxy';
import SpiralGalaxy from './galaxies/SpiralGalaxy';
import EllipticalGalaxy from './galaxies/EllipticalGalaxy';
import RingGalaxy from './galaxies/RingGalaxy';
import LenticularGalaxy from './galaxies/LenticularGalaxy';
import IrregularGalaxy from './galaxies/IrregularGalaxy';
import DualGalaxy from './galaxies/DualGalaxy';
import PeculiarGalaxy from './galaxies/PeculiarGalaxy';
import StarFieldGalaxy from './galaxies/StarFieldGalaxy';
import EmptySpaceGalaxy from './galaxies/EmptySpaceGalaxy';
import ClusterGalaxy from './galaxies/ClusterGalaxy';
import BlackHoleGalaxy from './galaxies/BlackHoleGalaxy';

export default function createGalaxy(scene, galaxyType = 'milky_way') {
	// Normalize popular aliases
	const normalized = (galaxyType || '').toString();

	switch (normalized) {
		case 'milky_way':
		case 'spiral':
		case 'whirlpool':
			return new SpiralGalaxy(scene, galaxyType);

		case 'elliptical':
		case 'elliptical_giant':
			return new EllipticalGalaxy(scene, galaxyType);

		case 'ring':
		case 'ring_galaxy':
			return new RingGalaxy(scene, galaxyType);

		case 'lenticular':
			return new LenticularGalaxy(scene, galaxyType);

		case 'irregular':
		case 'irregular_lmc':
		case 'irregular_starburst':
			return new IrregularGalaxy(scene, galaxyType);

		case 'dual':
		case 'dual_spirals':
		case 'dual_ellipticals':
			return new DualGalaxy(scene, galaxyType);

		case 'peculiar':
		case 'peculiar_antennae':
			return new PeculiarGalaxy(scene, galaxyType);

		case 'star_field':
		case 'star_field_dense':
		case 'star_field_sparse':
			return new StarFieldGalaxy(scene, galaxyType);

		case 'empty':
		case 'empty_space':
			return new EmptySpaceGalaxy(scene, galaxyType);

		case 'cluster':
		case 'globular_cluster':
			return new ClusterGalaxy(scene, galaxyType);

		case 'black_hole':
		case 'black_hole_spiral':
		case 'black_hole_elliptical':
			return new BlackHoleGalaxy(scene, galaxyType);

		default:
			// Fallback to base Galaxy if no specialized subclass exists
			return new Galaxy(scene, galaxyType);
	}
}
