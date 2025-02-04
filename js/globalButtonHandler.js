/*Copyright 2019 Dynatrace LLC
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
function globalButtonHandler() {
  //a little cleanup first
  $("#errorBox, #teaser").hide();
  $("#errorBox, #teaser").html("");
  $("#errorBox, #teaser").removeClass("info");
  //handle buttons
  if ($(this)[0].nodeName == 'INPUT') {
    let id = $(this)[0].id;
    if (typeof dtrum !== "undefined") dtrum.actionName("globalButtonHandler(" + id + ")");
    switch (id) {
      case "connect":
        url = $("input#url").val().toLowerCase();
        if (url.length > 1 && url.charAt(url.length - 1) == "/")
          url = url.substring(0, url.length - 1);
        if (url.length > 1 && !url.startsWith("https://"))
          url = "https://" + url;
        $("input#url").val(url);
        token = $("input#token").val();
        githubuser = $("#githubuser").val();
        githubpat = $("#githubpat").val();
        createFullConnection();
        break;
      case "deleteApp": {
        $(this).val("Deleting...");
        $(this).prop('disabled', true);
        let TOid = $("#TOid").text();
        let AOid = $(this)[0].parentNode.id;
        let count = 1;

        let re = new RegExp("^" + AOid.substring(0, 19));
        DBAdashboards.forEach(function (db) {
          if (re.test(db.id) && db.id != AOid) {
            count++;
          }
        });

        if (window.confirm("DELETE " + count + " dashboards? This cannot be undone...")) {
          let p1 = deleteApp(AOid);

          $.when(p1).done(function () {
            $(this).val("Deleted");
            $("#viewport").load("html/configurator/listApp.html", fieldsetPainter);
            updateTenantOverview(TOid);
          });
        } else {
          $(this).val("Delete");
          $(this).prop('disabled', false);
        }
        break;
      }
      case "deleteFunnel": {
        $(this).val("Deleting...");
        $(this).prop('disabled', true);
        let AOid = $("#AOid").text();
        let FOid = $(this)[0].parentNode.id;
        let count = 1;

        let re = new RegExp("^" + FOid.substring(0, 24));
        DBAdashboards.forEach(function (db) {
          if (re.test(db.id) && db.id != FOid) {
            count++;
          }
        });

        if (window.confirm("DELETE " + count + " dashboards? This cannot be undone...")) {
          let p1 = deleteFunnel(FOid);

          $.when(p1).done(function () {
            $(this).val("Deleted");
            $("#viewport").load("html/configurator/listFunnel.html", fieldsetPainter);
            updateAppOverview(AOid);
          });
        } else {
          $(this).val("Delete");
          $(this).prop('disabled', false);
        }
        break;
      }
      case "deleteTenant": {
        $(this).val("Deleting...");
        $(this).prop('disabled', true);
        let TOid = $(this)[0].parentNode.id;
        let count = 1;

        let re = new RegExp("^" + TOid.substring(0, 14));
        DBAdashboards.forEach(function (db) {
          if (re.test(db.id) && db.id != TOid) {
            count++;
          }
        });

        if (window.confirm("DELETE " + count + " dashboards? This cannot be undone...")) {
          let p1 = deleteTenant(TOid);

          $.when(p1).done(function () {
            $(this).val("Deleted");
            $("#viewport").load("html/configurator/listTenant.html", fieldsetPainter);
          });
        } else {
          $(this).val("Delete");
          $(this).prop('disabled', false);
        }
        break;
      }
      case "deployApp":
        selection.TOid = $(this)[0].parentNode.id;
        delete selection.AOid;
        $("#viewport").load("html/configurator/deployApp.html", fieldsetPainter);
        break;
      case "deployAnotherApp":
        selection.TOid = $("#TOid").text();
        delete selection.AOid;
        $("#viewport").load("html/configurator/deployApp.html", fieldsetPainter);
        break;
      case "editApp":
        selection.AOid = $(this)[0].parentNode.id;
        $("#viewport").load("html/configurator/deployApp.html", fieldsetPainter);
        break;
      case "deployAnotherFunnel":
        selection.AOid = $("#AOid").text();
        selection.funnelLoaded = false;
        $("#viewport").load("html/configurator/deployFunnel-name.html", fieldsetPainter);
        break;
      case "deployFunnel":
        selection.AOid = $(this)[0].parentNode.id;
        selection.funnelLoaded = false;
        $("#viewport").load("html/configurator/deployFunnel-name.html", fieldsetPainter);
        break;
      case "deployFunnel-name-next":
        selection.config.funnelName = $("#funnelName").val();
        selection.config.journeyOverview = $("#journeyOverview").val();
        selection.config.journeyOverviewName = $("#journeyOverview option:selected").text();
        selection.config.repo = JSON.parse($("#journeyOverview option:selected")[0].dataset.repo);
        selection.config.xapp = $("#xapp").prop('checked');
        if (selection.config.xapp)
          selection.config.xapps = $("#xapp_apps").val();
        else
          delete selection.config.xapps;
        //$("#viewport").load("html/configurator/deployFunnel-kpi.html", fieldsetPainter);
        userjourneyNextStep(id);
        break;
      case "deployFunnel-kpi-next":
        selection.config.kpi = $("#usplist").val();
        selection.config.kpiName = $("#kpiName").val();
        //$("#viewport").load("html/configurator/deployFunnel-funnel.html", fieldsetPainter);
        userjourneyNextStep(id);
        break;
      case "deployFunnel-funnel-next":
        selection.config.whereClause = $("#whereClause").val();
        selection.config.funnelData = funnelData;
        //$("#viewport").load("html/configurator/deployFunnel-filters.html", fieldsetPainter);
        userjourneyNextStep(id);
        break;
      case "deployFunnel-filters-next":
        selection.config.filterClause = $(".filterClause").val();
        selection.config.filterData = {
          country: $(".countryList").val(),
          region: $(".regionList").val(),
          city: $(".cityList").val(),
          key: $("#uspKey").val(),
          type: $("#uspKey option:selected")[0].dataset['colname'],
          val: $("#uspVal").val()
        }
        //$("#viewport").load("html/configurator/deployFunnel-compare.html", fieldsetPainter);
        userjourneyNextStep(id);
        break;
      case "deployTenant":
        let p_mz = getMZs();
        $.when(p_mz).done(function (data1) {
          processMZs(data1);
          $("#viewport").load("html/configurator/deployTenant.html", fieldsetPainter);
        });
        break;
      case "editFunnel": {
        selection.FOid = $(this)[0].parentNode.id;
        let p1 = loadDashboard(configID(selection.FOid));

        $.when(p1).done(function (data) {
          selection.config = parseConfigDashboard(data);
          selection.funnelLoaded = true;
          $("#viewport").load("html/configurator/deployFunnel-name.html", fieldsetPainter);
        });
      }
        break;
      case "updateFunnelForecast": {
        let button = $(this);
        let originalText = button.text();
        $(this).text('Updating...');
        let ov = $(this)[0].parentNode.id;
        let p1 = loadDashboard(configID(ov));

        //get some vals from a popup
        let popupHeader = "Enter expected traffic factor";
        let inputs = [{ name: 'tfactor', value: '100%', label: "Traffic Factor" }];
        let desc = "Allows you to adjust for expected traffic changes, ie 110% is a 10% increase, eg to account for an advertising spot. Keep at 100% normally.";

        $.when(p1).done(function (data) {
          selection.config = parseConfigDashboard(data);
          let popup_p = popup(inputs, popupHeader, desc);
          let p2 = generateFunnelForecast(selection.config);

          if (typeof selection.config.subids == "undefined")
            errorbox("Sorry, journey data is too old, please edit and re-upload, then try again.");
          else $.when(p2, popup_p).done(function (r1, r2) {
            selection.config.tfactor = r2[0].val.replace('%', '');
            let revs = r1;
            let deferreds = updateFunnelForecast(selection.config, ov, revs);

            $.when.apply($, deferreds).done(function () {
              button.text(originalText);
            });
          });
        });
      }
        break;
      case "updateAppForecast": {
        let button = $(this);
        let originalText = button.text();
        $(this).text('Updating...');
        let ov = $(this)[0].parentNode.id;
        let p1 = loadDashboard(configID(ov));

        //get some vals from a popup
        let popupHeader = "Enter expected traffic factor";
        let inputs = [{ name: 'tfactor', value: '100%', label: "Traffic Factor" }];
        let desc = "Allows you to adjust for expected traffic changes, ie 110% is a 10% increase, eg to account for an advertising spot. Keep at 100% normally.";

        $.when(p1).done(function (data) {
          selection.config = parseConfigDashboard(data);
          popup_p = popup(inputs, popupHeader, desc);
          let p2 = generateAppForecast(selection.config);
          if (typeof selection.config.subids == "undefined")
            errorbox("Sorry, AppOverview data is too old, please edit and re-upload, then try again.");
          else $.when(p2, popup_p).done(function (r1, r2) {
            selection.config.tfactor = r2[0].val.replace('%', '');
            let revs = r1;
            let deferreds = updateAppForecast(selection.config, ov, revs);

            $.when.apply($, deferreds).done(function () {
              button.text(originalText);
            });
          });
        });
      }
        break;
      case "json":
        $("#jsonviewer").toggle();
        break;
      case "listApp":
        selection.TOid = $(this)[0].parentNode.id;
        selection.config = {};
        $("#viewport").load("html/configurator/listApp.html", fieldsetPainter);
        break;
      case "returnListFunnel":
        selection.config = {};
        $("#viewport").load("html/configurator/listFunnel.html", fieldsetPainter);
        break;
      case "listFunnel":
        selection.AOid = $(this)[0].parentNode.id;
        selection.config = {};
        $("#viewport").load("html/configurator/listFunnel.html", fieldsetPainter);
        break;
      case "listTenant":
        selection.config = {};
        $("#viewport").load("html/configurator/listTenant.html", fieldsetPainter);
        break;
      case "minus":
        if ($("input#whereClause").attr('readonly') &&
          funnelData.length > 2) { //do nothing if in pencil mode
          funnelData.pop();
          chart.draw(funnelData, options);
          updateWhere(funnelData);
          $("#plus").prop("disabled", false);
        } else {
          $("#minus").prop("disabled", true);
        }
        break;
      case "other":
        alert("other");
        break;
      case "plus":
        if ($("input#whereClause").attr('readonly') &&
          funnelData.length < 10) { //do nothing if in pencil mode
          funnelData.push({ label: 'name', value: '', clauses: [] });
          chart.draw(funnelData, options);
          updateWhere(funnelData);
          $("#minus").prop("disabled", false);
        } else {
          $("#plus").prop("disabled", true);
        }
        break;
      case "updateLabel":
        let i = $("#labelForm input#i").val();
        let label = $("#labelForm #labelInput").val();
        funnelData[i].label = label;
        $("#labelForm").hide();
        chart.draw(funnelData, options);
        updateWhere(funnelData);
        break;
      case "uploadApp": {
        $("input#uploadApp").val("Uploading...");
        $("input#uploadApp").prop('disabled', true);
        let TOid = $("#TOid").text();
        selection.config.appOverview = $("#appOverview").val();
        selection.config.AOname = $("#appName").val();
        selection.config.appID = $("#applist").val();
        selection.config.appName = $("#applist option:selected").text();
        selection.config.TOid = TOid;
        selection.config.TOname = $("#TOname").text();
        selection.config.appOverviewName = $("#appOverview option:selected").text();
        selection.config.repo = JSON.parse($("#appOverview option:selected")[0].dataset.repo);

        switch (selection.config.appOverview) {
          case "AppOverview.json": {
            selection.config.MyCompareApp = $("#MyCompareApp").val();
            selection.config.compareAppID = $("#compareAppList").val();
            selection.config.compareAppName = $("#compareAppList option:selected").text();
            selection.config.compareMZid = $("#compareMZ select").val();
            selection.config.compareMZname = $("#compareMZ select option:selected").text();
            selection.config.MyTime = $("#MyTime").val();
            selection.config.compareTime = $("#compareTimeList").val();
            break;
          }
          case "CitrixOverview.json": {
            selection.config.MZid = $("#citrixMZ select").val();
            selection.config.MZname = $("#citrixMZ select option:selected").text();
            selection.config.serviceID = $("#storefrontService").val();
            selection.config.customAppID = $("#citrixRUMApp").val();
            selection.config.customApp = $("#citrixRUMApp option:selected").text();
            /*Management ID - ${MZid}
          Management Zone Name - ${MZname}
          Citrix Custom App Name - ${CustomApp}
          Citrix Custom App ID - ${CustomAppID} – Ex: CUSTOM_APPLICATION-37A08489ECBD4F91
          Storefront App - ${MyApp} -
          Storefront App ID -  ${InternalAppID} – Ex: APPLICATION-A0F724A4E525A3E3
          Storefront Service - $[MyServiceID} – Ex: SERVICE-F44399D220DE9101*/
            break;
          }
          case "REApplicationOverview.json":
          case "REApplicationOverview2.json": {
            selection.config.ipClause = $("#ipClause").val();
            selection.config.rfc1918 = $("#rfc1918").prop("checked");
            selection.config.ipName = $("#ipName").val();
            selection.config.compareipClause = $("#compareipClause").val();
            selection.config.comparerfc1918 = $("#comparerfc1918").prop("checked");
            selection.config.ipCompareName = $("#ipCompareName").val();
            selection.config.compareipClause2 = $("#compareipClause2").val();
            selection.config.comparerfc19182 = $("#comparerfc19182").prop("checked");
            selection.config.ipCompareName2 = $("#ipCompareName2").val();
            break;
          }
          default:
          //console.log("No special handling defined for #appOverview: " + AO);
        }

        if (typeof $("#mz").val() != "undefined") {
          selection.config.mz = $("#mz").val();
          selection.config.mzname = $("#mzname").val();

        } else if (typeof $("#mzlist").val() != "undefined") {
          selection.config.mz = $("#mzlist").val();
          selection.config.mzname = $("#mzlist option:selected").text();
        }

        let p0 = getAppDetail(selection.config.appID);
        $.when(p0).done(function (d0) {
          if (typeof d0 != "undefined") {
            let appDetail = parseAppDetail(d0);
            selection.config.costControlUserSessionPercentage = appDetail.costControlUserSessionPercentage;
          }

          let p1 = uploadAppOverview(selection.config);
          $.when(p1).done(function () {
            $("input#uploadApp").val("Uploaded");
            $("#viewport").load("html/configurator/listApp.html", fieldsetPainter);
            updateTenantOverview(TOid);
          });
        });
        break;
      }
      case "uploadTenant": {
        $("input#uploadTenant").val("Uploading...");
        $("input#uploadTenant").prop('disabled', true);
        selection.config = {};
        selection.config.TOname = $("#TOname").val();
        selection.config.mz = $("#mzlist").val();
        selection.config.mzname = $("#mzlist option:selected").text();
        selection.config.tenantOverview = $("#tenantOverview").val();
        selection.config.tenantOverviewName = $("#tenantOverview option:selected").text();
        selection.config.repo = JSON.parse($("#tenantOverview option:selected")[0].dataset.repo);

        switch (selection.config.tenantOverview) {
          case "TenantOverview.json":
          case "LiteTenantOverview.json":
            break;
          case "00000000-dddd-bbbb-ffff-000000000001":
            break;
          case "SAP Application Cockpit.json":
            let $elArr = $("#SAPapps option:selected");
            let arr = [];
            $elArr.each((idx, el) => {
              try {
                let obj = JSON.parse($(el).attr("data-json"));
                arr.push(obj);
              } catch (err) {
                console.log("SAPapps JSON parse error");
              }
            })
            selection.config.SAPapps = arr;

            break;
          case "RETenantOverview.json":
          case "RETenantOverview2.json":
            selection.config.ipClause = $("#ipClause").val();
            selection.config.rfc1918 = $("#rfc1918").prop("checked");
            selection.config.ipName = $("#ipName").val();
            selection.config.compareipClause = $("#compareipClause").val();
            selection.config.comparerfc1918 = $("#comparerfc1918").prop("checked");
            selection.config.ipCompareName = $("#ipCompareName").val();
            selection.config.compareipClause2 = $("#compareipClause2").val();
            selection.config.comparerfc19182 = $("#comparerfc19182").prop("checked");
            selection.config.ipCompareName2 = $("#ipCompareName2").val();
            break;
          case "InfrastructureOverview.json":
            break;
          default:
        }


        let p1 = uploadTenantOverview(selection.config);

        $.when(p1).done(function () {
          $("input#uploadTenant").val("Uploaded");
          $("#viewport").load("html/configurator/listTenant.html", fieldsetPainter);
        });
        break;
      }
      case "uploadFunnel": {
        if ('xapp' in selection.config && selection.config.xapp) {
          selection.config.compareFunnel = $("#xapp_compareFunnel").val();
          selection.config.xapp_compareAppID1 = $("#compareAppList1").val();
          selection.config.xapp_compareAppName1 = $("#compareAppList1 option:selected").text();
          selection.config.xapp_compareAppID2 = $("#compareAppList2").val();
          selection.config.xapp_compareAppName2 = $("#compareAppList2 option:selected").text();

          if (selection.config.xapp_compareAppName1 != "None" && selection.config.xapp_compareAppName2 != "None") {
            selection.config.compareFirstStep = {
              'colname': $("#xapp_compareFirstStep option:selected")[0].dataset['colname'],
              'name': $("#xapp_compareFirstStep option:selected").text()
            };
            selection.config.compareLastStep = {
              'colname': $("#xapp_compareLastStep option:selected")[0].dataset['colname'],
              'name': $("#xapp_compareLastStep option:selected").text()
            };
            selection.config.compareRevenue = $("#xapp_compareRevenue").val();
          }
        } else {
          selection.config.compareFunnel = $("#compareFunnel").val();
          selection.config.compareAppID = $("#compareAppList").val();
          selection.config.compareAppName = $("#compareAppList option:selected").text();
          if (selection.config.compareAppName != "None") {
            if (!$("#compareFirstStep option:selected").length) {
              alert("Compare First Step cannot be blank with a selected Compare App");
              return;
            } else
              selection.config.compareFirstStep = {
                'colname': $("#compareFirstStep option:selected")[0].dataset['colname'],
                'name': $("#compareFirstStep option:selected").text()
              };
            if (!$("#compareLastStep option:selected").length) {
              alert("Compare Last Step cannot be blank with a selected Compare App");
              return;
            } else
              selection.config.compareLastStep = {
                'colname': $("#compareLastStep option:selected")[0].dataset['colname'],
                'name': $("#compareLastStep option:selected").text()
              };
            selection.config.compareRevenue = $("#compareRevenue").val();
          }
        }
        selection.config.compareTime = $("#compareTimeList").val();
        selection.config.campaignActive = $("#campaignActive").prop('checked');
        if (selection.config.campaignActive) {
          selection.config.campaignStep1 = {
            'colname': $("#campaignStep1 option:selected")[0].dataset['colname'],
            'name': $("#campaignStep1").val()
          };
          selection.config.promHeaderStep = $("#promHeaderStep").val();
        }
        selection.config.featureAdded = $("#featureAdded").prop('checked');
        if (selection.config.featureAdded) {
          selection.config.FeatureHeaderStep = $("#FeatureHeaderStep").val();
          selection.config.StepNewFeature1 = {
            'colname': $("#StepNewFeature1 option:selected")[0].dataset['colname'],
            'name': $("#StepNewFeature1").val()
          };
        }
        selection.config.MyTime = $("#MyTime").val();
        selection.config.compareTime = $("#compareTimeList").val();

        $("#uploadFunnel").val("Uploading...");
        $("#uploadFunnel").prop("disabled", true);
        let p0 = getAppDetail(selection.config.appID);
        $.when(p0).done(function (d0) {
          if (typeof d0 != "undefined") {
            let appDetail = parseAppDetail(d0);
            selection.config.costControlUserSessionPercentage = appDetail.costControlUserSessionPercentage;
          }

          let p1 = uploadFunnel(selection.config);

          $.when(p1).done(function () {
            $("#viewport").load("html/configurator/deployFunnel-finish.html", fieldsetPainter);
            updateAppOverview(selection.AOid);
          });
        });
        break;
      }
      case "downloadConfig":
        let filename = selection.config.funnelName + "-" +
          Date.now() +
          ".json";
        download(filename, JSON.stringify((({ config }) => ({ config }))(selection)));
        break;
      case "downloadOfflinePack": {
        let filename = `OfflinePack-${Date.now()}.json`;
        download(filename, JSON.stringify({
          dbList: dbList,
          repoList: repoList,
          readmeList: readmeList,
          workflowList: workflowList
        }));
        break;
      }
      case "uploadOfflinePack": {
        OfflineMode = $("#offlineMode").prop('checked');
        //get file from a popup
        let popupHeader = "Offline Pack to upload";
        let inputs = [{ type: 'file', name: 'offlinePack', value: '', label: "JSON&nbsp;file" }];
        let desc = "Downloaded from an online environment.";

        let popup_p = popup(inputs, popupHeader, desc);
        $.when(popup_p).done(function (data) {
          let file = data.find(obj => obj.name == "offlinePack").file;
          fr = new FileReader();
          fr.onload = function () {
            let res = fr.result;
            try {
              let json = JSON.parse(res);
              dbList = json.dbList;
              repoList = json.repoList;
              readmeList = json.readmeList;
              workflowList = json.workflowList;
            } catch (e) {
              alert("Loading offline pack failed: " + e.message);
            }
            updateDashboardButton();

          };
          if (typeof file !== "undefined") fr.readAsText(file);
        });
        break;
      }
      case "downloadDashboards": {
        let filelist = []; //get from checkboxes
        $("#dashboardlist ul li input[type=checkbox]:checked").each(function (index, element) {
          filelist.push(element.dataset.dbid);
        });
        $("#ownerlist ul li input[type=checkbox]:checked").each(function (index, element) {
          filelist = filelist.concat(JSON.parse(element.dataset.dbids));
        });

        let filename = `dashboards-${filelist.length}-${Date.now()}.json`;

        let filearray = []; //get from XHRs
        let deferreds = [];
        deferreds[0] = $.Deferred();
        filelist.forEach(function (f) {
          let p0 = $.Deferred();
          let p1 = loadDashboard(f);
          deferreds.push(p0);
          deferreds.push(p1);
          $.when(p1).done(function (d) {
            filearray.push(d);
            p0.resolve();
          });
        });
        deferreds[0].resolve();

        $.when.apply($, deferreds).done(function () {
          download(filename, JSON.stringify(filearray));
        });
        break;
      }
      case "publishDashboards":
        var publish = true;
      case "unpublishDashboards": {
        var publish = (typeof publish != "undefined" && publish ? true : false);
        let list = []; //get from checkboxes
        $("#dashboardlist ul li input[type=checkbox]:checked").each(function (index, element) {
          list.push(element.dataset.dbid);
        });
        $("#ownerlist ul li input[type=checkbox]:checked").each(function (index, element) {
          list = list.concat(JSON.parse(element.dataset.dbids));
        });
        if (confirm(`Set 'published'=${publish} for ${list.length} dashboards?`)) {
          list.forEach(function (id) {
            publishDashboard(id, publish);
          });
          $("#viewport").load("html/dashboardCleanup.html", fieldsetPainter); //refresh
        }
        break;
      }
      case "deleteDashboards": {
        let list = []; //get from checkboxes
        let bizops = false; //for checking if selection contains Configurator dbs
        $("#dashboardlist ul li input[type=checkbox]:checked").each(function (index, element) {
          list.push(element.dataset.dbid);
        });
        $("#ownerlist ul li input[type=checkbox]:checked").each(function (index, element) {
          list = list.concat(JSON.parse(element.dataset.dbids));
        });

        list.forEach(function (id) {
          if (id.match(/bbbbbbbb-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/))
            bizops = true;
        });
        if (bizops && confirm("Selection contains Configurator managed dashboards! \nDeleting here will break links etc! \nProceed anyway?"))
          bizops = false;

        if (!bizops && confirm(`DELETE ${list.length} dashboards?`)) {
          list.forEach(function (id) {
            if (!id.match(/bbbbbbbb-[0-9]{4}-[0-9]{4}-[0-9]{4}-ffffffffffff/) ||
              confirm(`${id} is a config dashboard for Configurator! DELETE anyway?`)) {
              deleteDashboard(id);
            }
          });
          $("#viewport").load("html/dashboardCleanup.html", fieldsetPainter); //refresh
        }
        break;
      }
      case "loadConfig": {
        let file = $("#funnelConfig").prop("files")[0];
        fr = new FileReader();
        fr.onload = function () {
          let res = fr.result;
          let json = JSON.parse(res);
          if ('config' in json) {
            selection.funnelLoaded = true;
            selection.config = json.config;
            fieldsetPainter();
          }
        };
        fr.readAsText(file);
        break;
      }
      case "clearFunnel": {
        funnelData.forEach(function (f, i, a) {
          a[i].value = "";
          a[i].clauses = [];
        });
        updateWhere(funnelData);
        selection.config.whereClause = $("#whereClause").val();
        $("#viewport").load("html/configurator/deployFunnel-funnel.html", fieldsetPainter);
        break;
      }
      case "reloadCSS": {
        var css = $("#css")[0];
        var queryString = '?reload=' + new Date().getTime();
        css.href = css.href.replace(/\?.*|$/, queryString);
        break;
      }
      case "saveRepoConfig": {
        /*repoList[1].owner = $("#default_repo_owner").val();
        repoList[1].repo = $("#default_repo_repo").val();
        repoList[0].owner = $("#old_repo_owner").val();
        repoList[0].repo = $("#old_repo_repo").val();*/
        oldVersion = parseInt($("#oldVersion").val());
        dbTagsVersion = parseInt($("#dbTagsVersion").val());
        USQLlimit = parseInt($("#USQLlimit").val());
        personaFlow = $("#personaFlow").prop('checked');
        PreviewWorkflows = $("#previewWorkflows").prop('checked');
        OfflineMode = $("#offlineMode").prop('checked');
        dbTO = $("#dbTO").val();
        dbAO = $("#dbAO").val();
        dbFunnelTrue = $("#dbFunnelTrue").val();
        dbFunnelFalse = $("#dbFunnelFalse").val();


        $("input.repo_owner[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          repoList[i].owner = element.value;
        });
        $("input.repo_repo[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          if (element.value.includes('/')) {
            let paths = element.value.split('/');
            repoList[i].repo = paths.shift();
            repoList[i].path = paths.join('/');
          } else {
            repoList[i].repo = element.value;
            repoList[i].path = '';
          }
        });
        $("select.tenantOverview_repo[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          let selected = element.children("option:selected");
          tenantOverviews[i].repo = JSON.parse(selected.dataset.repo);
        });
        $("input.tenantOverview_name[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          tenantOverviews[i].name = element.value;
        });
        $("input.tenantOverview_filename[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          tenantOverviews[i].filename = element.value;
        });
        $("select.appOverview_repo[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          let selected = element.children("option:selected");
          appOverviews[i].repo = JSON.parse(selected.dataset.repo);
        });
        $("input.appOverview_name[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          appOverviews[i].name = element.value;
        });
        $("input.appOverview_filename[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          appOverviews[i].filename = element.value;
        });
        $("select.journeyOverview_repo[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          let selected = element.children("option:selected");
          journeyOverviews[i].repo = JSON.parse(selected.dataset.repo);
        });
        $("input.journeyOverview_name[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          journeyOverviews[i].name = element.value;
        });
        $("input.journeyOverview_filename[data-index]").each(function (index, element) {
          let i = element.dataset.index;
          journeyOverviews[i].filename = element.value;
        });
        $("#x_a").trigger("click");
        break;
      }
      case "reloadDBs": {
        OfflineMode = $("#offlineMode").prop('checked');
        let p1 = loadEverythingFromGithubAndCache();
        $.when(p1).done(() => {
          updateOfflineButtons();
        });
        break;
      }
      case "recycleDBs": {
        let p1 = loadEverythingFromGithubAndCache();
        $.when(p1).done(() => {
          fieldsetPainter({selector:`#dashboard_list`});
        });
        break;
      }
      case "addRepo": {
        let owner = $("#add_repo_owner").val();
        let repo = $("#add_repo_repo").val();
        let path = "";
        if (repo.includes('/')) {
          let paths = repo.split('/');
          repo = paths.shift();
          path = paths.join('/');
        } else {
          repo = repo;
          path = '';
        }
        repoList.push({ 'owner': owner, 'repo': repo, 'path': path });
        $("#repo_config").load("html/repo_config.html", fieldsetPainter);
        break;
      }
      case "addTenantOverview": {
        tenantOverviews.push({
          'name': $("#add_tenantOverview_name").val(),
          'filename': $("#add_tenantOverview_filename").val(),
          'repo': JSON.parse($("#add_tenantOverview_repo option:selected")[0].dataset.repo)
        });
        $("#repo_config").load("html/repo_config.html", fieldsetPainter);
        break;
      }
      case "addAppOverview": {
        appOverviews.push({
          'name': $("#add_appOverview_name").val(),
          'filename': $("#add_appOverview_filename").val(),
          'repo': JSON.parse($("#add_appOverview_repo option:selected")[0].dataset.repo)
        });
        $("#repo_config").load("html/repo_config.html", fieldsetPainter);
        break;
      }
      case "addJourneyOverview": {
        journeyOverviews.push({
          'name': $("#add_journeyOverview_name").val(),
          'filename': $("#add_journeyOverview_filename").val(),
          'repo': JSON.parse($("#add_journeyOverview_repo option:selected")[0].dataset.repo)
        });
        $("#repo_config").load("html/repo_config.html", fieldsetPainter);
        break;
      }
      case "deployAutoTag": {
        let tech = $("#deployAutoTag")[0].dataset['tech'];
        let appname = $("#applist option:selected").text();
        let swaps = [{ 'to': '${appname}', 'from': appname }];
        let p1 = deployAutoTag("json/autoTags/" + tech + ".json", swaps);
        $.when(p1).done(appOverviewChangeHandler);
        break;
      }
      case "deployMZ": {
        let tech = $("#deployMZ")[0].dataset['tech'];
        let swaps = [];
        let p1 = deployMZ("json/managementZones/" + tech + "Overview.json", swaps);
        $.when(p1).done(appOverviewChangeHandler);
        break;
      }
      case "dashboardCleanup": {
        $("#viewport").load("html/dashboardCleanup.html", fieldsetPainter);
        break;
      }
      case "compareaddIpRange":
      case "compareaddIpRange2":
      case "addIpRange": {
        let divObj = $(this).parent("div");
        let ipClauseObj = divObj.find(".ipClause");
        let lowerObj = divObj.find(".ipLowerBound");
        let upperObj = divObj.find(".ipUpperBound");
        let ipClause = ipClauseObj.val();
        let ipClauses = [];

        try {
          ipClause = ipClause.match(/\((.*)\)/)[1];
          ipClauses = ipClause.split(" OR ");
        } catch (e) {
          ipClause = "";
          ipClauses = [];
        }

        let lower = lowerObj.val();
        let upper = upperObj.val();
        ipClauses.push(`usersession.ip BETWEEN "${lower}" AND "${upper}"`);
        if (ipClauses.length > 0) ipClause = ` AND (${ipClauses.join(" OR ")})`;
        else ipClause = "";
        ipClauseObj.val(ipClause);
        lowerObj.val("");
        upperObj.val("");
        break;
      }

      case "persona_list": {
        $("#viewport").load("html/personaFlow/persona_list.html", fieldsetPainter);
        break;
      }
      case "persona_deploy": {
        selection = {};
        $("#viewport").load("html/personaFlow/persona_usecase.html", fieldsetPainter);
        break;
      }
      case "persona_usecase_next": {
        selection.swaps = [];
        selection.config = {};
        let personaPrefix = $("#persona :selected").attr('data-prefix');
        selection.persona = personas.find(({ prefix }) => prefix === personaPrefix);
        let usecasePrefix = $("#usecase :selected").attr('data-prefix');
        selection.usecase = usecases.find(({ prefix }) => prefix === usecasePrefix);
        let workflowI = $("#workflow :selected").attr('data-workflowIndex');
        selection.workflow = workflowList[workflowI];
        $("#viewport").load("html/personaFlow/persona_userInputs.html", fieldsetPainter);
        break;
      }
      case "workflowButton": {
        let button = $("#workflowButton");
        let activePage = $("#workflow").find(".workflowPage.activePage");
        let $invalids = $("#workflow").find(`:invalid`);
        if ($invalids.length) {
          $invalids.eq(0)
            .focus()
            .fadeOut(250)
            .fadeIn(250)
            .fadeOut(250)
            .fadeIn(250);
          ;
          break;
        }
        generateWorkflowSwapList(activePage);
        while (ConfigPushers.length) {
          let cp = ConfigPushers.shift();
          cp.addCPToSwaps(selection.swaps);
        }
        if (button.val() == "Next") {
          let activePage = workflowNextPage();
          renderWorkflowPage(activePage);
          drawWorkflowPagerButton();
        }
        else if (button.val() == "Done") {
          if (selection.testMode) {
            let tester = button.parents(".popupHTML");
            compareWorkflowVsRepo(tester);
          } else {
            selection.owner = $(`input:radio[name='owner']:checked`).val();
            if(selection.owner=="owner_other") selection.owner = $(`#other`).val().trim();
            selection.shared = $(`#shared`).prop('checked').toString();
            selection.published = $(`#published`).prop('checked').toString();
            let p = uploadWorkflow($("#workflow"));
            $.when(p).done(returnInfo => {
              let p_DBA = getAllDashboards();
              $.when(p_DBA).done(data => {
                processDBADashboards(data);
                $("#viewport").load("html/personaFlow/persona_list.html", () => {
                  fieldsetPainter();
                  highlightPersonaList(returnInfo);
                });
              });
            });
          }
        }
        break;
      }
      case "personaDelete": {
        $(this).val("Deleting...");
        $(this).prop('disabled', true);
        let id = $(this)[0].parentNode.id;
        let count = 1;
        let personaPrefix = $(this).parents(`section[data-type="persona"]`).attr("data-prefix");
        let usecasePrefix = $(this).parents(`section[data-type="usecase"]`).attr("data-prefix");

        let parts = id.split("-");
        let re = new RegExp(`${parts[0]}-${parts[1]}-${parts[2]}-[a-f0-9]{4}-${parts[4]}`);
        DBAdashboards.forEach(function (db) {
          if (re.test(db.id) && db.id != id) {
            count++;
          }
        });

        if (window.confirm("DELETE " + count + " dashboards? This cannot be undone...")) {
          let p_delete = deleteDashboards(id, re);
          $.when(p_delete).done(function () {
            let p_DBA = getAllDashboards();
            $.when(p_DBA).done(function (data) {
              processDBADashboards(data);
              $(this).val("Deleted");
              $("#viewport").load("html/personaFlow/persona_list.html", () => {
                fieldsetPainter();
                expandPersonaList([personaPrefix], [usecasePrefix]);
              });
            });
          });

        } else {
          $(this).val("Delete");
          $(this).prop('disabled', false);
        }
        break;
      }
      case "personaEdit": {
        let id = $(this)[0].parentNode.id;
        editWorkflow(id);
        break;
      }
      case "":
      case undefined:
        console.log("undefined button");
        break;
      default:
        //alert("Unknown Button: " + id);
        if (typeof dtrum !== "undefined") dtrum.reportCustomError("Unknown Button", id, undefined, true);
        console.log($(this));
    }
  } else console.log($(this));
}

function userjourneyNextStep(id) {
  switch (id) {
    case "deployFunnel-name-next":
      switch (selection.config.journeyOverview) {
        case 'OverviewFalse.json':
        case 'LiteOverviewFalse.json':
          $("#viewport").load("html/configurator/deployFunnel-funnel.html", fieldsetPainter);
          break;
        default:
          $("#viewport").load("html/configurator/deployFunnel-kpi.html", fieldsetPainter);
      }
      break;
    case "deployFunnel-kpi-next":
      $("#viewport").load("html/configurator/deployFunnel-funnel.html", fieldsetPainter);
      break;
    case "deployFunnel-funnel-next":
      $("#viewport").load("html/configurator/deployFunnel-filters.html", fieldsetPainter);
      break;
    case "deployFunnel-filters-next":
      $("#viewport").load("html/configurator/deployFunnel-compare.html", fieldsetPainter);
      break;
  }
}
