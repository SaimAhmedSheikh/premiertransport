
import SyncStorage from 'sync-storage';
const appKey = 'LNPremierTransportation';

const Key_TempData = appKey+"_TempData";
const Key_UserData = appKey+"_UserData";
const Key_Token = appKey+"_Token";
const Key_TokenExpiry = appKey+"_TokenExpiry";
const Key_UpdateData = appKey+"_UpdateData";
const Key_TodayRides = appKey+"_TodayRides";
const Key_TodayRidesTemp = appKey+"_TodayRidesTemp";
const Key_MyLogs = appKey+"_MyLogs";
const Key_Notifications = appKey+"_Notifications";
const Key_CurrRideData = appKey+"_CurrRideData";
const Key_ProfileCreated = appKey+"_ProfileCreated";
const Key_SelRideDate = appKey+"_SelRideDate";
const Key_CheckInOut = appKey+"_CheckInOut";
const Key_BreakInOut = appKey+"_BreakInOut";
const Key_CurrentLatLong = appKey+"_CurrentLatLong";

class CommonDataManager {

    static myInstance = null;

    _userID = "";
    Key_CurrentTime="Key_CurrentTime";

    static getInstance() {
        if (CommonDataManager.myInstance == null) {
            CommonDataManager.myInstance = new CommonDataManager();
            CommonDataManager.myInstance.initializeSyncStorage();
        }
        return this.myInstance;
    }

    async initializeSyncStorage(){
      const storageKeys = [appKey];
      await SyncStorage.init(storageKeys);
      const data = SyncStorage.get(appKey);
    }

    ////////////////////////////

    setTempData(value)
    {
      SyncStorage.set(Key_TempData, value);
    }

    getTempData()
    {
      let TempData = SyncStorage.get(Key_TempData);
      if(typeof TempData !== "undefined") { return TempData;   }
      else { return TempData = 0; }
    }

    ////////////////////////////

    setCheckInOut(value)
    {
      SyncStorage.set(Key_CheckInOut, value);
    }

    getCheckInOut()
    {
      let data = SyncStorage.get(Key_CheckInOut);
      if(typeof data !== "undefined") { return data; }
      else { return data = 0; }
    }

    ////////////////////////////

    setBreakInOut(value)
    {
      SyncStorage.set(Key_BreakInOut, value);
    }

    getBreakInOut()
    {
      let data = SyncStorage.get(Key_BreakInOut);
      if(typeof data !== "undefined") { return data; }
      else { return data = 0; }
    }
    ////////////////////////////

    // setCurrentLatLong(value)
    // {
    //   SyncStorage.set(Key_CurrentLatLong, value);
    // }
    //
    // getCurrentLatLong()
    // {
    //   let data = SyncStorage.get(Key_CurrentLatLong);
    //   if(typeof data !== "undefined") { return data; }
    //   else { return data = 0; }
    // }

    ////////////////////////////

    setTokenExpiry(value)
    {
      SyncStorage.set(Key_TokenExpiry, value);
    }

    getTokenExpiry()
    {
      let TokenEx = SyncStorage.get(Key_TokenExpiry);
      if(typeof TokenEx !== "undefined") {   return JSON.parse(TokenEx);   }
      else { return TokenEx = 0; }
    }

    ////////////////////////////

    setToken(value)
    {
      SyncStorage.set(Key_Token, value);
    }

    getToken()
    {
      let Token = SyncStorage.get(Key_Token);
      if(typeof Token !== "undefined") {   return JSON.parse(Token);   }
      else { return Token = 0; }
    }

    ////////////////////////////

    setUpdateData(value)
    {
      SyncStorage.set(Key_UpdateData, value);
    }

    getUpdateData()
    {
      let data = SyncStorage.get(Key_UpdateData);
      if(typeof data !== "undefined") {   return data;   }
      else { return data = false; }
    }

    ////////////////////////////


    setTodayRidesDataTemp(value)
    {
      SyncStorage.set(Key_TodayRidesTemp, value);
    }

    getTodayRidesDataTemp()
    {
      let data = SyncStorage.get(Key_TodayRidesTemp);
      if(typeof data !== "undefined") { return JSON.parse(data); }
      else { return data = []; }
    }


    ////////////////////////////

    setTodayRidesData(value)
    {
      SyncStorage.set(Key_TodayRides, value);
    }

    getTodayRidesData()
    {
      let data = SyncStorage.get(Key_TodayRides);
      if(typeof data !== "undefined") { return JSON.parse(data); }
      else { return data = []; }
    }

    deleteTodayRidesData(){
        SyncStorage.remove(Key_TodayRides);
    }

    ////////////////////////////

    setMyLogsData(value)
    {
      SyncStorage.set(Key_MyLogs, value);
    }

    getMyLogsData()
    {
      let data = SyncStorage.get(Key_MyLogs);
      if(typeof data !== "undefined") { return JSON.parse(data); }
      else { return data = []; }
    }

    deleteTodayRidesData(){
        SyncStorage.remove(Key_MyLogs);
    }

    ////////////////////////////

    // setProfileCreated(value)
    // {
    //   SyncStorage.set(Key_ProfileCreated, value);
    // }
    //
    // getProfileCreated()
    // {
    //   let mData = SyncStorage.get(Key_ProfileCreated);
    //   if(typeof mData !== "undefined") { return JSON.parse(mData); }
    //   else { return mData = 0; }
    // }

    ////////////////////////////

    setUserData(value)
    {
      SyncStorage.set(Key_UserData, value);
    }

    getUserData()
    {
      let mData = SyncStorage.get(Key_UserData);
      if(typeof mData !== "undefined") { return JSON.parse(mData); }
      else { return mData = 0; }
    }

    ////////////////////////////

    setNotifications(value)
    {
      SyncStorage.set(Key_Notifications, value);
    }

    getNotifications()
    {
      let mData = SyncStorage.get(Key_Notifications);
      if(typeof mData !== "undefined") { return JSON.parse(mData); }
      else { return mData = 0; }
    }

    ////////////////////////////

    setCurrentRideData(value)
    {
      SyncStorage.set(Key_CurrRideData, value);
    }

    getCurrentRideData()
    {
      let mData = SyncStorage.get(Key_CurrRideData);
      if(typeof mData !== "undefined") { return  mData; }
      else { return mData = 0; }
    }

    ////////////////////////////

    setSelRideDate(value)
    {
      SyncStorage.set(Key_SelRideDate, value);
    }

    getSelRideDate()
    {
      let mData = SyncStorage.get(Key_SelRideDate);
      if(typeof mData !== "undefined") { return mData; }
      else { return mData = 0; }
    }

    ////////////////////////////

    removeAllKeysData(){
      SyncStorage.remove(Key_TempData);
      SyncStorage.remove(Key_UserData);
      SyncStorage.remove(Key_Token);
      SyncStorage.remove(Key_UpdateData);
      SyncStorage.remove(Key_TodayRides);
      SyncStorage.remove(Key_MyLogs);
      SyncStorage.remove(Key_Notifications);
      SyncStorage.remove(Key_CurrRideData);
      SyncStorage.remove(Key_SelRideDate);
      SyncStorage.remove(Key_CheckInOut);
      SyncStorage.remove(Key_BreakInOut);
      SyncStorage.remove(Key_TokenExpiry);
    }

    resetTime()
    {
      SyncStorage.remove(this.Key_CurrentTime);
    }

    getUserID() { return this._userID; }

    setUserID(id) { this._userID = id; }

}

export default CommonDataManager;
