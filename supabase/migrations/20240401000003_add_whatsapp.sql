-- AJOUT DU CHAMP WHATSAPP --
ALTER TABLE public.establishments ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- Mettre à jour les politiques si nécessaire
-- (Déjà géré par le script d'alignement précédent)
