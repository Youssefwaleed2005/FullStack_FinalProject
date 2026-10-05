using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Models;


namespace Andalusia.Api.Mapping
{
    public static class CareerPathMapping
    {
        public static CareerPathResponseDto ToResponseDto(this CareerPath cp)
        {
            return new CareerPathResponseDto
            {
                Id = cp.Id,
                Title = cp.Title,
                ShortDescription = cp.ShortDescription,
                ImageUrl = cp.ImageUrl,
                IsFeatured = cp.IsFeatured,
                ProgramCount = cp.CareerPathPrograms.Count
            };
        }

        public static CareerPathDetailsResponseDto ToDetailsResponseDto(this CareerPath cp)
        {
            var orderedPrograms = cp.CareerPathPrograms
                .OrderBy(cpp => cpp.SortOrder)
                .Select(cpp => cpp.Program)
                .ToList();

            return new CareerPathDetailsResponseDto
            {
                Id = cp.Id,
                Title = cp.Title,
                ShortDescription = cp.ShortDescription,
                ImageUrl = cp.ImageUrl,
                IsFeatured = cp.IsFeatured,
                ProgramCount = cp.CareerPathPrograms.Count,
                Overview = cp.Overview,
                RecommendedSkills = cp.RecommendedSkills,

                Programs = orderedPrograms
                    .Select(p => p.ToResponseDto())
                    .ToList(),

                // All courses from the recommended programs, in learning order, without duplicates
                RecommendedCourses = orderedPrograms
                    .SelectMany(p => p.ProgramCourses.OrderBy(pc => pc.SortOrder))
                    .Select(pc => pc.Course)
                    .DistinctBy(c => c.Id)
                    .Select(c => c.ToResponseDto())
                    .ToList()
            };
        }

        public static CareerPath ToEntity(this CareerPathRequestDto dto)
        {
            return new CareerPath
            {
                Title = dto.Title.Trim(),
                ShortDescription = dto.ShortDescription,
                Overview = dto.Overview,
                RecommendedSkills = dto.RecommendedSkills,
                ImageUrl = dto.ImageUrl,
                IsFeatured = dto.IsFeatured,
                IsPublished = dto.IsPublished
            };
        }

        public static void UpdateEntity(this CareerPathRequestDto dto, CareerPath cp)
        {
            cp.Title = dto.Title.Trim();
            cp.ShortDescription = dto.ShortDescription;
            cp.Overview = dto.Overview;
            cp.RecommendedSkills = dto.RecommendedSkills;
            cp.ImageUrl = dto.ImageUrl;
            cp.IsFeatured = dto.IsFeatured;
            cp.IsPublished = dto.IsPublished;
        }
    }
}