import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Course } from "@/lib/types";

type CourseCardProps = {
  course: Course;
};

const CourseCard = ({ course }: CourseCardProps) => {
  console.log(course);

  return (
    <Card className="relative overflow-hidden group">
      <Link to={`/course/${course?.$id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View course</span>
      </Link>
      <img
        src={course?.thumbnail}
        alt={`Thumbnail of ${course?.name}`}
        width={400}
        height={225}
        className="w-full h-48 object-cover group-hover:opacity-80 transition-opacity aspect-[400/225]"
      />
      <CardContent className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {course?.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course?.description}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/placeholder-user.jpg" alt="@username" />
            <AvatarFallback>
              {course?.instructor
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {course?.instructor}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
