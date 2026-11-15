/* Réglages de Kabylos Notes de frais */
window.KCM = {
  SUPABASE_URL: "https://opmulpaebadrhsdvybqi.supabase.co",
  SUPABASE_CLE: "sb_publishable_TcZrqc-bDrDofajz0VofSw_lbOWz0yH",
  SOCIETE: "Pradel & Associés",
  VERSION: "1.0.42",
  // Autres moyens de paiement proposés sous « Payé avec » (ceux qui commencent par « Cabinet » comptent comme payés par la société)
  PAYE_AVEC: ["Carte perso Kamel", "Carte perso Stéphanie"],
  // Dossiers où ranger chaque ticket / facture (ceux qui contiennent « perso » ne comptent pas dans l'avance du cabinet)
  DOSSIERS: ["Cabinet Kamel", "Cabinet Stéphanie", "Stéphanie perso", "Kamel perso"],
  // Barème kilométrique (voitures, jusqu'à 5 000 km par an) — à mettre à jour chaque année
  BAREME_KM: { 3: 0.529, 4: 0.606, 5: 0.636, 6: 0.665, 7: 0.697 },
  CATEGORIES: ["Repas", "Repas avec client", "Carburant", "Péage", "Parking", "Train", "Avion", "Taxi / VTC", "Transports en commun", "Hôtel", "Location de véhicule", "Fournitures de bureau", "Matériel", "Téléphone / Internet", "Poste / Envoi", "Cadeau client", "Documentation", "Entretien véhicule", "Autre"]
};
