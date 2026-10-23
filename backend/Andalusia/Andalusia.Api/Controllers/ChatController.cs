using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Helpers;
using Andalusia.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Andalusia.Api.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [AllowAnonymous]   // visitors can ask about courses too; signed-in learners get personal answers
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<ActionResult<ChatResponseDto>> Ask(ChatRequestDto request)
        {
            int? learnerId = User.Identity?.IsAuthenticated == true && User.IsInRole(Roles.Learner)
                ? User.GetUserId()
                : null;

            return Ok(await _chatService.AskAsync(request, learnerId));
        }
    }
}
