using Andalusia.Api.Models;

namespace Andalusia.Api.Repos.Interfaces
{
    public interface IAssignmentRepository : IGenericRepository<Assignment>
    {
        Task<List<Assignment>> GetByCourseAsync(int courseId);
        Task<Assignment?> GetByIdWithSubmissionsAsync(int id);

        Task<List<Submission>> GetSubmissionsAsync(int assignmentId);
        Task<Submission?> GetSubmissionForGradingAsync(int submissionId);
    }
}