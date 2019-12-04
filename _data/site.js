module.exports = {
  en: {
    projectName: '11ty Starter',
    home: 'Home',
    h2Label: 'This is an h2 tag.',
    favoriteColor(color) {
      return `${color.charAt(0).toUpperCase() + color.slice(1)} is my favorite color.`;
    },
  },
  es: {
    projectName: '11ty Proyecto de Inicio',
    home: 'Casa',
    h2Label: 'Esta es una etiqueta h2.',
    favoriteColor(color) {
      return `Prefiero el color ${color}.`;
    },
  },
  fr: {
    projectName: '11ty Projet de démarrage',
    home: 'Domicile',
    h2Label: 'Ceci est une balise h2.',
    favoriteColor(color) {
      return `Ma couleur préférée est ${color}.`;
    },
  },
};
