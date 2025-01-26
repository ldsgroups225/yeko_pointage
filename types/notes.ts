import { NoteType } from "./../config/constants";
export interface INoteDetailDTO {
  id?: string;
  noteId: string;
  studentId: string;
  note?: number;
  gradedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INoteDTO {
  id?: string;
  classId: string;
  schoolId: string;
  subjectId: string;
  teacherId: string;
  semesterId: number;
  schoolYearId: number;
  noteType: NoteType;
  title?: string; // Titre de la note. Ex.: Factorisation
  description?: string | null; // Description de la note. Ex.: Factorisation de la formule (a+b)(c+d) or Exercice 1 à 5 page 12
  totalPoints: number; // L'évaluation sera notée sur combien de points
  weight: number; // Coefficient de la note
  isGraded: boolean; // Si la note est sera notée ou pas
  createdAt?: Date;
  publishedAt?: Date;
  dueDate?: Date; // Date de la note
  isPublished: boolean;
  isActive?: boolean;
  noteDetails?: INoteDetailDTO[];
}
