import { HomePage } from "@/components/home/home-page"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"

export default function Page() {
  return (
    <>
      <NavbarAvancee />
      <HomePage />
    </>
  )
}
    return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-boulangerie-cream texture-pain">
      {/* Header avec bouton panier */}
      <div className="bg-boulangerie-bordeaux relative">
        <div className="absolute inset-0 bg-pattern-alsacien"></div>
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-artisan font-bold text-white mb-6 leading-tight">
              Boulangerie <span className="text-boulangerie-or">Fabrice's</span>
            </h1>
            <p className="text-xl md:text-2xl text-boulangerie-cream font-alsacien leading-relaxed">
              Découvrez notre sélection de produits artisanaux, 
              <br className="hidden md:block" />
              pétris avec passion selon les traditions d'Alsace
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-24 h-1 bg-boulangerie-or rounded-full shadow-or"></div>
            </div>
          </div>

          <PanierButton />
          <TestDataBanner show={useTestData} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filtre par catégories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <CategorieFilter
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={selectCategorie}
              produitsCountByCategory={produitsCountByCategory}
            />
          </div>
        )}

        {/* Header de la catégorie sélectionnée */}
        <CategorieHeader 
          categorie={categorieSelectionnee} 
          produitsCount={produitsFiltres.length} 
        />

        {/* Contenu principal */}
        {produitsFiltres.length === 0 ? (
          <EmptyState 
            selectedCategoryId={selectedCategoryId}
            onClearSelection={clearSelection}
          />
        ) : (
          <ProduitsGrid produits={produitsFiltres} />
        )}

        {/* Compteur de produits */}
        <ProduitsCounter 
          produitsCount={produitsFiltres.length}
          selectedCategoryId={selectedCategoryId}
          categories={categories}
        />
      </div>

      {/* Drawer du panier */}
      <PanierDrawer
        isOpen={usePanier().panier.isOpen}
        onClose={fermerPanier}
        onStartCommande={handleStartCommande}
      />

      {/* Processus de commande */}
      <ProcessusCommande
        isOpen={isCommandeOpen}
        onClose={handleCloseCommande}
      />
    </div>
  );
}
