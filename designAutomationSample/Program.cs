using Autodesk.Forge.Core;
using Autodesk.Forge.DesignAutomation;
using Microsoft.AspNetCore;

namespace designAutomationSample
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).ConfigureAppConfiguration(builder =>
            {
                builder.AddJsonFile($"appsettings.user.json", optional: true);
                builder.AddEnvironmentVariables();

            }).ConfigureServices((hostContext, services) =>
            {
                services.AddDesignAutomation(hostContext.Configuration);
            }).Build().Run();
        }

        public static IWebHostBuilder CreateHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
    }
}

