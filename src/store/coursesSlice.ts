import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "@/lib/types";
import courseService from "@/services/CourseService";
import enrollmentService from "@/services/EnrollementService";

interface CoursesState {
  courses: Course[];
  selectedCourse: Course | null;
  status: "idle" | "loading" | "failed" | "fulfilled";
  enrolledCourses: Course[];
  filteredCourses: Course[];
}

const initialState: CoursesState = {
  courses: [],
  selectedCourse: null,
  status: "idle",
  enrolledCourses: [],
  filteredCourses: [],
};

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await courseService.getCourses();
    const data = response?.documents;
    return data as Course[];
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  "courses/fetchEnrolledCourses",
  async (user_id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await enrollmentService.getEnrolledCourses(user_id);
    console.log(response);
    const data = response?.documents;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrolledCourses = data?.map((item: any) => ({
      ...item.course,
    }));

    return enrolledCourses as Course[];
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    selectCourseById: (state, action: PayloadAction<string>) => {
      const courseId = action.payload;
      state.selectedCourse =
        state.courses.find((course) => course.$id === courseId) || null;
    },
    resetUserData: (state) => {
      state.enrolledCourses = [];
    },
    setFilteredCourses: (state, action) => {
      state.filteredCourses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCourses.fulfilled,
        (state, action: PayloadAction<Course[]>) => {
          state.status = "fulfilled";
          state.courses = action.payload;
          state.filteredCourses = action.payload;
        }
      )
      .addCase(fetchCourses.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolledCourses = action.payload;
      });
  },
});

export const { selectCourseById, setFilteredCourses, resetUserData } =
  coursesSlice.actions;
export default coursesSlice.reducer;
