using Microsoft.AspNetCore.Mvc;

namespace designAutomationSample
{
    internal class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(options => options.EnableEndpointRouting = false).SetCompatibilityVersion(CompatibilityVersion.Version_3_0).AddNewtonsoftJson();
            services.AddSignalR().AddNewtonsoftJsonProtocol(opt => {
                opt.PayloadSerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseFileServer();
            app.UseMvc();

            app.UseRouting();
            app.UseEndpoints(routes =>
            {
                routes.MapHub<Controllers.DesignAutomationHub>("/api/signalr/designautomation");
            });
        }
    }
}