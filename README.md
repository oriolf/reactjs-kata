# Associa't

Associa't és un exercici per aprendre React, fent servir les millors pràctiques disponibles de moment. No és un exercici limitat, sinó que és una web completa que permet gestionar el dia a dia d'una associació, amb alta i baixa de socis, cobraments de quotes, convocatòria d'assemblees, votacions, i més.

El _backend_ de la web està implementat en llenguatge Go, i es pot trobar en l'exemple del _framework_ de desenvolupament web [Simple APP](https://github.com/oriolf/simple-app).

L'estructura de la web parteix de l'exemple `material-ui-vite-ts` del repositori de [Material UI](https://github.com/mui/material-ui), però conserva poc de l'original a banda de les configuracions de Node, Vite i Typescript.

Per instal·lar i fer desenvolupament en local, en aquest repositori:

```bash
npm install
npm run dev
```

I en el repositori de Simple APP:

```bash
go build
./example http
```
