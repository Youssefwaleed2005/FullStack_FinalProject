using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    // Reads the public catalog the chatbot is allowed to talk about
    public interface IChatRepository
    {
        Task<List<Course>> GetPublicCoursesAsync();
        Task<List<AcademyProgram>> GetPublicProgramsAsync();
        Task<List<CareerPath>> GetPublishedCareerPathsAsync();
    }
}
