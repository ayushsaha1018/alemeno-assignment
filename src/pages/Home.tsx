import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import { Course } from "@/lib/types";
import { setFilteredCourses } from "@/store/coursesSlice";
import { AppDispatch, RootState } from "@/store/store";
import { SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Home() {
  const { courses, status, filteredCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch: AppDispatch = useDispatch();

  const debouncedSearch = (query: string) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      const lowerCaseQuery = query.toLowerCase();
      const filtered = courses?.filter((course: Course) => {
        const courseNameLower = course.name.toLowerCase();
        const instructorLower = course.instructor?.toLowerCase() || "";

        return (
          courseNameLower.includes(lowerCaseQuery) ||
          instructorLower.includes(lowerCaseQuery)
        );
      });
      dispatch(setFilteredCourses(filtered));
    }, 300);
  };

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [searchQuery]);

  return (
    <main className="flex-1 container px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Courses</h1>
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="w-full rounded-lg bg-muted pl-10 pr-4 py-2 text-sm"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>
      {status === "loading" ? <Loader /> : null}
      {status === "fulfilled" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses?.map((item) => (
            <CourseCard key={item.$id} course={item} />
          ))}
        </div>
      ) : null}
      {status === "failed" ? (
        <div className="flex justify-center w-full">
          <h1>Something went wrong!!</h1>
        </div>
      ) : null}
    </main>
  );
}

export default Home;
