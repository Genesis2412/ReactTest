import React from "react";
import TutorProfile from "./TutorProfile";
import StudentProfile from "./StudentProfile";

const ViewProfile = () => {
  const days = [];
  for (let i = 1; i < 32; i++) {
    days.push(i);
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  let getYear = date.getFullYear();

  const years = [];
  for (let i = 0; i < getYear - 1939; i++) {
    years.push(1940 + i);
  }

  const cityArray = [
    "Albion",
    "Amaury",
    "Amitié-Gokhoola",
    "Anse La Raie",
    "Arsenal",
    "Baie du Cap",
    "Baie du Tombeau",
    "Bambous",
    "Bambous Virieux",
    "Bananes",
    "Beau Bassin",
    "Beau Vallon",
    "Bel Air Rivière Sèche",
    "Bel Ombre",
    "Belle Vue Haurel",
    "Bénarès",
    "Bois Chéri",
    "Bois des Amourettes",
    "Bon Accueil",
    "Bramsthan",
    "Brisée Verdière",
    "Britannia",
    "Calebasses",
    "Camp Carol",
    "Camp de Masque",
    "Camp de Masque Pavé",
    "Camp Diable",
    "Camp Ithier",
    "Camp Thorel",
    "Cap Malheureux",
    "Cascavelle",
    "Case Noyale",
    "Centre de Flacq",
    "Chamarel",
    "Chamouny",
    "Chemin Grenier",
    "Clémencia",
    "Cluny",
    "Congomah",
    "Cottage",
    "Crève Coeur",
    "Curepipe",
    "Dagotière",
    "D'Épinay",
    "Dubreuil",
    "Écroignard",
    "Espérance",
    "Espérance Trébuchet",
    "Flic en Flac",
    "Fond du Sac",
    "Goodlands",
    "Grand Baie",
    "Grand Bel Air",
    "Grand Bois",
    "Grand Gaube",
    "Grand Sable",
    "Grande Retraite",
    "Grande Rivière Noire",
    "Grande Rivière Sud Est",
    "Gros Cailloux",
    "La Flora",
    "La Gaulette",
    "La Laura-Malenga",
    "Lalmatie",
    "L'Avenir",
    "Laventure",
    "Le Hochet",
    "Le Morne",
    "Le Vale",
    "L'Escalier",
    "Mahébourg",
    "Mapou",
    "Mare Chicose",
    "Mare d'Albert",
    "Mare La Chaux",
    "Mare Tabac",
    "Médine Camp de Masque",
    "Melrose",
    "Midlands",
    "Moka",
    "Montagne Blanche",
    "Montagne Longue",
    "Morcellement Saint André",
    "New Grove",
    "Notre Dame",
    "Nouvelle Découverte",
    "Nouvelle France",
    "Olivia",
    "Pailles",
    "Pamplemousses",
    "Petit Bel Air",
    "Petit Raffray",
    "Petite Rivière",
    "Phoenix",
    "Piton",
    "Plaine des Papayes",
    "Plaine des Roches",
    "Plaine Magnien",
    "Pointe aux Piments",
    "Port Louis",
    "Poste de Flacq",
    "Poudre d'Or",
    "Poudre d'Or Hamlet",
    "Providence",
    "Quartier Militaire",
    "Quartre Bornes",
    "Quatre Cocos",
    "Quatre Soeurs",
    "Queen Victoria",
    "Richelieu",
    "Ripailles",
    "Rivière des Anguilles",
    "Rivière des Créoles",
    "Rivière du Poste",
    "Rivière du Rempart",
    "Roche Terre",
    "Roches Noires",
    "Rose Belle",
    "Rose Hill",
    "Saint Aubin",
    "Saint Hubert",
    "Saint Julien d'Hotman",
    "Saint Julien Village",
    "Saint Pierre",
    "Sébastopol",
    "Seizième Mille",
    "Souillac",
    "Surinam",
    "Tamarin",
    "Terre Rouge",
    "Triolet",
    "Trois Boutiques",
    "Trou aux Biches",
    "Trou d'Eau Douce",
    "Tyack",
    "Union Park",
    "Vacoas",
    "Vale",
    "Verdun",
    "Vieux Grand Port",
    "Ville Bague",
  ];

  const districtArray = [
    "Flacq",
    "Grand Port",
    "Moka",
    "Pamplemousses",
    "Plaine Wilhems",
    "Port Louis",
    "Rivière du Rempart",
    "Rivière Noire",
    "Savanne",
  ];

  let userStorageDetails = localStorage.getItem("userStorageDetails");
  let userDetails = JSON.parse(userStorageDetails);

  if (userDetails.accountType === "Tutor") {
    return (
      <TutorProfile
        days={days}
        months={months}
        years={years}
        cityArray={cityArray}
        districtArray={districtArray}
      />
    );
  }
  if (userDetails.accountType === "Student") {
    return (
      <StudentProfile
        days={days}
        months={months}
        years={years}
        cityArray={cityArray}
        districtArray={districtArray}
      />
    );
  }
};

export default ViewProfile;
