import React from "react";
import {
  FormContainer,
  FormItems,
  FormInput,
  RegisterSelectItem,
  RegisterField,
  RegisterButton,
} from "./RegisterElements";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const ContactDetails = (props) => {
  const handleSubmit = (values) => {
    props.next(values, false);
  };

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

  const validationSchema = Yup.object({
    streetAddress: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    district: Yup.string().required("District is required"),
    homeNumber: Yup.string()
      .required("Home number is required")
      .min(7, "Home number must be of 8 numbers")
      .max(7, "Enter valid home number")
      .matches(
        /^\d+$/,
        "Home number cannot contain letters or special characters"
      ),
    mobileNumber: Yup.string()
      .required("Mobile number is required")
      .matches(
        /\b5[0-9]{7}\b/,
        "Mobile number should start with 5 and cannot contain letters or special characters"
      ),
    additionalNumber: Yup.string()
      .min(7, "Additional number must be of 7 or 8 numbers")
      .max(8, "Additional number must be of 7 or 8 numbers")
      .matches(
        /^\d+$/,
        "Additional number cannot contain letters or special characters"
      ),
  });
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={props.data}
      onSubmit={handleSubmit}
    >
      {(formikProps) => (
        <Form>
          <FormContainer container direction="column" spacing={4}>
            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={4}>
                <Field
                  as={RegisterField}
                  name="streetAddress"
                  label="Street Address"
                  fullWidth
                  error={
                    formikProps.touched.streetAddress &&
                    Boolean(formikProps.errors.streetAddress)
                  }
                  helperText={
                    formikProps.touched.streetAddress &&
                    formikProps.errors.streetAddress
                  }
                ></Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field
                  as={RegisterField}
                  name="city"
                  label="City"
                  select
                  fullWidth
                  error={
                    formikProps.touched.city && Boolean(formikProps.errors.city)
                  }
                  helperText={
                    formikProps.touched.city && formikProps.errors.city
                  }
                >
                  {cityArray.map((showCityArray) => {
                    return (
                      <RegisterSelectItem
                        key={showCityArray}
                        value={showCityArray}
                      >
                        {showCityArray}
                      </RegisterSelectItem>
                    );
                  })}
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field
                  as={RegisterField}
                  name="district"
                  label="District"
                  select
                  fullWidth
                  error={
                    formikProps.touched.district &&
                    Boolean(formikProps.errors.district)
                  }
                  helperText={
                    formikProps.touched.district && formikProps.errors.district
                  }
                >
                  {districtArray.map((showDistrictArray) => {
                    return (
                      <RegisterSelectItem
                        key={showDistrictArray}
                        value={showDistrictArray}
                      >
                        {showDistrictArray}
                      </RegisterSelectItem>
                    );
                  })}
                </Field>
              </FormInput>
            </FormItems>

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={6}>
                <Field
                  as={RegisterField}
                  name="homeNumber"
                  label="Home Number"
                  fullWidth
                  error={
                    formikProps.touched.homeNumber &&
                    Boolean(formikProps.errors.homeNumber)
                  }
                  helperText={
                    formikProps.touched.homeNumber &&
                    formikProps.errors.homeNumber
                  }
                ></Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={6}>
                <Field
                  as={RegisterField}
                  name="mobileNumber"
                  label="Mobile Number"
                  fullWidth
                  error={
                    formikProps.touched.mobileNumber &&
                    Boolean(formikProps.errors.mobileNumber)
                  }
                  helperText={
                    formikProps.touched.mobileNumber &&
                    formikProps.errors.mobileNumber
                  }
                ></Field>
              </FormInput>
            </FormItems>

            <FormInput item>
              <Field
                as={RegisterField}
                name="additionalNumber"
                label="Additional Number"
                fullWidth
                error={
                  formikProps.touched.additionalNumber &&
                  Boolean(formikProps.errors.additionalNumber)
                }
                helperText={
                  formikProps.touched.additionalNumber &&
                  formikProps.errors.additionalNumber
                }
              ></Field>
            </FormInput>

            <FormInput item>
              <RegisterButton type="submit">Next</RegisterButton>
            </FormInput>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default ContactDetails;
