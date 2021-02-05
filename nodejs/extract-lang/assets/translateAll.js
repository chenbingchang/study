module.exports = {
  common: {
    project: {
      name: "Bailun backstage",
      title: "Bailun news manage backstage",
      main: "Bailun{0}",
    },
    isShow: { key: "Whether to show", show: "Do not show", hide: "display" },
    errTag: {
      mark: "mark",
      adminMark: "Administrator flag",
      groupMark: "Leader Mark",
      normalUpd: "Common error",
      dangerUpd: "Serious error",
      normalDel: "Ordinary mistaken deletion",
      dangerDel: "Badly deleted",
      sucess: "Mark successful",
      delErr: "Wrong judgment",
      updErr: "Error correction",
    },
    user: {
      image: "profile picture",
      onJob: "On-job",
      lock: "locking",
      resign: "Resign",
    },
    ws: {
      connection: "connection",
      disconnect: "disconnect",
      tipReConnectMax:
        "There are too many real-time connection attempts to reconnect, and it is currently unable to synchronize with the server. Please refresh the page manually later!",
      tipReConnect: "The live connection has been reopened!",
      tipWsDisConnect: "The real-time connection has been disconnected!",
      canSend:
        "The real-time connection has been disconnected and the request cannot be sent!  Please try again later or refresh the page.",
    },
    roleType: {
      admin: "administrator",
      menber: "Group member",
      group: "Group leader",
    },
    menu: {
      home: "Home",
      newsScreen: "Newsletter screening",
      newsTranslate: "Express Translation",
      teamData: "Team statistics",
      wordManage: "Thesaurus Management",
      wordConvertManager: "Translation correction dictionary",
      userManage: "Staff management",
      tagManage: "Label management",
      calendarManage: "Economic calendar management",
      eventManage: "Incident management",
      systemSetting: "System settings",
      loginOut: "sign out",
    },
    operate: {
      name: "operating",
      add: "Add",
      delete: "delete",
      search: "search",
      query: "Inquire",
      save: "save",
      selectAll: "select all",
      clear: "Empty",
      reset: "Reset",
      revoke: "Revoke",
      seeBigImage: "View larger image",
      download: "download",
      publish: "release",
      ok: "ok",
      cancel: "cancel",
      close: "close",
      export: "Export",
      batchDelete: "batch deletion",
      addWord: "Add thesaurus",
      updWord: "Modify thesaurus",
    },
    network: {
      networkErr: "network anomaly",
      serverErr: "Service exception",
      tipReqFail: "Failed to send request!",
      timeOver: "Request timed out, please try again!",
      reqErr: "The request is abnormal, please try again!",
    },
    formTip: {
      inpContent: "Please enter content",
      inpFileType: "Please select a file in {type} format",
      limitImageNum: "Upload up to {number} pictures",
      selLanguage: "Please select language",
      formErr: "The input is incorrect!",
      sel: "please choose",
      inpKeyWrod: "Please enter key words",
      selUser: "Please select user",
      inpMarks: "Please enter a note",
      selTimeRang: "Please select a time range",
    },
    lang: {
      en: "English",
      zhHans: "Simplified Chinese",
      zhHant: "traditional Chinese",
      ru: "Russian",
      fr: "French",
      ko: "Korean",
      ja: "Japanese",
      ar: "Arabic",
    },
    no: "no",
    image: "image",
    imageDetail: "Picture details",
    noData: "No data",
    lineChart: "line chart",
    barChart: "histogram",
    featured: "Featured",
    important: "Important",
    push: "Push",
    seriousWarning: "Serious warning",
    tipPBLogin: "Bloomberg's login has been disconnected, please log in again!",
    text: "text",
    uploadFail: "upload failed!",
    wait: "Please wait!",
    uploading: "Uploading, please try again later...",
    tipPatseUpload:
      'Paste upload steps:\n  1. Take a screenshot or right-click the picture in the browser and select "Copy Picture".\n  2. Under the premise that the frame has the focus (the blue frame is the focus state, if you don\'t click to get the focus), press ctrl+v to upload the picture in the pasteboard.\n  Note: This operation is not available for pictures copied in Explorer',
    asc: "Positive order",
    desc: "Reverse order",
    emptyList: "The list is empty!",
    tag: "label",
    source: "source",
    time: "time",
    language: "Language",
    langVersion: "language version",
    timeRang: "time limit",
    startTime: "Starting time",
    endTime: "End Time",
    tip: "prompt",
    detail: "Details",
    wrod: "vocabulary",
    startDate: "start date",
    endDate: "End date",
    today: "today",
    thisWeek: "This week",
    thisMonth: "this month",
    fullYear: "annual",
    emplyee: "Employee",
    emplyeeName: "employee's name",
    languageFrom: "Language",
    phone: "Cell phone",
    roles: "Roles",
    remarks: "Remarks",
    createTime: "Creation time",
    lastLoginTime: "Last login time",
    status: "status",
    convertWord: "Corrected vocabulary",
    batchImportWord: "Batch import thesaurus",
    tableFormatterExp:
      "The table refers to the following format (Note: starting from the second line)",
    tipWordNMark:
      "The vocabulary does not exceed 20 characters, and the remarks do not exceed 100 characters",
    translateWord: "Target vocabulary",
    tipDeleteWord:
      "Confirm to delete this thesaurus information, once deleted, it will not be displayed in the management list",
    tipUserLangFail: "Failed to query user language, use all languages",
    lastUpdTime: "Last update time",
    sourceUrl: "Original link",
    tipLocking: "Quick news lock request......",
    tipAutoUnLock: "Application for newsletter lock timeout, automatic unlock!",
    translate: "Translation",
    toggleTranslate: "Switch source/translation",
    tipImageUpload: "The picture is uploading, please post later",
    content: "content",
  },
  login: {
    title: "Quick news translation background",
    form: {
      sCountry: "Please select a country",
      inpPhone: "Please enter the phone number",
      lPhone: "Phone number format is wrong",
      inpCode: "Please enter the 4-digit verification code",
      getCode: "get verification code",
      reGetCode: "Reacquire | Reacquire({0})",
      validtePhone: "please enter a valid phone number",
      errCode: "Verification code error",
      sucessLogin: "login successful",
    },
    operate: { login: "log in" },
  },
  home: {
    pending: {
      title: "Pending",
      unPublish: "Number of alerts currently pending",
      unScreen: "Current number of alerts to be filtered",
    },
    quota: {
      translateSpeed: "Translation speed",
      screenSpeed: "Screening speed",
      translateEfficiency: "Express translation efficiency",
      updatePercent: "modify the proportion of news",
      screenRentention: "Screening stay",
      translateRentention: "Translation stuck",
      retention: "News stranded",
      updateNumPercent: "The percentage of changes",
      groupUpdatedNum: "Number of groups corrected",
      selfUpdateNum: "Self-modified",
      translateTotal: "Number of translated alerts",
      groupTranslateSpeed: "Group News Translation Speed",
      groupRetention: "Group News Detention",
      groupQuality: "The quality of group news",
      groupUpdated: "Group is corrected news",
      selfUpdate: "Modify the alert yourself",
      groupDelImp: "Number of important alerts deleted by the team by mistake",
      groupDel: "Number of accidentally deleted alerts by group",
      updPercentTotal: "Proportion of cumulative number of modified alerts",
      leaderQuality: "Leader quality inspection index",
    },
    delErrTag: {
      title: "Important news was deleted by mistake",
      name: "Delete error",
      mark: "Remove error mark",
      deleteNumber: "mistakenly deleted alerts",
      deleteTotal: "Accumulated number of accidentally deleted alerts",
      findDelTotal: "Accumulated number of accidentally deleted alerts",
      lackDelTotal: "Cumulative number of missed and deleted alerts",
      delErrTotal: "Accumulated number of misjudgment alerts",
    },
    updErrTag: {
      name: "correct mistakes",
      mark: "Modify the error flag",
      updatedNumber: "Number of corrected alerts",
      updateNumber: "corrected the number of alerts",
      findNumber: "found the number of deleted alerts by mistake",
      selfUpd: "Modify by yourself",
      updNumTotal: "Cumulative number of modified alerts",
      updatedNumTotal: "Accumulated number of corrected alerts",
      updateNumTotal: "Accumulated number of corrected alerts",
      updErrTotal: "Accumulated number of incorrectly corrected alerts",
      update: "Corrected news",
    },
    char: {
      translateSpeedScatter: "Translation speed distribution",
      screenSpeed: "Newsletter screening speed",
      publishSpeed: "News release efficiency",
      translateNum: "Newsletter translation volume",
    },
    earliest: "Earliest",
    deleteOn: "Deleted on",
    publishOn: "posted on",
    screen: "filter",
    secondPerBar: "Second/bar",
    barPerHour: "Article/h",
    total: "In total",
    overview: "Overview",
    personalInfo: "Personal situation",
    groupInfo: "Group situation",
    strip: "Article",
    hour: "hour",
    leaderQuota: "Group leader's personal indicators",
    workHours: "Working hours",
    officialUpdDetail:
      "Official short-label newsletter view update comparison details",
    beforeUpd: "Before update",
    afterUpd: "Updated",
    newsOrigin: "Newsletter original",
    updOn: "Updated on",
    tipQueryArticleFail: "Failed to query official news articles!",
  },
  newsScreen: {
    tip: {
      voice:
        'Google Chrome needs to be set to receive the alert tone:  \n    High version:  \n    1. Click the small icon at the top of the URL bar  \n    2. Click "Website Settings" in the pop-up box  \n    3. Find "Sound" in the settings and change the "Default" option to "Run"  \n    4. Refresh the background management page  Low version (refer to https://blog.csdn.net/maergaiyun/article/details/97007514):  \n    1. Open a new tab and enter "chrome://flags/"  \n    2. Find "Autoplay policy" and change the default value "Default" to "No user gesture is required"  \n    3. Save, click "Relaunch" in the lower right corner  \n    4. Refresh the background management page',
      lockFail: "Failed to apply for newsletter lock",
      voiceFail:
        "If loading the prompt sound fails, the prompt sound cannot be played!",
      rejectListFail: "Failed to get the alert REJECT list",
      pass: "No PASS without label",
      screenFail: "Failed to filter alerts, please try again!",
      rePassFail: "Alert failed to reset PASS, please try again!",
      addNewsSuccess: "Succeeded in adding alert!",
      addNewsFail: "Failed to add alert!",
      getTagFail: "Failed to get the label!",
      needAutho:
        "The reject list can only be operated by the group leader or above",
    },
    operate: {
      exportRejectData: "Export data to be filtered",
      addNews: "Add alert",
    },
    form: {
      inpContent: "Please enter the content of the alert",
      limitContentNum: "The content of the newsletter can be up to 1000 words",
      beforeContent: "Please enter the content first!",
      selTag: "Please select a label",
      inp: "Please add content/label",
    },
    list: "Alert list",
    unlock: "Unlock",
    unscreen: "To be filtered",
    tagList: "Label list",
    originArticle: "Full text",
    unscreenData: "Alert data to be filtered",
    seeArticle: "View full text",
  },
  newsTranslate: {
    tip: {
      noScreenData: "No related alerts",
      noData: "No news",
      lockFail: "Failed to apply for newsletter lock!",
      reUpdate:
        "Modified by the group leader or administrator, he can no longer modify",
      updBySelf: "Can only edit own alerts",
      delSuccess: "Alert deleted successfully!",
      addWrodSuccess: "Added vocabulary successfully!",
      dbErrFind: "Browser database error, failed to find cached content!",
      dbErrOpen:
        "Browser database failed to open, unable to provide cache content function!",
      dbUnOpen:
        "The browser database is not open and the content cannot be cached!",
      dbErrSave: "Browser database error, failed to save cached content!",
      cacheSuccess: "Cached content successfully!",
      dbUnOpenFind:
        "The browser database is not opened and the cached content cannot be read!",
      dbErrRead: "Browser database error, failed to read cached content!",
      recacheSucess: "The cached content is restored successfully!",
      isDelNews: "Do you want to delete the alert?",
      noTagNoPublish: "Cannot publish without label",
      publishSuccess: "The newsletter was successfully released!",
      publishFail: "News release failed!",
      autoNoEdit:
        "The real-time connection is closed abnormally and the editing is automatically cancelled. Please try again in 30 seconds!",
      copySuccess: "One-click copy is successful!",
      isDel: "Are you sure to delete this content?",
    },
    form: {
      selNewsType: "Please select the alert type",
      selPublisher: "Please select publisher",
      selSource: "Please select the source",
      inpOriginWord: "Please enter the original vocabulary",
      inpTranslWord: "Please enter the target words",
      limitOriginWrod: "Original vocabulary up to 70 words",
      limitTranslWord: "Translation vocabulary up to 70 words",
      limitMark: "Remarks up to 200 words",
      err: "The content is incorrect!",
      inpTranslText: "Please enter translation content",
      inpTitle: "Please enter title",
      lLangText:
        "Selected long text content must be greater than 550 characters",
      rLangText: "Featured long article title cannot be empty",
      rPublishFullText:
        "Publish the full text long text content cannot be empty",
      rPublishFullTitle:
        "The title of the full-text long article cannot be empty",
    },
    operate: {
      packUp: "Put away",
      addWrod: "Add vocabulary",
      addTag: "Add label",
      delNews: "Delete alert",
    },
    enToCn: "English -> Jane",
    newsType: "Alert type",
    normalNews: "General news",
    officialNews: "Official news",
    publisher: "announcer",
    tagSearch: "Tag search",
    unPublish: "To be released",
    editing: "Edit",
    published: "Published",
    deleted: "deleted",
    curTag: "Current label",
    originWord: "Source vocabulary",
    operateBan: "Operation panel",
    copyOrigin: "Copy the original",
    withArticle: "Publish the full text at the same time",
    langNews: "Long News",
    news: "News",
    origin: "original",
    oneKeyCopy: "One-click copy",
    receiveTime: "Time received in the background",
    unpublishTime: "Time to enter the pending list",
    memoryBank: "Memory bank",
  },
  teamData: {
    tip: { flatEmpty: "The platform is empty and cannot be exported!" },
    quota: {
      newsRentation: "News stranded number",
      translSpeed: "translation speed of each item",
      updPercent: "number of revisions/total number of translations",
      updOtherErr: "correct others' mistakes",
      restoreNews: "Restore important news",
      over20Time: "more than 20 seconds of gold",
      translPerHour: "Total translation volume per person per shift/8 hours",
      updErrNum: "modify the error amount",
      delImpNews: "important news deleted by mistake",
      groupUpdPercent:
        "number of modified items (whole group)/number of released items",
    },
    form: {
      lNumMax100: "The sum of all values is greater than 100",
      lNumMin100: "The sum of all values is less than 100",
      iRequireItem: "Please enter required fields",
      selStartTime: "Please select start time",
      selEdnTime: "Please select the end time",
      sField: "Please select a field",
      sGroup: "Please select a group",
    },
    operate: {
      dataCfg: "Data configuration",
      expFlatData: "Export platform statistics",
      expTeamData: "Export team statistics",
      expPublishData: "Export published data",
      expUserData: "Export employee statistics",
      expReject: "Export the reject list for the past 24 hours",
      expUserDetail: "Export personal details",
      expUserScore: "Export personal results",
      expTeamDetail: "Export detailed team data",
    },
    errTag: {
      leadErrUpd: "Team leader error correction",
      leadOkUpd: "Team leader corrects",
      leadErrDel: "Group leader's mistake",
      leadOkDel: "Team leader got it right",
    },
    char: {
      screenSpeedScatter: "Screening speed distribution",
      publishSpeedScatter: "Release speed distribution",
      publishNumPercentScatter:
        "Distribution of the percentage within the release group",
    },
    newsCoverage: "News coverage",
    basePercentCfg: "Basic proportion configuration",
    perImpErr: "Every major mistake",
    perDel: "Every mistake",
    flatData: "Platform statistics",
    teanDataDetail: "Detailed team data",
    field: "Field",
    robotTransl: "Machine translation",
    manTransl: "Artificial translation",
    originTag: "Original label",
    manTag: "Manual label",
    screener: "Screener",
    publisher: "publisher",
    updater: "updater",
    imp: "importance",
    isPush: "Whether to push",
    sourceTime: "Source time",
    screenTime: "Screening time",
    publishTime: "release time",
    publishList: "List of published alerts",
    userData: "Staff statistics",
    monthFlatWin: "Platform win rate this month",
    repeatRate: "Repetition rate",
    winRate: "Win rate",
    avgWinTime: "Average time to win",
    func: "Features",
    app: "application",
    userDetail: "Personal details",
    name: "name",
    leadUpdNum: "Leader's correction number",
    total: "total",
    userQuota: "Employee indicator data",
    userScore: "Personal performance",
    totalScore: "Comprehensive assessment",
    score: "Grades",
    teamOrder: "Team ranking",
    group: "group",
    monDataOver: "Data overview this month",
    updNumPercent: "Newsletter Modifications Percentage",
    rejectList: "reject list",
  },
  wordManage: {
    form: {
      sUserBy: "Please choose a person",
      lFileType: "Only upload xls and xlsx files",
      lWord:
        "The original text and translation should not exceed 70 characters, and the remarks should not exceed 200 characters",
      sFile: "Please select file",
      bImpS: "Batch import is successful",
      sLangType: "Please select language",
    },
    tip: {
      dWordS: "Successfully deleted words!",
      aWordS: "Successfully added vocabulary!",
      uWordS: "Edit the vocabulary successfully!",
      tableFormat:
        "The table refers to the following format (Note: starting from the second line)",
    },
    operate: {
      dWord: "Delete words",
      aWord: "New words",
      uWord: "Edit vocabulary",
      bImpWord: "Import vocabulary in bulk",
      sFile: "Select file",
    },
    userBy: "Owner",
    order: "Serial number",
    by: "Belonging",
    table: "form",
  },
  userManage: {
    tip: {
      gUserGroupF: "Failed to obtain user group!",
      gUserListF: "Failed to get user list!",
      lockUser:
        "If the employee is locked, the employee can no longer log in to the background system",
      lockUserS: "Successfully locked employees!",
      dUser:
        "Confirm that this employee has resigned! Once deleted, this action will not be withdrawn",
      dUserS: "Successfully deleted employees!",
      aUserS: "Successfully added employees!",
      uUserS: "Editing staff succeeded!",
    },
    operate: {
      lockUser: "Lock employee",
      dUser: "Delete employee",
      aUser: "New employee",
      uUser: "Edit employee",
      aGroup: "New group",
      aGroupName: "Add group name",
    },
    form: {
      iUserName: "Please enter employee name",
      sGroup: "Please select a group",
      iGroupName: "Please enter the new group name",
      iPhone: "Please enter phone number",
      sRole: "Please choose a role",
      lUserNameC: "The employee name can be up to 10 characters",
      lPhoneLength: "Mobile phone number must be 11 digits",
      lRemarkC: "Remarks up to 300 words",
      sRegion: "Please select the region",
      sScreenLang: "Please select a filter language",
      sTranslateLang: "Please select output language",
    },
    userStatus: "Employee status",
    group: "Group",
    region: "district belong to",
    domestic: "domestic",
    foreign: "foreign",
    screenLang: "Filter language",
    translateLang: "Output language",
  },
  tagManage: {
    form: {
      sCategory: "Please select category",
      iTagName: "Please enter a label name",
      lTagNameC: "The label name can contain up to 20 characters",
      iCategory: "At least one language is required",
      lRemarksC: "Remarks up to 1000 words",
      iKeyword: "Please enter a keyword",
      lKeywordC: "Keywords up to 20 words",
      lKeyword: 'Enter keywords and separate them with English commas ","',
      sFileType: "Please select a file with the suffix xlsx/xls",
    },
    tip: {
      isDelTag: "Are you sure to delete this label?",
      dTagS: "The label was successfully deleted!",
      aCategoryS: "Successfully added category!",
      uCategoryS: "Edit category successfully!",
      aDisturbWordS: "Successfully added anti-interference keywords!",
      impF: "Import failed, please try again",
      aTagS: "Added label successfully!",
      uTagS: "Edit the label successfully!",
      dCategory:
        "Deleting a category will also delete all tags under the category. Do you want to delete the category?",
      dCategoryS: "Successfully deleted category!",
      isDelDisturbWord: "Do you want to delete the anti-interference keyword?",
    },
    operate: {
      categoryManage: "Category management",
      dTag: "Remove label",
      aCategory: "New category",
      uCategory: "Edit category",
      aDisturbWord: "Add anti-interference keywords",
      uTag: "Edit label",
      bImp: "Batch Import",
      dCategory: "Delete category",
      bImpTag: "Import tags in bulk",
    },
    langType: "Language type",
    disturbWord: "Anti-interference keywords",
    tagName: "Label name",
    categoryBy: "category",
    creater: "founder",
    categoryAlias: "Category name",
    keyword: "Key words",
    category: "category",
    aKeyword: "Add keywords",
    dDisturbWord: "Delete anti-interference keywords",
    dDisturbWordS: "Successfully delete anti-interference keywords!",
  },
  calendarManage: {
    form: {
      iCalendarTitle: "Please enter the calendar title",
      iCountryArea: "Please select a country and region",
      iSourceId: "Please enter source ID",
      iBailunIdWithEx:
        "Please enter the ID of Byron Club, such as: bls-l-10000",
      iUnit: "Please enter a unit",
      sProductAttr: "Please select product attributes",
      sCalendarCategory: "Please select calendar category",
      iMarket: "Please enter the market",
      iEventText: "Please enter event content",
      IExchange: "Please enter the exchange",
      iHolidayName: "Please enter holiday name",
      iOther: "Please enter other",
      sSourceWebSite: "Please select the source site",
      sStatus: "Please select status",
      iBailunId: "Please enter Byron ID",
      iNote: "Please enter a comment",
    },
    tip: {
      chgStatusS: "The calendar display status is switched successfully!",
      chgStatusF: "Failed to switch calendar display status",
      multipleSource: 'Different sources are separated by commas ","',
      uCalendarS: "Successfully edited the calendar!",
    },
    calendarType: "Calendar type",
    countryAndArea: "Countries and regions",
    productAttr: "product properties",
    calendarCategory: "Calendar category",
    countryArea: "country / region",
    sourceId: "Source ID",
    bailunId: "Byron ID",
    title: "title",
    unit: "unit",
    market: "market",
    eventName: "Event name",
    exchange: "Exchange",
    holidayName: "Holiday name",
    other: "other",
    data: "data",
    event: "event",
    holiday: "Holiday",
    jinshi: "Jinju",
    wallStreet: "Wall Street",
    reuters: "Reuters",
    bloomberg: "Bloomberg",
    yinwei: "Yingwei Finance",
    calendarDetail: "Calendar details",
    note: "Comment",
  },
  systemSettings: {
    tip: {
      isValidInInp: "Is it valid in the input box",
      noWithWin: "Shortcut keys cannot bring WIN",
      saveS: "Saved successfully!",
      restoreSetS: "Restore default settings!",
    },
    opereate: { restoreSet: "Restore default settings" },
    universal: "Universal",
    beep: "Beep",
    beepInterval: "Prompt tone interval in milliseconds",
    newPushRestore: "New push reset tone interval",
    hotKey: "hot key",
    button: "button",
    passNews: "pass news",
    setHotKey: "Set shortcut keys",
    rejectNews: "reject news",
    preScreenNews: "Previous filter alert",
    nextScreenNews: "Next Screening Alert",
    publishNews: "Release newsletter",
    uNewsInpBr: "Edit alert input box to wrap",
  },
}
