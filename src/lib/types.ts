export type SyllabusItem = {
  week: number;
  topic: string;
  content: string;
  $id: string;
  $tenant: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  course_id: string | null;
  $databaseId: string;
  $collectionId: string;
};

export type Course = {
  name: string;
  instructor: string;
  description: string;
  enrollmentStatus: string;
  thumbnail: string;
  duration: string;
  schedule: string;
  location: string;
  prerequisites: string[];
  $id: string;
  $tenant: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  syllabus: SyllabusItem[];
  $databaseId: string;
  $collectionId: string;
};

interface Target {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  userId: string;
  providerId: string | null;
  providerType: string;
  identifier: string;
}

export interface User {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  registration: string;
  status: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any[]; // Adjust the type if you have specific label data
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Record<string, unknown>; // Use `Record<string, unknown>` if prefs can have various properties
  targets: Target[];
  accessedAt: string;
}

export type UserType = User | null;
