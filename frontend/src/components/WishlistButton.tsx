import { IconButton, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import type { SxProps, Theme } from "@mui/material";
import { useWishlist } from "../hooks/useWishlist";
import { toggleSaved } from "../utils/wishlist";
import type { Course } from "../types/Course";

type WishlistButtonProps = {
  course: Course;
  sx?: SxProps<Theme>;
};

// Heart button that saves a course in this browser (no account needed)
function WishlistButton({ course, sx }: WishlistButtonProps) {
  const saved = useWishlist().some((c) => c.id === course.id);
  const label = saved ? "Remove from saved" : "Save for later";

  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        aria-pressed={saved}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggleSaved(course);
        }}
        sx={{ bgcolor: "background.paper", boxShadow: 1, "&:hover": { bgcolor: "background.paper" }, ...sx }}
        size="small"
      >
        {saved ? <FavoriteIcon fontSize="small" sx={{ color: "#d64545" }} /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

export default WishlistButton;
