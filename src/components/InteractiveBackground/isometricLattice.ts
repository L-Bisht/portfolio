/** Precomputed vertex in 2D canvas coordinates */
export interface CubeVertex {
  x: number;
  y: number;
}

/** Precomputed 3D isometric cube edge with cached bounding box and squared length */
export interface CubeEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  midX: number;
  midY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  len2: number;
}

export interface IsometricLattice {
  edges: CubeEdge[];
  vertices: CubeVertex[];
}

export const CUBE_EDGE = 38; // px length of each isometric cube wireframe edge
export const CUBE_PROX_R = 190; // px proximity influence radius
export const CUBE_PROX_R2 = CUBE_PROX_R * CUBE_PROX_R;

/**
 * Generates a tessellated 3D Isometric Cubes Wireframe Lattice.
 * Each cube is projected isometrically as a hexagon with 3 interior Y-edges.
 * All edges strictly conform to 30°, 90°, and 150° orientations with uniform edge length.
 * Shared edges and vertices between adjacent cubes are deduplicated.
 */
export function buildIsometricLattice(w: number, h: number, s: number = CUBE_EDGE): IsometricLattice {
  const sin30 = 0.5;
  const cos30 = Math.sqrt(3) / 2;
  const dx = s * cos30; // horizontal step to 30° / 150° vertices
  const dy = s * sin30; // vertical step (0.5 * s)

  const vertexMap = new Map<string, CubeVertex>();
  const edgeMap = new Map<string, CubeEdge>();

  const colStep = 2 * dx;
  const rowStep = 3 * dy; // 1.5 * s

  // Buffer around canvas to tile seamlessly edge-to-edge
  const colStart = Math.floor(-colStep / colStep) - 2;
  const colEnd   = Math.ceil((w + colStep) / colStep) + 2;
  const rowStart = Math.floor(-rowStep / rowStep) - 2;
  const rowEnd   = Math.ceil((h + rowStep) / rowStep) + 2;

  function addVertex(x: number, y: number) {
    const rx = Math.round(x * 100) / 100;
    const ry = Math.round(y * 100) / 100;
    const key = `${rx},${ry}`;
    if (!vertexMap.has(key)) {
      vertexMap.set(key, { x: rx, y: ry });
    }
  }

  function addEdge(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    const rx1 = Math.round(p1.x * 100) / 100;
    const ry1 = Math.round(p1.y * 100) / 100;
    const rx2 = Math.round(p2.x * 100) / 100;
    const ry2 = Math.round(p2.y * 100) / 100;

    const isP1First = rx1 < rx2 || (rx1 === rx2 && ry1 < ry2);
    const x1 = isP1First ? rx1 : rx2;
    const y1 = isP1First ? ry1 : ry2;
    const x2 = isP1First ? rx2 : rx1;
    const y2 = isP1First ? ry2 : ry1;

    const key = `${x1},${y1}-${x2},${y2}`;
    if (!edgeMap.has(key)) {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const edx = x2 - x1;
      const edy = y2 - y1;
      const len2 = edx * edx + edy * edy;
      edgeMap.set(key, { x1, y1, x2, y2, midX, midY, minX, maxX, minY, maxY, len2 });
    }
  }

  for (let r = rowStart; r <= rowEnd; r++) {
    const cy = r * rowStep;
    const xOffset = Math.abs(r) % 2 === 1 ? dx : 0;

    for (let c = colStart; c <= colEnd; c++) {
      const cx = c * colStep + xOffset;

      const Vc = { x: cx, y: cy };
      const V0 = { x: cx, y: cy - 2 * dy };
      const V1 = { x: cx + dx, y: cy - dy };
      const V2 = { x: cx + dx, y: cy + dy };
      const V3 = { x: cx, y: cy + 2 * dy };
      const V4 = { x: cx - dx, y: cy + dy };
      const V5 = { x: cx - dx, y: cy - dy };

      addVertex(Vc.x, Vc.y);
      addVertex(V0.x, V0.y);
      addVertex(V1.x, V1.y);
      addVertex(V2.x, V2.y);
      addVertex(V3.x, V3.y);
      addVertex(V4.x, V4.y);
      addVertex(V5.x, V5.y);

      // 3 interior Y-edges meeting at cube center Vc
      addEdge(Vc, V3); // 90° straight down
      addEdge(Vc, V1); // 30° up-right
      addEdge(Vc, V5); // 150° up-left

      // 6 perimeter edges of the isometric hexagon
      addEdge(V5, V0); // 30°
      addEdge(V0, V1); // 150°
      addEdge(V1, V2); // 90° vertical
      addEdge(V2, V3); // 150°
      addEdge(V3, V4); // 30°
      addEdge(V4, V5); // 90° vertical
    }
  }

  return {
    edges: Array.from(edgeMap.values()),
    vertices: Array.from(vertexMap.values()),
  };
}
