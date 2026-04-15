export interface Orbit {
    id: number;
    name: string;
    altitudeKm: number;
    imageKey: string | null;
    videoKey: string | null;
    description: string;
}

export interface MissionItem {
    orbitId: number;
    name: string;
    altitudeKm: number;
    imageKey: string | null;
    payloadTons: number;
    velocity: number | null;
    period: number | null;
}

export const ORBITS_MOCK: Orbit[] =[
    {
        id: 1,
        name: "Низкая опорная орбита (LEO)",
        altitudeKm: 400,
        imageKey: null,
        videoKey: null,
        description: "Круговая орбита, расположенная над экватором."
    },
    {
        id: 2,
        name: "Геостационарная орбита (GEO)",
        altitudeKm: 35786,
        imageKey: null,
        videoKey: null,
        description: "Спутник кажется неподвижным для наземного наблюдателя."
    },
    {
        id: 3,
        name: "Солнце-синхронная орбита",
        altitudeKm: 800,
        imageKey: null,
        videoKey: null,
        description: "Орбита не меняющая положения относительно солнца."
    }
];

export const MISSION_MOCK = {
    id: 101,
    mass: 0,
    status: "DRAFT",
    items:[] as MissionItem[] 
};