using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using System.Net.Http;
using System.Threading.Tasks;

public record BusTimeOptions
{
    public string BaseUrl { get; set; }
    public string ApiKey { get; set; }

    public BusTimeOptions() : base()
    {
        // Initialize default values if needed
    }
}

public class BusTimeService
{
    private readonly HttpClient _http;
    private readonly BusTimeOptions _opts;

    public BusTimeService(IHttpClientFactory factory, IOptions<BusTimeOptions> opts)
    {
        _http = factory.CreateClient();
        _opts = opts.Value;
    }

    public async Task<string> GetRoutesAsync()
    {
        var url = $"{_opts.BaseUrl}/getroutes?key={_opts.ApiKey}&format=json";
        Console.WriteLine("DEBUG");
        Console.WriteLine(url);
        return await _http.GetStringAsync(url);
    }

    public async Task<string> GetPredictionsAsync(string stopId)
    {
        var url = $"{_opts.BaseUrl}/getpredictions?key={_opts.ApiKey}&stpid={stopId}&format=json";
        return await _http.GetStringAsync(url);
    }
}

public class Program
{
    public static void Main(string[] args)
    {
        // Load environment variables
        DotNetEnv.Env.Load();

        var builder = WebApplication.CreateBuilder(args);

        // Add services
        builder.Services.AddControllers();
        builder.Services.AddHttpClient<BusTimeService>();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "BusTime API", Version = "v1" });
        });

        // Verify environment variables loaded
        Console.WriteLine($"BusTime API loaded: {builder.Configuration["BusTime:ApiKey"]?.Length} chars");
        Console.WriteLine($"BusTime BaseUrl loaded: {builder.Configuration["BusTime:BaseUrl"]}");

        // Configuration binding using environment variables
        builder.Services.Configure<BusTimeOptions>(options =>
        {
            options.BaseUrl = builder.Configuration["BusTime:BaseUrl"];
            options.ApiKey = builder.Configuration["BusTime:ApiKey"];
        });

        builder.Services.AddSingleton<BusTimeService>();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseRouting();
        app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        app.MapControllers();
        app.Run();
    }
}