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
import type { Program } from "../types/Program";
import type { Category } from "../types/Category";
import { getPrograms } from "../services/programService";
import { getCategories } from "../services/categoryService";
import ProgramCard from "../components/ProgramCard";

const PAGE_SIZE = 9;

// White background only on the input box, so the label stays readable
const fieldStyle = {
  "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
};

function ProgramsPage() {
  // Data from the API
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Filters chosen by the user
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
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

  // Load the programs every time a filter or the page changes
  useEffect(() => {
    getPrograms({
      search: search || undefined,
      categoryId: categoryId ? Number(categoryId) : undefined,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    })
      .then((result) => {
        setPrograms(result.items);
        setTotalPages(result.totalPages);
        setTotalCount(result.totalCount);
        setError(null);
      })
      .catch(() => setError("Could not load programs. Please try again later."))
      .finally(() => setLoading(false));
  }, [search, categoryId, page]);

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

  function handleClearFilters() {
    const nothingToClear = !search && !categoryId && page === 1;
    setSearchInput("");
    if (nothingToClear) return;
    setLoading(true);
    setSearch("");
    setCategoryId("");
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
      <Typography variant="h4" sx={{ mb: 1, textAlign: "center" }}>
        Programs
      </Typography>
      <Typography sx={{ mb: 4, textAlign: "center", color: "text.secondary" }}>
        Complete learning journeys made of several courses.
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
            label="Search programs"
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
          {totalCount} {totalCount === 1 ? "program" : "programs"} found
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

      {!loading && !error && programs.length === 0 && (
        <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
          No programs match your filters.
        </Typography>
      )}

      {!loading && !error && programs.length > 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
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

export default ProgramsPage;
