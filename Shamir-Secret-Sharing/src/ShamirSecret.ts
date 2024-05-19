import { Field, Struct } from "o1js";

// Define struct to represent points in Cartesian plane
class Point extends Struct({
    x: Field,
    y: Field
}) {}

// Convert string to number
function stringToAsciiNumber(str: string): number {
    const asciistr = str.split('').map(char => char.charCodeAt(0)).join('');
    return Number(asciistr);
}

// Generate points for the polynomial
function generatePoints(secret: number, shares: number): Point[] {
    // Assume "random "coefficient with value of 2
    const a = Field(2); 
    // Assume "random "coefficient with value of 4
    const b = Field(4);
    let s = Field(secret);
    const points: Point[] = [];
    // Assume 2nd degree polynomial computation:
    // --> y = secret + ax + bx^2
    for (let x = 1; x <= shares; x++) {
        let z = a.mul(Field(x));
        let _w = b.mul(Field(x));
        let w = _w.mul(_w);
        let r = s.add(z.add(w));
        let point = new Point({ x: Field(x), y: r });
        points.push(point);
    }

    return points;
}

// Encode points to Base64
function encodeShares(points: Point[]): string[] {
    const encodedPoints: string[] = [];
    points.map(p => {
        const xStr = p.x.toString();
        const yStr = p.y.toString();
        const encodedPoint = Buffer.from(xStr + ',' + yStr).toString('base64');
        encodedPoints.push(encodedPoint);
    });

    return encodedPoints;

}

// Decode shares and retrieve points
function decodeShares(encodedShares: string[]): Point[] {
    const points: Point[] = [];
    encodedShares.map(share => {
        const decoded = Buffer.from(share, 'base64').toString('utf-8');
        const [xStr, yStr] = decoded.split(',');
        const x = Field(BigInt(xStr));
        const y = Field(BigInt(yStr));
        const point = new Point({ x, y });
        points.push(point);
    });

    return points;
}

// Reconstruct secret from points
function reconstructSecret(points: Point[], k: number): Field {
    if (k < points.length) {
        throw new Error("Not enough shares to reconstruct secret!");
    }
    return lagrangeInterpolation(points, k);
}

// Reconstruct degree 2 polynomial using Lagrange Interpolation
function lagrangeInterpolation(points: Point[], k: number): Field {
    let secret = Field(0);
    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        let li = Field(1);
        for (let m = 0; m < k; m++) {
            if (m !== i) {
                let xm = points[m].x;
                li = li.mul(xm).div(xm.sub(xi));
            }
        }
        secret = secret.add(yi.mul(li));
    }
    return secret;
}

// Create secret
const secret = "BOBER";
// Convert string to ascii numbers
const asciiNumbers = stringToAsciiNumber(secret);
console.log(`secret '${secret}' to number: ${asciiNumbers}`);

// Shares to break secret into
const k = 3;
// Compute polynomial and return points in plane
const points = generatePoints(asciiNumbers, k);
// Encode points into Base64 to represent shares
const encodedShares = encodeShares(points);

console.log(`Encoded Shares: ${encodedShares}`);

// Decode shares and use Lagrange Interpolation to retrieve points 
const retrievedPoints = decodeShares(encodedShares);

const reconstructedSecret = reconstructSecret(retrievedPoints, k);
console.log(`Reconstructed secret: ${reconstructedSecret.toString()}`);
