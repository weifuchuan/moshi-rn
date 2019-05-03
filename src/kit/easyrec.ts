import {GET} from './req';

const xml2js = require('react-native-xml2js')

interface Config {
  serverUrl: string;
  tenantid: string;
  token: string;
  apikey: string;
  sessionid: string;
}

const config: Config = {
  serverUrl: '',
  tenantid: '',
  token: '',
  apikey: '',
  sessionid: ''
};

export async function initEasyrecConfig() {
  const resp = await GET<Config>('/easyrec');
  Object.assign(config, resp.data);
}

// http://easyrec.org/implement
export class EasyrecAPI {
  static async mostvieweditems() {
    // http://123.207.28.107:9090/easyrec/api/1.1/mostvieweditems?apikey=e9ede1d7cd9422b30a2b500394aa9770&tenantid=moshi&timeRange=ALL&requesteditemtype=COURSE
    const resp=await GET<string>(config.serverUrl.trim() + "/api/1.1/mostvieweditems", {
      apikey: config.apikey,
      tenantid: config.tenantid,
      timeRange: "ALL",
      requesteditemtype: "COURSE"
    }, {responseType: "text"});
    const xml=resp.data;

  }

  static async view(params: {
    sessionid?: string; // session id of a user. (e.g. "F3D4E3BE31EE3FA069F5434DB7EC2E34")
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    itemdescription: string; // item description that is displayed when showing recommendations on your Website. (e.g. "the frog")
    itemurl: string; // url that links to the item page on your Website. Note:Please encode &'s in url with %26
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    itemimageurl?: string; // An optional item image url that links to a image of the item. Note:Please encode &'s in url with %26
    actiontime?: string; // An optional action time parameter that overwrites the current timestamp of the action. The parameter has the format "dd_MM_yyyy_HH_mm_ss" (e.g."01_01_2009_23_59_59").
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    actioninfo?: string; // an arbitraray valid JSON object with additional information about he action. The JSON string may be up to 500 characters long.
  }) {
    if (!params.sessionid) params.sessionid = config.sessionid;
    return await get('/api/1.1/view', params);
  }

  static async buy(params: {
    sessionid?: string; // session id of a user. (e.g. "F3D4E3BE31EE3FA069F5434DB7EC2E34")
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    itemdescription: string; // item description that is displayed when showing recommendations on your Website. (e.g. "the frog")
    itemurl: string; // url that links to the item page on your Website. Note:Please encode &'s in url with %26
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    itemimageurl?: string; // An optional item image url that links to a image of the item. Note:Please encode &'s in url with %26
    actiontime?: string; // An optional action time parameter that overwrites the current timestamp of the action. The parameter has the format "dd_MM_yyyy_HH_mm_ss" (e.g."01_01_2009_23_59_59").
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    actioninfo?: string; // an arbitraray valid JSON object with additional information about he action. The JSON string may be up to 500 characters long.
  }) {
    if (!params.sessionid) params.sessionid = config.sessionid;
    return await get('/api/1.1/buy', params);
  }

  static async rate(params: {
    sessionid?: string; // session id of a user. (e.g. "F3D4E3BE31EE3FA069F5434DB7EC2E34")
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    itemdescription: string; // item description that is displayed when showing recommendations on your Website. (e.g. "the frog")
    itemurl: string; // url that links to the item page on your Website. Note:Please encode &'s in url with %26
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    itemimageurl?: string; // An optional item image url that links to a image of the item. Note:Please encode &'s in url with %26
    ratingvalue: string; // A required rating value for the item. The value must be an integer in the range from 1 to 10 (e.g. 5)
    actiontime?: string; // An optional action time parameter that overwrites the current timestamp of the action. The parameter has the format "dd_MM_yyyy_HH_mm_ss" (e.g."01_01_2009_23_59_59").
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    actioninfo?: string; // an arbitraray valid JSON object with additional information about he action. The JSON string may be up to 500 characters long.
  }) {
    if (!params.sessionid) params.sessionid = config.sessionid;
    return await get('/api/1.1/rate', params);
  }

  static async sendaction(params: {
    sessionid?: string; // session id of a user. (e.g. "F3D4E3BE31EE3FA069F5434DB7EC2E34")
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    itemdescription: string; // item description that is displayed when showing recommendations on your Website. (e.g. "the frog")
    itemurl: string; // url that links to the item page on your Website. Note:Please encode &'s in url with %26
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    itemimageurl?: string; // An optional item image url that links to a image of the item. Note:Please encode &'s in url with %26
    actiontype: string; // the actiontype of the action you want to send. You have to creation actiontypes using the admin GUI before you can use it in API calls.
    actionvalue?: string; // If your actiontype uses actionvalues this parameter is required. It is used to save the actionvalue of your action.
    actiontime?: string; // An optional action time parameter that overwrites the current timestamp of the action. The parameter has the format "dd_MM_yyyy_HH_mm_ss" (e.g."01_01_2009_23_59_59").
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    actioninfo?: string; // an arbitraray valid JSON object with additional information about he action. The JSON string may be up to 500 characters long.
  }) {
    if (!params.sessionid) params.sessionid = config.sessionid;
    return await get('/api/1.1/sendaction', params);
  }

  static async track(params: {
    sessionid?: string; // session id of a user. (e.g. "F3D4E3BE31EE3FA069F5434DB7EC2E34")
    itemfromid?: string; // id to identify the item currently displayed on your website. (e.g. "ID001") In case there is no specific item displayed on the page (e.g. an overview page where you display rankings) this parameter can be left out.
    itemfromtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    itemtoid: string; // the id of the recommended item that was clicked on
    itemtotype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    rectype: "VIEWED_TOGETHER" | "RANKING" | "CLUSTER" | "HISTORY"; // either the association type that was used to display the recommendation (e.g. VIEWED_TOGETHER) or one of the following values: RECS_FOR_USER in case the recommended item came from the recommendationsforuser call; RANKING in case the recommended item came from a ranking call (e.g. mostvieweditems); CLUSTER in case the recommended item came from a ranking call (e.g. itemsofcluster); HISTORY in case the recommended item came from the actionhistoryforuser call.
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
  }) {
    if (!params.sessionid) params.sessionid = config.sessionid;
    return await get('/api/1.1/json/track', params);
  }

  static async other_users_also_viewed(params: {
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    numberOfResults?: string; // An optional parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.) you are looking for. If not supplied the default value ITEM will be used.
    requesteditemtype?: string; // An optional type of an item (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // If this parameter is set to true the result contains an additional element 'profileData' with the item profile.
  }) {
    return await get('/api/1.1/otherusersalsoviewed', params);
  }

  static async other_users_also_bought(params: {
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    numberOfResults?: string; // An optional parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.) you are looking for. If not supplied the default value ITEM will be used.
    requesteditemtype?: string; // An optional type of an item (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // If this parameter is set to true the result contains an additional element 'profileData' with the item profile.
  }) {
    return await get('/api/1.1/otherusersalsobought', params);
  }

  static async items_rated_good_by_other_users(params: {
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    numberOfResults?: string; // An optional parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.) you are looking for. If not supplied the default value ITEM will be used.
    requesteditemtype?: string; // An optional type of an item (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // If this parameter is set to true the result contains an additional element 'profileData' with the item profile.
  }) {
    return await get('/api/1.1/itemsratedgoodbyotherusers', params);
  }

  static async related_items(params: {
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    numberOfResults?: string; // An optional parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.) you are looking for. If not supplied the default value ITEM will be used.
    requesteditemtype?: string; // An optional type of an item (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // If this parameter is set to true the result contains an additional element 'profileData' with the item profile.
  }) {
    return await get('/api/1.1/relateditems', params);
  }

  static async recommendations_for_user(params: {
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    userid?: string; // anonymised id of a user. (e.g. "24EH1723322222A3")
    numberOfResults?: string; // parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    itemtype?: string; // item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.) you are looking for. If not supplied the default value ITEM will be used.
    requesteditemtype?: string; // item type (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // If this parameter is set to true the result contains an additional element 'profileData' with the item profile.
  }) {
    return await get('/api/1.1/recommendationsforuser', params);
  }

  static async action_history_for_user(params: {
    userid?: string; // anonymised id of a user. (e.g. "24EH1723322222A3")
    numberOfResults?: string; // parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    itemtype?: string; // item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.) you are looking for. If not supplied the default value ITEM will be used.
    requesteditemtype?: string; // item type (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    actiontype?: string; // thte type of actions in the history
  }) {
    return await get('/api/1.1/actionhistoryforuser', params);
  }

  static async most_viewed_items(params: {
    numberOfResults?: string; // parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    requesteditemtype?: string; // item type (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    timeRange?: string; // parameter to determine the time range. This parameter may be set to one of the following values: DAY: most viewed items within the last 24 hours. WEEK: most viewed items within the last week. MONTH: most viewed items within the last month. ALL (default): if no value or this value is given, the most viewed items of all time will be shown
    clusterid?: string; // the type of actions in the history
  }) {
    return await get('/api/1.1/mostvieweditems', params);
  }

  static async most_bought_items(params: {
    numberOfResults?: string; // parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    requesteditemtype?: string; // item type (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // parameter to determine the time range. This parameter may be set to one of the following values: DAY: most viewed items within the last 24 hours. WEEK: most viewed items within the last week. MONTH: most viewed items within the last month. ALL (default): if no value or this value is given, the most viewed items of all time will be shown
    clusterid?: string; // the type of actions in the history
  }) {
    return await get('/api/1.1/mostboughtitems', params);
  }

  static async most_rated_items(params: {
    numberOfResults?: string; // parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    requesteditemtype?: string; // item type (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // parameter to determine the time range. This parameter may be set to one of the following values: DAY: most viewed items within the last 24 hours. WEEK: most viewed items within the last week. MONTH: most viewed items within the last month. ALL (default): if no value or this value is given, the most viewed items of all time will be shown
    clusterid?: string; // the type of actions in the history
  }) {
    return await get('/api/1.1/mostrateditems', params);
  }

  static async best_rated_items(params: {
    numberOfResults?: string; // parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    requesteditemtype?: string; // item type (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // parameter to determine the time range. This parameter may be set to one of the following values: DAY: most viewed items within the last 24 hours. WEEK: most viewed items within the last week. MONTH: most viewed items within the last month. ALL (default): if no value or this value is given, the most viewed items of all time will be shown
    clusterid?: string; // the type of actions in the history
  }) {
    return await get('/api/1.1/bestrateditems', params);
  }

  static async worst_rated_items(params: {
    numberOfResults?: string; // parameter to determine the number of results returned.
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    requesteditemtype?: string; // item type (e.g. IMAGE, VIDEO, BOOK, etc.) to filter the returned items. If not supplied the default value ITEM will be used.
    withProfile?: string; // parameter to determine the time range. This parameter may be set to one of the following values: DAY: most viewed items within the last 24 hours. WEEK: most viewed items within the last week. MONTH: most viewed items within the last month. ALL (default): if no value or this value is given, the most viewed items of all time will be shown
    clusterid?: string; // the type of actions in the history
  }) {
    return await get('/api/1.1/worstrateditems', params);
  }

  static async clusters(params: {}) {
    return await get('/api/1.1/clusters', params);
  }

  static async items_of_cluster(params: {
    clusterid: string; // The response will contain the items of the cluster with the required id used here. Note: the clusterid is the name of the cluster.
    numberOfResults?: string; // parameter to determine the number of results returned. (e.g. 10)
    offset?: string; // An optional 0-based index to specify with which item to start the result - useful for paging.
    strategy?: string; // An optional parameter that allows you to specify a strategy based on which the items are selected from the given cluster. Valid values are RANDOM, NEWEST and BEST.RANDOM: returns random items that belong to the given cluster NEWEST: returns the items of a cluster sorted that the items added more recently are at the top of the list BEST: returns the items with the highest association to the given cluster at the top of the list (Note: currently only useful with plugin generated clusters; items added via the Admin GUI or CSV upload all have the same association to a cluster) The default strategy is NEWEST.
    usefallback?: string; // Clusters can be organized in a hierarchical way in the Admin GUI to take the form of a tree. If this usefallback is set to true, easyrec tries to traverse the cluster hierarchy and adds items from sibling and parent clusters to the returned recommendation in case the given cluster only has less that numberOfResults matching items.
    requesteditemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    withProfile?: string; // If this parameter is set to true the result contains an additional element 'profileData' with the item profile.
  }) {
    return await get('/api/1.1/itemsofcluster', params);
  }

  static async create_cluster(params: {
    token: string; // The required security token to access this service. This token is only valid for the current session. Note: The token invalidates, if you sign out
    clusterid: string; // The cluster id to identify the cluster. Note: the clusterid is the name of the cluster.
    clusterdescription?: string; // A short text which describes the cluster.
    clusterparent?: string; // The cluster ID of the parent cluster. If this parameter is not provided the cluster will be added as child to the root cluster "CLUSTERS".
  }) {
    return await get('>/api/1.1/createcluster', params);
  }

  static async General_Information(params: {
    token: string; // The required security token ("b08f41cfa92b430538146cf474116c6d") to access this service. This token is only valid for the current session.Note: The token invalidates, if you sign out.
    itemfromid: string; // A required base item id for the relation (e.g. "ID001")
    itemtoid: string; // A required partner item id for the relation (e.g. "ID003")
    assocvalue: string; // A required association value (0-100) to describe the relation strength between the two items. (e.g. "95.443"). Note:If you want to "delete" an imported rule, simply pass 0.0 as assoc value and the rule will not be shown in any recommendation, as long the ruleminer did not compute the same rule. If the same rule was computed or imported by different sources the average assoc value is taken. For example: the ruleminer computed a rule between item A and B with an association value of 50. Then a rule for the same two items with an asooc value of 100 is manually imported. The final association strength between the two items will be 75.
    assoctype: string; // A required association type. This parameter may be set to one of the following predefined values: VIEWED_TOGETHER, BOUGHT_TOGETHER, GOOD_RATED_TOGETHER, IS_RELATED. You can add more arbitrary accoy types using the Admin GUI.
    itemfromtype?: string; // item type that denotes the type of the base item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
    itemtotype?: string; // item type that denotes the type of the partner item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
  }) {
    return await get('/api/1.1/importrule', params);
  }

  static async import_update_item(params: {
    token: string; // The required security token ("b08f41cfa92b430538146cf474116c6d") to access this service. This token is only valid for the current session.Note: The token invalidates, if you sign out.
    itemid: string; // id to identify an item on your Website. (e.g. "ID001")
    itemdescription: string; // item description that is displayed when showing recommendations on your Website. (e.g. "the frog")
    itemurl: string; // url that links to the item page on your Website. Note:Please encode &'s in url with %26
    userid?: string; // An optional anonymised id of a user. (e.g. "24EH1723322222A3")
    itemimageurl?: string; // An optional item image url that links to a image of the item. Note:Please encode timestamp of the action. The parameter has the format "dd_MM_yyyy_HH_mm_ss" (e.g."01_01_2009_23_59_59").
    itemtype?: string; // An optional item type that denotes the type of the item (e.g. IMAGE, VIDEO, BOOK, etc.).    If not supplied the default value ITEM will be used.
  }) {
    return await get('/api/1.1/importitem', params);
  }

  static async set_item_active(params: {
    token: string; // The required security token ("b08f41cfa92b430538146cf474116c6d") to access this service. This token is only valid for the current session.Note: The token invalidates, if you sign out.
    itemid: string; // The id of the item you want to activate or deactivate
    active: string; // This value is used to activate or deactivate an item - set it to true(active)or false(deactivate)
    itemtype?: string; // item type that denotes the type of the partner item (e.g. IMAGE, VIDEO, BOOK, etc.). If not supplied the default value ITEM will be used.
  }) {
    return await get('/api/1.1/setitemactive', params);
  }

  static async item_types(params: {} = {}) {
    return await get('/api/1.0/itemtypes', params);
  }

  static async add_itemtype(params: {} = {}) {
    return await get('/api/1.1/additemtype', params);
  }

  static async delete_itemtype(params: {} = {}) {
    return await get('/api/1.1/additemtype', params);
  }
}

async function get<Ret = any>(
  uri: string,
  params: Record<string, string | number | undefined>
) {
  params.apikey = config.apikey;
  params.tenantid = config.tenantid;
  return await GET<Ret>(config.serverUrl.trim() + uri.trim(), params);
}

/*

function collect() {
  let elemList = $('.markdown_content').children().toArray();
  let apis = [];
  while (elemList) {
    elemList = fuck(elemList);
  }
  return apis
    .map((api) => genFunc(api.uri, api.name, api.params))
    .reduce((p, c) => p + '\n\n' + c, '');

  function fuck(elemList) {
    let tableIndex = 0;
    while (true) {
      if (elemList[tableIndex] && elemList[tableIndex].tagName === 'TABLE') {
        break;
      }
      tableIndex++;
    }
    let table = elemList[tableIndex];
    let action = elemList[tableIndex - 2];
    action = /\{yourServerURL\}(.+)\??/.exec($(action).text());
    action = action[1];

    let api = {};
    api.uri = action;

    api.name = $(
      elemList.slice(0, tableIndex + 1).find((e) => e && e.tagName === 'H2')
    ).text().replace(/\W/g,'_');

    api.params = $(table).find('tbody > tr').toArray().filter(tr=>{
      let c = iterToList(tr.children);
      if(/(apikey)|(tenantid)/.test(c[0].innerText)){
        return false;
      }
      return true;
    }).map((tr) => {
      return iterToList(tr.children).map((td) => td.innerText);
    });

    apis.push(api);
    
    if (elemList.slice(tableIndex + 1).find((e) => e && e.tagName === 'TABLE'))
      return elemList.slice(tableIndex + 1);
    else return null;
  }
  function iterToList(iter) {
    const list = [];
    if (iter instanceof HTMLCollection) {
      for (let i = 0; i < iter.length; i++) {
        list.push(iter.item(i));
      }
    } else
      for (let v of iter) {
        list.push(v);
      }
    return list;
  }
  function genFunc(uri, name, params) {
    return `
    static async ${name}(params: {
      ${params
        .map(
          (param) =>
            param[0] +
            (/required/.test(param[1]) ? ': ' : '?: ') +
            ' string; ' +
            `// ${param[2].replace(/\W/g, ' ')}`
        )
        .reduce((p, c) => p + '\n' + c, '')}
    }) {
      return await get('${uri}', params);
    }
  `;
  }
}

*/
