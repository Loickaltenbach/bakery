import { Produit, Categorie } from './api';

// Données de test pour les catégories
export const categoriesTest: Categorie[] = [
    {
        id: 1,
        documentId: "cat-1",
        nom: "Pains",
        description: "Pains artisanaux cuits au feu de bois",
        slug: "pains",
        couleur: "#8b5a3c",
        icone: "bread-slice",
        ordre: 1,
        image: [
            {
                id: 101,
                documentId: "cat-img-1",
                name: "categorie-pains.jpg",
                alternativeText: "Catégorie Pains",
                width: 400,
                height: 300,
                formats: {},
                hash: "cat_pains_abc123",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 45.2,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        id: 2,
        documentId: "cat-2",
        nom: "Viennoiseries",
        description: "Croissants, pains au chocolat et autres délices",
        slug: "viennoiseries",
        couleur: "#f59e0b",
        icone: "croissant",
        ordre: 2,
        image: [
            {
                id: 102,
                documentId: "cat-img-2",
                name: "categorie-viennoiseries.jpg",
                alternativeText: "Catégorie Viennoiseries",
                width: 400,
                height: 300,
                formats: {},
                hash: "cat_viennoiseries_def456",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 52.8,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        id: 3,
        documentId: "cat-3",
        nom: "Pâtisseries",
        description: "Tartes, éclairs et gâteaux faits maison",
        slug: "patisseries",
        couleur: "#ec4899",
        icone: "cake",
        ordre: 3,
        image: [
            {
                id: 103,
                documentId: "cat-img-3",
                name: "categorie-patisseries.jpg",
                alternativeText: "Catégorie Pâtisseries",
                width: 400,
                height: 300,
                formats: {},
                hash: "cat_patisseries_ghi789",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 48.5,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    }
];

export const produitsTest: Produit[] = [
    {
        id: 1,
        documentId: "test-1",
        nom: "Pain de Campagne",
        description: "Pain artisanal au levain naturel, cuit au feu de bois pour une croûte croustillante et une mie moelleuse.",
        prix: 4.50,
        image: [
            {
                id: 1,
                documentId: "img-1",
                name: "pain-campagne.jpg",
                alternativeText: "Pain de campagne artisanal",
                caption: "",
                width: 800,
                height: 600,
                formats: {},
                hash: "pain_campagne_abc123",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 120.5,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        categorie: {
            id: 1,
            documentId: "cat-1",
            nom: "Pains",
            description: "Pains artisanaux cuits au feu de bois",
            slug: "pains",
            couleur: "#8b5a3c",
            icone: "bread-slice",
            ordre: 1,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z",
            publishedAt: "2024-01-01T10:00:00.000Z"
        },
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        id: 2,
        documentId: "test-2",
        nom: "Croissants Beurre",
        description: "Croissants pur beurre AOP, feuilletage traditionnel français. Croustillants à l'extérieur, fondants à l'intérieur.",
        prix: 1.20,
        image: [
            {
                id: 2,
                documentId: "img-2",
                name: "croissants.jpg",
                alternativeText: "Croissants au beurre",
                caption: "",
                width: 800,
                height: 600,
                formats: {},
                hash: "croissants_def456",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 95.2,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        categorie: {
            id: 2,
            documentId: "cat-2",
            nom: "Viennoiseries",
            description: "Croissants, pains au chocolat et autres délices",
            slug: "viennoiseries",
            couleur: "#f59e0b",
            icone: "croissant",
            ordre: 2,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z",
            publishedAt: "2024-01-01T10:00:00.000Z"
        },
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        id: 3,
        documentId: "test-3",
        nom: "Tarte aux Pommes",
        description: "Tarte aux pommes maison, pâte brisée pur beurre, pommes de nos vergers locaux et crème pâtissière vanille.",
        prix: 18.50,
        image: [
            {
                id: 3,
                documentId: "img-3",
                name: "tarte-pommes.jpg",
                alternativeText: "Tarte aux pommes maison",
                caption: "",
                width: 800,
                height: 600,
                formats: {},
                hash: "tarte_pommes_ghi789",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 140.8,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        categorie: {
            id: 3,
            documentId: "cat-3",
            nom: "Pâtisseries",
            description: "Tartes, éclairs et gâteaux faits maison",
            slug: "patisseries",
            couleur: "#ec4899",
            icone: "cake",
            ordre: 3,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z",
            publishedAt: "2024-01-01T10:00:00.000Z"
        },
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        id: 4,
        documentId: "test-4",
        nom: "Baguette Tradition",
        description: "Baguette de tradition française Label Rouge, farine de qualité supérieure, fermentation lente pour un goût authentique.",
        prix: 1.10,
        categorie: {
            id: 1,
            documentId: "cat-1",
            nom: "Pains",
            description: "Pains artisanaux cuits au feu de bois",
            slug: "pains",
            couleur: "#8b5a3c",
            icone: "bread-slice",
            ordre: 1,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z",
            publishedAt: "2024-01-01T10:00:00.000Z"
        },
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        id: 5,
        documentId: "test-5",
        nom: "Éclair au Chocolat",
        description: "Éclair garni de crème pâtissière au chocolat noir 70%, glaçage chocolat fondant, pâte à choux dorée.",
        prix: 3.20,
        image: [
            {
                id: 5,
                documentId: "img-5",
                name: "eclair-chocolat.jpg",
                alternativeText: "Éclair au chocolat",
                caption: "",
                width: 800,
                height: 600,
                formats: {},
                hash: "eclair_chocolat_jkl012",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 88.3,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        categorie: {
            id: 3,
            documentId: "cat-3",
            nom: "Pâtisseries",
            description: "Tartes, éclairs et gâteaux faits maison",
            slug: "patisseries",
            couleur: "#ec4899",
            icone: "cake",
            ordre: 3,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z",
            publishedAt: "2024-01-01T10:00:00.000Z"
        },
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    },
    {
        id: 6,
        documentId: "test-6",
        nom: "Pain aux Noix",
        description: "Pain complet aux cerneaux de noix fraîches, mie dense et savoureuse, parfait pour les plateaux de fromages.",
        prix: 5.80,
        image: [
            {
                id: 6,
                documentId: "img-6",
                name: "pain-noix.jpg",
                alternativeText: "Pain aux noix",
                caption: "",
                width: 800,
                height: 600,
                formats: {},
                hash: "pain_noix_mno345",
                ext: ".jpg",
                mime: "image/jpeg",
                size: 115.7,
                url: "/placeholder-product.svg",
                provider: "local",
                createdAt: "2024-01-01T10:00:00.000Z",
                updatedAt: "2024-01-01T10:00:00.000Z"
            }
        ],
        categorie: {
            id: 1,
            documentId: "cat-1",
            nom: "Pains",
            description: "Pains artisanaux cuits au feu de bois",
            slug: "pains",
            couleur: "#8b5a3c",
            icone: "bread-slice",
            ordre: 1,
            createdAt: "2024-01-01T10:00:00.000Z",
            updatedAt: "2024-01-01T10:00:00.000Z",
            publishedAt: "2024-01-01T10:00:00.000Z"
        },
        createdAt: "2024-01-01T10:00:00.000Z",
        updatedAt: "2024-01-01T10:00:00.000Z",
        publishedAt: "2024-01-01T10:00:00.000Z"
    }
];
