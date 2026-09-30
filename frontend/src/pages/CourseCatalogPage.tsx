import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import type { Course } from "../types/Course";
import type { Category } from "../types/Category";
import { getCourses, type CourseQueryParams } from "../services/courseService";
import { getCategories } from "../services/categoryService";
import CourseCard from "../components/CourseCard";

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest", sortBy: "newest", sortDescending: false },
  {
    value: "priceAsc",
    label: "Price: low to high",
    sortBy: "price",
    sortDescending: false,
  },
  {
    value: "priceDesc",
    label: "Price: high to low",
    sortBy: "price",
    sortDescending: true,
  },
  {
    value: "titleAsc",
    label: "Title: A to Z",
    sortBy: "title",
    sortDescending: false,
  },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// White background only on the input box, so the label stays readable
const fieldStyle = {
  "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
};

function CourseCatalogPage() {
  // Data from the API
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Filters chosen by the user
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState<SortValue>("newest");
  const [page, setPage] = useState(1);

  // Page state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the categories once, for the dropdown
  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // Load the courses every time a filter or the page changes
  useEffect(() => {
    const sortOption = SORT_OPTIONS.find((option) => option.value === sort)!;

    const params: CourseQueryParams = {
      search: search || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      sortBy: sortOption.sortBy,
      sortDescending: sortOption.sortDescending,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    };

    getCourses(params)
      .then((result) => {
        setCourses(result.items);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        setError(null);
      })
      .catch(() => setError("Could not load courses. Please try again later."))
      .finally(() => setLoading(false));
  }, [search, categoryId, sort, page]);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed === search) return;
    setLoading(true);
    setPage(1);
    setSearch(trimmed);
  }

  function handleCategoryChange(value: string) {
    setLoading(true);
    setPage(1);
    setCategoryId(value);
  }

  function handleSortChange(value: SortValue) {
    setLoading(true);
    setPage(1);
    setSort(value);
  }

  function handleClearFilters() {
    const nothingToClear =
      !search && !categoryId && sort === "newest" && page === 1;
    setSearchInput("");
    if (nothingToClear) return;
    setLoading(true);
    setSearch("");
    setCategoryId("");
    setSort("newest");
    setPage(1);
  }

  function handlePageChange(
    _event: React.ChangeEvent<unknown>,
    newPage: number,
  ) {
    setLoading(true);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Box sx={{ py: 8, px: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        All courses
      </Typography>

      {/* Filter bar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ display: "flex", gap: 1 }}
        >
          <TextField
            size="small"
            label="Search courses"
            color="secondary"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            sx={{ ...fieldStyle, width: 240 }}
          />
          <Button type="submit" variant="contained" color="secondary">
            Search
          </Button>
        </Box>

        <TextField
          select
          size="small"
          label="Category"
          color="secondary"
          value={categoryId}
          onChange={(event) => handleCategoryChange(event.target.value)}
          sx={{ ...fieldStyle, width: 200 }}
        >
          <MenuItem value="">All categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={String(category.id)}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Sort by"
          color="secondary"
          value={sort}
          onChange={(event) =>
            handleSortChange(event.target.value as SortValue)
          }
          sx={{ ...fieldStyle, width: 200 }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearFilters}
        >
          Clear
        </Button>
      </Box>

      {!loading && !error && (
        <Typography
          sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}
        >
          {totalCount} {totalCount === 1 ? "course" : "courses"} found
        </Typography>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      )}

      {!loading && !error && courses.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No courses match your filters.
        </Typography>
      )}

      {!loading && !error && courses.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="secondary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default CourseCatalogPage;
