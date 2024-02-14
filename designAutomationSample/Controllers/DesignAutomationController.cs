using Autodesk.Forge;
using Autodesk.Forge.Client;
using Autodesk.Forge.DesignAutomation;
using Autodesk.Forge.DesignAutomation.Model;
using Autodesk.Forge.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Activity = Autodesk.Forge.DesignAutomation.Model.Activity;
using Alias = Autodesk.Forge.DesignAutomation.Model.Alias;
using AppBundle = Autodesk.Forge.DesignAutomation.Model.AppBundle;
using Parameter = Autodesk.Forge.DesignAutomation.Model.Parameter;
using WorkItem = Autodesk.Forge.DesignAutomation.Model.WorkItem;
using WorkItemStatus = Autodesk.Forge.DesignAutomation.Model.WorkItemStatus;


namespace designAutomationSample.Controllers
{
    [ApiController]
    public class DesignAutomationController : ControllerBase
    {
        // Used to access the application folder (temp location for files & bundles)
        private IWebHostEnvironment _env;
        // used to access the SignalR Hub
        private IHubContext<DesignAutomationHub> _hubContext;
        // used to store the s3 upload payload;
        private static PostCompleteS3UploadPayload _postCompleteS3UploadPayload;
        // Local folder for bundles
        public string LocalBundlesFolder { get { return Path.Combine(_env.WebRootPath, "bundles"); } }
        /// Prefix for AppBundles and Activities
        public static string NickName { get { return OAuthController.GetAppSetting("APS_CLIENT_ID"); } }
        /// Alias for the app (e.g. DEV, STG, PROD). This value may come from an environment variable
        public static string Alias { get { return "dev"; } }
        //This property manager S3 Upload Payload
        public static PostCompleteS3UploadPayload S3UploadPayload
        {
            get { return _postCompleteS3UploadPayload; }
            set { _postCompleteS3UploadPayload = value; }
        }
        // Design Automation v3 API
        DesignAutomationClient _designAutomation;

        // Constructor, where env and hubContext are specified
        public DesignAutomationController(IWebHostEnvironment env, IHubContext<DesignAutomationHub> hubContext, DesignAutomationClient api)
        {
            _designAutomation = api;
            _env = env;
            _hubContext = hubContext;
        }

        #region Next we will add the methods here

        /// <summary>
        /// Names of app bundles on this project
        /// フォルダーを見て、.ZIPファイルの一覧を返します。
        /// </summary>
        [HttpGet]
        [Route("api/appbundles")]
        public string[] GetLocalBundles()
        {
            // this folder is placed under the public folder, which may expose the bundles
            // but it was defined this way so it be published on most hosts easily
            return Directory.GetFiles(LocalBundlesFolder, "*.zip").Select(Path.GetFileNameWithoutExtension).ToArray();
        }

        /// <summary>
        /// Return a list of available engines
        /// バンドルを定義するにはエンジンも必要であるため、このエンドポイントは使用可能なすべてのエンジンのリストを返します。
        /// </summary>
        [HttpGet]
        [Route("api/aps/designautomation/engines")]
        public async Task<List<string>> GetAvailableEngines()
        {
            List<string> allEngines = new List<string>();
            // define Engines API
            string paginationToken = null;
            while (true)
            {
                Page<string> engines = await _designAutomation.GetEnginesAsync(paginationToken);
                allEngines.AddRange(engines.Data);
                if (engines.PaginationToken == null)
                    break;
                paginationToken = engines.PaginationToken;
            }
            allEngines.Sort();
            return allEngines; // return list of engines
        }

        /// <summary>
        /// Define a new appbundle
        /// ここで、実際に新しい AppBundle を定義します。
        /// </summary>
        [HttpPost]
        [Route("api/aps/designautomation/appbundles")]
        public async Task<IActionResult> CreateAppBundle([FromBody] JObject appBundleSpecs)
        {
            // basic input validation
            string zipFileName = appBundleSpecs["zipFileName"].Value<string>();
            string engineName = appBundleSpecs["engine"].Value<string>();

            // standard name for this sample
            string appBundleName = zipFileName + "AppBundle";

            // check if ZIP with bundle is here
            string packageZipPath = Path.Combine(LocalBundlesFolder, zipFileName + ".zip");
            if (!System.IO.File.Exists(packageZipPath)) throw new Exception("Appbundle not found at " + packageZipPath);

            // get defined app bundles
            Page<string> appBundles = await _designAutomation.GetAppBundlesAsync();

            // check if app bundle is already define
            dynamic newAppVersion;
            string qualifiedAppBundleId = string.Format("{0}.{1}+{2}", NickName, appBundleName, Alias);
            if (!appBundles.Data.Contains(qualifiedAppBundleId))
            {
                // create an appbundle (version 1)
                AppBundle appBundleSpec = new AppBundle()
                {
                    Package = appBundleName,
                    Engine = engineName,
                    Id = appBundleName,
                    Description = string.Format("Description for {0}", appBundleName),

                };
                newAppVersion = await _designAutomation.CreateAppBundleAsync(appBundleSpec);
                if (newAppVersion == null) throw new Exception("Cannot create new app");

                // create alias pointing to v1
                Alias aliasSpec = new Alias() { Id = Alias, Version = 1 };
                Alias newAlias = await _designAutomation.CreateAppBundleAliasAsync(appBundleName, aliasSpec);
            }
            else
            {
                // create new version
                AppBundle appBundleSpec = new AppBundle()
                {
                    Engine = engineName,
                    Description = appBundleName
                };
                newAppVersion = await _designAutomation.CreateAppBundleVersionAsync(appBundleName, appBundleSpec);
                if (newAppVersion == null) throw new Exception("Cannot create new version");

                // update alias pointing to v+1
                AliasPatch aliasSpec = new AliasPatch()
                {
                    Version = newAppVersion.Version
                };
                Alias newAlias = await _designAutomation.ModifyAppBundleAliasAsync(appBundleName, Alias, aliasSpec);
            }

            // upload the zip with .bundle            
            using (var client = new HttpClient())
            {
                using (var formData = new MultipartFormDataContent())
                {
                    foreach (var kv in newAppVersion.UploadParameters.FormData)
                    {
                        if (kv.Value != null)
                        {
                            formData.Add(new StringContent(kv.Value), kv.Key);
                        }
                    }
                    using (var content = new StreamContent(new FileStream(packageZipPath, FileMode.Open)))
                    {
                        formData.Add(content, "file");
                        using (var request = new HttpRequestMessage(HttpMethod.Post, newAppVersion.UploadParameters.EndpointURL) { Content = formData })
                        {
                            var response = await client.SendAsync(request);
                            response.EnsureSuccessStatusCode();
                        }
                    }
                }
            }

            return Ok(new { AppBundle = qualifiedAppBundleId, Version = newAppVersion.Version });
        }

        #endregion
    }

    /// <summary>
    /// Class uses for SignalR
    /// </summary>
    public class DesignAutomationHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public string GetConnectionId() { return Context.ConnectionId; }
    }

}