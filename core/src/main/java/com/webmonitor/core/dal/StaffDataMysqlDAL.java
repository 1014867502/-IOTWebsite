package com.webmonitor.core.dal;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.webmonitor.core.bll.StaffService;
import com.webmonitor.core.idal.IStaffData;
import com.webmonitor.core.model.Role;
import com.webmonitor.core.model.StaffData;
import com.webmonitor.core.model.StaffDataEntity;
import com.webmonitor.core.model.userbase.FuncAuthor;
import com.webmonitor.core.util.MD5Utils;
import com.webmonitor.core.util.Tools;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

public class StaffDataMysqlDAL implements IStaffData {
    @Override
    public StaffData getStaffByName(String username) {
        StaffData staffData=StaffData.dao.findFirst("select * from staff_data where uAccountNum='"+username+"'");
        return  staffData;
    }

    @Override
    public StaffData getStaffById(String userid) {
        StaffData staffData=StaffData.dao.findById(userid);
        return  staffData;
    }
    @Override
    public void edit(StaffData staffData) {
//        Record staff= Db.findFirst("select * from staff_data where uAccountNum='"+staffData.getUAccountNum()+"'");
//        staff.set("uRealName",realname).set("agentNumber",comid).set("cDept",dept).
//                set("iRoleType",roletype).set("iAccountType",accounttype).set("groupAssemble",groupassemble);
           staffData.update();
    }

    @Override
    public void add(StaffData staffData) {
        String account="";
        if(isExistTable(randomAcount(),"staff_data","uAccountNum")){
            add(staffData);
        }else{
            String password=staffData.getUPassword();
            String code= MD5Utils.md5(password);
            Record staff=new Record().set("agentNumber",staffData.getAgentNumber()).set("uAccountNum",staffData.getUAccountNum()).set("uPassword",code)
                    .set("uRealName",staffData.getURealName()).set("cDept",staffData.getCDept()).set("iRoleType",staffData.getIRoleType()).set("iAccountType",staffData.getIAccountType())
                    .set("groupAssemble",staffData.getGroupAssemble());
            Db.save("staff_data",staff);
        }
    }

    @Override
    public void delete(String loginaccount) {
        Record staff=new Record().set("uAccountNum",loginaccount);
        Db.delete("staff_data",staff);
    }

    @Override
    public void updateAuthorityById(String userid, String project) {

        Record staff= Db.findFirst("select * from staff_data where Id='"+userid+"'");
        String author=staff.getStr("groupAssemble");
        author=author+"@"+project;
        staff.set("groupAssemble",author);
        Db.update("staff_data",staff);

    }

    @Override
    public List<StaffData> searchStaffData(String customname) {
        List<StaffData> staffDataList=new ArrayList<>();
        staffDataList=StaffData.dao.find("select * from staff_data where uAccountNum like '%"+customname+"%'");
        return staffDataList;
    }


    public String randomAcount(){
        Random random=new Random();
        StringBuffer sb=new StringBuffer();
        for(int i=0;i<11;i++){
            int number=random.nextInt(3);
            long result=0;
            switch(number){
                case 0:
                    result=Math.round(Math.random()*25+65);
                    sb.append(String.valueOf((char)result));
                    break;
                case 1:
                    result=Math.round(Math.random()*25+97);
                    sb.append(String.valueOf((char)result));
                    break;
                case 2:
                    sb.append(String.valueOf(new Random().nextInt(10)));
                    break;
            }
        }
        return sb.toString();
    }

    /**根据id判断项目是否存在**/
    public boolean isExistTable(String id,String tablename,String column){
        Record record=Db.findFirst("select * from "+tablename+" where "+column+"='"+id+"'");
        if(record!=null){
            return true;
        }else{
            return false;
        }
    }

    /**获取用户列表**/
    public Page<StaffDataEntity> getAllCustomByPage(String userid,int pageno,int limit) {
        String sql = "";
        StaffData currentuser = StaffService.me.getStaffById(userid);
        int roletype = currentuser.getIRoleType();
        RoleType role = RoleType.getIndex(roletype);
        switch (role) {
                case superadmin:
                    sql = " from staff_data a left join agent_table b on a.agentNumber=b.agentNumber ";
                    break;
                case admin:
                    String groupagent = currentuser.getGroupAgentNumber().replace("@", ",");
                    groupagent = groupagent != null ? groupagent : "";
                    sql = " from staff_data a left join agent_table b on a.agentNumber=b.agentNumber where a.agentNumber in(" + groupagent + ") and a.iRoleType!='"+RoleType.superadmin.getIndex()+"'";
                    break;
            }
            List<StaffDataEntity> list = new ArrayList<>();
            Page<Record> record = Db.paginate(pageno, limit, "select a.*,b.agentName", sql);
            List<Record> recordList = record.getList();
            for (Record item : recordList) {
                StaffDataEntity staffDataEntity = new StaffDataEntity();
                staffDataEntity.setId(item.getInt("id"));
                staffDataEntity.setAgentName(item.getStr("agentName"));
                staffDataEntity.setAgentNumber(item.getStr("agentNumber"));
                staffDataEntity.setuAccountNum(item.getStr("uAccountNum"));
                staffDataEntity.setuPassword(item.getStr("uPassword"));
                staffDataEntity.setcDept(item.getStr("cDept"));
                staffDataEntity.setuRealName(item.getStr("uRealName"));
                staffDataEntity.setAccounttime(item.getStr("AccountTime"));
                staffDataEntity.setiRoleType(item.getInt("iRoleType"));
                staffDataEntity.setGroupAgentNumber(item.getStr("groupAgentNumber") != null ? item.getStr("groupAgentNumber") : "");
                if (item.getStr("groupAssemble") != null && !item.getStr("groupAssemble").equals("")) {
                    String projectlist = item.getStr("groupAssemble").replace('@', ',');
                    staffDataEntity.setGroupAssemble(projectlist);
                } else {
                    staffDataEntity.setGroupAssemble("empty");
                }
                int type = item.getInt("iRoleType");
                staffDataEntity.setRoleType(RoleType.getTypeName(type));
                list.add(staffDataEntity);
            }
            return new Page<StaffDataEntity>(list, record.getPageNumber(), record.getPageSize(), record.getTotalPage(), record.getTotalRow());
        }

    /**根据类别查询用户数目**/
    @Override
    public List<StaffDataEntity> getCountByType(String type) {
        String sql="select a.*,b.agentName from staff_data a left join agent_table b on a.agentNumber=b.agentNumber where iRoleType="+type;
        List<StaffDataEntity> list=new ArrayList<>();
        List<Record> record= Db.find(sql);
        for(Record item:record){
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(item.getInt("id"));
            staffDataEntity.setAgentName(item.getStr("agentName"));
            staffDataEntity.setAgentNumber(item.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(item.getStr("uAccountNum"));
            staffDataEntity.setuPassword(item.getStr("uPassword"));
            staffDataEntity.setcDept(item.getStr("cDept"));
            staffDataEntity.setuRealName(item.getStr("uRealName"));
            staffDataEntity.setAccounttime(item.getStr("AccountTime"));
            staffDataEntity.setiRoleType(item.getInt("iRoleType"));
            if(item.getStr("groupAssemble")!=null&&!item.getStr("groupAssemble").equals("")){
                String projectlist=item.getStr("groupAssemble").replace('@',',');
                staffDataEntity.setGroupAssemble(projectlist);
            }else{
                staffDataEntity.setGroupAssemble("empty");
            }

            int roletype=item.getInt("iRoleType");
            staffDataEntity.setRoleType(RoleType.getTypeName(roletype));
            list.add(staffDataEntity);
        }
        return list;
    }

    @Override
    public List<StaffDataEntity> getAlCustom() {
        String sql="select a.*,b.agentName from staff_data a left join agent_table b on a.agentNumber=b.agentNumber";
        List<StaffDataEntity> list=new ArrayList<>();
        List<Record> record= Db.find(sql);
        for(Record item:record){
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(item.getInt("id"));
            staffDataEntity.setAgentName(item.getStr("agentName"));
            staffDataEntity.setAgentNumber(item.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(item.getStr("uAccountNum"));
            staffDataEntity.setuPassword(item.getStr("uPassword"));
            staffDataEntity.setcDept(item.getStr("cDept"));
            staffDataEntity.setuRealName(item.getStr("uRealName"));
            staffDataEntity.setiRoleType(item.getInt("iRoleType"));
            staffDataEntity.setAccounttime(item.getStr("AccountTime"));
            if(item.getStr("groupAssemble")!=null&&!item.getStr("groupAssemble").equals("")){
                String projectlist=item.getStr("groupAssemble").replace('@',',');
                staffDataEntity.setGroupAssemble(projectlist);
            }else{
                staffDataEntity.setGroupAssemble("empty");
            }
            int roletype=item.getInt("iRoleType");
            staffDataEntity.setRoleType(RoleType.getTypeName(roletype));
            list.add(staffDataEntity);
        }
        return list;
    }

    @Override
    public Page<StaffDataEntity> searchCustomByParam(StaffData staffData,String content,String agentnum,int pageno, int limit) {
        String sql = "   from staff_data a left join agent_table b on a.agentNumber=b.agentNumber ";
        String role=RoleType.getString(staffData.getIRoleType());
        if(!agentnum.equals("all")){
            if(!content.isEmpty()){
                sql=sql+" where a.agentNumber="+agentnum+" and a.uAccountNum like '%"+content+"%'";
            }else{
                sql=sql+" where b.agentNumber='"+agentnum+"'";
            }
        }else{
            if(!content.isEmpty()){
                sql=sql+" where a.uAccountNum like '%"+content+"%'";
            }
        }
        if(role.equals("admin")){
            String groupagent=staffData.getGroupAgentNumber().replace("@",",");
            if(sql.contains("where")){
                sql+=" and b.agentNumber in ("+groupagent+") and a.iRoleType!='"+RoleType.superadmin.getIndex()+"'";
            }else{
                sql+=" where b.agentNumber in ("+groupagent+") and a.iRoleType!='"+RoleType.superadmin.getIndex()+"'";
            }
        }
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
        List<Record> recordList = page.getList();
        List<StaffDataEntity> rslist = new ArrayList<>();
        for (Record record : recordList) {
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(record.getInt("id"));
            staffDataEntity.setAgentName(record.getStr("agentName"));
            staffDataEntity.setAgentNumber(record.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(record.getStr("uAccountNum"));
            staffDataEntity.setuPassword(record.getStr("uPassword"));
            staffDataEntity.setcDept(record.getStr("cDept"));
            staffDataEntity.setuRealName(record.getStr("uRealName"));
            staffDataEntity.setiRoleType(record.getInt("iRoleType"));
            staffDataEntity.setAccounttime(record.getStr("AccountTime"));
            if(record.getStr("groupAssemble")!=null&&!record.getStr("groupAssemble").equals("")){
                String projectlist=record.getStr("groupAssemble").replace('@',',');
                staffDataEntity.setGroupAssemble(projectlist);
            }else{
                staffDataEntity.setGroupAssemble("empty");
            }
            int type=record.getInt("iRoleType");
            staffDataEntity.setRoleType(RoleType.getTypeName(type));
            rslist.add(staffDataEntity);
        }
        return new Page<StaffDataEntity>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public Page<StaffDataEntity> getCustomByComId(String agentnum,String userid,int pageno,int limit) {
        String sql="from staff_data a left join agent_table b on a.agentNumber=b.agentNumber where a.agentNumber="+agentnum;
        Page<Record> page = Db.paginate(pageno, limit, "select a.*,b.agentName",sql);
        List<Record> recordList = page.getList();
        String role=RoleType.getTypeName(StaffData.dao.findById(userid).getIRoleType());
        List<StaffDataEntity> rslist = new ArrayList<>();
        for (Record record : recordList) {
            int type=record.getInt("iRoleType");
            if(!role.equals("超级管理员")&& RoleType.getTypeName(type).equals("超级管理员")){
                continue;
            }
            if(!role.equals("普通管理员")&& RoleType.getTypeName(type).equals("普通管理员")){
                continue;
            }
            StaffDataEntity staffDataEntity=new StaffDataEntity();
            staffDataEntity.setId(record.getInt("id"));
            staffDataEntity.setAgentName(record.getStr("agentName"));
            staffDataEntity.setAgentNumber(record.getStr("agentNumber"));
            staffDataEntity.setuAccountNum(record.getStr("uAccountNum"));
            staffDataEntity.setuPassword(record.getStr("uPassword"));
            staffDataEntity.setcDept(record.getStr("cDept"));
            staffDataEntity.setuRealName(record.getStr("uRealName"));
            staffDataEntity.setiRoleType(record.getInt("iRoleType"));
            staffDataEntity.setAccounttime(record.getStr("AccountTime"));
            if(record.getStr("groupAssemble")!=null&&!record.getStr("groupAssemble").equals("")){
                String projectlist=record.getStr("groupAssemble").replace('@',',');
                staffDataEntity.setGroupAssemble(projectlist);
            }else{
                staffDataEntity.setGroupAssemble("empty");
            }
            staffDataEntity.setRoleType(RoleType.getTypeName(type));
            rslist.add(staffDataEntity);
        }
        return new Page<StaffDataEntity>(rslist, page.getPageNumber(), page.getPageSize(), page.getTotalPage(), page.getTotalRow());
    }

    @Override
    public List<StaffData> getStaffDataByComid(String agentNumber) {
        List<StaffData> staffDataList=new ArrayList<>();
        staffDataList=StaffData.dao.find("select * from staff_data where agentNumber='"+agentNumber+"'");
        return staffDataList;
    }


    @Override
    public List<FuncAuthor> getWebAuthorityById(String userid) {
        StaffData staffData=StaffService.me.getStaffById(userid);
        List<FuncAuthor> list=new ArrayList<>();
        if(staffData.getWebPermission()!=null&&!staffData.getWebPermission().equals("")){
        String[] web=staffData.getWebPermission().split("@");
        for(int i=0;i<web.length;i++){
            FuncAuthor funcAuthor=new FuncAuthor();
            funcAuthor.setName(WebAuthority.getString(Integer.parseInt(web[i])));
            funcAuthor.setValue(web[i]);
            list.add(funcAuthor);
        }}
        return list;
    }

    @Override
    public List<FuncAuthor> getAppAuthorityById(String userid) {
        StaffData staffData=StaffService.me.getStaffById(userid);

        List<FuncAuthor> list=new ArrayList<>();
        if(staffData.getAppPermission()!=null&&!staffData.getAppPermission().equals("")){
            String[] app=staffData.getAppPermission().split("@");

        for(int i=0;i<app.length;i++){
            FuncAuthor funcAuthor=new FuncAuthor();
            funcAuthor.setName(AppAuthority.getString(Integer.parseInt(app[i])));
            funcAuthor.setValue(app[i]);
            list.add(funcAuthor);
        }
        }
        return list;
    }


}
