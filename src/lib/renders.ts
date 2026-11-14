/**
 * What the page knows about the rendered scroll sequence in "What it is".
 *
 * scripts/blender prints this as a SEQINFO line when it renders the plate or
 * the frames; copy it here when the camera, the crop or the choreography
 * changes. Positions are fractions of the frame from its top left.
 */
export const SEQ = {
  /** How many frames the moving layer has: public/renders/seq/000.webp onwards. */
  frames: 157,
  /** The frame each beat starts on. */
  beats: { look: 0, reach: 16, carry: 34, swap1: 62, deleaf: 84, swap2: 120, lower: 140 },
  /** The part of the frame the moving layer covers. */
  crop: { left: 0.24, right: 0.76, top: 0, bottom: 0.84 },
  /** The trusses the robot looks at before it picks: centre, and height. */
  marks: [
    { ready: true, x: 0.348, y: 0.5297, h: 0.1786 },
    { ready: false, x: 0.3707, y: 0.4124, h: 0.1726 },
    { ready: false, x: 0.3598, y: 0.2271, h: 0.1831 },
  ],
} as const;

/**
 * The second sequence, which follows the first: HOIST at the crop wire, from
 * a camera under the wire. Printed as a WIREINFO line.
 */
export const WIRE = {
  /** public/renders/wire/000.webp onwards. */
  frames: 54,
  beats: { wire: 0, flip: 15 },
  crop: { left: 0, right: 1, top: 0, bottom: 1 },
} as const;
