'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Categorie } from "../lib/api";
import Image from "next/image";

interface CategorieCardProps {
  categorie: Categorie;
  produitsCount?: number;
  onClick?: () => void;
  isSelected?: boolean;
}

export function CategorieCard({ 
  categorie, 
  produitsCount, 
  onClick, 
  isSelected = false 
}: CategorieCardProps) {
  const imageUrl = categorie.image?.[0]?.url || '/placeholder-product.svg';
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-elevation hover:scale-105 card-boulangerie ${
        isSelected ? 'ring-4 ring-boulangerie-or shadow-elevation scale-105' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden shadow-or">
          <Image
            src={fullImageUrl}
            alt={categorie.image?.[0]?.alternativeText || categorie.nom}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <CardTitle className="text-xl font-artisan font-bold text-boulangerie-bordeaux flex items-center justify-between">
          <span>{categorie.nom}</span>
          <div
            className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm border-2 border-white"
            style={{ backgroundColor: categorie.couleur }}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {categorie.description && (
          <p className="text-sm text-boulangerie-bordeaux-light font-alsacien mb-4 line-clamp-2 leading-relaxed">
            {categorie.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Badge 
            className={`px-3 py-1 rounded-full font-medium text-xs ${
              isSelected 
                ? 'bg-boulangerie-or text-boulangerie-bordeaux-dark' 
                : 'bg-boulangerie-beige text-boulangerie-bordeaux border border-boulangerie-or-light'
            }`}
          >
            {produitsCount !== undefined 
              ? `${produitsCount} produit${produitsCount > 1 ? 's' : ''}`
              : 'Spécialité'
            }
          </Badge>
          
          <div className="text-2xl">
            {categorie.icone === 'bread-slice' && '🍞'}
            {categorie.icone === 'croissant' && '🥐'}
            {categorie.icone === 'cake' && '🧁'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
