export interface Orbit {
    id: number;
    name: string;
    altitudeKm: number;
    imageKey: string | null;
    videoKey: string | null;
    description: string;
    descriptionEn: string;
    embedding?: number[];
}

export const MINIO_BASE_URL = "http://localhost:9000/orbits/";

export const ORBITS_MOCK: Orbit[] =[
    {
        id: 1,
        name: "Низкая опорная орбита (LEO)",
        altitudeKm: 400,
        imageKey: "", 
        videoKey: null,
        description: "Базовая орбита для развертывания спутников связи и МКС. Минимальная задержка сигнала.",
        descriptionEn: "A white spacecraft docked to a space station orbiting Earth. Blue ocean and clouds are visible below. Solar panels extended."
    },
    {
        id: 2,
        name: "Средняя орбита (MEO)",
        altitudeKm: 20200,
        imageKey: "",
        videoKey: null,
        description: "Орбита для навигационных систем. Обеспечивает стабильное покрытие больших территорий.",
        descriptionEn: "A large cylindrical satellite with four rectangular solar panels orbiting Earth. Bright sun glare in the background."
    },
    {
        id: 3,
        name: "Переходная орбита (GTO)",
        altitudeKm: 15000,
        imageKey: "",
        videoKey: null,
        description: "Используется для перевода аппаратов с низкой орбиты на геостационарную. Наблюдение ночной стороны.",
        descriptionEn: "A spacecraft orbiting Earth at night. Yellow city lights are glowing brightly on the dark surface. A small moon is in the dark distance."
    },
    {
        id: 4,
        name: "Солнечно-синхронная (SSO)",
        altitudeKm: 800,
        imageKey: "",
        videoKey: null,
        description: "Орбита для метеорологических наблюдений. Позволяет мониторить ураганы и циклоны в одно время суток.",
        descriptionEn: "A satellite with a dish antenna and solar panels above a massive white hurricane or cyclone on Earth's surface."
    },
    {
        id: 5,
        name: "Полярная орбита (Polar)",
        altitudeKm: 1000,
        imageKey: "",
        videoKey: null,
        description: "Проходит над полюсами Земли. Идеальна для картографирования и научных исследований.",
        descriptionEn: "A small box-shaped satellite with four solar panels arranged in a cross shape. Bright sunrise over the blue Earth horizon."
    },
    {
        id: 6,
        name: "Геостационарная орбита (GEO)",
        altitudeKm: 35786,
        imageKey: "",
        videoKey: null,
        description: "Спутник неподвижен относительно Земли. Используется для постоянного телевещания.",
        descriptionEn: "A large communication satellite with a solid parabolic dish antenna and solar panels. Bright sun shining behind it over Earth."
    }
];

export const MISSION_MOCK = {
    id: 101, 
    status: "DRAFT", 
    mass: 0, 
    items:[] 
};