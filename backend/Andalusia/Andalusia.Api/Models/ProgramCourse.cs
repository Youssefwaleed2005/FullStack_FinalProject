namespace Andalusia.Api.Models
{
    public class ProgramCourse
    {
        public int ProgramId { get; set; }
        public AcademyProgram Program { get; set; } = null!;

        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public int SortOrder { get; set; }
    }
}