"use client";
import { useEffect, useRef, useState } from "react";
import {
  Color,
  Fog,
  PerspectiveCamera,
  Scene,
  Vector3,
  Object3D,
} from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ThreeGlobe from "three-globe";
import countries from "@/data/globe.json";

// ✅ تصحيح الـ typing: السماح باستخدام <threeGlobe /> بدون خطأ
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: any;
  }
}

// أنواع البيانات المطلوبة
type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

// إعدادات ثابتة
const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

let numbersOfRings: number[] = [];

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<any[]>([]);
  const globeRef = useRef<any>(null);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (!globeRef.current) return;

    const material = globeRef.current.globeMaterial() as any;
    material.color = new Color(defaultProps.globeColor);
    material.emissive = new Color(defaultProps.emissive);
    material.emissiveIntensity = defaultProps.emissiveIntensity;
    material.shininess = defaultProps.shininess;

    const points = data.flatMap((arc) => {
      const { r, g, b } = hexToRgb(arc.color)!;
      return [
        {
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${r}, ${g}, ${b}, ${1 - t})`,
          lat: arc.startLat,
          lng: arc.startLng,
        },
        {
          size: defaultProps.pointSize,
          order: arc.order,
          color: (t: number) => `rgba(${r}, ${g}, ${b}, ${1 - t})`,
          lat: arc.endLat,
          lng: arc.endLng,
        },
      ];
    });

    const filtered = points.filter(
      (v, i, a) =>
        a.findIndex(
          (v2) => v2.lat === v.lat && v2.lng === v.lng
        ) === i
    );

    setGlobeData(filtered);
  }, [data]);

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current

      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(data)
   
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
     
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      );

    const interval = setInterval(() => {
      numbersOfRings = genRandomNumbers(0, globeData.length, Math.floor(globeData.length * 0.8));
      globeRef.current.ringsData(globeData.filter((_, i) => numbersOfRings.includes(i)));
    }, 2000);

    return () => clearInterval(interval);
  }, [globeData]);

  return <threeGlobe ref={globeRef} />;
}

// إعداد الـ WebGL renderer
export function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0); // خلفية شفافة
  }, []);
  return null;
}

// المكون النهائي الذي يعرض كل شيء
export function World(props: WorldProps) {
  const { globeConfig } = props;

  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  return (
    <Canvas
      scene={scene}
      camera={new PerspectiveCamera(50, aspect, 180, 1800)}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotate={true}
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

// أدوات مساعدة
export function hexToRgb(hex: string) {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const result = new Set<number>();
  while (result.size < count) {
    result.add(Math.floor(Math.random() * (max - min)) + min);
  }
  return Array.from(result);
}
