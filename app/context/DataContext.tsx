import React, { createContext, useContext, useState, useEffect } from "react";
import DataService from "../services/DataService";

const DataContext = createContext<any>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      await DataService.initializeData();
      await refreshData();
    } catch (error) {
      console.error("Error initializing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const [
        consultationsData,
        prescriptionsData,
        medicinesData,
        treatmentsData,
        appointmentsData,
        doctorsData,
      ] = await Promise.all([
        DataService.getConsultations(),
        DataService.getPrescriptions(),
        DataService.getMedicines(),
        DataService.getTreatments(),
        DataService.getAppointments(),
        DataService.getDoctors(),
      ]);

      setConsultations(consultationsData);
      setPrescriptions(prescriptionsData);
      setMedicines(medicinesData);
      setTreatments(treatmentsData);
      setAppointments(appointmentsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  // Consultation methods
  const addConsultation = async (consultation) => {
    try {
      const newConsultation = await DataService.addConsultation(consultation);
      setConsultations((prev) => [...prev, newConsultation]);
      return newConsultation;
    } catch (error) {
      console.error("Error adding consultation:", error);
      throw error;
    }
  };

  const updateConsultation = async (consultationId, updates) => {
    try {
      const updatedConsultation = await DataService.updateConsultation(
        consultationId,
        updates
      );
      if (updatedConsultation) {
        setConsultations((prev) =>
          prev.map((c) => (c.id === consultationId ? updatedConsultation : c))
        );
      }
      return updatedConsultation;
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    }
  };

  const getConsultationsByDoctor = (doctorId) => {
    return consultations.filter((c) => c.doctorId === doctorId);
  };

  const getConsultationsByPatient = (patientId) => {
    return consultations.filter((c) => c.patientId === patientId);
  };

  // Message methods
  const addMessage = async (consultationId, message) => {
    try {
      const newMessage = await DataService.addMessage(consultationId, message);
      if (newMessage) {
        // Update local state
        setConsultations((prev) =>
          prev.map((c) => {
            if (c.id === consultationId) {
              return {
                ...c,
                messages: [...(c.messages || []), newMessage],
              };
            }
            return c;
          })
        );
      }
      return newMessage;
    } catch (error) {
      console.error("Error adding message:", error);
      throw error;
    }
  };

  const getMessages = async (consultationId) => {
    try {
      // Get fresh data from AsyncStorage to ensure we have the latest messages
      const messages = await DataService.getMessages(consultationId);
      return messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      // Fallback to state data
      const consultation = consultations.find((c) => c.id === consultationId);
      return consultation?.messages || [];
    }
  };

  // Prescription methods
  const addPrescription = async (prescription) => {
    try {
      const newPrescription = await DataService.addPrescription(prescription);
      setPrescriptions((prev) => [...prev, newPrescription]);
      return newPrescription;
    } catch (error) {
      console.error("Error adding prescription:", error);
      throw error;
    }
  };

  const updatePrescription = async (prescriptionId, updates) => {
    try {
      const updatedPrescription = await DataService.updatePrescription(
        prescriptionId,
        updates
      );
      if (updatedPrescription) {
        setPrescriptions((prev) =>
          prev.map((p) => (p.id === prescriptionId ? updatedPrescription : p))
        );
      }
      return updatedPrescription;
    } catch (error) {
      console.error("Error updating prescription:", error);
      throw error;
    }
  };

  const getPrescriptionsByPatient = (patientId) => {
    return prescriptions.filter((p) => p.patientId === patientId);
  };

  // Treatment methods
  const getTreatmentsByPatient = (patientId) => {
    return treatments.filter((t) => t.patientId === patientId);
  };

  const addTreatment = async (treatment) => {
    try {
      const newTreatment = await DataService.addTreatment(treatment);
      setTreatments((prev) => [...prev, newTreatment]);
      return newTreatment;
    } catch (error) {
      console.error("Error adding treatment:", error);
      throw error;
    }
  };

  // Appointment methods
  const addAppointment = async (appointment) => {
    try {
      const newAppointment = await DataService.addAppointment(appointment);
      setAppointments((prev) => [...prev, newAppointment]);
      return newAppointment;
    } catch (error) {
      console.error("Error adding appointment:", error);
      throw error;
    }
  };

  const updateAppointment = async (appointmentId, updates) => {
    try {
      const updatedAppointment = await DataService.updateAppointment(
        appointmentId,
        updates
      );
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId ? updatedAppointment : appointment
        )
      );
      return updatedAppointment;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  };

  const getAppointmentsByPatient = (patientId) => {
    return appointments.filter(
      (appointment) => appointment.patientId === patientId
    );
  };

  const getAppointmentsByDoctor = (doctorId) => {
    return appointments.filter(
      (appointment) => appointment.doctorId === doctorId
    );
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const updatedAppointment = await DataService.updateAppointment(
        appointmentId,
        {
          status: "cancelled",
          cancelledAt: new Date().toISOString(),
        }
      );
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === appointmentId ? updatedAppointment : appointment
        )
      );
      return updatedAppointment;
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw error;
    }
  };

  // Add prescription message to chat
  const addPrescriptionMessage = async (consultationId, prescriptionData) => {
    try {
      const result = await DataService.addPrescriptionMessage(
        consultationId,
        prescriptionData
      );

      // Update local state with new message and prescription
      setConsultations((prev) =>
        prev.map((c) => {
          if (c.id === consultationId) {
            return {
              ...c,
              messages: [...(c.messages || []), result.message],
              status: "prescription_sent",
              prescriptionId: result.prescription.id,
            };
          }
          return c;
        })
      );

      setPrescriptions((prev) => [...prev, result.prescription]);

      return result;
    } catch (error) {
      console.error("Error adding prescription message:", error);
      throw error;
    }
  };

  // Complete consultation
  const completeConsultation = async (consultationId) => {
    try {
      const updatedConsultation = await DataService.completeConsultation(
        consultationId
      );
      if (updatedConsultation) {
        setConsultations((prev) =>
          prev.map((c) => (c.id === consultationId ? updatedConsultation : c))
        );
      }
      return updatedConsultation;
    } catch (error) {
      console.error("Error completing consultation:", error);
      throw error;
    }
  };

  // Cancel consultation
  const cancelConsultation = async (consultationId) => {
    try {
      const updatedConsultation = await DataService.cancelConsultation(
        consultationId
      );
      if (updatedConsultation) {
        setConsultations((prev) =>
          prev.map((c) => (c.id === consultationId ? updatedConsultation : c))
        );
      }
      return updatedConsultation;
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      throw error;
    }
  };

  const value = {
    // Data
    consultations,
    prescriptions,
    medicines,
    treatments,
    appointments,
    doctors,
    loading,

    // Methods
    refreshData,

    // Consultation methods
    addConsultation,
    updateConsultation,
    getConsultationsByDoctor,
    getConsultationsByPatient,

    // Message methods
    addMessage,
    getMessages,

    // Prescription methods
    addPrescription,
    updatePrescription,
    getPrescriptionsByPatient,

    // Treatment methods
    getTreatmentsByPatient,
    addTreatment,

    // Appointment methods
    addAppointment,
    updateAppointment,
    getAppointmentsByPatient,
    getAppointmentsByDoctor,
    cancelAppointment,

    // New methods
    addPrescriptionMessage,
    completeConsultation,
    cancelConsultation,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
