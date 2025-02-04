/*Copyright 2019 Dynatrace LLC
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
function fieldsetPainter(scope) {
    let id;
    if (typeof (scope) === "string") //normal callback style
        id = $(this).find("fieldset").attr("id");
    else if (typeof (scope) === "object" && "selector" in scope) //manual fire of fieldsetPainter
        id = $(scope.selector).find("fieldset").attr("id");
    if (typeof id === "undefined") //if we still don't have an id, go find one
        id = $("#viewport").find("fieldset").attr("id");
    bcHandler();
    switch (id) {
        case "repoconfig": {
            let saveNeeded = false;
            $("#saveRepoConfig").prop("disabled", true);
            $("#dbTagsVersion").val(dbTagsVersion);
            //$("#dbTO").val(dbTO);
            //$("#dbAO").val(dbAO);
            $("#USQLlimit").val(USQLlimit);

            updateOfflineButtons();


            //repos
            let repoOptions = "";
            for (let i = 0; i < repoList.length; i++) {
                let r = repoList[i];
                let html = `<tr><td>Repo #${i}:</td>
                <td class='right'><input type='text' class='repo_owner' data-index='${i}' value='${r.owner}'>
                 / <input type='text' class='repo_repo' data-index='${i}' value='${r.repo}${r.path.length > 0 ? "/" + r.path : ''}'>
                 <input type='button' class='removeRepo' data-index='${i}' value='-'></td></tr>`;
                $("#additionalRepos").after(html);
                repoOptions += `<option data-repo='${JSON.stringify(r)}'>${r.owner}/${r.repo}/${r.path}</option>`;
            }
            $("input.removeRepo").on("click", function () {
                let i = $(this)[0].dataset['index'];
                repoList.splice(i, 1);
                $("#repo_config").load("html/repo_config.html", fieldsetPainter);
            });
            $("fieldset#repoconfig input:not([type=button])").on("keyup blur change", () => {
                if (saveNeeded) return;
                else {
                    saveNeeded = true;
                    $("#saveRepoConfig").prop("disabled", false);
                }
            });

            if (PreviewWorkflows) $("#previewWorkflows").prop("checked", true);
            else $("#previewWorkflows").prop("checked", false);

            if (OfflineMode) $("#offlineMode").prop("checked", true);
            else $("#offlineMode").prop("checked", false);

            if (personaFlow) {
                $("#personaFlow").prop("checked", true);
                $(".oldFlow").hide();
            } else {
                $("#personaFlow").prop("checked", false);
                $(".oldFlow").show();

                for (let i = 0; i < tenantOverviews.length; i++) {
                    let TO = tenantOverviews[i];
                    let html = `<tr class="oldFlow"><td>TenantOverview #${i}:</td>
                    <td class='right'>
                    <select class='overview_repo' class="tenantOverview_repo" data-index='${i}'>
                        <option data-repo='${JSON.stringify(TO.repo)}' selected>${TO.repo.owner}/${TO.repo.repo}/${TO.repo.path}</option>
                        ${repoOptions}
                    </select>
                    <input type='text' class='tenantOverview_name' data-index='${i}' value='${TO.name}'>:
                    <input type='text' class='tenantOverview_filename' data-index='${i}' value='${TO.filename}'>
                    <input type='button' class='removeTenantOverview' data-index='${i}' value='-'>
                    </td></tr>`;
                    $("#tenantOverviews").after(html);
                }
                $("#add_tenantOverview_repo").html(repoOptions);
                $("input.removeTenantOverview").on("click", function () {
                    let i = $(this)[0].dataset['index'];
                    tenantOverviews.splice(i, 1);
                    $("#repo_config").load("html/repo_config.html", fieldsetPainter);
                });

                for (let i = 0; i < appOverviews.length; i++) {
                    let AO = appOverviews[i];
                    let html = `<tr class="oldFlow"><td>AppOverview #${i}:</td>
                    <td class='right'>
                    <select class='overview_repo' class="appOverview_repo" data-index='${i}'>
                        <option data-repo='${JSON.stringify(AO.repo)}' selected>${AO.repo.owner}/${AO.repo.repo}/${AO.repo.path}</option>
                        ${repoOptions}
                    </select>
                    <input type='text' class='appOverview_name' data-index='${i}' value='${AO.name}'>: 
                    <input type='text' class='appOverview_filename' data-index='${i}' value='${AO.filename}'>
                    <input type='button' class='removeAppOverview' data-index='${i}' value='-'>
                    </td></tr>`;
                    $("#appOverviews").after(html);
                }
                $("#add_appOverview_repo").html(repoOptions);
                $("input.removeAppOverview").on("click", function () {
                    let i = $(this)[0].dataset['index'];
                    appOverviews.splice(i, 1);
                    $("#repo_config").load("html/repo_config.html", fieldsetPainter);
                });

                for (let i = 0; i < journeyOverviews.length; i++) {
                    let JO = journeyOverviews[i];
                    let html = `<tr class="oldFlow"><td>JourneyOverview #${i}:</td>
                    <td class='right'>
                    <select class='overview_repo' class="journeyOverview_repo" data-index='${i}'>
                        <option data-repo='${JSON.stringify(JO.repo)}' selected>${JO.repo.owner}/${JO.repo.repo}/${JO.repo.path}</option>
                        ${repoOptions}
                    </select>
                    <input type='text' class='journeyOverview_name' data-index='${i}' value='${JO.name}'>: 
                    <input type='text' class='journeyOverview_filename' data-index='${i}' value='${JO.filename}'>
                    <input type='button' class='removeJourneyOverview' data-index='${i}' value='-'>
                    </td></tr>`;
                    $("#journeyOverviews").after(html);
                }
                $("#add_journeyOverview_repo").html(repoOptions);
                $("input.removeJourneyOverview").on("click", function () {
                    let i = $(this)[0].dataset['index'];
                    journeyOverviews.splice(i, 1);
                    $("#repo_config").load("html/repo_config.html", fieldsetPainter);
                });
            }
            break;
        }
        case "connect":
            $("#url").val(url);
            $("#token").val(token);
            $("div.bc").hide();
            break;
        case "main":
            $("#owner").text(owner);
            let p_DBA = getAllDashboards();
            if (personaFlow) $("#persona_list, #persona_deploy").show();
            else $("#persona_list, #persona_deploy").hide();

            $.when(p_DBA).done(function (data) {
                processDBADashboards(data);
                $("#numDBADashboards").text(DBAdashboards.length);
                jsonviewer(data);
            });
            break;
        case "deployApp": {
            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);

            let p0 = loadDashboard(configID("AOid" in selection ? selection.AOid : selection.TOid));
            $.when(p0).done(function (d1) {
                selection.config = parseConfigDashboard(d1);
                drawTimeInterval(("MyTime" in selection.config) ? selection.config.MyTime : "Last 2 hours");
                appOverviews.forEach(function (ov) {
                    $("#appOverview").append(
                        `<option value='${ov.filename}' data-repo='${JSON.stringify(ov.repo)}'>${ov.name}</option>`);
                });
                if ("appOverview" in selection.config) $("#appOverview").val(selection.config.appOverview);
                let p1 = getApps(selection.config.mz);
                let p2 = getApps();
                $.when(p1, p2).done(function (d1, d2) {
                    let appList = d1[0];
                    let compareAppList = d2[0];
                    jsonviewer([appList, compareAppList]);
                    drawApps(appList, selection.config);
                    appOverviewChangeHandler();
                    drawCompareApps(compareAppList, selection.config);
                    MyTimeChangeHandler();
                    if ("AOname" in selection.config) $("#appName").val(selection.config.AOname);
                    if ("MyCompareApp" in selection.config) $("#MyCompareApp").val(selection.config.MyCompareApp);
                    if ("rfc1918" in selection.config && selection.config.rfc1918) $("#rfc1918").prop("checked", "checked");
                    if ("ipClause" in selection.config) $("#ipClause").val(selection.config.ipClause);
                    if ("ipName" in selection.config) $("#ipName").val(selection.config.ipName);
                    if ("comparerfc1918" in selection.config && selection.config.comparerfc1918) $("#comparerfc1918").prop("checked", "checked");
                    if ("compareipClause" in selection.config) $("#compareipClause").val(selection.config.compareipClause);
                    if ("ipCompareName" in selection.config) $("#ipCompareName").val(selection.config.ipCompareName);
                    if ("comparerfc19182" in selection.config && selection.config.comparerfc19182) $("#comparerfc19182").prop("checked", "checked");
                    if ("compareipClause2" in selection.config) $("#compareipClause2").val(selection.config.compareipClause2);
                    if ("ipCompareName2" in selection.config) $("#ipCompareName2").val(selection.config.ipCompareName2);
                    appOverviewChangeHandler();
                });
            });
            $("#applist").on("change", function () { //autofill with app name
                if ($("#appName").val() == "")
                    $("#appName").val($("#appList option:selected").text());
            });
            $("#compareAppList").on("change", function () { //autofil with compare app name
                if ($("#MyCompareApp").val() == "")
                    $("#MyCompareApp").val($("#compareAppList option:selected").text());
            });

            break;
        }
        case "deployFunnel-name": {
            let p1 = (!selection.funnelLoaded ? loadDashboard(configID(selection.AOid)) : null);
            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);
            $("#AOid").text(selection.AOid);
            $("#AOname").text(DBAdashboards.find(x => x.id === selection.AOid).name);

            $.when(p1).done(function (data) {
                jsonviewer(data);
                if (!selection.funnelLoaded)
                    selection.config = parseConfigDashboard(data);
                $("#appName").text(selection.config.appName);
                $("#appID").text(selection.config.appID);
                journeyOverviews.forEach(function (ov) {
                    $("#journeyOverview").append(
                        `<option value='${ov.filename}' data-repo='${JSON.stringify(ov.repo)}'>${ov.name}</option>`);
                });
                if ("journeyOverview" in selection.config) $("#journeyOverview").val(selection.config.journeyOverview);
                if ("xapp" in selection.config) $("#xapp").prop('checked', selection.config.xapp);
                let p2 = xappChangeHandler();
                $.when(p2).done(function () {
                    if ("xapps" in selection.config) $("#xapp_apps").val(selection.config.xapps);
                });

                if ('funnelName' in selection.config) $("#funnelName").val(selection.config.funnelName);
            });
            break;
        }
        case "deployFunnel-kpi": {
            let teaser = `<img src="images/light-bulb-yellow_300.svg">
            Do you use Adobe Analytics, Google Analytics / Web properties, or Intercom?
            You can easily import properties from those platforms using &nbsp;<a
            href="https://www.dynatrace.com/support/help/shortlink/user-session-properties#property-packs" target="_blank" class="newTab">
            Property Packs <img src="images/link.svg"></a>.`;
            $("#teaser").html(teaser);
            $("#teaser").show();

            let p1 = getKPIs(selection.config.xapp ? selection.config.xapps : selection.config.appName);
            $("#bc-deployFunnel-name").text(selection.config.funnelName);

            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);
            $("#AOid").text(selection.AOid);
            $("#AOname").text(DBAdashboards.find(x => x.id === selection.AOid).name);
            $("#appName").text(selection.config.appName);
            $("#appID").text(selection.config.appID);

            $.when(p1).done(function (data) {
                jsonviewer(data);
                let kpis = parseKPIs(data);
                $("#usplist").html(drawKPIs(kpis));
                if (kpis.length == 0) {
                    let popheader = "No User Session Properties (long/double)";
                    let desc = "Please configure some User Session Properties ";
                    desc += `<a href="${url}/#applicationconfigurationsessionuseractionproperties;uemapplicationId=${selection.config.appID}"`
                        + ' class="newTab" target="_blank">here <img src="images/link.svg"></a>';
                    popup([], popheader, desc);
                }

                if ('kpi' in selection.config) $("#usplist").val(selection.config.kpi);
                if ('kpiName' in selection.config) $("#kpiName").val(selection.config.kpiName);
                uspListChangeHandler();
            });
            break;
        }
        case "deployFunnel-filters": {
            let teaser = `<img src="images/light-bulb-yellow_300.svg">
            Do you use Adobe Analytics, Google Analytics / Web properties, or Intercom?
            You can easily import properties from those platforms using &nbsp;<a
            href="https://www.dynatrace.com/support/help/shortlink/user-session-properties#property-packs" target="_blank" class="newTab">
            Property Packs <img src="images/link.svg"></a>.`;
            $("#teaser").html(teaser);
            $("#teaser").show();
            let p1 = getUSPs(selection.config.xapp ? selection.config.xapps : selection.config.appName);
            let p2 = getRegions(selection.config.xapp ? selection.config.xapps : selection.config.appName);

            $("#bc-deployFunnel-name").text(selection.config.funnelName);
            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);
            $("#AOid").text(selection.AOid);
            $("#AOname").text(DBAdashboards.find(x => x.id === selection.AOid).name);
            $("#appName").text(selection.config.appName);
            $("#appID").text(selection.config.appID);
            $("#kpi").text(selection.config.kpiName);

            $.when(p1, p2).done(function (d1, d2) {
                let usps = d1[0];
                let regions = d2[0];
                jsonviewer([usps, regions]);
                parseUSPFilter(usps);
                parseRegions(regions);
                regionsChangeHandler();
                uspFilterChangeHandler();
                if ("filterClause" in selection.config)
                    $(".filterClause").val(selection.config.filterClause);
            });
            break;
        }
        case "deployFunnel-compare": {
            $("#bc-deployFunnel-name").text(selection.config.funnelName);

            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);
            $("#AOid").text(selection.AOid);
            $("#AOname").text(DBAdashboards.find(x => x.id === selection.AOid).name);
            $("#appName").text(selection.config.appName);
            $("#appID").text(selection.config.appID);
            $("#kpi").text(selection.config.kpiName);
            drawTimeInterval(("MyTime" in selection.config) ? selection.config.MyTime : "Last 2 hours");

            if ("xapp" in selection.config && selection.config.xapp) {
                $("#xapp_compare").show();
                $("#compareApp").hide();
            }

            let p1 = getApps();
            $.when(p1).done(function (data) {
                jsonviewer(data);
                drawCompareApps(data, selection.config);

                if ('compareFunnel' in selection.config) $("#compareFunnel").val(selection.config.compareFunnel);
                if ('compareAppID' in selection.config) $("#compareAppList").val(selection.config.compareAppID);
                if ('campaignActive' in selection.config) $("#campaignActive").prop('checked', selection.config.campaignActive);
                if ('featureAdded' in selection.config) $("#featureAdded").prop('checked', selection.config.featureAdded);

                if ('xapp' in selection.config && selection.config.xapp) {
                    if ('xapp_compareAppID1' in selection.config) $("#compareAppList1").val(selection.config.xapp_compareAppID1);
                    if ('xapp_compareAppID2' in selection.config) $("#compareAppList2").val(selection.config.xapp_compareAppID2);
                }

                let p2 = compareAppChangeHandler();
                $.when(p2).done(function () {
                    if ('compareFirstStep' in selection.config) $("#compareFirstStep").val(selection.config.compareFirstStep.name);
                    if ('compareLastStep' in selection.config) $("#compareLastStep").val(selection.config.compareLastStep.name);
                    if ('compareRevenue' in selection.config) $("#compareRevenue").val(selection.config.compareRevenue);
                });
                let p3 = campaignChangeHandler();
                $.when(p3).done(function () {
                    if ('campaignStep1' in selection.config) $("#campaignStep1").val(selection.config.campaignStep1.name);
                    if ('promHeaderStep' in selection.config) $("#promHeaderStep").val(selection.config.promHeaderStep);
                });
                let p4 = featureChangeHandler();
                $.when(p4).done(function () {
                    if ('StepNewFeature1' in selection.config) $("#StepNewFeature1").val(selection.config.StepNewFeature1.name);
                    if ('FeatureHeaderStep' in selection.config) $("#FeatureHeaderStep").val(selection.config.FeatureHeaderStep);
                });
            });
            break;
        }
        case "deployFunnel-funnel": {
            let xapp = selection.config && "xapp" in selection.config && selection.config.xapp || false;
            let mobileHack = (!xapp && selection.config.appID.split('-')[0] == "APPLICATION" ? false : true);
            let p1 = getGoals(xapp ? selection.config.xapps : selection.config.appName);
            let p2 = getKeyActions(xapp ? selection.config.xapps : selection.config.appName, mobileHack);
            $("#bc-deployFunnel-name").text(selection.config.funnelName);

            //paint info we already have
            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);
            $("#AOid").text(selection.AOid);
            $("#AOname").text(DBAdashboards.find(x => x.id === selection.AOid).name);
            $("#appName").text(selection.config.appName);
            $("#appID").text(selection.config.appID);
            $("#kpi").text(selection.config.kpiName);
            $("#goallist").html("");

            //load the funnel and whereClause
            if ("funnelData" in selection.config) funnelData = selection.config.funnelData;
            else funnelData = [
                { label: 'Awareness', value: '', clauses: [] },
                { label: 'Interest', value: '', clauses: [] },
                { label: 'Evaluation', value: '', clauses: [] },
                { label: 'Decision', value: '', clauses: [] }
            ];
            chart.draw(funnelData, options);
            updateWhere(funnelData);
            if ("whereClause" in selection.config &&
                $("#whereClause").val() != selection.config.whereClause) {
                pencilToggle(true);
                $("whereClause").val(selection.config.whereClause);
            }

            //once XHRs are finished, do some stuff
            $.when(p1, p2).done(function (data1, data2) {
                if (data1[0].values.length == 0 && data2[0].values.length == 0) {
                    let popheader = "No Key User Actions or Conversion Goals";
                    let desc = "Please configure some Key User Actions and/or Conversion Goals ";
                    desc += `<a href="${url}/#uemapplications/performanceanalysis;uemapplicationId=${selection.config.appID}"`
                        + ' class="newTab" target="_blank">here <img src="images/link.svg"></a>';
                    popup([], popheader, desc);
                }
                drawSteps(parseSteps(data2[0]), "#goallist", xapp);
                drawSteps(parseSteps(data1[0]), "#goallist", xapp);
                $("#goallist li").draggable();
                jsonviewer([data1[0], data2[0]]);
            });
            break;
        }
        case "deployFunnel-finish":
            $("#bc-deployFunnel-name").text(selection.config.funnelName);

            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);
            $("#AOid").text(selection.AOid);
            $("#AOname").text(DBAdashboards.find(x => x.id === selection.AOid).name);
            $("#appName").text(selection.config.appName);
            $("#appID").text(selection.config.appID);
            $("#kpi").text(selection.config.kpiName);
            $("#finalWhereClause").text(selection.config.whereClause);

            $("#deployFunnel-finish").append("Uploaded: <a target='_blank' href='" + url + "/#dashboard;id=" + selection.config.FOid + ";gf=defaultManagementZone' class='newTab'>" +
                selection.config.dashboardName + " <img src='images/link.svg'></a>");
            break;
        case "deployTenant":
            drawMZs();

            tenantOverviews.forEach(function (ov) {
                $("#tenantOverview").append(
                    `<option value="${ov.filename}" data-repo='${JSON.stringify(ov.repo)}'>${ov.name}</option>`);
            });
            if ("tenantOverview" in selection.config) {
                $("#tenantOverview").val(selection.config.tenantOverview);
            }
            tenantOverviewChangeHandler();
            break;
        case "listApp": {
            let p_DBA = getAllDashboards();
            $("#TOid").text(selection.TOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);

            $.when(p_DBA).done(function (data) {
                processDBADashboards(data);
                drawAppOverviewList(selection.TOid);
                jsonviewer(DBAdashboards); //do NOT display raw dashboard list
                if (version < 183) $("#updateAppForecast").hide();
                else $("#updateAppForecast").show();
            });
            break;
        }
        case "listFunnel": {
            let p_DBA = getAllDashboards();
            $("#TOid").text(selection.TOid);
            $("#AOid").text(selection.AOid);
            $("#TOname").text(DBAdashboards.find(x => x.id === selection.TOid).name);
            $("#AOid").text(selection.AOid);
            $("#AOname").text(DBAdashboards.find(x => x.id === selection.AOid).name);

            $.when(p_DBA).done(function (data) {
                processDBADashboards(data);
                drawFunnelList(selection.AOid);
                jsonviewer(DBAdashboards); //do NOT display raw dashboard list
                if (version < 183) $("#updateFunnelForecast").hide();
                else $("#updateFunnelForecast").show();
            });
            break;
        }
        case "listTenant": {
            let p_DBA = getAllDashboards();

            $.when(p_DBA).done(function (data) {
                processDBADashboards(data);
                drawTenantOverviewList();
                jsonviewer(DBAdashboards); //do NOT display raw dashboard list
            });
            break;
        }
        case "dashboardList": {
            let viewerObj = {};
            let $wf_ul = $("#dashboardList ul")
            $wf_ul.html("");
            if (workflowList.length) $(`#recycleDBs`).hide();
            else $(`#recycleDBs`).show();
            workflowList
                .sort((a, b) => (a.file.config.workflowName.toLowerCase() > b.file.config.workflowName.toLowerCase()) ? 1 : -1)
                .forEach((wf, i) => {
                    let $wf_li = $("<li>");
                    let $wf_li_a = $("<a>")
                        .addClass("dashboardList")
                        .attr("href", "#json")
                        .attr("data-index", i)
                        .text(wf.file.config.workflowName)
                        .appendTo($wf_li);
                    $wf_li.appendTo($wf_ul);
                    $wf_li_a.on("click", function () {
                        if ($wf_li_a.hasClass("open")) {
                            $wf_li_a.removeClass("open");
                            $wf_li_a.detach();
                            $wf_li.empty();
                            $wf_li_a.appendTo($wf_li);
                            //jsonviewer({ config: wf.file.config },
                            //    true, wf.file.config.workflowName, "#popupjsonviewer");
                            // Closing an open workflow
                            viewerObj = {};
                            workflowViewer(viewerObj, "", target = "#popupjsonviewer", show = "Blank")
                        } else {
                            let tokenList = new Set();
                            $wf_li_a.addClass("open");
                            let ov = dbList.find((x) =>
                                x.name === wf.file.config.overviewDB
                                && x.repo.owner === wf.file.config.githubUser
                                && x.repo.repo === wf.file.config.githubRepo
                                && x.repo.path === wf.file.config.githubPath
                            );
                            if (typeof (ov) === "undefined") {
                                console.log(`ERROR: unable to match OV - ${wf.file.config.overviewDB}`);
                                return false;
                            }
                            let $wf_ov_a = $("<a>")
                                .addClass("dashboardList")
                                .attr("href", "#json")
                                .text(ov.name)
                                .appendTo($wf_li);
                            $wf_ov_a.before(" - (");
                            $wf_ov_a.after(")");
                            $wf_ov_a.on("click", function () {
                                //jsonviewer(ov.file, true, ov.file.dashboardMetadata.name, "#popupjsonviewer");
                                viewerObj = ov.file;
                                viewerObj = {
                                    json: ov.file,
                                    config: wf.file.config,
                                    tokens: tokenList,
                                    readme: findWorkflowReadme(wf)
                                }
                                workflowViewer(viewerObj, ov.name, target = "#popupjsonviewer", show = "JSON")
                            });
                            let $ov_ul = $("<ul>")
                                .appendTo($wf_li);
                            let subs = getStaticSubDBs(ov.file)
                                .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
                            subs.forEach((sub) => {
                                let $sub_li = $("<li>")
                                    .appendTo($ov_ul);
                                let $sub_li_a = $("<a>")
                                    .addClass("dashboardList")
                                    .attr("href", "#json")
                                    .text(sub.name)
                                    .appendTo($sub_li);
                                $sub_li_a.on("click", function () {
                                    //jsonviewer(sub.file, true, sub.file.dashboardMetadata.name, "#popupjsonviewer");
                                    //viewerObj = sub.file;
                                    viewerObj = {
                                        json: sub.file,
                                        config: wf.file.config,
                                        tokens: tokenList,
                                        readme: findWorkflowReadme(wf)
                                    }
                                    workflowViewer(viewerObj, sub.file.dashboardMetadata.name, target = "#popupjsonviewer", show = "JSON")
                                });
                                tokenList = new Set([...tokenList, ...scanForTokens(sub.file)]);
                            });
                            tokenList = new Set([...tokenList, ...scanForTokens(ov.file)]);
                            tokenList = Array.from(tokenList)
                                .sort((a, b) => (a.toLowerCase() > b.toLowerCase()) ? 1 : -1)
                            /*jsonviewer({
                                config: wf.file.config, tokens: tokenList
                            },
                                true, wf.file.config.workflowName, "#popupjsonviewer");*/
                            viewerObj = {
                                json: { config: wf.file.config, tokens: tokenList },
                                config: wf.file.config,
                                tokens: tokenList,
                                readme: findWorkflowReadme(wf)
                            }
                            workflowViewer(viewerObj, wf.file.config.workflowName, target = "#popupjsonviewer", show = "Readme")
                        }
                    });
                });
            break;
        }
        case "dashboardList_old": {
            let html = "";
            let list = [].concat(tenantOverviews, appOverviews, journeyOverviews);
            let topLevelIDs = [];
            let usedIndexes = [];
            let tokenList = new Set();
            //get list of topLevelIDs
            list.forEach(function (overview) {
                let i = dbList.findIndex(({ name }) => name === overview.filename);
                if (i > -1) topLevelIDs.push(dbList[i].file.id);
            });
            //traverse the list building sub dashboard list
            list.forEach(function (overview) {
                let i = dbList.findIndex(({ name }) => name === overview.filename);
                usedIndexes.push(i);
                if (i < 0) {
                    html += "<li>" + overview.name + " (" + overview.filename + ")</li>";
                } else {
                    html += "<li>" + overview.name + " - (<a class='dashboardList' href='#json' data-index='" + i + "'>" + overview.filename + "</a>):<br><ul>"
                    let subs = getStaticSubDBs(dbList[i].file, topLevelIDs);
                    tokenList = new Set([...tokenList, ...scanForTokens(dbList[i].file)]);
                    subs.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
                    subs.forEach(function (s) {
                        let j = dbList.findIndex(({ name }) => name === s.name);
                        usedIndexes.push(j);
                        tokenList = new Set([...tokenList, ...scanForTokens(s.file)]);
                        html += "<li><a class='dashboardList' href='#json' data-index='" + j + "'>" + s.name + "</a></li>"
                    });
                    html += "</ul></li>";
                }
            });
            //find a list of orphans
            let orphanIndexes = [];
            for (let i of dbList.keys()) {
                if (!usedIndexes.includes(i)) orphanIndexes.push(i);
            }
            if (orphanIndexes.length > 0) {
                html += "<li>Orphan Dashboards:<br><ul>";
                orphanIndexes.forEach(function (i) {
                    html += "<li><a class='dashboardList' href='#json' data-index='" + i + "'>" + dbList[i].name + "</a></li>"
                });
                html += "</ul></li>";
            }
            if (tokenList.size > 0) {
                html += "<li>Token List:<br><ul>";
                tokenList.forEach(function (t) {
                    html += `<li>${t}</li>`;
                });
                html += "</ul></li>";
            }
            $("#dashboardList ul").html(html);
            $("#dashboardList ul").on("click", "a", function () {
                let i = $(this)[0].dataset['index'];
                jsonviewer(dbList[i].file,
                    true,
                    `${dbList[i].repo.owner}/${dbList[i].repo.repo}/${dbList[i].name}`, "#popupjsonviewer");
            });
            break;
        }
        case "dashboardCleanup": {
            let p1 = getAllDashboards();

            $.when(p1).done(function (data) {
                let allDBs = data["dashboards"];

                //get owners and number of dashboards
                let owners = new Map();
                for (const x of allDBs) {
                    if (!owners.has(x.owner)) {
                        let data = {
                            count: 1,
                            dbids: [x.id]
                        }
                        owners.set(x.owner, data);
                    }
                    else {
                        let data = owners.get(x.owner);
                        data.count++;
                        data.dbids.push(x.id);
                        owners.set(x.owner, data);
                    }
                }

                //sort
                owners = new Map(Array
                    .from(owners)
                    .sort((a, b) => b[1].count - a[1].count));
                allDBs.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);


                //sum 
                let total = [...owners].reduce((acc, val) => acc + val[1].count, 0);

                //print out the list of owners and counts
                let html = "";
                for (let [owner, data] of owners) {
                    html += `<li><input type="checkbox" data-owner="${owner}" data-dbids='${JSON.stringify(data.dbids)}'>
                    <a href="#dashboardCleanup-owner" class="dashboardCleanup-owner" data-owner="${owner}">${owner == "" ? "<no owner>" : owner}: ${data.count}</a></li>`;
                }
                $("#ownerlist ul").html(html);
                $("#total").text(total);
                $("#owners").text(owners.size);

                //listener
                $("#ownerlist ul").on("click", "a", function () {
                    let owner = $(this)[0].dataset['owner'];
                    $("#dashboardlist h3").text(owner);
                    let dbhtml = ``;
                    for (let i = 0; i < allDBs.length; i++) {
                        if (allDBs[i].owner == owner) {
                            dbhtml += `<li><input type="checkbox" data-dbid="${allDBs[i].id}">
                        <a href="#dashboardCleanup-db" class="dashboardCleanup-db" data-owner="${owner}" data-index="${i}">${allDBs[i].name}</a></li>`
                        }
                    }
                    $("#dashboardlist ul").html(dbhtml);
                });

                //listener
                $("#dashboardlist ul").on("click", "a", function () {
                    let index = $(this)[0].dataset['index'];
                    let p1 = loadDashboard(allDBs[index].id);

                    $.when(p1).done(function (data) {
                        jsonviewer(data, true, allDBs[index].name, "#cleanupjsonviewer");
                    });
                });

            });
            break;
        }
        case "persona_usecase_selection": {
            workflowPickerChangeHandler();
            break;
        }
        case "persona_usecase_selection_owner": {
            workflowPickerOwnerChangeHandler();
            break;
        }
        case "persona_usecase_selection_all": {
            workflowPickerAllChangeHandler();
            break;
        }
        case "persona_user_inputs": {
            let p = renderWorkflow(selection.workflow.file.html);
            $.when(p).done(function (html) {
                if(html.includes('id="workflow"'))
                    $("#workflow").replaceWith(html);
                else     
                    $("#workflow").html(html);
                workflowSetFirstPageActive();
                let activePage = $("#workflow .workflowPage.activePage");
                renderWorkflowPage(activePage);
                drawWorkflowPagerButton();
            });
            break;
        }
        case "persona_list":
            let deployedPersonas = personaDBs
                //.sort((a,b) => a.)
                .map(({ id }) => id.split("-")[1]).filter(unique);
            let html = "";

            deployedPersonas.forEach(function (personaPrefix) {
                let persona = personas.find(({ prefix }) => prefix === personaPrefix);
                let startPersonaHtml = `<section data-type="persona" data-prefix="${personaPrefix}"><a class="expandable">${persona.name}</a><article>`;
                let endPersonaHtml = `</article></section>`;

                let filteredDBs = personaDBs.filter(db => db.id.split("-")[1] === personaPrefix);
                let deployedUsecases = filteredDBs.map(({ id }) => id.split("-")[2]).filter(unique);
                deployedUsecases.forEach(function (usecasePrefix) {
                    let usecase = usecases.find(({ prefix }) => prefix === usecasePrefix);
                    let startUsecaseHtml = `<section data-type="usecase" data-prefix="${usecasePrefix}"><a class="expandable">${usecase.name}</a><article><div id="tenantList"><dl class="list">`;
                    let endUsecaseHtml = `</dl></div></article></section>`;

                    let filteredDBs2 = filteredDBs.filter(db => db.id.split("-")[2] === usecasePrefix);
                    filteredDBs2.forEach(function (db) {
                        let dbHtml = `
                        <dt><a target='_blank' href='${url}/#dashboard;id=${db.id};gf=defaultManagementZone;gtf=defaultTimeFrame' class='newTab'>
                        ${db.name} <img src='images/link.svg'></a> (${db.owner})</dt>
                        <dd id="${db.id}">
                            <input type="button" id="personaEdit" value="Edit">
                            <input type="button" id="personaDelete" value="Delete">
                        </dd>`;
                        startUsecaseHtml += dbHtml;
                    })
                    startPersonaHtml += startUsecaseHtml + endUsecaseHtml;
                });
                html += startPersonaHtml + endPersonaHtml;
            });
            $("#personaDeployedList").html(html);
            break;
        case "workflowBuilder":
            $(".workflowSectionPopup, .workflowInputPopup").addClass("hidden");
            workflowSetFirstPageActive();
            break;
        case undefined:
            break;
        default:
            console.log("Unknown Fieldset: " + id);
    }
}

function bcHandler() {
    $("#bcwrapper").empty();
    $("div.bc").prependTo($("#bcwrapper"));
    $("#bc-connect").text(tenantID);
    if ($("#bcwrapper").children().length) $("#bcwrapper").show();
    else $("#bcwrapper").hide();
}

function updateOfflineButtons() {
    if (dbList.length) $("#downloadOfflinePack").prop("disabled", false);
    else $("#downloadOfflinePack").prop("disabled", true);
    if (dbList.length) $("#uploadOfflinePack").prop("disabled", true);
    else $("#uploadOfflinePack").prop("disabled", false);
    if (dbList.length) $("#reloadDBs").val("Reload Dashboards");
    else $("#reloadDBs").val("Load Dashboards");
}

function highlightPersonaList(returnedInfo) {
    let $dd = $(`#${returnedInfo.id}`);
    if ($dd.length) {
        $dd.prev().children("a").addClass("justAdded");
        $dd.parents('section').addClass("expanded");
    } else {
        let $list = $(`#personaDeployedList`);
        if ($list.length) {
            let dbHtml = `
                <dt><a target='_blank' href='${url}/#dashboard;id=${returnedInfo.id};gf=defaultManagementZone;gtf=defaultTimeFrame' class='newTab justAdded'>
                ${returnedInfo.name} <img src='images/link.svg'></a> (${returnedInfo.owner})</dt>
                <dd id="${returnedInfo.id}">
                    <input type="button" id="personaEdit" value="Edit">
                    <input type="button" id="personaDelete" value="Delete">
                </dd>`;
            let $dl = $('<dl>')
                .addClass('list')
                .html(dbHtml)
                .css("margin-top", "5px")
                .css("margin-top", "-10px")
                .prependTo($list);
            $('<div>')
                .html("Just added:")
                .css("margin-top", "15px")
                .insertBefore($dl);
        }
    }
}

function expandPersonaList(personaPrefixList = [], usecasePrefixList = []) {
    personaPrefixList.forEach(prefix => {
        $(`section[data-type="persona"][data-prefix=${prefix}]`).addClass("expanded");
    });
    usecasePrefixList.forEach(prefix => {
        $(`section[data-type="usecase"][data-prefix=${prefix}]`).addClass("expanded");
    });
}

function workflowViewer(obj = {}, title = "", target = "#popupjsonviewer", show = "Readme") {
    let fail = false;
    let $target = $(target);
    $target.html(`
    <div id="popupjsonviewermenu">
        <span id="title"></span>
        <select id="show">
            <option>Readme</option>
            <option>Config</option>
            <option>Tokens</option>
            <option>JSON</option>
        </select>
    </div>
    <div id="popupjsonviewercontent"></div>
    `);
    $(`#title`).text(title);
    let $show = $("#show")
        .val(show)
        .on("change", (e) => {
            let newShow = $show.val();
            workflowViewer(obj, title, target, newShow);
        });
    let $content = $(`#popupjsonviewercontent`);


    switch (show) {
        case "Blank":
            $content.html(``);
            break;
        case "JSON":
            if ("json" in obj) {
                jsonviewer(obj.json, true, null, "#popupjsonviewercontent");
            } else fail = true;
            break;
        case "Config":
            if ("config" in obj) {
                jsonviewer(obj.config, true, null, "#popupjsonviewercontent");
            } else fail = true;
            break;
        case "Tokens":
            if ("tokens" in obj) {
                jsonviewer(obj.tokens, true, null, "#popupjsonviewercontent");
            } else fail = true;
            break;
        case "Readme":
        default:
            if ("readme" in obj) {
                let readme = obj.readme;
                if (readme) $content.html(readme.html);
            } else fail = true;
            break;
    }
    if (fail) {
        console.log("workflowViewer failure, blanking...");
        $content.html(``);
    }
}

function editWorkflow(id) {
    let p1 = loadDashboard(workflowConfigID(id));

    $.when(p1).done(function (data) {
        selection = {};
        let configData = parseConfigDashboard(data);
        
        if ("selection" in configData) {
            let workflow = workflowList.find(x =>
                x.name === configData.selection.workflow.name
                && x.repo.owner === configData.selection.workflow.repo.owner
                && x.repo.repo === configData.selection.workflow.repo.repo
                && x.repo.path === configData.selection.workflow.repo.path
            );

            selection = configData.selection;
            selection['workflow']['loadedFromConfigDB'] = true;
            selection['workflow']['originalID'] = id;
            if(workflow != undefined){
                if(workflow.sha !== configData.selection.workflow.sha){
                    warningbox(new Error("Saved workflow does not match current version. Attempting to merge..."));
                    selection.workflow = JSON.parse(JSON.stringify(workflow));
                } 
            } else {
                logError("WARN:",new Error("Editing workflow that is no longer in the list... "));
            }
        } else {
            errorbox("Config dashboard doesn't match current format.")
        }

        //selection.funnelLoaded = true;
        $("#viewport").load("html/personaFlow/persona_userInputs.html", fieldsetPainter);
    });
}