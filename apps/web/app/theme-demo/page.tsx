'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'

export default function ThemeDemoPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-boulangerie-cream dark:bg-boulangerie-dark-bg-primary p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-artisan font-bold text-boulangerie-bordeaux dark:text-boulangerie-or-light mb-4">
            Démonstration du Thème Bordeaux
          </h1>
          <p className="text-lg text-boulangerie-text-secondary dark:text-boulangerie-dark-text-secondary">
            Nouveau thème avec contraste élevé et mise en avant des couleurs bordeaux et or
          </p>
        </div>

        {/* Palette de couleurs */}
        <Card className="card-boulangerie">
          <CardHeader>
            <CardTitle className="text-boulangerie-bordeaux dark:text-boulangerie-or-light">
              Palette de Couleurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Bordeaux */}
              <div className="space-y-2">
                <h3 className="font-semibold text-boulangerie-text-primary dark:text-boulangerie-dark-text-primary">Bordeaux</h3>
                <div className="bg-boulangerie-bordeaux-dark h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  Très foncé
                </div>
                <div className="bg-boulangerie-bordeaux h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  Principal
                </div>
                <div className="bg-boulangerie-bordeaux-light h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  Clair
                </div>
              </div>

              {/* Or */}
              <div className="space-y-2">
                <h3 className="font-semibold text-boulangerie-text-primary dark:text-boulangerie-dark-text-primary">Or</h3>
                <div className="bg-boulangerie-or-dark h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  Foncé
                </div>
                <div className="bg-boulangerie-or h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  Principal
                </div>
                <div className="bg-boulangerie-or-light h-16 rounded-lg flex items-center justify-center text-boulangerie-bordeaux text-sm font-medium">
                  Clair
                </div>
              </div>

              {/* Gradients */}
              <div className="space-y-2">
                <h3 className="font-semibold text-boulangerie-text-primary dark:text-boulangerie-dark-text-primary">Gradients</h3>
                <div className="bg-gradient-bordeaux-or h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  Bordeaux → Or
                </div>
                <div className="bg-gradient-or-cream h-16 rounded-lg flex items-center justify-center text-boulangerie-bordeaux text-sm font-medium">
                  Or → Crème
                </div>
                <div className="bg-gradient-dark-bordeaux h-16 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                  Bordeaux foncé
                </div>
              </div>

              {/* Backgrounds */}
              <div className="space-y-2">
                <h3 className="font-semibold text-boulangerie-text-primary dark:text-boulangerie-dark-text-primary">Backgrounds</h3>
                <div className="bg-boulangerie-cream h-16 rounded-lg border-2 border-boulangerie-or flex items-center justify-center text-boulangerie-bordeaux text-sm font-medium">
                  Crème
                </div>
                <div className="bg-boulangerie-beige h-16 rounded-lg border-2 border-boulangerie-bordeaux flex items-center justify-center text-boulangerie-bordeaux text-sm font-medium">
                  Beige
                </div>
                <div className="bg-boulangerie-dark-bg-secondary h-16 rounded-lg border-2 border-boulangerie-or-light flex items-center justify-center text-boulangerie-or-light text-sm font-medium">
                  Sombre
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Boutons */}
        <Card className="card-boulangerie">
          <CardHeader>
            <CardTitle className="text-boulangerie-bordeaux dark:text-boulangerie-or-light">
              Boutons avec Contraste Élevé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="btn-boulangerie-primary">
                Bouton Principal
              </Button>
              <Button className="btn-boulangerie-secondary">
                Bouton Secondaire
              </Button>
              <Button variant="outline" className="border-boulangerie-bordeaux text-boulangerie-bordeaux hover:bg-boulangerie-bordeaux hover:text-white">
                Bouton Outline
              </Button>
              <Button variant="ghost" className="text-boulangerie-or hover:bg-boulangerie-or/10 hover:text-boulangerie-or-dark">
                Bouton Ghost
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <Card className="card-boulangerie">
          <CardHeader>
            <CardTitle className="text-boulangerie-bordeaux dark:text-boulangerie-or-light">
              Liens de Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <a href="#" className="nav-link">Accueil</a>
              <a href="#" className="nav-link active">Produits (Actif)</a>
              <a href="#" className="nav-link">Commandes</a>
              <a href="#" className="nav-link">Contact</a>
              <a href="#" className="nav-link">Mon Compte</a>
            </div>
          </CardContent>
        </Card>

        {/* Textes */}
        <Card className="card-boulangerie">
          <CardHeader>
            <CardTitle className="text-boulangerie-bordeaux dark:text-boulangerie-or-light">
              Hiérarchie de Texte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-3xl font-artisan font-bold text-primary">
              Titre Principal (H1)
            </h1>
            <h2 className="text-2xl font-artisan font-semibold text-boulangerie-bordeaux dark:text-boulangerie-or-light">
              Sous-titre (H2)
            </h2>
            <h3 className="text-xl font-medium text-boulangerie-bordeaux-light dark:text-boulangerie-or">
              Section (H3)
            </h3>
            <p className="text-secondary">
              Texte principal avec un contraste optimal pour la lecture. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p className="text-muted">
              Texte atténué mais toujours lisible selon les standards d'accessibilité WCAG 2.1 AA.
            </p>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card className="card-boulangerie">
          <CardHeader>
            <CardTitle className="text-boulangerie-bordeaux dark:text-boulangerie-or-light">
              Éléments Interactifs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="interactive p-4 rounded-lg bg-boulangerie-beige dark:bg-boulangerie-dark-bg-accent cursor-pointer transition-all">
                <h4 className="font-semibold text-boulangerie-bordeaux dark:text-boulangerie-or-light">Carte Interactive</h4>
                <p className="text-sm text-secondary">Survole pour voir l'effet</p>
              </div>
              <div className="interactive p-4 rounded-lg bg-boulangerie-or/10 dark:bg-boulangerie-bordeaux-light/20 cursor-pointer transition-all">
                <h4 className="font-semibold text-boulangerie-bordeaux dark:text-boulangerie-or-light">Carte Accent</h4>
                <p className="text-sm text-secondary">Avec couleur d'accent</p>
              </div>
              <div className="interactive p-4 rounded-lg bg-gradient-or-cream dark:bg-gradient-dark-bordeaux cursor-pointer transition-all">
                <h4 className="font-semibold text-boulangerie-bordeaux-dark dark:text-boulangerie-cream">Carte Gradient</h4>
                <p className="text-sm text-boulangerie-bordeaux dark:text-boulangerie-cream/80">Avec gradient</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contraste et Accessibilité */}
        <Card className="card-boulangerie">
          <CardHeader>
            <CardTitle className="text-boulangerie-bordeaux dark:text-boulangerie-or-light">
              Tests de Contraste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-boulangerie-dark-bg-primary rounded-lg border">
                <h4 className="font-semibold text-primary mb-2">Contraste AA (4.5:1)</h4>
                <p className="text-secondary">Ce texte respecte les standards WCAG 2.1 AA pour l'accessibilité.</p>
              </div>
              <div className="p-4 bg-boulangerie-bordeaux rounded-lg">
                <h4 className="font-semibold text-white mb-2">Texte sur Bordeaux</h4>
                <p className="text-boulangerie-cream">Contraste élevé pour une lisibilité optimale.</p>
              </div>
              <div className="p-4 bg-boulangerie-or rounded-lg">
                <h4 className="font-semibold text-boulangerie-bordeaux-dark mb-2">Texte sur Or</h4>
                <p className="text-boulangerie-bordeaux">Combinaison harmonieuse avec contraste suffisant.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
