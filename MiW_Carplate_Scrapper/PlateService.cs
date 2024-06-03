using System.Text;
using System;
using HtmlAgilityPack;
using HtmlAgilityPack.CssSelectors.NetCore;

namespace CarPlatesScrapper
{
    public class PlateService:IPlateService
    {   
        private readonly HttpClient _httpClient;
        public PlateService(HttpClient httpClient) 
        { 
            _httpClient = httpClient;
        }
        public async Task<string> GetPlateIdAsync(IFormFile image)
        {
            var apiPath = "http://127.0.0.1:8000/recognize";
            using var content = new MultipartFormDataContent();
            using var fileStream = image.OpenReadStream();
            using var streamContent = new StreamContent(fileStream);
            streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(image.ContentType);
            content.Add(streamContent, "file", image.FileName);
            var response = await _httpClient.PostAsync(apiPath,content);
            response.EnsureSuccessStatusCode();
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = responseContent.Trim('"');
            return result;
        }

        public async Task<CarInfo> GetCarInfoAsync(string plateId)
        {
            var path = $"https://tablica-rejestracyjna.pl/{plateId}";
            var web = new HtmlWeb();
            web.OverrideEncoding = Encoding.UTF8;
            var doc = web.Load(path);

            var middleColumn = doc.QuerySelector(".col-md-8");
            var commentsObj = middleColumn.QuerySelectorAll(".comment .text");
            var comments = commentsObj.Select(c => c.InnerText).ToList();
            var carInfo = new CarInfo();
            carInfo.PlateId = plateId;
            carInfo.Comments = comments.Take(20).ToList();

            return carInfo;
        }


    }
}
