using CarPlatesScrapper;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography.X509Certificates;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddScoped<IPlateService, PlateService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors(
    x => x
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowed(origin => true) // allow any origin
            .AllowCredentials()
               
);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
