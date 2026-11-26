-- Lets Brew stap 3: beheer. Een account dat de beheerder blokkeert gaat op slot:
-- het kan niet meer inloggen, syncen, volgen of de AI van de app gebruiken.
ALTER TABLE users ADD COLUMN locked INTEGER NOT NULL DEFAULT 0;
