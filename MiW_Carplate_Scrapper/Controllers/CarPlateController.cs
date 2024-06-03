using Microsoft.AspNetCore.Mvc;


namespace CarPlatesScrapper.Controllers
{
    [ApiController]
    public class CarPlateController : ControllerBase
    {
        private readonly IPlateService _plateService;
        public CarPlateController(IPlateService plateService)
        {

            _plateService = plateService;

        }

        [HttpPost]
        [Route("/plate")]
        public async Task<IActionResult> GetCarPlateData([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("Nieprawidłowy plik.");
            }

            var plateId = await _plateService.GetPlateIdAsync(image);
            if (plateId == null || plateId == "null") { return NotFound("Nie wykryto numeru tablic na przesłanym obrazie"); }
            var carInfo = await _plateService.GetCarInfoAsync(plateId);

            return Ok(carInfo);
        }
    }
}
