package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.bll.*;
import com.webmonitor.core.idal.IAgentData;
import com.webmonitor.core.model.AgentData;
import com.webmonitor.core.model.AgentDataDao;
import com.webmonitor.core.model.ProDevCount;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.util.Tools;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AgentDataMysqlDAL implements IAgentData {

    public Page<AgentData> getAllDevice(int pageno,int limit){
        String sql=" from agent_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName ",sql);
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            map.setOnlineState(record.getInt("onlineState"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setCreateTime(record.getDate("createTime"));
            map.setProgroupid(record.getInt("proGroupId"));
            map.setMachineSerial(record.getStr("machineSerial"));
            map.setMachineName(record.getStr("machineName"));
            map.setAgentName(record.getStr("agentName"));
            rslist.add(map);
        }
        return new Page<AgentData>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    public Page<AgentData> searchDeviceByParam(String content,String agentnum,String[] projectid,String state,int pageno,int limit){
        String sql=" from agent_data where onlineState="+state;
        String test="";
        if(content!=null&&!content.isEmpty()){
            sql=sql+" and machineSerial like '%"+content+"%' ";
        }else if(agentnum!=null&&!agentnum.isEmpty()){
            sql=sql+" and agentNumber='"+agentnum+"' ";
        }else if(projectid.length > 0&&(!projectid[0].equals("all"))){
            if(projectid.length>1){
                test=" and (proGroupid="+projectid[0];
                for(int k=0;k<projectid.length;k++){
                    String test1=" OR proGroupid="+projectid[k];
                    test+=test1;
                }
                sql=sql+test+")";
            }else{
                sql=sql+" and proGroupid="+projectid[0];
            }
        }
        Page<Record> page = Db.paginate(pageno, limit, "select * ",sql);
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state1=Integer.parseInt(record.getStr("onlineState"));
            map.setOnlineState(state1);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setCreateTime(Tools.toDate(record.getStr("createTime")));
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

    @Override
    public Page<AgentData> findDeviceByParam(String content, String agentnum, String projectid, String state, int pageno, int limit) {
        String sql=" from agent_data where onlineState="+state;
        String test="";
        if(content!=null&&!content.isEmpty()){
            sql=sql+" and machineSerial like '%"+content+"%' ";
        }else if(agentnum!=null&&!agentnum.isEmpty()){
            sql=sql+" and agentNumber='"+agentnum+"' ";
        }else if(projectid!=null&&!projectid.isEmpty()){
            sql=sql+" and proGroupid="+projectid;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select * ",sql);
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            int state1=Integer.parseInt(record.getStr("onlineState"));
            map.setOnlineState(state1);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setCreateTime(Tools.toDate(record.getStr("createTime")));
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

    /**根据公司id获取公司旗下所有设备**/
    @Override
    public Page<AgentData> getAllDeviceByComid(String Companyid,int pageno,int limit) {
        String sql="  from agent_data a left join projects_data b on a.proGroupId=b.proGroupId where a.agentNumber="+Companyid;
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.proGroupName ",sql);
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            String state1=record.getStr("onlineState");
            int state=Integer.parseInt(state1);
            map.setOnlineState(state);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setCreateTime(Tools.toDate(record.getStr("createTime")));
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

    /**查询当前项目旗下的所有设备（分页）**/
    public Page<AgentData> getAllDeviceByGroupid(String Groupid,int pageno,int limit) {
        String sql="  from agent_data a left join projects_data b on a.proGroupId=b.proGroupId where a.proGroupId="+Groupid;
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.proGroupName ",sql);
        List<Record> recordList = page.getList();
        List<AgentData> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentData map = new AgentData();
            String state1=record.getStr("onlineState");
            int state=Integer.parseInt(state1);
            map.setOnlineState(state);
            map.setId(record.getInt("id"));
            map.setAgentNumber(record.getStr("agentNumber"));
            map.setCreateTime(Tools.toDate(record.getStr("createTime")));
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
    public Page<AgentDataDao> getDeviceByParams(int pageno, int limit,String userid) {
        String sql = "";
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
        Page<Record> page = Db.paginate(pageno, limit, "select *",sql);
        List<Record> recordList = page.getList();
        List<AgentDataDao> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentDataDao map = new AgentDataDao();
            map.setOnlineState(record.getStr("onlineState"));
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
                map.setOnlineState(record.getStr("onlineState"));
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
                sql= AdminService.me.searchOutDeviceByParam(content, pageno, limit, type);
            break;
            /**根据名称查询**/
            case "consumer":
                sql= CompanyAdminService.me.searchOutDeviceByParam(agentnum, content, pageno, limit, type, role);
                break;
        }
        Page<Record> page = Db.paginate(pageno, limit, "select *",sql);
        List<Record> recordList = page.getList();
        List<AgentDataDao> rslist = new ArrayList<>();
        for (Record record : recordList) {
            AgentDataDao map = new AgentDataDao();
            map.setOnlineState(record.getStr("onlineState"));
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
    public void deleteDeviceByGroupid(String sn) {
        Db.update("update agent_data set proGroupId = null where machineSerial=?",sn);
    }

    @Override
    public void insertDeviceById(String projectid, String sn) {
        Db.update("update agent_data set proGroupId = ? where machineSerial=?",projectid,sn);
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
                .set("agentNumber",comid).set("createTime",time);
        Db.save("agent_data",device);
    }

    @Override
    public void deleteDevice(String sn) {
        Record device=new Record().set("machineSerial",sn);
        Db.delete("agent_data",device);
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
        record=Db.findFirst("select count(*) from agent_data");
        proDevCount.setSum(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data where onlineState=0");
        proDevCount.setOutcount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data where onlineState=1");
        proDevCount.setOncount(record.getInt("count(*)"));
        return proDevCount;
    }


    @Override
    public ProDevCount getDeviceCountByComid(String comid) {
        ProDevCount proDevCount=new ProDevCount();
        Record record=new Record();
        record=Db.findFirst("select count(*) from agent_data where agentNumber="+comid);
        proDevCount.setSum(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data where onlineState=0 and agentNumber="+comid);
        proDevCount.setOutcount(record.getInt("count(*)"));
        record=Db.findFirst("select count(*) from agent_data where onlineState=1 and agentNumber="+comid);
        proDevCount.setOncount(record.getInt("count(*)"));
        return proDevCount;
    }

    @Override
    public ProDevCount getDeviceCountByUserid(String[] authoritys) {
        int sum=0;
        int online=0;
        int outline=0;
        ProDevCount proDevCountfin=new ProDevCount();
        for (int i = 0; i < authoritys.length; i++) {
            ProDevCount proDevCount=ProjectService.me.getProDevCountById(authoritys[i]);
            sum=sum+proDevCount.getSum();
            online=online+proDevCount.getOncount();
            outline=outline+proDevCount.getOutcount();
        }
        proDevCountfin.setOutcount(outline);
        proDevCountfin.setSum(sum);
        proDevCountfin.setOncount(online);
        return proDevCountfin;
    }





}
