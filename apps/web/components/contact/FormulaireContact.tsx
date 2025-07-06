import React, { useState } from "react"
import { motion } from "framer-motion"
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useContact } from "@/hooks/useContact"

export function FormulaireContact() {
  const { loading, error, success, envoyerMessage, reset } = useContact()
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await envoyerMessage(formData)
    if (!error) {
      setFormData({ nom: "", email: "", sujet: "", message: "" })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error || success) reset()
  }

  if (success) {
    return (
      <motion.div 
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Message envoyé !</h3>
        <p className="text-green-700 mb-4">
          Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
        </p>
        <button 
          onClick={reset}
          className="text-green-600 hover:text-green-800 underline"
        >
          Envoyer un autre message
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Erreur</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
            Nom complet *
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
            placeholder="Votre nom et prénom"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
          Sujet *
        </label>
        <select
          id="sujet"
          name="sujet"
          value={formData.sujet}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
        >
          <option value="">Choisissez un sujet</option>
          <option value="commande">Question sur une commande</option>
          <option value="produits">Informations sur nos produits</option>
          <option value="horaires">Horaires et localisation</option>
          <option value="événement">Commande pour événement</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent resize-none"
          placeholder="Décrivez votre demande..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-boulangerie-bordeaux text-white py-3 px-6 rounded-lg hover:bg-boulangerie-bordeaux-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Envoyer le message
          </>
        )}
      </button>
    </motion.form>
  )
}
