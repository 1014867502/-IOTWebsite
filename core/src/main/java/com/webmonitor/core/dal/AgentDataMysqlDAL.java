package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.bll.*;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.model.*;
import com.webmonitor.core.model.userbase.BaseProjects;
import com.webmonitor.core.model.userbase.DeviceSensorList;
import com.webmonitor.core.model.userbase.Templates;
import com.webmonitor.core.util.Tools;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class AgentDataMysqlDAL implements IAgentData {

    public Page<AgentData> getAllDevice(int pageno,int limit){
        String sql=" from agent_data a left join agent_table b on a.agentNumber=b.agentNumber LEFT JOIN agent_table c on a.agentNumber=c.agentNumber ";
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName,b.updateTime,c.agentName ",sql+" order by b.updateTime desc");
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state=0;
            String connect="";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
                state=Integer.parseInt(connect);
            }
            map.setOnlineState(state);
            map.setAgentNumber(record.getStr("agentNumber"));
            try{
                if(record.getStr("updateTime")!=null||record.getStr("updateTime").equals("")){
                    map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/','-')));
                }}catch (Exception e){

            }
            map.setProgroupid(record.getInt("proGroupId"));
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**首页上的搜索框**/
    public Page<AgentData> searchDeviceByParam(String type,String content,String agentnum,String[] projectid,String state,int pageno,int limit){
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where ";
        String test="";
        switch(state){
            case "0"://离线
                if(!content.isEmpty()){
                    sql=sql+"(b.connectState=0 or b.connectState is null) and a.machineSerial like '%"+content.trim()+"%'";
                }else{
                    sql=sql+"(b.connectState=0 or b.connectState is null)";
                }
                break;
            case "1"://在线
                if(!content.isEmpty()){
                    sql=sql+"b.connectState=1 and a.machineSerial like '%"+content.trim()+"%'";
                }else{
                    sql=sql+"b.connectState=1";
                }
                break;
            case "2"://公司
                sql=sql+" c.agentName like '%"+content.trim()+"%'";
                break;
        }
        if(projectid[0]!=null&&(!type.equals("1"))&&(!type.equals("2"))){
            if(projectid.length>1){
                test=" and (a.proGroupid="+projectid[0];
                for(int k=0;k<projectid.length;k++){
                    String test1=" OR a.proGroupid="+projectid[k];
                    test+=test1;
                }
                sql=sql+test+")";
            }else{
                sql=sql+" and a.proGroupid="+projectid[0];
            }
        }
        if(type.equals("1")){
            sql=sql+" and a.agentNumber="+agentnum;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.connectState,b.updateTime,c.agentName ",sql+" order by b.updateTime desc");
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state1=0;
            String connect="";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
                state1=Integer.parseInt(connect);
            }
            map.setOnlineState(state1);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            String test1=record.getStr("updateTime");
            if(record.getStr("updateTime")==null||record.getStr("updateTime").equals("")){

            }else{
                map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/','-')));
            }
            if(record.getInt("proGroupId")==null){
                map.setProgroupid(0);
            }else{
                map.setProgroupid(record.getInt("proGroupId"));
            }
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**首页上的搜索框**/
    public Page<AgentData> seekDeviceByParam(StaffData currentuser,String content,String agentnum,String projectid,String state,int pageno,int limit){
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber ";
        if(!agentnum.equals("all")){
            sql+=" where a.agentNumber='"+agentnum+"'";
        }
        if(!content.equals("")){
            if(agentnum.equals("all")){
                sql+=" where a.machineSerial like '%"+content.trim()+"%'";
            }else{
                sql+=" and a.machineSerial like '%"+content.trim()+"%'";
            }
        }
        if(!projectid.equals("all")){
            sql+=" and a.proGroupId='"+projectid+"'";
        }else{
            if(currentuser.getIRoleType()==0){
                String[] jobs=currentuser.getGroupAssemble().split("@");
                for(int i=0;i<jobs.length;i++){
                    if(i!=0) {
                        sql += " or a.proGroupId='" + jobs[i] + "'";
                    }else{
                        sql+=" and (a.proGroupId='"+jobs[i]+"'";
                    }
                }
                sql+=" )";
            }
        }
        if(!state.equals("all")){
            if(!sql.contains("where")){
                sql+=" where b.connectState='"+state+"'";
            }else{
                sql+=" and b.connectState='"+state+"'";
            }

        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.connectState,b.updateTime,c.agentName ",sql+" order by b.updateTime desc");
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state1 = 0;
            String connect = "";
            if (record.getStr("connectState") != null && !record.getStr("connectState").equals("")) {
                connect = record.getStr("connectState");
                state1 = Integer.parseInt(connect);
            }
            map.setOnlineState(state1);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            String test1 = record.getStr("updateTime");
            if (record.getStr("updateTime") == null || record.getStr("updateTime").equals("")) {

            } else {
                map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/', '-')));
            }
            if (record.getInt("proGroupId") == null) {
                map.setProgroupid(0);
            } else {
                map.setProgroupid(record.getInt("proGroupId"));
            }
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }


    /**公司详情页上的搜索框**/
    public Page<AgentData> searchDeviceByCom(String content,String agentnum,String state,int pageno,int limit){
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.agentNumber="+agentnum;
        String test="";
        switch(state){
            case "0"://离线
                if(!content.isEmpty()){
                    sql=sql+" and (b.connectState=0 or b.connectState is null) and a.machineSerial like '%"+content.trim()+"%'";
                }else{
                    sql=sql+" and (b.connectState=0 or b.connectState is null)";
                }
                break;
            case "1"://在线
                if(!content.isEmpty()){
                    sql=sql+" and b.connectState=1 and a.machineSerial like '%"+content.trim()+"%'";
                }else{
                    sql=sql+" and b.connectState=1";
                }
                break;
            case "2"://全部
                break;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.connectState,b.updateTime,c.agentName ",sql+" order by b.updateTime desc");
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state1=0;
            String connect="";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
                state1=Integer.parseInt(connect);
            }
            map.setOnlineState(state1);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            try{
                if(record.getStr("updateTime")!=null||record.getStr("updateTime").equals("")){
                    map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/','-')));
                }}catch (Exception e){

            }
            if(record.getInt("proGroupId")==null){
                map.setProgroupid(0);
            }else{
                map.setProgroupid(record.getInt("proGroupId"));
            }
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }




    @Override
    public Page<AgentData> findDeviceByParam(String content, String agentnum, String projectid, String state, int pageno, int limit) {
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.proGroupid="+projectid;
        switch(state){
            case "0"://离线
                if(!content.isEmpty()){
                    sql=sql+" and (b.connectState=0 or b.connectState is null) and a.machineSerial like '%"+content+"%'";
                }else{
                    sql=sql+" and (b.connectState=0 or b.connectState is null)";
                }
                break;
            case "1"://在线
                if(!content.isEmpty()){
                    sql=sql+" and b.connectState=1 and a.machineSerial like '%"+content.trim()+"%'";
                }else{
                    sql=sql+" and b.connectState=1";
                }
                break;
            case "all"://全部
                if(!content.isEmpty()){
                  sql=sql+" and a.machineSerial like '%"+content.trim()+"%'";
                }
                break;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.connectState,b.updateTime,c.agentName ",sql+" order by b.updateTime desc");
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state1=0;
            String connect="";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
                state1=Integer.parseInt(connect);
            }
            map.setOnlineState(state1);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            try{
                if(record.getStr("updateTime")!=null||record.getStr("updateTime").equals("")){
                    map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/','-')));
                }}catch (Exception e){
            }
            if(record.getInt("proGroupId")==null){
                map.setProgroupid(0);
            }else{
                map.setProgroupid(record.getInt("proGroupId"));
            }
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**根据公司id获取公司旗下所有设备**/
    @Override
    public Page<AgentData> getAllDeviceByComid(String Companyid,int pageno,int limit) {
        String sql="  from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.agentNumber="+Companyid;
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.connectState,b.updateTime,c.agentName",sql+" order by b.updateTime desc");
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state=0;
            String connect="";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
                state=Integer.parseInt(connect);
            }
            map.setOnlineState(state);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            try{
                if(record.getStr("updateTime")!=null||record.getStr("updateTime").equals("")){
                    map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/','-')));
                }}catch (Exception e){
            }
            if(record.getInt("proGroupId")==null){
                map.setProgroupid(0);
            }else{
                map.setProgroupid(record.getInt("proGroupId"));
            }
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**查询当前项目旗下的所有设备（分页）**/
    public Page<AgentData> getAllDeviceByGroupid(String Groupid,int pageno,int limit) {
        String sql=" from agent_data a left join machine_data b on a.machineSerial=b.machineSerial LEFT JOIN agent_table c on a.agentNumber=c.agentNumber where a.proGroupId="+Groupid;
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.connectState,b.updateTime,c.agentName ",sql+" order by b.updateTime desc");
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state=0;
            String connect="";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
                state=Integer.parseInt(connect);
            }
            map.setOnlineState(state);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            try{
                if(record.getStr("updateTime")!=null||record.getStr("updateTime").equals("")){
                    map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/','-')));
                }}catch (Exception e){
            }
            if(record.getInt("proGroupId")==null){
                map.setProgroupid(-1);
            }else{
                map.setProgroupid(record.getInt("proGroupId"));
            }
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }


    /**首页各权限角色不同的返回**/
    @Override
    public Page<AgentData> getDeviceByParams(int pageno, int limit,String userid) {
        String sql = "";
        String select="";
        StaffData currentuser= StaffService.me.getStaffByName(userid);
        String role=RoleType.getString(currentuser.getIRoleType());
        switch (role){
            case "superadmin":
                sql=AdminService.me.getAllDeviceById(pageno, limit);
                break;
            case "user":
                sql= ConsumerService.me.getAllDevice(userid);
                break;
            case "companyadmin":
                sql= CompanyAdminService.me.getAllDevice(currentuser.getAgentNumber());
                break;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.connectState,b.updateTime,c.agentName ",sql);
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state=0;
            String connect="";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
                state=Integer.parseInt(connect);
            }
            map.setAgentName(record.getStr("agentName"));
            map.setOnlineState(state);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            try {
                map.setCreateTime(Tools.toDateTime(record.getStr("updateTime").replace('/','-')));
            } catch (Exception e) {
            }
            map.setProgroupid((record.getInt("proGroupId")!=null)?record.getInt("proGroupId"):0);
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }


    /**根据权限获取未关联的设备(普通用户)仅限查看用户公司所属设备**/
    @Override
    public Page<AgentDataDao> getOutDeviceById(String agentNumber,int pageno, int limit,int type) {
        String sql="";
        if(type==0){
           sql=" from agent_data where proGroupId is  null and agentNumber="+agentNumber;
        }else{
            sql=" from agent_data where proGroupId is  null";
        }
            Page<Record> page = Db.paginate(pageno, limit, "select *",sql);
            List<Record> recordList = page.getList();
            List<AgentDataDao> rslist = new ArrayList<>();
            for (Record record : recordList) {
                AgentDataDao map = new AgentDataDao();
                String connect="0";
                if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                    connect=record.getStr("connectState");
                }
                map.setOnlineState(connect);
                map.setId(record.getInt("id"));
                map.setAgentNumber(record.getStr("agentNumber"));
                map.setCreateTime(record.getStr("createTime"));
                map.setProGroupId(record.getInt("proGroupId"));
                map.setMachineSerial(record.getStr("machineSerial"));
                map.setMachineName(record.getStr("machineName"));
                rslist.add(map);
            }
            return new Page<AgentDataDao>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }


    /**根据参数搜索未关联的设备（）**/
    @Override
    public Page<AgentDataDao> searchOutDeviceByParam(String agentnum,String content, int pageno, int limit, String type, String role) {
        String sql = "";
        switch (role) {
            /**根据serial查询**/
            case "admin":
                sql= CompanyAdminService.me.searchOutDeviceByParam(agentnum, content.trim(), pageno, limit, type, role);
            break;
            /**根据名称查询**/
            case "consumer":
                sql= CompanyAdminService.me.searchOutDeviceByParam(agentnum, content.trim(), pageno, limit, type, role);
                break;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select *",sql);
        List<Record> recordList = page.getList();
        List<AgentDataDao> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentDataDao map = new AgentDataDao();
            String connect="0";
            if(record.getStr("connectState")!=null&&!record.getStr("connectState").equals("")){
                connect=record.getStr("connectState");
            }
            map.setOnlineState(connect);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setCreateTime(record.getStr("createTime"));
            map.setProGroupId(record.getInt("proGroupId"));
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            rslist.add(map);
        }
        return new Page<AgentDataDao>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public void deleteDeviceBySerial(String sn) {
        Db.update("update agent_data set proGroupId = 0 where machineSerial=?",sn);
    }

    public void reductionDeviceBySerial(String sn){
        Db.update("update agent_data set proGroupId = 0,agentNumber=1 where machineSerial=?",sn);
    }

    @Override
    public void insertDeviceById(String projectid, String sn) {
        Db.update("update agent_data set proGroupId = ? where machineSerial=?",projectid,sn);
    }

    public void updateDeivceAgentBySerial(String sn,String agentnum){
        Db.update("update agent_data set agentNumber=?,proGroupId=0 where machineSerial=?",agentnum,sn);
    }

    @Override
    public void editDevice(String sn, String machinename) {
        Record device = Db.findFirst("select * from agent_data where machineSerial=" +sn);
        device.set("machineSerial", sn).set("machineName", machinename);
        Db.update("agent_data", device);
    }

    @Override
    public void addDevice(String sn, String comid, String state,String machinename) {
        Date date=new Date();
        DateFormat format=new SimpleDateFormat("yyyy-MM-dd");
        String time=format.format(date);
        Record device=new Record().set("machineSerial",sn).set("machineName",machinename).set("onlineState",Integer.parseInt(state))
                .set("agentNumber",comid).set("createTime",time).set("proGroupId",0);
//        MachineData machineData=MachineData.dao.findFirst("select * from machine_data where machineSerial='"+sn+"'");
//        if(machineData==null){
//            Record machine=new Record().set("machineSerial",sn).set("connectState",Integer.parseInt(state))
//                    .set("updateTime",time);
//            Db.save("machine_data",machine);
//        }
        Db.save("agent_data",device);

    }

    @Override
    public void deleteDevice(int id) {
        AgentDataDao.dao.deleteById(id);
    }

    @Override
    public boolean isExitsn(String sn) {
        StaffData staffData=StaffData.dao.findFirst("select * from agent_data where machineSerial='"+sn+"'");
        if(staffData!=null){
            return true;
        }else{
            return false;
        }
    }

    @Override
    public ProDevCount getDevCountAdmin() {
        ProDevCount proDevCount=new ProDevCount();
        Record record=new Record();
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial");
        proDevCount.setSum(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where b.connectState=0 or b.connectState is null");
        proDevCount.setOutcount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where b.connectState=1");
        proDevCount.setOncount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where a.proGroupId=0");
        proDevCount.setUnprojcount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data  where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(createTime)");
        proDevCount.setNewcount((record.getInt("count(*)")));
        return proDevCount;
    }


    @Override
    public ProDevCount getDeviceCountByComid(String comid) {
        ProDevCount proDevCount=new ProDevCount();
        Record record=new Record();
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where agentNumber='"+comid+"'");
        proDevCount.setSum(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where (b.connectState=0 or b.connectState is null) and a.agentNumber='"+comid+"'");
        proDevCount.setOutcount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where b.connectState=1 and a.agentNumber='"+comid+"'");
        proDevCount.setOncount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data a left join machine_data b on a.machineSerial=b.machineSerial where a.proGroupId=0 and a.agentNumber='"+comid+"'");
        proDevCount.setUnprojcount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data  where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(createTime) and agentNumber='"+comid+"'");
        proDevCount.setNewcount((record.getInt("count(*)")));
        return proDevCount;
    }

    /**获取传感器列表中的传感器**/
    @Override
    public Page<DeviceSensorList> getDeivceSensorList(String machineserial,int pageno,int limit) {
        String sql="select extSensorCmd from machine_data where machineSerial='"+machineserial+"'";
        List<DeviceSensorList> deviceSensorLists=new ArrayList<>();
        try{
            String result=Db.findFirst(sql).getStr("extSensorCmd");
            if(result!=null&&!result.equals("")){
                String[] list=result.split("\\|");
                for(int i=0;i<list.length;i++){
                    String[] sensor=list[i].split(";");
                    DeviceSensorList deviceSensorList=new DeviceSensorList();
                    deviceSensorList.setInterval(0<sensor.length?sensor[0]:"");
                    deviceSensorList.setVoltage(1<sensor.length?sensor[1]:"");
                    deviceSensorList.setBruad(2<sensor.length?sensor[2]:"");
                    deviceSensorList.setCmd(3<sensor.length?sensor[3]:"");
                    deviceSensorList.setSn(4<sensor.length?sensor[4]:"");
                    deviceSensorList.setType(5<sensor.length?sensor[5]:"");
                    deviceSensorList.setVender(6<sensor.length?sensor[6]:"");
                    deviceSensorList.setRef(7<sensor.length?sensor[7]:"");
                    deviceSensorLists.add(deviceSensorList);
                }
        }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        return new Page<DeviceSensorList>(deviceSensorLists, pageno, limit,(deviceSensorLists.size()/ limit) + 1, deviceSensorLists.size());
    }

    /**添加传感器列表中的传感器**/
    public void addSensorByData(DeviceSensorList deviceSensorList,String machineserial){
        String add="";
        String sql="select extSensorCmd from machine_data where machineSerial='"+machineserial+"'";
        String str1=deviceSensorList.getInterval()+";"+deviceSensorList.getVoltage()+";8N1@"+deviceSensorList.getBruad()+";"+deviceSensorList.getCmd()+";"+deviceSensorList.getSn()+";"+deviceSensorList.getType()+";"+
                deviceSensorList.getVender()+";"+deviceSensorList.getRef();
        String result=Db.findFirst(sql).getStr("extSensorCmd");
        if(result.equals("")){
            add=str1;
        }else{
            add=result+"|"+str1;
        }

        Db.update("update machine_data set extSensorCmd = ? where machineSerial=?",add,machineserial);
    }

    /**删除传感器列表中的传感器**/
    public void delSensorByData(DeviceSensorList deviceSensorList,String machineserial){
        String sql="select extSensorCmd from machine_data where machineSerial='"+machineserial+"'";
        String result=Db.findFirst(sql).getStr("extSensorCmd");
        String str1=deviceSensorList.getInterval()+";"+deviceSensorList.getVoltage()+";"+deviceSensorList.getBruad()+";"+deviceSensorList.getCmd()+";"+deviceSensorList.getSn()+";"+deviceSensorList.getType()+";"+
                deviceSensorList.getVender()+";"+deviceSensorList.getRef();
        String afterdel=getSubString(result,str1);
        Db.update("update machine_data set extSensorCmd = ? where machineSerial=?",afterdel,machineserial);
    }

    /**/
    @Override
    public Page<UpdateData> getDeviceUpdatelog(String machineserial, int pageno, int limit) {
        String sql=" from update_data where machineSerial='"+machineserial+"' order by updateTime desc";
        Page<Record> page = Db.paginate(pageno, limit, "select * ",sql);
        List<Record> recordList = page.getList();
        List<UpdateData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            UpdateData map = new UpdateData();
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setUpdateState(record.getInt("updateState"));
            map.setUpdateTime(record.getStr("updateTime"));
            rslist.add(map);
        }
        return new Page<UpdateData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    /**根据设备serial码获取设备相关信息**/
    public AgentData getDeviceDetailBySn(String machineserial){
        String sql="select a.*,b.agentName,c.ProGroupName from agent_data a LEFT JOIN agent_table b on a.agentNumber=b.agentNumber LEFT JOIN projects_data c ON a.ProGroupId=c.ProGroupId where a.machineSerial='"+machineserial+"'";
        Record result=Db.findFirst(sql);
        AgentData agentData=new AgentData();
        agentData.setAgentName(result.getStr("agentName")!=null?result.getStr("agentName"):"");
        if(result.getStr("onlineState")!=null){
            agentData.setOnlineState(Integer.parseInt(result.getStr("onlineState")));
        }else {
            agentData.setOnlineState(0);
        }
        agentData.setProgroupid(result.getInt("proGroupId")!=null?result.getInt("proGroupId"):0);
        agentData.setAgentNumber(result.getStr("agentNumber")!=null?result.getStr("agentNumber"):"");
        agentData.setMachineName(result.getStr("machineName")!=null?result.getStr("machineName"):"");
        agentData.setMachineSerial(result.getStr("machineSerial")!=null?result.getStr("machineSerial"):"");
        agentData.setProGroupName(result.getStr("ProGroupName")!=null?result.getStr("ProGroupName"):"");
        return agentData;
    }


    @Override
    public ProDevCount getDeviceCountByUserid(String[] authoritys) {
        int sum=0;
        int online=0;
        int outline=0;
        int newdev=0;
        ProDevCount proDevCountfin=new ProDevCount();
        for (int i = 0; i < authoritys.length; i++) {
            ProDevCount proDevCount=ProjectService.me.getProDevCountById(authoritys[i]);
            sum=sum+proDevCount.getSum();
            online=online+proDevCount.getOncount();
            outline=outline+proDevCount.getOutcount();
            newdev+=proDevCount.getNewcount();
        }
        proDevCountfin.setOutcount(outline);
        proDevCountfin.setSum(sum);
        proDevCountfin.setOncount(online);
        proDevCountfin.setNewcount(newdev);
        return proDevCountfin;
    }


    public static String getSubString(String str1, String str2) {
        StringBuffer sb = new StringBuffer(str1);
            int index = sb.indexOf(str2);
            int num=str1.split("\\|").length;
            if(num>1){
                sb.delete(index-1, index + str2.length());
            }else{
                sb.delete(index, index + str2.length());
            }
        return sb.toString();
    }
}
