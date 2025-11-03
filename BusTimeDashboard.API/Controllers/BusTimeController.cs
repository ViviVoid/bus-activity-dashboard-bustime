using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class BusTimeController : ControllerBase
{
    private readonly BusTimeService _busTime;

    public BusTimeController(BusTimeService busTime)
    {
        _busTime = busTime;
    }

    [HttpGet("routes")]
    public async Task<IActionResult> GetRoutes()
    {
        var json = await _busTime.GetRoutesAsync();
        return Content(json, "application/json");
    }

    [HttpGet("predictions/{stopId}")]
    public async Task<IActionResult> GetPredictions(string stopId)
    {
        var json = await _busTime.GetPredictionsAsync(stopId);
        return Content(json, "application/json");
    }
}
