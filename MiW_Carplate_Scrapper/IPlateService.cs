namespace CarPlatesScrapper
{
    public interface IPlateService
    {
        Task<string> GetPlateIdAsync(IFormFile image);
        Task<CarInfo> GetCarInfoAsync(string plateId);

    }
}