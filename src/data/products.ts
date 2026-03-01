export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    origin: string;
    image_url: string;
};

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod_1',
        name: 'Chili Smoke',
        description: 'A deeply aromatic blend of smoked Mexican chilies and savory Korean aromatics. Perfect for fire-roasted meats or rich stews.',
        price: 14.99,
        origin: 'Oaxaca, MX / Jeolla, KR',
        image_url: '/images/chili-smoke.jpg'
    },
    {
        id: 'prod_2',
        name: 'Sweet Beans',
        description: 'Rich, fermented Korean soy sweetness intertwined with notes of Mexican vanilla beans. An unexpected glaze for pork or sweet pastries.',
        price: 12.99,
        origin: 'Seoul, KR / Veracruz, MX',
        image_url: '/images/sweet-beans.jpg'
    },
    {
        id: 'prod_3',
        name: 'Salty Fruit',
        description: 'Bright citrus from the Mexican coast paired with sun-dried Korean sea salt. Elevates fresh ceviche or a summer fruit salad.',
        price: 11.99,
        origin: 'Colima, MX / Shinan, KR',
        image_url: '/images/salty-fruit.jpg'
    }
];
