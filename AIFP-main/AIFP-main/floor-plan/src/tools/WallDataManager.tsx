import { Point, WallSegment } from "../types";
import { v4 as uuidv4 } from 'uuid';

// WallTool: Pure data management and calculations
export class WallDataManager {
    private segments: WallSegment[] = [];
    private readonly snapThreshold = 1;
    private readonly angleSnapThreshold = Math.PI / 36; // 5 degrees
    private readonly commonAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

    // Core data operations
    addWall(wall: WallSegment): void {
        wall.id = uuidv4();
        this.segments.push(wall);
    }

    getWall(id: string): WallSegment | null {
        return this.segments.find(wall => wall.id === id) || null;
    }

    updateWall(id: string, wall: WallSegment): void {
        const index = this.segments.findIndex(segment => segment.id === id);
        if (index >= 0) {
            this.segments[index] = wall;
        }
    }

    deleteWall(index: number): void {
        this.segments.splice(index, 1);
    }

    getWalls(): WallSegment[] {
        return this.segments;
    }

    clear(): void {
        this.segments = [];
    }

    // Utility calculations
    getSnapPoints(): Point[] {
        const points: Point[] = [];
        this.segments.forEach(segment => {
            points.push(segment.start, segment.end);
            points.push({
                x: (segment.start.x + segment.end.x) / 2,
                y: (segment.start.y + segment.end.y) / 2
            });
        });
        return points;
    }

    findNearestSnapPoint(point: Point, scale: number): Point | null {
        const threshold = this.snapThreshold / scale;
        const snapPoints = this.getSnapPoints();
        let nearest: Point | null = null;
        let minDistance = Infinity;

        snapPoints.forEach(snapPoint => {
            const distance = Math.sqrt(
                Math.pow(point.x - snapPoint.x, 2) + Math.pow(point.y - snapPoint.y, 2)
            );
            if (distance < threshold && distance < minDistance) {
                minDistance = distance;
                nearest = snapPoint;
            }
        });

        return nearest;
    }

    snapToAngle(start: Point, end: Point): Point {
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const distance = Math.sqrt(
            Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
        );

        let snappedAngle = angle;
        let minDiff = this.angleSnapThreshold;

        this.commonAngles.forEach(commonAngle => {
            const diff = Math.abs(angle - commonAngle);
            if (diff < minDiff) {
                minDiff = diff;
                snappedAngle = commonAngle;
            }
        });

        return {
            x: start.x + distance * Math.cos(snappedAngle),
            y: start.y + distance * Math.sin(snappedAngle)
        };
    }
}