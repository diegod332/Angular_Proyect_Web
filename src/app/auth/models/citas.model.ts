export interface Cita {
    id: string;
    fullName: string;
    emergencyNumber: string;
    appointmentDate: string; // ISO string (puedes transformarlo con Date si lo necesitas)
    appointmentTime: string;
    service: string; // Esto es una cadena con los nombres de los servicios separados por comas
    status: 'pendiente' | 'confirmado' | 'Finalizado';
  }
  