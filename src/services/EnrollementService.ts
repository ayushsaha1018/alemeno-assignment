import conf from "../conf/conf.js";
import { Client, Databases, ID, Query, Storage } from "appwrite";

class EnrollmentService {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async getEnrolledCourses(user_id: string) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteEnrollmentCollectionId,
        [Query.equal("user_id", user_id)]
      );
    } catch (error) {
      console.log("Appwrite serive :: getEnrolledCourses :: error", error);
      return false;
    }
  }

  async enrollCourse(user_id: string, course_id: string) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteEnrollmentCollectionId,
        ID.unique(),
        {
          user_id,
          course: course_id,
        }
      );
    } catch (error) {
      console.log("Appwrite serive :: enrollCourse :: error", error);
      return false;
    }
  }
}

const enrollmentService = new EnrollmentService();
export default enrollmentService;
