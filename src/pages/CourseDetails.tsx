import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import enrollmentService from "@/services/EnrollementService";
import { fetchEnrolledCourses, selectCourseById } from "@/store/coursesSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function CourseDetails() {
  const params = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { status, selectedCourse, enrolledCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const { status: authStatus, userData } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (params && params.id) {
      dispatch(selectCourseById(params?.id));
      console.log(status);
    }
  }, [params, status]);

  useEffect(() => {
    if (params && params.id) {
      console.log(enrolledCourses);
      setIsEnrolled(
        enrolledCourses?.some((course) => course?.$id === params?.id)
      );
    }
  }, [params, status, enrolledCourses]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error loading course.</div>;
  }

  if (!selectedCourse) {
    return <div>No course found.</div>;
  }

  const enrollUser = async () => {
    if (!authStatus) return toast.error("Please log in");
    console.log(userData);
    if (userData) {
      console.log(userData?.$id);
      const res = await enrollmentService.enrollCourse(
        userData?.$id,
        selectedCourse.$id
      );
      dispatch(fetchEnrolledCourses(userData?.$id));
      setIsEnrolled(true);
      console.log(res);
    }
  };

  return (
    <main className="flex-1 bg-muted/40 py-8">
      <div className="container grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <img
            src={selectedCourse.thumbnail}
            alt="Course thumbnail"
            width={800}
            height={450}
            className="w-full h-auto rounded-lg object-cover aspect-video"
          />
          <div className="mt-6 space-y-4">
            <h1 className="text-3xl font-bold">{selectedCourse.name}</h1>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {selectedCourse.instructor
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">
                {selectedCourse.instructor}
              </span>
            </div>
            <p className="text-muted-foreground">
              {selectedCourse.description}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">Enrollment Status</h3>
                <p className="text-muted-foreground">
                  {selectedCourse.enrollmentStatus}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Course Duration</h3>
                <p className="text-muted-foreground">
                  {selectedCourse.duration}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Schedule</h3>
                <p className="text-muted-foreground">
                  {selectedCourse.schedule}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Location</h3>
                <p className="text-muted-foreground">
                  {selectedCourse.location}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Pre-requisites</h3>
              <ul className="text-muted-foreground list-disc pl-5">
                {selectedCourse.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="syllabus">
                <AccordionTrigger className="flex items-center justify-between w-full text-lg font-semibold">
                  Syllabus
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {selectedCourse.syllabus.map((item) => (
                      <div key={item.$id}>
                        <h4 className="text-base font-semibold">
                          Week {item.week}
                        </h4>
                        <p>{item.topic}</p>
                        <p className="text-muted-foreground">{item.content}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div>
                <h3 className="text-lg font-semibold">Enroll Now</h3>
                <p className="text-muted-foreground">
                  Secure your spot in this popular course.
                </p>
              </div>
              <Button
                disabled={isEnrolled}
                onClick={() => enrollUser()}
                className="w-full"
              >
                {isEnrolled ? "Already Enrolled" : "Enroll"}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4 p-4">
              <div>
                <h3 className="text-lg font-semibold">Course Details</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-base font-semibold">Instructor</h4>
                  <p className="text-muted-foreground">
                    {selectedCourse.instructor}
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">Duration</h4>
                  <p className="text-muted-foreground">
                    {selectedCourse.duration}
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">Schedule</h4>
                  <p className="text-muted-foreground">
                    {selectedCourse.schedule}
                  </p>
                </div>
                <div>
                  <h4 className="text-base font-semibold">Location</h4>
                  <p className="text-muted-foreground">
                    {selectedCourse.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
