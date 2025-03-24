import React from "react";
import { useState, useEffect } from "react";
import useAppointments from "../hooks/appointmentHook";

const horairesOuverture = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

export default function PriseDeRdv() {
  const [jours, setJours] = useState([]);
  const { creneauxOccupes, jourSelectionne, chargerCreneaux, prendreRdv } = useAppointments();

  useEffect(() => {
    const joursGeneres = [];
    const aujourdHui = new Date();

    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(aujourdHui.getDate() + i);
      
      if (date.getDay() !== 0) {
        joursGeneres.push(date.toISOString().split("T")[0]);
      }
    }
    setJours(joursGeneres);
  }, []);

  const handlePrendreRdv = (creneau) => {
    prendreRdv(creneau);
  };

  return (
    <div>
      <h2>Prendre rendez-vous</h2>

      <div>
        <h3>Choisissez un jour :</h3>
        {jours.map((jour) => (
          <button key={jour} onClick={() => chargerCreneaux(jour)}>
            {jour}
          </button>
        ))}
      </div>

      {jourSelectionne && (
        <div>
          <h3>Créneaux pour {jourSelectionne} :</h3>
          {horairesOuverture.map((creneau) => (
            <button 
              key={creneau} 
              disabled={creneauxOccupes.filter(time => time === creneau).length >= 3} 
              style={{ margin: "5px", backgroundColor: creneauxOccupes.filter(time => time === creneau).length >= 3 ? "red" : "green", color: "white" }}
              onClick={() => handlePrendreRdv(creneau)}
            >
              {creneau} {creneauxOccupes.filter(time => time === creneau).length >= 3 ? "(Complet)" : "(Disponible)"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}