using Andalusia.Api.DTOs.Requests;
using Andalusia.Api.DTOs.Responses;
using Andalusia.Api.Exceptions;
using Andalusia.Api.Mapping;
using Andalusia.Api.Models;
using Andalusia.Api.Repos.Interfaces;
using Andalusia.Api.Services.Interfaces;

namespace Andalusia.Api.Services
{
    public class CareerPathService : ICareerPathService
    {
        private readonly ICareerPathRepository _repo;

        public CareerPathService(ICareerPathRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<CareerPathResponseDto>> GetPublishedAsync(bool? isFeatured, int? take)
        {
            var paths = await _repo.GetPublishedAsync(isFeatured, take);
            return paths.Select(cp => cp.ToResponseDto());
        }

        public async Task<CareerPathDetailsResponseDto> GetByIdAsync(int id)
        {
            var path = await _repo.GetByIdWithDetailsAsync(id)
                ?? throw new NotFoundException($"Career path {id} not found");
            return path.ToDetailsResponseDto();
        }

        public async Task<CareerPathDetailsResponseDto> CreateAsync(CareerPathRequestDto dto)
        {
            var programIds = dto.ProgramIds.Distinct().ToList();
            await EnsureProgramsExist(programIds);

            var path = dto.ToEntity();
            for (int i = 0; i < programIds.Count; i++)
                path.CareerPathPrograms.Add(new CareerPathProgram
                {
                    ProgramId = programIds[i],
                    SortOrder = i + 1
                });

            await _repo.AddAsync(path);
            await _repo.SaveChangesAsync();

            return await GetByIdAsync(path.Id);   // reload with programs for the response
        }

        public async Task<CareerPathDetailsResponseDto> UpdateAsync(int id, CareerPathRequestDto dto)
        {
            var path = await _repo.GetByIdWithLinksAsync(id)
                ?? throw new NotFoundException($"Career path {id} not found");

            var programIds = dto.ProgramIds.Distinct().ToList();
            await EnsureProgramsExist(programIds);

            dto.UpdateEntity(path);

            // Remove programs no longer in the path
            var toRemove = path.CareerPathPrograms
                .Where(cpp => !programIds.Contains(cpp.ProgramId))
                .ToList();
            _repo.RemoveLinks(toRemove);

            // Update order of kept programs, add new ones
            var existing = path.CareerPathPrograms
                .Where(cpp => programIds.Contains(cpp.ProgramId))
                .ToDictionary(cpp => cpp.ProgramId);

            for (int i = 0; i < programIds.Count; i++)
            {
                if (existing.TryGetValue(programIds[i], out var link))
                    link.SortOrder = i + 1;
                else
                    path.CareerPathPrograms.Add(new CareerPathProgram
                    {
                        ProgramId = programIds[i],
                        SortOrder = i + 1
                    });
            }

            await _repo.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task DeleteAsync(int id)
        {
            var path = await _repo.GetByIdWithLinksAsync(id)
                ?? throw new NotFoundException($"Career path {id} not found");

            // FKs are Restrict, so remove the links explicitly; programs stay untouched
            _repo.RemoveLinks(path.CareerPathPrograms);
            _repo.Delete(path);
            await _repo.SaveChangesAsync();
        }

        private async Task EnsureProgramsExist(List<int> programIds)
        {
            if (!await _repo.AllProgramsExistAsync(programIds))
                throw new BadRequestException("One or more program IDs do not exist");
        }
    }
}