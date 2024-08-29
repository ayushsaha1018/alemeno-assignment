const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCourseCollectionId: String(
    import.meta.env.VITE_APPWRITE_COURSE_COLLECTION_ID
  ),
  appwriteSyllabusCollectionId: String(
    import.meta.env.VITE_APPWRITE_SYLLABUS_COLLECTION_ID
  ),
  appwriteEnrollmentCollectionId: String(
    import.meta.env.VITE_APPWRITE_ENROLLEMENT_COLLECTION_ID
  ),
};

export default conf;
