namespace Andalusia.Api.Models
{
    public class CareerPathProgram
    {
        public int CareerPathId { get; set; }
        public CareerPath CareerPath { get; set; } = null!;

        public int ProgramId { get; set; }
        public AcademyProgram Program { get; set; } = null!;

        public int SortOrder { get; set; }
    }
}