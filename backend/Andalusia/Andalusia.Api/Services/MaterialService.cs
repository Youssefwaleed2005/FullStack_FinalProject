using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Enums;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class MaterialService : IMaterialService
    {
        private const long MaxFileBytes = 25 * 1024 * 1024; // 25 MB

        // Allowed uploads → material type
        private static readonly Dictionary<string, MaterialType> AllowedFiles = new(StringComparer.OrdinalIgnoreCase)
        {
            [".pdf"] = MaterialType.Document,
            [".doc"] = MaterialType.Document,
            [".docx"] = MaterialType.Document,
            [".ppt"] = MaterialType.Document,
            [".pptx"] = MaterialType.Document,
            [".xls"] = MaterialType.File,
            [".xlsx"] = MaterialType.File,
            [".zip"] = MaterialType.File,
            [".png"] = MaterialType.File,
            [".jpg"] = MaterialType.File,
            [".jpeg"] = MaterialType.File,
            [".mp4"] = MaterialType.Video
        };

        private readonly IMaterialRepository _materialRepository;
        private readonly IInstructorService _instructorService;
        private readonly IWebHostEnvironment _environment;

        public MaterialService(
            IMaterialRepository materialRepository,
            IInstructorService instructorService,
            IWebHostEnvironment environment)
        {
            _materialRepository = materialRepository;
            _instructorService = instructorService;
            _environment = environment;
        }

        public async Task<List<MaterialResponseDto>> GetByCourseAsync(int instructorId, int courseId)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);

            var materials = await _materialRepository.GetByCourseAsync(courseId);
            return materials.Select(m => m.ToResponseDto()).ToList();
        }

        public async Task<MaterialResponseDto> CreateAsync(int instructorId, int courseId, MaterialRequestDto dto)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);
            EnsureValidUrl(dto.Url);

            var material = dto.ToEntity(courseId);
            await _materialRepository.AddAsync(material);
            await _materialRepository.SaveChangesAsync();

            return material.ToResponseDto();
        }

        public async Task<MaterialResponseDto> UpdateAsync(int instructorId, int materialId, MaterialRequestDto dto)
        {
            var material = await GetOwnedMaterialAsync(instructorId, materialId);
            EnsureValidUrl(dto.Url);

            dto.UpdateEntity(material);
            await _materialRepository.SaveChangesAsync();

            return material.ToResponseDto();
        }

        public async Task DeleteAsync(int instructorId, int materialId)
        {
            var material = await GetOwnedMaterialAsync(instructorId, materialId);

            await _materialRepository.RemoveCompletionsAsync(materialId);
            _materialRepository.Delete(material);
            await _materialRepository.SaveChangesAsync();

            DeleteUploadedFile(material.Url);
        }

        // Save the file under wwwroot/uploads/materials and create a material that points to it
        public async Task<MaterialResponseDto> UploadAsync(int instructorId, int courseId, UploadMaterialRequestDto dto)
        {
            await _instructorService.EnsureOwnsCourseAsync(instructorId, courseId);

            var file = dto.File;
            if (file.Length == 0)
                throw new BadRequestException("The file is empty.");
            if (file.Length > MaxFileBytes)
                throw new BadRequestException("The file is too big. The maximum is 25 MB.");

            var extension = Path.GetExtension(file.FileName);
            if (!AllowedFiles.TryGetValue(extension, out var type))
                throw new BadRequestException(
                    "This file type is not allowed. Use PDF, Word, PowerPoint, Excel, ZIP, an image or MP4.");

            // Random name, so files never overwrite each other
            var folder = Path.Combine(WebRoot(), "uploads", "materials");
            Directory.CreateDirectory(folder);
            var fileName = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";

            await using (var stream = File.Create(Path.Combine(folder, fileName)))
            {
                await file.CopyToAsync(stream);
            }

            var material = new Material
            {
                CourseId = courseId,
                Title = dto.Title.Trim(),
                Description = dto.Description,
                Type = type,
                Url = $"/uploads/materials/{fileName}"
            };
            await _materialRepository.AddAsync(material);
            await _materialRepository.SaveChangesAsync();

            return material.ToResponseDto();
        }

        // The material exists (404) and belongs to one of my courses (403)
        private async Task<Material> GetOwnedMaterialAsync(int instructorId, int materialId)
        {
            var material = await _materialRepository.GetByIdAsync(materialId)
                ?? throw new NotFoundException($"Material with id {materialId} was not found.");

            await _instructorService.EnsureOwnsCourseAsync(instructorId, material.CourseId);
            return material;
        }

        // A full http(s) link, or a file served by this API
        private static void EnsureValidUrl(string url)
        {
            var value = url.Trim();
            var isWebLink = Uri.TryCreate(value, UriKind.Absolute, out var uri)
                && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
            var isServerFile = value.StartsWith("/uploads/") || value.StartsWith("/files/");

            if (!isWebLink && !isServerFile)
                throw new BadRequestException("The link must start with http:// or https://");
        }

        private string WebRoot()
        {
            return _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        // Only files we uploaded ourselves are deleted (never the demo files in /files)
        private void DeleteUploadedFile(string url)
        {
            if (!url.StartsWith("/uploads/materials/")) return;

            var path = Path.Combine(WebRoot(), "uploads", "materials", Path.GetFileName(url));
            if (File.Exists(path))
                File.Delete(path);
        }
    }
}
