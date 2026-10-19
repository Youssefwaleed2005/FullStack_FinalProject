using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/instructor")]
    [Authorize(Roles = Roles.Instructor)]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorService _instructorService;

        public InstructorController(IInstructorService instructorService)
        {
            _instructorService = instructorService;
        }

       
        [HttpGet("dashboard")]
        public async Task<ActionResult<InstructorDashboardDto>> GetDashboard()
        {
            return Ok(await _instructorService.GetDashboardAsync(User.GetUserId()));
        }

        
        [HttpGet("courses")]
        public async Task<ActionResult<List<InstructorCourseDto>>> GetMyCourses()
        {
            return Ok(await _instructorService.GetMyCoursesAsync(User.GetUserId()));
        }

        // GET /api/instructor/courses/5/students
        [HttpGet("courses/{courseId:int}/students")]
        public async Task<ActionResult<List<CourseStudentDto>>> GetCourseStudents(int courseId)
        {
            return Ok(await _instructorService.GetCourseStudentsAsync(User.GetUserId(), courseId));
        }
    }
}