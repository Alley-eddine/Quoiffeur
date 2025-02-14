import request from "supertest";
import express from "express";
import appointmentRoutes from "../routes/appointmentRoutes.js";

const app = express();

app.use(express.json());
app.use("/api", appointmentRoutes);

// Mock de la base de données
jest.mock("../models/appointment.js", () => {
  return {
    save: jest.fn().mockResolvedValue({
      _id: "12345",
      customerName: "John Doe",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12T10:00:00Z",
      service: "Coupe",
      status: "Scheduled",
    }),
  };
});

describe("Tests des routes des rendez-vous", () => {
  it("devrait créer un rendez-vous avec succès", async () => {
    const newAppointment = {
      customerName: "John Doe",
      customerPhone: "1234567890",
      appointmentDate: "2025-02-12T10:00:00Z",
      service: "Coupe",
    };

    const response = await request(app)
      .post("/api/appointments")
      .send(newAppointment);

    expect(response.status).toBe(201); // Vérifie que le statut de la réponse est 201 (créé)
    expect(response.body.message).toBe("Rendez-vous créé avec succès");
    expect(response.body.data.customerName).toBe("John Doe"); // Vérifie que le nom du client est correct
  });

  it("devrait mettre à jour un rendez-vous avec succès", async () => {
    const updatedAppointment = {
      customerName: "Jane Doe",
      customerPhone: "0987654321",
      appointmentDate: "2025-02-12T14:00:00Z",
      service: "Coloration",
    };

    const response = await request(app)
      .put("/api/appointments/12345") // Utilisation de l'ID du rendez-vous
      .send(updatedAppointment);

    expect(response.status).toBe(200); // Vérifie que le statut de la réponse est 200 (OK)
    expect(response.body.message).toBe("Rendez-vous mis à jour");
    expect(response.body.data.customerName).toBe("Jane Doe"); // Vérifie que le nom a bien été mis à jour
  });

  it("devrait supprimer un rendez-vous avec succès", async () => {
    const response = await request(app)
      .delete("/api/appointments/12345") // Utilisation de l'ID du rendez-vous
      .send();

    expect(response.status).toBe(200); // Vérifie que le statut de la réponse est 200 (OK)
    expect(response.body.message).toBe("Rendez-vous supprimé");
  });
});
